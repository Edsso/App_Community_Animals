from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User

security = HTTPBearer(auto_error=False)  # Não forçar auto erro para testes

# Usuário fixo para teste (enquanto não implementa JWT)
TEST_USER_ID = 1

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """
    Versão SIMPLIFICADA para teste - sempre retorna o primeiro usuário
    """
    # Buscar ou criar usuário de teste
    user = db.query(User).filter(User.id == TEST_USER_ID).first()
    
    if not user:
        # Criar usuário de teste se não existir
        user = User(
            id=TEST_USER_ID,
            email="teste@email.com",
            name="Usuário Teste",
            hashed_password="fake_hash"
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    
    return user