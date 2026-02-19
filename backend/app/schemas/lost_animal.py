from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class LostAnimalBase(BaseModel):
    name: str
    photo: Optional[str] = None
    species: str
    last_seen_location: str
    last_seen_date: datetime
    description: str
    contact_name: str
    contact_phone: str

class LostAnimalCreate(LostAnimalBase):
    pass

class LostAnimalUpdate(BaseModel):
    found: Optional[bool] = None

class LostAnimal(LostAnimalBase):
    id: int
    found: bool
    date_reported: datetime

    class Config:
        from_attributes = True