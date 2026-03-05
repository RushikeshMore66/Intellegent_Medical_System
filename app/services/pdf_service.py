from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.lib.pagesizes import A4
import io


def generate_invoice_pdf(invoice, items):

    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4)
    elements = []
    styles = getSampleStyleSheet()

    elements.append(Paragraph("<b>PharmaOS Pharmacy</b>", styles["Title"]))
    elements.append(Paragraph("GSTIN: 22AAAAA0000A1Z5", styles["Normal"]))
    elements.append(Paragraph("Address: Your Pharmacy Address Here", styles["Normal"]))
    elements.append(Spacer(1, 0.3 * inch))
    elements.append(Paragraph(f"<b>Invoice No:</b> {invoice.invoice_number}", styles["Normal"]))
    elements.append(Paragraph(f"<b>Date:</b> {invoice.created_at}", styles["Normal"]))
    elements.append(Spacer(1, 0.3 * inch))

    data = [["Medicine", "Qty", "Rate", "GST%", "Tax Amt", "Total"]]

    total_tax = 0

    for item in items:
        tax_amount = (item.price * item.quantity) * (item.gst_percentage / 100)
        total_tax += tax_amount

        data.append([
            str(item.medicine_id)[:8],
            str(item.quantity),
            f"{item.price:.2f}",
            f"{item.gst_percentage}%",
            f"{tax_amount:.2f}",
            f"{item.total_price:.2f}"
        ])

    table = Table(data, colWidths=[1.3*inch]*6)

    table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.lightgrey),
        ('GRID', (0,0), (-1,-1), 1, colors.black),
        ('ALIGN',(1,1),(-1,-1),'CENTER'),
    ]))

    elements.append(table)
    elements.append(Spacer(1, 0.3 * inch))

    # GST Breakdown
    elements.append(Paragraph(f"Total Tax: {total_tax:.2f}", styles["Normal"]))
    elements.append(Paragraph(f"<b>Grand Total: {invoice.total_amount:.2f}</b>", styles["Heading2"]))

    elements.append(Spacer(1, 0.5 * inch))
    elements.append(Paragraph("Thank you for your business!", styles["Normal"]))

    doc.build(elements)
    buffer.seek(0)

    return buffer