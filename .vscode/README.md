# AI-Powered Invoice Follow-Up Email Automation System

## Project Overview

This project is an AI-powered backend automation system that helps businesses automatically generate professional invoice follow-up emails for unpaid invoices.

The system stores invoice records, tracks overdue invoices, escalates email tone based on overdue duration, and generates personalized reminder emails automatically.

---

# Features

- Create and store invoice records
- Fetch all invoices from database
- Automatic overdue tracking
- Tone escalation engine
- AI-style professional email generation
- Mock email sending (Dry Run)
- Audit logging system
- REST APIs using FastAPI
- SQLite database integration

---

# Tech Stack

- Python
- FastAPI
- SQLite
- SQLAlchemy
- Swagger UI
- Uvicorn

---

# Project Architecture

Invoice Input  
↓  
FastAPI Backend  
↓  
SQLite Database  
↓  
Tone Escalation Logic  
↓  
Email Generation Engine  
↓  
Mock Send + Audit Logs  

---

# Tone Escalation Logic

| Days Overdue | Tone |
|---|---|
| 1–7 Days | Warm & Friendly |
| 8–14 Days | Polite but Firm |
| 15–21 Days | Formal & Serious |
| 22–30 Days | Stern & Urgent |
| 30+ Days | Escalation Flag |

---

# API Endpoints

## Home API

GET /

Returns backend status.

---

## Create Invoice

POST /invoices

Stores invoice in database.

---

## Get All Invoices

GET /invoices

Returns all stored invoices.

---

## Generate Email

GET /generate-email/{invoice_id}

Generates AI-style follow-up email.

---

## Mock Send Email

POST /mock-send/{invoice_id}

Simulates sending email in dry-run mode.

---

# Database Fields

- Client Name
- Client Email
- Invoice Number
- Amount
- Due Date
- Status
- Follow-Up Count
- Payment Link

---

# Audit Logging

Every generated email is stored in `email_logs.txt` with:

- Timestamp
- Invoice ID
- Client Name
- Tone Used
- Stage
- Days Overdue
- Send Status

---

# Security Mitigations

- `.env` file used for sensitive configurations
- `.gitignore` protects secret files
- Local SQLite database used
- Dry-run mode avoids accidental email delivery
- Structured outputs reduce hallucination risk

---

# LLM / AI Design

The current prototype uses rule-based AI-style email generation.

The architecture is designed for future integration with:
- OpenAI GPT-4
- Gemini API
- LangChain

---

# Future Improvements

- Real SMTP Integration
- Frontend Dashboard
- Email Scheduling
- AI Sentiment Optimization
- Analytics Dashboard
- Multi-user Support

---

# Setup Instructions

## Install Dependencies

```bash
pip install -r requirements.txt