"""Enquiry API for Neal Driving School (FastAPI + SQLite)."""
import os
import re
import sqlite3
from contextlib import closing
from datetime import datetime, timezone

from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, field_validator

DB_PATH = os.getenv("DB_PATH", "enquiries.db")
ADMIN_KEY = os.getenv("ADMIN_KEY", "")
ORIGINS = [o.strip() for o in os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",") if o.strip()]

app = FastAPI(title="Neal Driving School API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=ORIGINS,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


def db():
    return sqlite3.connect(DB_PATH)


with closing(db()) as conn:
    conn.execute(
        """CREATE TABLE IF NOT EXISTS enquiries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            created_at TEXT NOT NULL,
            name TEXT NOT NULL,
            phone TEXT NOT NULL,
            service TEXT NOT NULL DEFAULT 'Driving classes',
            plan TEXT NOT NULL,
            car TEXT NOT NULL
        )"""
    )
    conn.commit()


class Enquiry(BaseModel):
    name: str
    phone: str
    service: str = "Driving classes"
    plan: str = "Not sure yet"
    car: str = "Manual"

    @field_validator("name")
    @classmethod
    def clean_name(cls, v: str) -> str:
        v = v.strip()
        if not 2 <= len(v) <= 60:
            raise ValueError("Name must be 2 to 60 characters")
        return v

    @field_validator("phone")
    @classmethod
    def clean_phone(cls, v: str) -> str:
        digits = re.sub(r"\D", "", v)
        if len(digits) == 12 and digits.startswith("91"):
            digits = digits[2:]
        elif len(digits) == 11 and digits.startswith("0"):
            digits = digits[1:]
        if not re.fullmatch(r"[6-9]\d{9}", digits):
            raise ValueError("Enter a valid 10-digit Indian mobile number")
        return digits


@app.get("/api/health")
def health():
    return {"ok": True}


@app.post("/api/enquiry", status_code=201)
def create_enquiry(e: Enquiry):
    with closing(db()) as conn:
        conn.execute(
            "INSERT INTO enquiries (created_at, name, phone, service, plan, car) VALUES (?,?,?,?,?,?)",
            (datetime.now(timezone.utc).isoformat(), e.name, e.phone, e.service[:80], e.plan[:30], e.car[:30]),
        )
        conn.commit()
    return {"ok": True}


@app.get("/api/enquiries")
def list_enquiries(x_admin_key: str = Header(default="")):
    if not ADMIN_KEY or x_admin_key != ADMIN_KEY:
        raise HTTPException(status_code=403, detail="Forbidden")
    with closing(db()) as conn:
        conn.row_factory = sqlite3.Row
        rows = conn.execute("SELECT * FROM enquiries ORDER BY id DESC LIMIT 500").fetchall()
    return [dict(r) for r in rows]
