from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db, require_role
from app.models.users import User
from app.models.suppliers import Supplier
from app.schemas.common import PaginatedResponse
from sqlalchemy import or_

router = APIRouter(prefix="/suppliers", tags=["Suppliers"])


@router.post("/")
def create_supplier(
    data: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["admin"]))
):
    supplier = Supplier(
        pharmacy_id=current_user.pharmacy_id,
        name=data.get("name"),
        phone=data.get("phone"),
        email=data.get("email"),
        gst_number=data.get("gst_number"),
        address=data.get("address"),
    )

    db.add(supplier)
    db.commit()
    db.refresh(supplier)

    return supplier

@router.get("/", response_model=PaginatedResponse)
def list_suppliers(
    search: str = "",
    limit: int = 10,
    offset: int = 0,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    query = db.query(Supplier).filter(
        Supplier.pharmacy_id == current_user.pharmacy_id,
        Supplier.is_active == True
    )

    if search:
        query = query.filter(
            or_(
                Supplier.name.ilike(f"%{search}%"),
                Supplier.phone.ilike(f"%{search}%"),
                Supplier.gst_number.ilike(f"%{search}%")
            )
        )

    total = query.count()

    suppliers = (
        query
        .order_by(Supplier.name)
        .offset(offset)
        .limit(limit)
        .all()
    )

    return {
        "total": total,
        "limit": limit,
        "offset": offset,
        "data": suppliers
    }

@router.delete("/{supplier_id}")
def soft_delete_supplier(
    supplier_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["admin"]))
):
    existing = db.query(Supplier).filter(
        Supplier.id == supplier_id,
        Supplier.pharmacy_id == current_user.pharmacy_id,
        Supplier.is_active == True
    ).first()

    if not existing:
        raise HTTPException(
            status_code=404,
            detail="Supplier not found"
        )

    existing.is_active = False
    db.commit()

    return {"message": "Supplier deactivated successfully"}