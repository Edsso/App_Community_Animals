from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional

from app.database import get_db
from app.core.auth import get_current_user
from app.models.user import User
from .agent import Agent
from .schemas import ChatRequest, ChatResponse

router = APIRouter(prefix="/ai", tags=["assistente"])

@router.post("/chat", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Conversa com o assistente IA (histórico por usuário)"""
    try:
        agent = Agent(db, current_user)
        response = await agent.process_message(
            message=request.message,
            session_id=request.session_id
        )
        return response
    except Exception as e:
        print(f"Erro no chat: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/health")
async def health_check():
    """Verifica se o serviço de IA está funcionando"""
    return {"status": "healthy", "service": "AI Assistant"}