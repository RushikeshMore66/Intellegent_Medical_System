from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.models.invoice import Invoice
from app.models.inventory import Inventory
from app.models.medicine import Medicine
from app.schemas.invoice import InvoiceCreate, InvoiceResponse, InvoiceDetailResponse
from app.api.deps import require_roles, require_role
from app.models.invoice_item import InvoiceItem
from app.models.batch import Batch
from fastapi.responses import StreamingResponse
from app.services.pdf_service import generate_invoice_pdf
from typing import List
from sqlalchemy import func
from datetime import date
from app.core.logger import logger
from datetime import datetime
from app.schemas.common import PaginatedResponse

router = APIRouter(prefix="/billing", tags=["Billing"])

@router.post("/")
def create_invoice(
    data: InvoiceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["admin", "cashier"]))
):
    total_amount = 0
    total_gst = 0

    year = datetime.utcnow().year
    logger.info(f"Invoice creation started by user {current_user.id}")

    last_invoice = db.query(Invoice).filter(
        Invoice.pharmacy_id == current_user.pharmacy_id
    ).order_by(Invoice.created_at.desc()).first()

    sequence = 1

    if last_invoice and last_invoice.invoice_number:
        try:
            sequence = int(last_invoice.invoice_number.split("-")[-1]) + 1
        except Exception:
            sequence = 1

    invoice_number = f"INV-{year}-{sequence:05d}"

    new_invoice = Invoice(
        pharmacy_id=current_user.pharmacy_id,
        user_id=current_user.id,
        invoice_number=invoice_number,
        total_amount=0,
        gst_amount=0
    )

    db.add(new_invoice)
    db.commit()
    db.refresh(new_invoice)

    batch_ids = sorted({str(item.batch_id) for item in data.items})
    medicine_ids = list({str(item.medicine_id) for item in data.items})

    if not batch_ids:
        raise HTTPException(status_code=400, detail="No items provided")

    # Bulk query Medicines to fix N+1 performance
    medicines = db.query(Medicine).filter(
        Medicine.id.in_(medicine_ids),
        Medicine.pharmacy_id == current_user.pharmacy_id
    ).all()
    medicine_dict = {str(m.id): m for m in medicines}

    # Bulk query Batches with row lock
    batches = (
        db.query(Batch)
        .filter(
            Batch.id.in_(batch_ids),
            Batch.pharmacy_id == current_user.pharmacy_id
        )
        .order_by(Batch.id) # Crucial for Deadlock prevention when acquiring row locks
        .with_for_update(of=Batch)
        .all()
    )
    batch_dict = {str(b.id): b for b in batches}

    for item in data.items:
        batch = batch_dict.get(str(item.batch_id))
        medicine = medicine_dict.get(str(item.medicine_id))

        if not batch:
            raise HTTPException(status_code=404, detail=f"Batch ID {item.batch_id} not found.")

        if not medicine:
            raise HTTPException(status_code=404, detail="Medicine not found")

        # Prevent Data Mismatch/Tampering Challenge
        if str(item.medicine_id) != str(batch.medicine_id):
            raise HTTPException(
                status_code=400,
                detail=f"Batch {item.batch_id} does not belong to Medicine ID {item.medicine_id}"
            )

        # Prevent selling expired medicine
        if batch.expiry_date < date.today():
            raise HTTPException(
                status_code=400,
                detail=f"Cannot sell expired medicine (Batch: {batch.batch_number})"
            )

        # Check stock
        if batch.quantity < item.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient stock for Batch {batch.batch_number}. Only {batch.quantity} remaining."
            )

        # Prevent selling inactive medicine
        if not medicine.is_active:
            raise HTTPException(
                status_code=400,
                detail=f"Medicine {medicine.name} is inactive"
            )

        # Deduct stock
        batch.quantity -= item.quantity

        item_total = batch.selling_price * item.quantity
        gst_value = item_total * ((medicine.gst_percentage or 0) / 100)

        total_amount += item_total
        total_gst += gst_value

        invoice_item = InvoiceItem(
            invoice_id=new_invoice.id,
            medicine_id=medicine.id,
            batch_id=batch.id,
            quantity=item.quantity,
            price=batch.selling_price,
            gst_percentage=medicine.gst_percentage or 0
        )

        db.add(invoice_item)

    new_invoice.total_amount = total_amount
    new_invoice.gst_amount = total_gst

    db.commit()

    logger.info(
        f"Invoice {new_invoice.invoice_number} created by user {current_user.id} "
        f"total={new_invoice.total_amount}"
    )

    return {
        "invoice_id": str(new_invoice.id),
        "total": total_amount,
        "gst": total_gst
    }

