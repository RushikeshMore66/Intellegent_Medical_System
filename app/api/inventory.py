from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.api.deps import get_current_user, get_db
from app.models.users import User
from app.models.batch import Batch
from app.models.medicine import Medicine
from app.schemas.batch import BatchCreate, BatchResponse
from app.models.inventory import Inventory
from app.schemas.inventory import InventoryCreate, InventoryResponse
from sqlalchemy import func
from datetime import date, timedelta

router = APIRouter(prefix="/inventory", tags=["Inventory"])

@router.post("/add-batch", response_model=BatchResponse)
def add_batch(
    data: BatchCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    # Check medicine belongs to pharmacy
    medicine = db.query(Medicine).filter(
        Medicine.id == data.medicine_id,
        Medicine.pharmacy_id == current_user.pharmacy_id
    ).first()

    if not medicine:
        raise HTTPException(status_code=404, detail="Medicine not found")

    new_batch = Batch(
        pharmacy_id=current_user.pharmacy_id,
        medicine_id=data.medicine_id,
        batch_number=data.batch_number,
        expiry_date=data.expiry_date,
        quantity=data.quantity,
        purchase_price=data.purchase_price,
        selling_price=data.selling_price,
    )

    db.add(new_batch)
    db.commit()
    db.refresh(new_batch)

    return new_batch


@router.get("/medicine/{medicine_id}", response_model=List[BatchResponse])
def get_batches_for_medicine(
    medicine_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    batches = db.query(Batch).filter(
        Batch.medicine_id == medicine_id,
        Batch.pharmacy_id == current_user.pharmacy_id
    ).all()

    return batches

@router.post("/", response_model=InventoryResponse)
def add_inventory(
    data: InventoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    new_batch = Inventory(
        pharmacy_id=current_user.pharmacy_id,
        medicine_id=data.medicine_id,
        batch_number=data.batch_number,
        quantity=data.quantity,
        purchase_price=data.purchase_price,
        selling_price=data.selling_price,
        expiry_date=data.expiry_date
    )

    db.add(new_batch)
    db.commit()
    db.refresh(new_batch)

    return new_batch

@router.get("/", response_model=list[InventoryResponse])
def get_inventory(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    inventory = db.query(Inventory).filter(
        Inventory.pharmacy_id == current_user.pharmacy_id
    ).all()

    return inventory

@router.get("/stock-summary")
def stock_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    summary = (
        db.query(
            Batch.medicine_id,
            func.sum(Batch.quantity).label("total_quantity")
        )
        .filter(Batch.pharmacy_id == current_user.pharmacy_id)
        .group_by(Batch.medicine_id)
        .all()
    )

    return summary

@router.get("/low-stock")
def low_stock(
    threshold: int = 10,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    low_stock_items = (
        db.query(
            Batch.medicine_id,
            func.sum(Batch.quantity).label("total_quantity")
        )
        .filter(Batch.pharmacy_id == current_user.pharmacy_id)
        .group_by(Batch.medicine_id)
        .having(func.sum(Batch.quantity) <= threshold)
        .all()
    )

    return low_stock_items

@router.get("/near-expiry")
def near_expiry(
    days: int = 30,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    target_date = date.today() + timedelta(days=days)

    batches = (
        db.query(Batch)
        .filter(
            Batch.pharmacy_id == current_user.pharmacy_id,
            Batch.expiry_date <= target_date,
            Batch.quantity > 0
        )
        .all()
    )

    return batches