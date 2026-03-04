from pydantic_settings import BaseSettings
from dotenv import load_dotenv
import os

load_dotenv()

class Settings(BaseSettings):
    DATABASE_URL: str = os.getenv('DATABASE_URL', 'Coloque aqui a sua URL do banco de dados')

    class Config:
        env_file = '.env'
        extra = 'ignore'

settings = Settings()