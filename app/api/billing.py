from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.models.users import User
from app.models.invoice import Invoice
from app.models.inventory import Inventory
from app.models.medicine import Medicine
from app.schemas.invoice import InvoiceCreate, InvoiceResponse, InvoiceDetailResponse
from app.api.deps import require_roles
from app.models.invoice_item import InvoiceItem
from typing import List


router = APIRouter(prefix="/billing", tags=["Billing"])

@router.post("/")
def create_invoice(
    data: InvoiceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["admin", "cashier"]))
):
    total_amount = 0
    total_gst = 0

    new_invoice = Invoice(
        pharmacy_id=current_user.pharmacy_id,
        total_amount=0,
        gst_amount=0
    )

    db.add(new_invoice)
    db.commit()
    db.refresh(new_invoice)

    for item in data.items:

        medicine = db.query(Medicine).filter(
            Medicine.id == item.medicine_id,
            Medicine.pharmacy_id == current_user.pharmacy_id
        ).first()

        if not medicine:
            raise HTTPException(status_code=404, detail="Medicine not found")

        from datetime import date

        remaining_quantity = item.quantity

        inventory_batches = db.query(Inventory).filter(
            Inventory.medicine_id == item.medicine_id,
            Inventory.pharmacy_id == current_user.pharmacy_id,
            Inventory.quantity > 0,
            Inventory.expiry_date > date.today()
        ).order_by(Inventory.expiry_date.asc()).all()

        if not inventory_batches:
            raise HTTPException(status_code=400, detail="No valid stock available")

        for batch in inventory_batches:
            if remaining_quantity <= 0:
                break

            if batch.quantity >= remaining_quantity:
                batch.quantity -= remaining_quantity
                remaining_quantity = 0
            else:
                remaining_quantity -= batch.quantity
                batch.quantity = 0

        if remaining_quantity > 0:
            raise HTTPException(status_code=400, detail="Insufficient stock")

        item_total = medicine.price * item.quantity
        gst_value = item_total * (medicine.gst_percentage / 100)

        total_amount += item_total
        total_gst += gst_value

        total_purchase_cost = 0

        remaining_quantity = item.quantity

        for batch in inventory_batches:
            if remaining_quantity <= 0:
                break

            if batch.quantity >= remaining_quantity:
                total_purchase_cost += batch.purchase_price * remaining_quantity
                batch.quantity -= remaining_quantity
                remaining_quantity = 0
            else:
                total_purchase_cost += batch.purchase_price * batch.quantity
                remaining_quantity -= batch.quantity
                batch.quantity = 0

        if remaining_quantity > 0:
            raise HTTPException(status_code=400, detail="Insufficient stock")

        average_purchase_price = total_purchase_cost / item.quantity

        invoice_item = InvoiceItem(
            invoice_id=new_invoice.id,
            medicine_id=medicine.id,
            quantity=item.quantity,
            price=medicine.price,
            purchase_price=average_purchase_price,
            gst_percentage=medicine.gst_percentage
        )

        db.add(invoice_item)

    new_invoice.total_amount = total_amount
    new_invoice.gst_amount = total_gst

    db.commit()

    return {
        "invoice_id": str(new_invoice.id),
        "total": total_amount,
        "gst": total_gst
    }

@router.get("/invoices", response_model=List[InvoiceResponse])
def list_invoices(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    invoices = (
        db.query(Invoice)
        .filter(Invoice.pharmacy_id == current_user.pharmacy_id)
        .order_by(Invoice.created_at.desc())
        .all()
    )

    return invoices

@router.get("/invoice/{invoice_id}", response_model=InvoiceDetailResponse)
def get_invoice_detail(
    invoice_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    invoice = db.query(Invoice).filter(
        Invoice.id == invoice_id,
        Invoice.pharmacy_id == current_user.pharmacy_id
    ).first()

    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")

    items = db.query(InvoiceItem).filter(
        InvoiceItem.invoice_id == invoice.id
    ).all()

    return {
        "id": invoice.id,
        "total_amount": invoice.total_amount,
        "gst_amount": invoice.gst_amount,
        "created_at": invoice.created_at,
        "items": items
    }