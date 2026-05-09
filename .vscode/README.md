# AI-Powered Invoice Follow-Up Email Automation System

## Project Overview

This project is an AI-powered backend automation system that helps businesses automate invoice follow-up emails for unpaid invoices.

The system stores invoice information, tracks overdue invoices, generates intelligent follow-up emails with automatic tone escalation, and simulates email sending using APIs.

This project was developed using FastAPI, SQLAlchemy, and SQLite.

---

# Features

## Invoice Management
- Create invoices
- Store invoice details in SQLite database
- Retrieve all invoices
- Track unpaid invoices

---

## AI-Based Email Generation

The system automatically generates professional follow-up emails based on overdue duration.

### Tone Escalation Logic

| Days Overdue | Tone |
|--------------|------|
| 0–3 Days | Friendly Reminder |
| 4–7 Days | Polite Follow-Up |
| 8+ Days | Final Warning |

---

## Mock Email Sending

A mock API endpoint simulates email sending functionality for testing purposes.

---

## Email Logging

Generated follow-up emails are stored in:

email_logs.txt

Logs include:
- Invoice ID
- Client Name
- Tone Used
- Stage
- Days Overdue
- Timestamp

---

# Tech Stack

- Python
- FastAPI
- SQLAlchemy
- SQLite
- Uvicorn

---

# Project Structure

invoice-ai-followup-system/

├── backend/

│   ├── main.py

│   ├── database.py

│   ├── models.py

│   ├── schemas.py

│   ├── requirements.txt

│   ├── invoice.db

│   ├── email_logs.txt

│   ├── .env.example

│

├── README.md

---

# Database Schema

## Invoice Table

| Field | Type |
|------|------|
| id | Integer |
| client_name | String |
| client_email | String |
| invoice_number | String |
| amount | Float |
| due_date | Date |
| status | String |
| followup_count | Integer |
| payment_link | String |

---

# API Endpoints

## 1. Create Invoice

### Endpoint

POST /invoices

### Example Request

```json
{
  "client_name": "ABC Pvt Ltd",
  "client_email": "client@example.com",
  "invoice_number": "INV101",
  "amount": 25000,
  "due_date": "2026-05-01",
  "status": "Unpaid",
  "followup_count": 1,
  "payment_link": "https://payment-link.com"
}