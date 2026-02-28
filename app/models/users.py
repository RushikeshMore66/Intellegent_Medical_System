from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
import uuid
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4) 
    pharmacy_id = Column(UUID(as_uuid=True), ForeignKey("pharmacies.id")) 
    name = Column(String, nullable=False) 
    email = Column(String, unique=True, nullable=False) 
    password_hash = Column(String, nullable=False) 
    role = Column(String, default="admin")