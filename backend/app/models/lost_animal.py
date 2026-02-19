from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from app.database import Base

class LostAnimal(Base):
    __tablename__ = "animais_perdidos"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, index=True)
    photo = Column(String(500))
    species = Column(String(10), nullable=False, index=True)
    last_seen_location = Column(String(200), nullable=False)
    last_seen_date = Column(DateTime, nullable=False)
    description = Column(String(1000))
    contact_name = Column(String(100), nullable=False)
    contact_phone = Column(String(20), nullable=False)
    found = Column(Boolean, default=False, index=True)
    date_reported = Column(DateTime(timezone=True), server_default=func.now())