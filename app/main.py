from fastapi import FastAPI
from app.core.database import engine, Base
from app.models.pharmacy import Pharmacy
from app.models.users import User
from app.api.auth import router as auth_router
from app.api.medicine import router as medicine_router
from app.models.medicine import Medicine
from app.models.batch import Batch
from app.schemas.batch import BatchCreate, BatchResponse
from app.api.inventory import router as inventory_router
from app.models.invoice import Invoice
from app.models.invoice_item import InvoiceItem
from app.api.billing import router as billing_router
from app.models.inventory import Inventory
from app.api.reports import router as reports_router
from app.models.suppliers import Supplier
from app.models.purchase import Purchase
from app.models.purchase_item import PurchaseItem
from app.api.suppliers import router as supplier_router
from app.api.purchase import router as purchase_router




app = FastAPI()

app.include_router(auth_router)
app.include_router(medicine_router)
app.include_router(inventory_router)
app.include_router(billing_router)
app.include_router(reports_router)
app.include_router(supplier_router)
app.include_router(purchase_router)


@app.get("/")
def root():
    return {"message": "PharmaOS Backend Running"}
