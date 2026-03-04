from typing import Optional, Dict, Any, List
from fastapi import Depends
from sqlalchemy.orm import Session
from datetime import datetime
import json

from app.database import get_db
from app.models.animal import Animal
from app.models.lost_animal import LostAnimal
from app.schemas.animal import AnimalCreate
from app.schemas.lost_animal import LostAnimalCreate

class Tools:
    def __init__(self, db: Session):
        self.db = db
    
    async def reportar_perdido(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Registra um animal perdido no sistema"""
        try:
            # Criar novo registro de animal perdido
            novo_perdido = LostAnimal(
                name=params["name"],
                photo=params.get("photo"),
                species=params["species"],
                last_seen_location=params["last_seen_location"],
                last_seen_date=datetime.fromisoformat(params["last_seen_date"]),
                description=params["description"],
                contact_name=params["contact_name"],
                contact_phone=params["contact_phone"],
                found=False
            )
            
            self.db.add(novo_perdido)
            self.db.commit()
            self.db.refresh(novo_perdido)
            
            return {
                "success": True,
                "message": f" {params['name']} foi registrado como perdido!",
                "data": {
                    "id": novo_perdido.id,
                    "name": novo_perdido.name
                }
            }
        except Exception as e:
            self.db.rollback()
            return {
                "success": False,
                "message": f"Erro ao registrar: {str(e)}"
            }
    
    async def buscar_perdidos(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Busca animais perdidos no sistema"""
        query = self.db.query(LostAnimal).filter(LostAnimal.found == False)
        
        if params.get("species"):
            query = query.filter(LostAnimal.species == params["species"])
        
        if params.get("query"):
            search = f"%{params['query']}%"
            query = query.filter(
                (LostAnimal.name.ilike(search)) | 
                (LostAnimal.last_seen_location.ilike(search))
            )
        
        resultados = query.limit(10).all()
        
        if not resultados:
            return {
                "success": True,
                "message": "Nenhum animal perdido encontrado.",
                "data": []
            }
        
        animais_lista = [
            f"• {a.name} ({'🐶' if a.species == 'dog' else '🐱'}) - Visto em: {a.last_seen_location}"
            for a in resultados
        ]
        
        return {
            "success": True,
            "message": f"Encontrei {len(resultados)} animais perdidos:\n" + "\n".join(animais_lista),
            "data": [{"id": a.id, "name": a.name} for a in resultados]
        }
    
    async def registrar_comunitario(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Registra um novo animal comunitário"""
        try:
            novo_animal = Animal(
                name=params["name"],
                photo=params.get("photo"),
                species=params["species"],
                location=params["location"],
                latitude=params["latitude"],
                longitude=params["longitude"],
                caretaker=params["caretaker"],
                caretaker_contact=params.get("caretaker_contact"),
                vaccinated=params.get("vaccinated", False),
                vaccine_details=params.get("vaccine_details"),
                neutered=params.get("neutered", False),
                description=params.get("description")
            )
            
            self.db.add(novo_animal)
            self.db.commit()
            self.db.refresh(novo_animal)
            
            return {
                "success": True,
                "message": f" {params['name']} foi registrado como animal comunitário!",
                "data": {
                    "id": novo_animal.id,
                    "name": novo_animal.name
                }
            }
        except Exception as e:
            self.db.rollback()
            return {
                "success": False,
                "message": f"Erro ao registrar: {str(e)}"
            }
    
    async def marcar_encontrado(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Marca um animal perdido como encontrado"""
        try:
            animal = self.db.query(LostAnimal).filter(
                LostAnimal.id == params["animal_id"],
                LostAnimal.found == False
            ).first()
            
            if not animal:
                return {
                    "success": False,
                    "message": "Animal não encontrado ou já foi marcado como encontrado."
                }
            
            animal.found = True
            self.db.commit()
            
            return {
                "success": True,
                "message": f" Boas notícias! {animal.name} foi marcado como encontrado!",
                "data": {
                    "id": animal.id,
                    "name": animal.name
                }
            }
        except Exception as e:
            self.db.rollback()
            return {
                "success": False,
                "message": f"Erro ao marcar como encontrado: {str(e)}"
            }
    
    async def orientar_emergencia(self) -> Dict[str, Any]:
        """Fornece orientações para situações de emergência"""
        return {
            "success": True,
            "message": """
 **ORIENTAÇÕES DE EMERGÊNCIA**

1 **Mantenha a calma** - Animais sentem seu estresse
2 **Segurança primeiro** - Avalie se é seguro se aproximar
3 **Contate ajuda profissional:**
   • Vet emergência 24h: (11) 99999-9999
   • Corpo de Bombeiros: 193 (se houver risco)
   • Polícia Ambiental: 190

4 **Enquanto aguarda socorro:**
   • Mantenha o animal aquecido
   • Evite movimentar se houver suspeita de fratura
   • Não ofereça água/comida sem orientação veterinária

Posso ajudar a encontrar uma clínica veterinária próxima ou registrar este animal como perdido para acompanhamento.
            """,
            "data": {
                "emergency_phones": ["193", "190"],
                "vet_contact": "(11) 99999-9999"
            }
        }