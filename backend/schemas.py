from pydantic import BaseModel

class InvoiceCreate(BaseModel):
    client_name: str
    client_email: str
    invoice_number: str
    amount: str
    due_date: str
    status: str

    followup_count: int = 0
    payment_link: str