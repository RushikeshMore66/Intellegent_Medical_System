from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.api.deps import get_current_user, get_db, require_role
from app.models.users import User
from app.models.purchase import Purchase
from app.models.purchase_item import PurchaseItem
from app.models.batch import Batch

router = APIRouter(prefix="/purchases", tags=["Purchases"])


@router.post("/")
def create_purchase(
    data: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["admin"])),
):
    purchase = Purchase(
        pharmacy_id=current_user.pharmacy_id,
        supplier_id=data["supplier_id"],
        total_amount=0
    )

    db.add(purchase)
    db.flush()

    total_amount = 0

    for item in data["items"]:
        purchase_item = PurchaseItem(
            purchase_id=purchase.id,
            medicine_id=item["medicine_id"],
            batch_number=item["batch_number"],
            expiry_date=item["expiry_date"],
            quantity=item["quantity"],
            purchase_price=item["purchase_price"],
            selling_price=item["selling_price"],
        )

        db.add(purchase_item)

        # Add stock to batch table
        batch = Batch(
            pharmacy_id=current_user.pharmacy_id,
            medicine_id=item["medicine_id"],
            batch_number=item["batch_number"],
            expiry_date=item["expiry_date"],
            quantity=item["quantity"],
            purchase_price=item["purchase_price"],
            selling_price=item["selling_price"],
        )

        db.add(batch)

        total_amount += item["quantity"] * item["purchase_price"]

    purchase.total_amount = total_amount

    db.commit()

    return {
        "message": "Purchase created successfully",
        "purchase_id": str(purchase.id),
        "total_amount": total_amount
    }