from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import animals, lost
from app.database import engine, Base

# Cria as tabelas no banco (caso não exista)
print("Criando tabelas no banco de dados...")
Base.metadata.create_all(bind=engine)
print("Tabelas criadas com sucesso!")

app = FastAPI(
    title="Animais Comunitários API",
    description="API para gerenciamento de animais comunitários",
    version="1.0.0"
)

# Configuração CORS para o frontend React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],  # URLs do Vite
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclui as rotas
app.include_router(animals.router)
app.include_router(lost.router)

@app.get("/")
def root():
    return {
        "message": "API Animais Comunitários",
        "docs": "/docs",
        "redoc": "/redoc",
        "endpoints": {
            "animais": {
                "listar": "GET /animals",
                "buscar": "GET /animals/{id}",
                "criar": "POST /animals",
                "atualizar": "PUT /animals/{id}",
                "deletar": "DELETE /animals/{id}"
            },
            "perdidos": {
                "listar": "GET /lost",
                "listar_encontrados": "GET /lost/found",
                "reportar": "POST /lost",
                "marcar_encontrado": "PATCH /lost/{id}/found"
            }
        }
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "database": "connected"}