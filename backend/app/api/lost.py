from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.lost_animal import LostAnimal as LostAnimalModel
from app.schemas.lost_animal import LostAnimal, LostAnimalCreate

router = APIRouter(prefix="/lost", tags=["perdidos"])

@router.get("/", response_model=List[LostAnimal])
def listar_perdidos(db: Session = Depends(get_db)):
    """Retorna todos os animais perdidos não encontrados"""
    animais = db.query(LostAnimalModel).filter(LostAnimalModel.found == False).all()
    return animais

@router.get("/found", response_model=List[LostAnimal])
def listar_encontrados(db: Session = Depends(get_db)):
    """Retorna todos os animais já encontrados"""
    animais = db.query(LostAnimalModel).filter(LostAnimalModel.found == True).all()
    return animais

@router.post("/", response_model=LostAnimal, status_code=201)
def reportar_perdido(animal: LostAnimalCreate, db: Session = Depends(get_db)):
    """Reporta um novo animal perdido"""
    db_animal = LostAnimalModel(**animal.model_dump())
    db.add(db_animal)
    db.commit()
    db.refresh(db_animal)
    return db_animal

@router.patch("/{animal_id}/found")
def marcar_encontrado(animal_id: int, db: Session = Depends(get_db)):
    """Marca um animal como encontrado"""
    db_animal = db.query(LostAnimalModel).filter(LostAnimalModel.id == animal_id).first()
    if not db_animal:
        raise HTTPException(status_code=404, detail="Animal não encontrado")
    
    db_animal.found = True
    db.commit()
    return {"message": "Animal marcado como encontrado"}