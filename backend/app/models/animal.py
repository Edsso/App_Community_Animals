from sqlalchemy import Column, Integer, String, Boolean, Float, DateTime
from sqlalchemy.sql import func
from app.database import Base

class Animal(Base):
    __tablename__ = "animals"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, index=True)
    photo = Column(String(500))
    species = Column(String(10), nullable=False, index=True)  # 'dog' ou 'cat'
    location = Column(String(200), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    caretaker = Column(String(100), nullable=False)
    caretaker_contact = Column(String(20))
    vaccinated = Column(Boolean, default=False)
    vaccine_details = Column(String(500))
    neutered = Column(Boolean, default=False)
    description = Column(String(1000))
    date_added = Column(DateTime(timezone=True), server_default=func.now())