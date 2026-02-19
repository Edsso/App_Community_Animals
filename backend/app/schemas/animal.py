from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class AnimalBase(BaseModel):
    name: str
    photo: Optional[str] = None
    species: str
    location: str
    latitude: float
    longitude: float
    caretaker: str
    caretaker_contact: Optional[str] = None
    vaccinated: bool = False
    vaccine_details: Optional[str] = None
    neutered: bool = False
    description: Optional[str] = None

class AnimalCreate(AnimalBase):
    pass

class AnimalUpdate(BaseModel):
    name: Optional[str] = None
    photo: Optional[str] = None
    location: Optional[str] = None
    caretaker: Optional[str] = None
    caretaker_contact: Optional[str] = None
    vaccinated: Optional[bool] = None
    vaccine_details: Optional[str] = None
    neutered: Optional[bool] = None
    description: Optional[str] = None

class Animal(AnimalBase):
    id: int
    date_added: datetime

    class Config:
        from_attributes = True