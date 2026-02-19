from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.animal import Animal as AnimalModel
from app.schemas.animal import Animal, AnimalCreate, AnimalUpdate

router = APIRouter(prefix="/animals", tags=["animais"])

@router.get("/", response_model=List[Animal])
def listar_animais(db: Session = Depends(get_db)):
    """Retorna todos os animais"""
    animais = db.query(AnimalModel).all()
    return animais

@router.get("/{animal_id}", response_model=Animal)
def buscar_animal(animal_id: int, db: Session = Depends(get_db)):
    """Retorna um animal específico"""
    animal = db.query(AnimalModel).filter(AnimalModel.id == animal_id).first()
    if not animal:
        raise HTTPException(status_code=404, detail="Animal não encontrado")
    return animal

@router.post("/", response_model=Animal, status_code=201)
def criar_animal(animal: AnimalCreate, db: Session = Depends(get_db)):
    """Cria um novo animal"""
    db_animal = AnimalModel(**animal.model_dump())
    db.add(db_animal)
    db.commit()
    db.refresh(db_animal)
    return db_animal

@router.put("/{animal_id}", response_model=Animal)
def atualizar_animal(animal_id: int, animal: AnimalUpdate, db: Session = Depends(get_db)):
    """Atualiza um animal existente"""
    db_animal = db.query(AnimalModel).filter(AnimalModel.id == animal_id).first()
    if not db_animal:
        raise HTTPException(status_code=404, detail="Animal não encontrado")
    
    for key, value in animal.model_dump(exclude_unset=True).items():
        setattr(db_animal, key, value)
    
    db.commit()
    db.refresh(db_animal)
    return db_animal

@router.delete("/{animal_id}")
def deletar_animal(animal_id: int, db: Session = Depends(get_db)):
    """Remove um animal"""
    db_animal = db.query(AnimalModel).filter(AnimalModel.id == animal_id).first()
    if not db_animal:
        raise HTTPException(status_code=404, detail="Animal não encontrado")
    
    db.delete(db_animal)
    db.commit()
    return {"message": "Animal removido com sucesso"}