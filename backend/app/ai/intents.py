import re
from typing import Tuple, Optional, Dict, Any
from .prompts import INTENT_CLASSIFICATION_PROMPT
import json

# Palavras-chave para detecção rápida de emergência
EMERGENCY_KEYWORDS = [
    "atropel", "sangrando", "urgente", "machucad", "emergência",
    "socorro", "ajuda", "grave", "acident", "ferid", "sangue"
]

def detect_emergency(text: str) -> bool:
    """Detecta se a mensagem indica uma emergência"""
    text_lower = text.lower()
    return any(keyword in text_lower for keyword in EMERGENCY_KEYWORDS)

def extract_missing_info(intent: str, text: str) -> Dict[str, Any]:
    """Extrai informações já presentes no texto e identifica o que falta"""
    text_lower = text.lower()
    
    missing = {
        "report_lost": {
            "name": "nome" not in text_lower and "chama" not in text_lower,
            "species": "cachorro" not in text_lower and "gato" not in text_lower,
            "location": "local" not in text_lower and "visto" not in text_lower,
            "contact": "contato" not in text_lower and "telefone" not in text_lower
        },
        "register_community": {
            "name": "nome" not in text_lower,
            "species": "cachorro" not in text_lower and "gato" not in text_lower,
            "location": "local" not in text_lower,
            "caretaker": "cuidador" not in text_lower
        }
    }
    
    return missing.get(intent, {})

def normalize_text(text: str) -> str:
    """Remove acentos e caracteres especiais para facilitar análise"""
    import unicodedata
    text = unicodedata.normalize('NFKD', text).encode('ASCII', 'ignore').decode('ASCII')
    return text.lower()

def get_intent_questions(intent: str) -> str:
    """Retorna perguntas para coletar informações faltantes"""
    questions = {
        "report_lost": """
Para registrar um animal perdido, preciso de algumas informações:

 **Nome do animal**
 **Espécie** (cachorro ou gato)
 **Onde foi visto pela última vez**
 **Data que foi visto**
 **Seu nome e telefone para contato**
 **Descrição do animal** (cor, porte, características)

Pode me passar essas informações?""",

        "register_community": """
Para registrar um animal comunitário, preciso saber:

 **Nome do animal**
 **Espécie** (cachorro ou gato)
 **Onde ele vive**
 **Nome do cuidador principal**
 **Telefone de contato** (opcional)
 **Descrição** (comportamento, rotina)

Me conte sobre ele!"""
    }
    
    return questions.get(intent, "Como posso ajudar você?")