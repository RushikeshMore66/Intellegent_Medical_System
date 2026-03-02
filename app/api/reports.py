from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date

from app.api.deps import get_db, get_current_user, require_roles
from app.models.users import User
from app.models.invoice import Invoice
from app.models.invoice_item import InvoiceItem

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.get("/daily")
def daily_report(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["admin"]))
):

    today = date.today()

    result = db.query(
        func.count(Invoice.id).label("total_invoices"),
        func.sum(Invoice.total_amount).label("total_revenue"),
        func.sum(Invoice.gst_amount).label("total_gst")
    ).filter(
        Invoice.pharmacy_id == current_user.pharmacy_id,
        func.date(Invoice.created_at) == today
    ).first()

    return {
        "date": str(today),
        "total_invoices": result.total_invoices or 0,
        "total_revenue": float(result.total_revenue or 0),
        "total_gst": float(result.total_gst or 0)
    }

@router.get("/monthly")
def monthly_report(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    today = date.today()

    result = db.query(
        func.count(Invoice.id).label("total_invoices"),
        func.sum(Invoice.total_amount).label("total_revenue"),
        func.sum(Invoice.gst_amount).label("total_gst")
    ).filter(
        Invoice.pharmacy_id == current_user.pharmacy_id,
        func.extract("month", Invoice.created_at) == today.month,
        func.extract("year", Invoice.created_at) == today.year
    ).first()

    return {
        "month": today.month,
        "year": today.year,
        "total_invoices": result.total_invoices or 0,
        "total_revenue": float(result.total_revenue or 0),
        "total_gst": float(result.total_gst or 0)
    }

@router.get("/profit-daily")
def daily_profit(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    today = date.today()

    result = db.query(
        func.sum(
            (InvoiceItem.price - InvoiceItem.purchase_price) * InvoiceItem.quantity
        ).label("total_profit")
    ).join(Invoice).filter(
        Invoice.pharmacy_id == current_user.pharmacy_id,
        func.date(Invoice.created_at) == today
    ).first()

    return {
        "date": str(today),
        "total_profit": float(result.total_profit or 0)
    }