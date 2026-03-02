from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.database import SessionLocal
from app.models.medicine import Medicine
from app.schemas.medicine import MedicineCreate, MedicineResponse
from app.api.deps import get_current_user, get_db, require_roles
from app.models.users import User

router = APIRouter(prefix="/medicines", tags=["Medicine"])


@router.post("/", response_model=MedicineResponse)
def create_medicine(
    data: MedicineCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    new_medicine = Medicine(
        pharmacy_id=current_user.pharmacy_id,
        name=data.name,
        generic_name=data.generic_name,
        category=data.category,
        manufacturer=data.manufacturer,
        hsn_code=data.hsn_code,
        gst_percentage=data.gst_percentage,
        mrp=data.mrp,
        selling_price=data.selling_price,
    )

    db.add(new_medicine)
    db.commit()
    db.refresh(new_medicine)

    return new_medicine


@router.get("/", response_model=List[MedicineResponse])
def list_medicines(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["admin"])),
):

    medicines = (
        db.query(Medicine)
        .filter(Medicine.pharmacy_id == current_user.pharmacy_id)
        .all()
    )

    return medicines