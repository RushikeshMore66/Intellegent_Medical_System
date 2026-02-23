from app.db.session import engine
from app.db.base import Base
from app.models.medicine import Medicine
from app.models.drug_interaction import DrugInteraction


def init_db():
    Base.metadata.create_all(bind=engine)
    