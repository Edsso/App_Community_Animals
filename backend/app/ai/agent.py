import json
import os
import uuid
from typing import Dict, Any, List, Optional
from groq import Groq

from .prompts import SYSTEM_PROMPT, EMERGENCY_PROMPT
from .intents import detect_emergency
from .tools import Tools
from .schemas import IntentType, Message
from .conversation import conversation_manager, ConversationState
from app.services.chat_history import ChatHistoryService

class Agent:
    def __init__(self, db_session, user):
        self.client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        self.model = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
        self.tools = Tools(db_session)
        self.db = db_session
        self.user = user
        self.history_service = ChatHistoryService(db_session)
        self.session_id = f"session_{uuid.uuid4().hex[:8]}"
        
        # Definição das tools para o Groq
        self.tools_schema = [
            {
                "type": "function",
                "function": {
                    "name": "reportar_perdido",
                    "description": "Registra um animal perdido no sistema",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "name": {"type": "string", "description": "Nome do animal"},
                            "species": {"type": "string", "enum": ["dog", "cat"], "description": "Espécie: dog ou cat"},
                            "last_seen_location": {"type": "string", "description": "Local onde foi visto pela última vez"},
                            "last_seen_date": {"type": "string", "description": "Data (YYYY-MM-DD)"},
                            "description": {"type": "string", "description": "Descrição do animal"},
                            "contact_name": {"type": "string", "description": "Nome do contato"},
                            "contact_phone": {"type": "string", "description": "Telefone do contato"},
                            "photo": {"type": "string", "description": "URL da foto (opcional)"}
                        },
                        "required": ["name", "species", "last_seen_location", "last_seen_date", "description", "contact_name", "contact_phone"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "buscar_perdidos",
                    "description": "Busca animais perdidos no sistema",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "query": {"type": "string", "description": "Termo de busca (nome ou local)"},
                            "species": {"type": "string", "enum": ["dog", "cat"], "description": "Filtrar por espécie"}
                        }
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "registrar_comunitario",
                    "description": "Registra um novo animal comunitário",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "name": {"type": "string", "description": "Nome do animal"},
                            "species": {"type": "string", "enum": ["dog", "cat"], "description": "Espécie"},
                            "location": {"type": "string", "description": "Local onde vive"},
                            "latitude": {"type": "number", "description": "Latitude"},
                            "longitude": {"type": "number", "description": "Longitude"},
                            "caretaker": {"type": "string", "description": "Nome do cuidador"},
                            "caretaker_contact": {"type": "string", "description": "Telefone do cuidador (opcional)"},
                            "vaccinated": {"type": "boolean", "description": "Se é vacinado"},
                            "vaccine_details": {"type": "string", "description": "Detalhes das vacinas"},
                            "neutered": {"type": "boolean", "description": "Se é castrado"},
                            "description": {"type": "string", "description": "Descrição"},
                            "photo": {"type": "string", "description": "URL da foto"}
                        },
                        "required": ["name", "species", "location", "latitude", "longitude", "caretaker"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "marcar_encontrado",
                    "description": "Marca um animal perdido como encontrado",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "animal_id": {"type": "integer", "description": "ID do animal"}
                        },
                        "required": ["animal_id"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "orientar_emergencia",
                    "description": "Fornece orientações para situações de emergência",
                    "parameters": {"type": "object", "properties": {}}
                }
            }
        ]
    
    def _build_messages(self, history: List[Message], current_message: str) -> List[Dict[str, str]]:
        messages = [{"role": "system", "content": SYSTEM_PROMPT}]
        for msg in history[-10:]:  # Limitar histórico para não estourar tokens
            messages.append({"role": msg.role, "content": msg.content})
        messages.append({"role": "user", "content": current_message})
        return messages

    async def process_message(self, message: str, session_id: Optional[str] = None) -> Dict[str, Any]:
        """Processa a mensagem do usuário e guia para a página correta"""
        
        if session_id:
            self.session_id = session_id
            
        self.history_service.add_message(
            user_id=self.user.id,
            role="user",
            content=message,
            session_id=self.session_id
        )
        
        if detect_emergency(message):
            emergency_info = await self._handle_emergency()
            emergency_info["navigate_to"] = "/animals" 
            return emergency_info
            
        intent = await self._classify_intent(message)
        history = self.history_service.get_session_history(self.user.id, self.session_id)
        
        # Mapeamento de intenções para rotas do frontend
        routes = {
            "report_lost": "/lost?report=true",
            "register_community": "/animal/new",
            "ask_type": "/animal/new",
            "search_lost": "/lost",
            "mark_found": "/animals"
        }
        
        if intent in routes:
            route = routes[intent]
            
            # Usar o modelo para gerar uma resposta fluida e amigável confirmando a navegação
            try:
                messages = self._build_messages(history, message)
                response = self.client.chat.completions.create(
                    model=self.model,
                    messages=messages,
                    temperature=0.7,
                    max_tokens=150
                )
                response_text = response.choices[0].message.content
            except Exception as e:
                response_text = "Com certeza! Vou te redirecionar para a página correta agora mesmo."
                
            self.history_service.add_message(
                user_id=self.user.id,
                role="assistant",
                content=response_text,
                session_id=self.session_id,
                intent=intent
            )
            
            return {
                "message": response_text,
                "intent": intent,
                "action_performed": False,
                "session_id": self.session_id,
                "navigate_to": route
            }
            
        # Processamento normal para perguntas gerais
        normal_response = await self._process_normal_message(message, history)
        normal_response["navigate_to"] = "/animals"
        return normal_response
        
    async def _ask_registration_type(self, state_key: str) -> Dict[str, Any]:
        """Pergunta qual tipo de registro o usuário quer fazer"""
        
        # Salvar no estado que estamos aguardando escolha do tipo
        conversation_manager.set_state(
            state_key,
            ConversationState.AWAITING_REGISTRATION_TYPE,
            {}
        )
        
        response = """Sobre qual tipo de registro você quer falar?

     **Animal Comunitário** - Animal que vive na comunidade e tem cuidadores
     **Animal Perdido** - Animal que desapareceu e está sendo procurado

    Digite:
    - **comunitário** ou **1** para animal comunitário
    - **perdido** ou **2** para animal perdido"""
        
        self.history_service.add_message(
            user_id=self.user.id,
            role="assistant",
            content=response,
            session_id=self.session_id,
            intent="ask_type"
        )
        
        return {
            "message": response,
            "intent": "ask_type",
            "action_performed": False,
            "session_id": self.session_id
        }
    
    async def _start_community_registration(self, state_key: str) -> Dict[str, Any]:
        """Inicia fluxo de cadastro de animal comunitário"""
        conversation_manager.set_state(
            state_key,
            ConversationState.AWAITING_COMMUNITY_INFO,
            {"step": 1, "data": {}}
        )
        
        response = "Vou ajudar você a cadastrar um animal comunitário! \n\nPara começar, qual é o **nome do animal**?"
        
        # Salvar resposta da IA
        self.history_service.add_message(
            user_id=self.user.id,
            role="assistant",
            content=response,
            session_id=self.session_id,
            intent="register_community"
        )
        
        return {
            "message": response,
            "intent": "register_community",
            "action_performed": False,
            "session_id": self.session_id
        }
    
    async def _start_lost_registration(self, state_key: str) -> Dict[str, Any]:
        """Inicia fluxo de registro de animal perdido"""
        conversation_manager.set_state(
            state_key,
            ConversationState.AWAITING_LOST_INFO,
            {"step": 1, "data": {}}
        )
        
        response = "Vou ajudar a registrar um animal perdido! \n\nPrimeiro, qual é o **nome do animal**?"
        
        self.history_service.add_message(
            user_id=self.user.id,
            role="assistant",
            content=response,
            session_id=self.session_id,
            intent="report_lost"
        )
        
        return {
            "message": response,
            "intent": "report_lost",
            "action_performed": False,
            "session_id": self.session_id
        }
    
    async def _start_mark_found(self, state_key: str) -> Dict[str, Any]:
        """Inicia fluxo de marcar como encontrado"""
        conversation_manager.set_state(
            state_key,
            ConversationState.AWAITING_FOUND_INFO,
            {"step": 1, "data": {}}
        )
        
        response = "Que ótimo que encontrou um animal! \n\nPara marcar como encontrado, preciso do **ID do animal** (você encontra no perfil dele). Pode me informar?"
        
        self.history_service.add_message(
            user_id=self.user.id,
            role="assistant",
            content=response,
            session_id=self.session_id,
            intent="mark_found"
        )
        
        return {
            "message": response,
            "intent": "mark_found",
            "action_performed": False,
            "session_id": self.session_id
        }
    
    async def _handle_conversation_flow(self, message: str, state_key: str) -> Dict[str, Any]:
        """Gerencia o fluxo de coleta de informações"""
        state = conversation_manager.get_state(state_key)
        data = conversation_manager.get_data(state_key)
        
        response = None
        intent = None
        action_performed = False
        
        if state == ConversationState.AWAITING_COMMUNITY_INFO:
            result = await self._handle_community_registration(message, state_key, data)
            response = result["message"]
            intent = "register_community"
            action_performed = result.get("action_performed", False)
            
        elif state == ConversationState.AWAITING_LOST_INFO:
            result = await self._handle_lost_registration(message, state_key, data)
            response = result["message"]
            intent = "report_lost"
            action_performed = result.get("action_performed", False)
            
        elif state == ConversationState.AWAITING_FOUND_INFO:
            result = await self._handle_found_registration(message, state_key, data)
            response = result["message"]
            intent = "mark_found"
            action_performed = result.get("action_performed", False)
        
        # Tratar escolha do tipo de registro
        elif state == ConversationState.AWAITING_REGISTRATION_TYPE:
            msg_lower = message.lower()
            
            # Verificar se escolheu comunitário
            if any(word in msg_lower for word in ["comunitário", "comunitario", "1", "um", "primeiro"]):
                # Limpar estado atual e iniciar cadastro comunitário
                conversation_manager.clear_state(state_key)
                return await self._start_community_registration(state_key)
            
            # Verificar se escolheu perdido
            elif any(word in msg_lower for word in ["perdido", "2", "dois", "segundo"]):
                # Limpar estado atual e iniciar cadastro perdido
                conversation_manager.clear_state(state_key)
                return await self._start_lost_registration(state_key)
            
            # Se não entendeu, perguntar novamente
            else:
                response = "Não entendi. Digite **comunitário** (1) para animal comunitário ou **perdido** (2) para animal perdido."
                intent = "ask_type"
                action_performed = False
        
        # Salvar resposta da IA (apenas se não for redirecionamento)
        if response:
            self.history_service.add_message(
                user_id=self.user.id,
                role="assistant",
                content=response,
                session_id=self.session_id,
                intent=intent,
                metadata={"action_performed": action_performed}
            )
            
            return {
                "message": response,
                "intent": intent,
                "action_performed": action_performed,
                "session_id": self.session_id
            }
        else:
            # Caso de redirecionamento (já tem return próprio)
            # Isso é apenas para segurança, não deve chegar aqui
            return {
                "message": "Processando...",
                "intent": None,
                "action_performed": False,
                "session_id": self.session_id
            }
    
    async def _handle_community_registration(self, message: str, state_key: str, data: Dict) -> Dict[str, Any]:
        """Fluxo de cadastro de animal comunitário"""
        step = data.get("step", 1)
        
        steps = [
            {"field": "name", "question": "Qual o **nome do animal**?", "next": 2},
            {"field": "species", "question": "É **cachorro** ou **gato**? 🐕/🐱", "next": 3},
            {"field": "location", "question": "Onde ele **vive**? (ex: Praça da República, Rua Augusta...)", "next": 4},
            {"field": "caretaker", "question": "Qual o nome do **cuidador principal**?", "next": 5},
            {"field": "caretaker_contact", "question": "Qual o **telefone para contato**? (opcional - pode deixar em branco)", "next": 6},
            {"field": "description", "question": "Conte um pouco sobre ele: **comportamento, características, rotina**...", "next": 7},
            {"field": "vaccinated", "question": "Ele é **vacinado**? (sim/não)", "next": 8},
            {"field": "neutered", "question": "Ele é **castrado**? (sim/não)", "next": 9},
            {"field": "photo", "question": "Por último, tem uma **URL da foto**? (opcional - pode deixar em branco)", "next": 10},
        ]
        
        # Se ainda estamos coletando
        if step <= len(steps):
            current_step = steps[step - 1]
            
            # Salvar a resposta anterior
            if step > 1:
                prev_step = steps[step - 2]
                field = prev_step["field"]
                
                # Processar respostas especiais
                if field == "species":
                    value = "dog" if "cachorro" in message.lower() else "cat"
                elif field in ["vaccinated", "neutered"]:
                    value = "sim" in message.lower()
                elif field == "caretaker_contact" and message.lower() in ["não", "nao", "n", "nenhum", ""]:
                    value = None
                else:
                    value = message
                
                if "data" not in data:
                    data["data"] = {}
                data["data"][field] = value
            
            # Se chegamos ao último passo, finalizar e cadastrar
            if step == len(steps):
                # Adicionar coordenadas padrão
                data["data"]["latitude"] = -23.5505
                data["data"]["longitude"] = -46.6333
                
                # Chamar a ferramenta de registro
                result = await self.tools.registrar_comunitario(data["data"])
                
                # Limpar estado
                conversation_manager.clear_state(state_key)
                
                return {
                    "message": result["message"],
                    "action_performed": True
                }
            
            # Avançar para próximo passo
            conversation_manager.update_data(state_key, {"step": step + 1, "data": data.get("data", {})})
            
            return {
                "message": current_step["question"],
                "action_performed": False
            }
        
        return {"message": "Algo deu errado. Vamos começar de novo?"}
    
    async def _handle_lost_registration(self, message: str, state_key: str, data: Dict) -> Dict[str, Any]:
        """Fluxo de registro de animal perdido"""
        step = data.get("step", 1)
        
        steps = [
            {"field": "name", "question": "Qual o **nome do animal**?", "next": 2},
            {"field": "species", "question": "É **cachorro** ou **gato**? 🐕/🐱", "next": 3},
            {"field": "last_seen_location", "question": "Onde foi visto pela **última vez**?", "next": 4},
            {"field": "last_seen_date", "question": "Qual a **data** que foi visto? (formato: DD/MM/AAAA)", "next": 5},
            {"field": "description", "question": "Descreva o animal: **cor, porte, características marcantes**...", "next": 6},
            {"field": "contact_name", "question": "Qual seu **nome** para contato?", "next": 7},
            {"field": "contact_phone", "question": "Qual seu **telefone** para contato?", "next": 8},
            {"field": "photo", "question": "Tem uma **URL da foto**? (opcional)", "next": 9},
        ]
        
        if step <= len(steps):
            current_step = steps[step - 1]
            
            # Salvar resposta anterior
            if step > 1:
                prev_step = steps[step - 2]
                field = prev_step["field"]
                
                if field == "species":
                    value = "dog" if "cachorro" in message.lower() else "cat"
                elif field == "last_seen_date":
                    # Converter formato BR para ISO
                    try:
                        dia, mes, ano = message.split('/')
                        value = f"{ano}-{mes}-{dia}"
                    except:
                        value = message
                else:
                    value = message
                
                if "data" not in data:
                    data["data"] = {}
                data["data"][field] = value
            
            # Último passo
            if step == len(steps):
                result = await self.tools.reportar_perdido(data["data"])
                conversation_manager.clear_state(state_key)
                
                return {
                    "message": result["message"],
                    "action_performed": True
                }
            
            conversation_manager.update_data(state_key, {"step": step + 1, "data": data.get("data", {})})
            
            return {
                "message": current_step["question"],
                "action_performed": False
            }
        
        return {"message": "Algo deu errado. Vamos começar de novo?"}
    
    async def _handle_found_registration(self, message: str, state_key: str, data: Dict) -> Dict[str, Any]:
        """Fluxo de marcar como encontrado"""
        step = data.get("step", 1)
        
        if step == 1:
            # Tentar extrair ID da mensagem
            try:
                animal_id = int(message.strip())
                result = await self.tools.marcar_encontrado({"animal_id": animal_id})
                conversation_manager.clear_state(state_key)
                return {
                    "message": result["message"],
                    "action_performed": True
                }
            except:
                # Não é um número, pedir novamente
                conversation_manager.update_data(state_key, {"step": 1})
                return {
                    "message": "Por favor, informe apenas o **número do ID** do animal.",
                    "action_performed": False
                }
        
        return {"message": "Algo deu errado. Vamos começar de novo?"}
    
    async def _handle_search_lost(self, message: str, history: List[Message]) -> Dict[str, Any]:
        """Busca animais perdidos"""
        # Extrair termos de busca da mensagem
        msg_lower = message.lower()
        
        params = {}
        
        if "cachorro" in msg_lower:
            params["species"] = "dog"
        elif "gato" in msg_lower:
            params["species"] = "cat"
        
        # Se a mensagem for curta, pode ser o termo de busca
        words = message.split()
        if len(words) <= 3 and not any(p in msg_lower for p in ["cachorro", "gato"]):
            params["query"] = message
        
        result = await self.tools.buscar_perdidos(params)
        
        # Salvar resposta
        self.history_service.add_message(
            user_id=self.user.id,
            role="assistant",
            content=result["message"],
            session_id=self.session_id,
            intent="search_lost"
        )
        
        return {
            "message": result["message"],
            "intent": "search_lost",
            "action_performed": True,
            "session_id": self.session_id
        }
    
    async def _handle_emergency(self) -> Dict[str, Any]:
        """Responde a situações de emergência"""
        emergency_info = await self.tools.orientar_emergencia({})
        
        # Salvar resposta
        self.history_service.add_message(
            user_id=self.user.id,
            role="assistant",
            content=emergency_info["message"],
            session_id=self.session_id,
            intent="emergency"
        )
        
        return {
            "message": emergency_info["message"],
            "intent": "emergency",
            "action_performed": True,
            "session_id": self.session_id
        }
    
    async def _process_normal_message(self, message: str, history: List[Message]) -> Dict[str, Any]:
        """Processa mensagens normais (não de fluxo)"""
        messages = self._build_messages(history, message)
        
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=0.7,
                max_tokens=500
            )
            
            response_text = response.choices[0].message.content
            
            # Salvar resposta da IA
            self.history_service.add_message(
                user_id=self.user.id,
                role="assistant",
                content=response_text,
                session_id=self.session_id,
                intent="general_question"
            )
            
            return {
                "message": response_text,
                "intent": "general_question",
                "action_performed": False,
                "session_id": self.session_id
            }
            
        except Exception as e:
            print(f"Erro no Groq: {e}")
            error_msg = "Desculpe, tive um problema. Pode repetir?"
            
            self.history_service.add_message(
                user_id=self.user.id,
                role="assistant",
                content=error_msg,
                session_id=self.session_id,
                metadata={"error": str(e)}
            )
            
            return {
                "message": error_msg,
                "intent": None,
                "action_performed": False,
                "session_id": self.session_id
            }
    
    async def _classify_intent(self, message: str) -> str:
        """Classifica a intenção do usuário baseado em palavras-chave"""
        message_lower = message.lower()
        
        # PRIORIDADE 1: EMERGÊNCIA (sempre primeiro)
        if any(word in message_lower for word in ["socorro", "ajuda", "emergência", "urgente", "atropelado", "sangrando", "machucado"]):
            return "emergency"
        
        # PRIORIDADE 2: PERDIDO (palavras específicas)
        lost_keywords = [
            "perdido", "perdi", "sumiu", "desapareceu", "desaparecido",
            "fugiu", "fugido", "encontrei um animal", "achei um animal"
        ]
        if any(word in message_lower for word in lost_keywords):
            return "report_lost"
        
        # PRIORIDADE 3: ENCONTRADO (marcar como encontrado)
        found_keywords = [
            "encontrado", "achei", "encontrei", "localizei", 
            "recuperei", "achamos", "encontramos"
        ]
        if any(word in message_lower for word in found_keywords):
            return "mark_found"
        
        # PRIORIDADE 4: BUSCAR PERDIDOS
        search_keywords = [
            "buscar", "procurar", "lista de perdidos", "ver perdidos",
            "mostrar perdidos", "quais animais perdidos", "tem algum perdido",
            "como encontrar", "onde está"
        ]
        if any(word in message_lower for word in search_keywords):
            return "search_lost"
        
        # PRIORIDADE 5: CADASTRO COMUNITÁRIO (mais específico)
        community_keywords = [
            "cadastrar animal comunitário", "registrar animal comunitário",
            "novo animal comunitário", "adicionar animal comunitário",
            "animal da comunidade", "cuidador", "vive na rua"
        ]
        
        # Só classifica como register_community se tiver palavras MUITO específicas
        if any(keyword in message_lower for keyword in community_keywords):
            return "register_community"
        
        # Se mencionar "cadastrar" ou "registrar" mas sem "comunitário", pergunta qual tipo
        if any(word in message_lower for word in ["cadastrar", "registrar", "adicionar animal"]):
            return "ask_type"  # Precisamos adicionar este tipo
        
        # PRIORIDADE 6: PERGUNTA GERAL
        return "general_question"
    
    async def execute_tool(self, tool_name: str, params: Dict) -> Dict[str, Any]:
        """Executa uma ferramenta específica (para testes)"""
        tool_method = getattr(self.tools, tool_name, None)
        if tool_method:
            return await tool_method(params)
        return {"success": False, "message": "Ferramenta não encontrada"}