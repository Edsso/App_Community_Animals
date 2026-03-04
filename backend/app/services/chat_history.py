from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List, Optional
from datetime import datetime, timedelta

from app.models.chat_history import ChatHistory
from app.ai.schemas import Message

class ChatHistoryService:
    def __init__(self, db: Session):
        self.db = db
    
    def add_message(
        self, 
        user_id: int, 
        role: str, 
        content: str, 
        session_id: str = "default",
        intent: Optional[str] = None,
        metadata: Optional[dict] = None
    ) -> ChatHistory:
        """Adiciona uma mensagem ao histórico"""
        history = ChatHistory(
            user_id=user_id,
            session_id=session_id,
            role=role,
            content=content,
            intent=intent,
            metadata_json=metadata
        )
        self.db.add(history)
        self.db.commit()
        self.db.refresh(history)
        return history
    
    def get_recent_messages(
        self, 
        user_id: int, 
        session_id: str = "default",
        limit: int = 20,
        hours: int = 24 * 7  # Últimos 7 dias
    ) -> List[ChatHistory]:
        """Busca mensagens recentes do usuário"""
        cutoff = datetime.now() - timedelta(hours=hours)
        
        return self.db.query(ChatHistory).filter(
            ChatHistory.user_id == user_id,
            ChatHistory.session_id == session_id,
            ChatHistory.created_at >= cutoff
        ).order_by(desc(ChatHistory.created_at)).limit(limit).all()
    
    def get_session_history(self, user_id: int, session_id: str = "default") -> List[Message]:
        """Retorna histórico formatado para a IA"""
        messages = self.get_recent_messages(user_id, session_id)
        
        # Inverter para ordem cronológica
        messages.reverse()
        
        return [
            Message(
                role=msg.role,
                content=msg.content
            ) for msg in messages
        ]
    
    def clear_session(self, user_id: int, session_id: str = "default"):
        """Limpa histórico de uma sessão"""
        self.db.query(ChatHistory).filter(
            ChatHistory.user_id == user_id,
            ChatHistory.session_id == session_id
        ).delete()
        self.db.commit()
    
    def get_user_sessions(self, user_id: int) -> List[str]:
        """Lista todas as sessões do usuário"""
        sessions = self.db.query(ChatHistory.session_id).filter(
            ChatHistory.user_id == user_id
        ).distinct().all()
        return [s[0] for s in sessions]