@router.get("/invoices", response_model=PaginatedResponse[InvoiceResponse])
def list_invoices(
    search: str = "",
    limit: int = 10,
    offset: int = 0,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    query = db.query(Invoice).filter(
        Invoice.pharmacy_id == current_user.pharmacy_id
    )

    if search:
        query = query.filter(
            Invoice.invoice_number.ilike(f"%{search}%")
        )

    total = query.count()

    invoices = (
        query
        .order_by(Invoice.created_at.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )

    return {
        "total": total,
        "limit": limit,
        "offset": offset,
        "data": invoices
    }

@router.get("/invoice/{invoice_id}", response_model=InvoiceDetailResponse)
def get_invoice_detail(
    invoice_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["admin", "pharmacist", "cashier"])),
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
@router.get("/analytics/today")
def todays_sales(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["admin", "pharmacist", "cashier"])),
):
    today = date.today()

    total = (
        db.query(func.sum(Invoice.total_amount))
        .filter(
            Invoice.pharmacy_id == current_user.pharmacy_id,
            func.date(Invoice.created_at) == today
        )
        .scalar()
    )

    invoice_count = (
        db.query(func.count(Invoice.id))
        .filter(
            Invoice.pharmacy_id == current_user.pharmacy_id,
            func.date(Invoice.created_at) == today
        )
        .scalar()
    )

    return {
        "date": str(today),
        "total_sales": total or 0,
        "invoice_count": invoice_count
    }
@router.get("/analytics/month")
def monthly_sales(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    today = date.today()

    total = (
        db.query(func.sum(Invoice.total_amount))
        .filter(
            Invoice.pharmacy_id == current_user.pharmacy_id,
            func.extract("month", Invoice.created_at) == today.month,
            func.extract("year", Invoice.created_at) == today.year
        )
        .scalar()
    )

    invoice_count = (
        db.query(func.count(Invoice.id))
        .filter(
            Invoice.pharmacy_id == current_user.pharmacy_id,
            func.extract("month", Invoice.created_at) == today.month,
            func.extract("year", Invoice.created_at) == today.year
        )
        .scalar()
    )

    return {
        "month": today.month,
        "year": today.year,
        "total_sales": total or 0,
        "invoice_count": invoice_count
    }
@router.get("/analytics/sales-trend")
def sales_trend(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    results = (
        db.query(
            func.date(Invoice.created_at).label("date"),
            func.sum(Invoice.total_amount).label("total")
        )
        .filter(Invoice.pharmacy_id == current_user.pharmacy_id)
        .group_by(func.date(Invoice.created_at))
        .order_by(func.date(Invoice.created_at))
        .all()
    )

    return results
@router.get("/analytics/total-profit")
def total_profit(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    results = (
        db.query(
            func.sum(
                (InvoiceItem.price - Batch.purchase_price) * InvoiceItem.quantity
            )
        )
        .join(Batch, Batch.id == InvoiceItem.batch_id)
        .join(Invoice, Invoice.id == InvoiceItem.invoice_id)
        .filter(Invoice.pharmacy_id == current_user.pharmacy_id)
        .scalar()
    )

    return {
        "total_profit": results or 0
    }
@router.get("/analytics/month-profit")
def monthly_profit(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    today = date.today()

    results = (
        db.query(
            func.sum(
                (InvoiceItem.price - Batch.purchase_price) * InvoiceItem.quantity
            )
        )
        .join(Batch, Batch.id == InvoiceItem.batch_id)
        .join(Invoice, Invoice.id == InvoiceItem.invoice_id)
        .filter(
            Invoice.pharmacy_id == current_user.pharmacy_id,
            func.extract("month", Invoice.created_at) == today.month,
            func.extract("year", Invoice.created_at) == today.year
        )
        .scalar()
    )

    return {
        "month": today.month,
        "year": today.year,
        "profit": results or 0
    }

@router.get("/invoice/{invoice_id}/pdf")
def download_invoice_pdf(
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

    pdf_buffer = generate_invoice_pdf(invoice, items)

    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename=invoice_{invoice.id}.pdf"
        }
    )
