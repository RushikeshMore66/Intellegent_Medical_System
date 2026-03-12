from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.schemas.response import APIResponse
from app.core.database import SessionLocal
from app.models.medicine import Medicine
from app.schemas.medicine import MedicineCreate, MedicineResponse
from app.api.deps import get_current_user, get_db, require_roles, require_role
from app.models.users import User
from sqlalchemy import or_
from app.schemas.common import PaginatedResponse

router = APIRouter(prefix="/medicines", tags=["Medicines"])

@router.post("/", response_model=MedicineResponse)
def create_medicine(
    medicine: MedicineCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["admin", "pharmacist"]))
):
    new_medicine = Medicine(
        **medicine.model_dump(),
        pharmacy_id=current_user.pharmacy_id
    )
    db.add(new_medicine)
    db.commit()
    db.refresh(new_medicine)
    return new_medicine

@router.get("/", response_model=PaginatedResponse[MedicineResponse])
def list_medicines(
    search: str = "",
    limit: int = 10,
    offset: int = 0,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    query = db.query(Medicine).filter(
        Medicine.pharmacy_id == current_user.pharmacy_id,
        Medicine.is_active == True
    )

    if search:
        query = query.filter(
            or_(
                Medicine.name.ilike(f"%{search}%"),
                Medicine.generic_name.ilike(f"%{search}%"),
                Medicine.manufacturer.ilike(f"%{search}%")
            )
        )

    total = query.count()

    medicines = (
        query
        .order_by(Medicine.name)
        .offset(offset)
        .limit(limit)
        .all()
    )

    return {
        "total": total,
        "limit": limit,
        "offset": offset,
        "data": medicines
    }


@router.get("/all", response_model=List[MedicineResponse])
def list_all_medicines(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["admin", "pharmacist"])),
):

    medicines = (
        db.query(Medicine)
        .filter(Medicine.pharmacy_id == current_user.pharmacy_id)
        .all()
    )

    return APIResponse(
        success=True,
        message="Medicine created successfully",
        data=medicines
    )

@router.delete("/{medicine_id}")
def soft_delete_medicine(
    medicine_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["admin"]))
):
    existing = db.query(Medicine).filter(
        Medicine.id == medicine_id,
        Medicine.pharmacy_id == current_user.pharmacy_id,
        Medicine.is_active == True
    ).first()

    if not existing:
        raise HTTPException(
            status_code=404,
            detail="Medicine not found"
        )

    existing.is_active = False
    db.commit()

    return {"message": "Medicine deactivated successfully"}