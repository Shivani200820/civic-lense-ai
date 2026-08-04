import os
from fastapi import FastAPI
from contextlib import asynccontextmanager

from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from slowapi.extension import _rate_limit_exceeded_handler


# Database
from app.database.session import SessionLocal
from app.database.seed import run_seeders


# Routers
from app.api.routers import (
    database,
    health,
    admin,
    auth,
    citizen,
    officer,
    users,
    department,
    complaint_category,
    complaint_priority,
    complaint_status,
    upload,
)

from app.api.complaint.complaint_router import (
    router as complaint_router
)

from app.api.complaint.officer_router import (
    router as officer_router
)

from app.api.admin.dashboard_router import (
    router as dashboard_router
)

from app.api.admin.analytics_router import (
    router as analytics_router
)

from app.api.admin.department_analytics_router import (
    router as department_analytics_router
)

from app.api.admin.officer_analytics_router import (
    router as officer_analytics_router
)

from app.api.admin.citizen_analytics_router import (
    router as citizen_analytics_router
)

from app.api.admin.chart_router import (
    router as chart_router
)

from app.api.admin.recent_activity_router import (
    router as recent_activity_router
)

from app.api.admin.officer_management_router import (
    router as officer_management_router
)

from app.api.routers.notification import (
    router as notification_router
)

from app.api.translation.translation_router import (
    router as translation_router
)


# Core
from app.core.handlers import (
    register_exception_handlers
)

from app.core.request_logger import (
    RequestLoggingMiddleware
)

from app.core.security_headers import (
    SecurityHeadersMiddleware
)


# Cloudinary initialization
import app.core.cloudinary



# -----------------------------
# Application Lifespan
# -----------------------------

@asynccontextmanager
async def lifespan(app: FastAPI):

    print("🚀 Starting CivicAI Backend")

    db = SessionLocal()

    try:
        run_seeders(db)
        print("✅ Master data initialized.")

    except Exception as e:
        print(
            f"❌ Seeder Error: {e}"
        )

    finally:
        db.close()

    yield

    print("🛑 CivicAI Backend stopped")



# -----------------------------
# Rate Limiter
# -----------------------------

limiter = Limiter(
    key_func=get_remote_address
)



# -----------------------------
# FastAPI Application
# -----------------------------

app = FastAPI(

    title="CivicAI Backend API",

    version="1.0.0",

    description="""
AI Powered Smart Civic Complaint & Resolution Platform.

This API enables citizens to register civic complaints,
officers to manage complaint resolution,
and administrators to monitor analytics and system performance.
""".strip(),

    contact={
        "name": "CivicAI Development Team",
        "email": "team@civicai.com",
    },

    license_info={
        "name": "MIT License",
    },

    lifespan=lifespan,
)
os.makedirs("uploads", exist_ok=True)


# -----------------------------
# Limiter State
# -----------------------------

app.state.limiter = limiter



# -----------------------------
# Middlewares
# -----------------------------

app.add_middleware(

    CORSMiddleware,

    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)



app.add_middleware(
    RequestLoggingMiddleware
)


app.add_middleware(
    SlowAPIMiddleware
)


app.add_middleware(
    SecurityHeadersMiddleware
)



# -----------------------------
# Exception Handlers
# -----------------------------

register_exception_handlers(app)


app.add_exception_handler(
    RateLimitExceeded,
    _rate_limit_exceeded_handler,
)



# -----------------------------
# Root Endpoint
# -----------------------------

@app.get(
    "/",
    tags=["Root"]
)
def root():

    return {
        "message": "Welcome to CivicAI Backend"
    }



# -----------------------------
# Router Registration
# -----------------------------

app.include_router(
    health.router
)


app.include_router(
    database.router
)



# Authentication & User

app.include_router(
    auth.router,
    prefix="/api/v1"
)


app.include_router(
    users.router,
    prefix="/api/v1"
)



# Roles

app.include_router(
    admin.router,
    prefix="/api/v1"
)


app.include_router(
    officer.router,
    prefix="/api/v1"
)


app.include_router(
    citizen.router,
    prefix="/api/v1"
)



# Master Data

app.include_router(
    department.router,
    prefix="/api/v1"
)


app.include_router(
    complaint_category.router,
    prefix="/api/v1"
)


app.include_router(
    complaint_priority.router,
    prefix="/api/v1"
)


app.include_router(
    complaint_status.router,
    prefix="/api/v1"
)



# Upload

app.include_router(
    upload.router,
    prefix="/api/v1"
)


app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads"
)



# Complaint

app.include_router(
    complaint_router,
    prefix="/api/v1",
)



app.include_router(
    officer_router,
    prefix="/api/v1"
)



# Admin Dashboard

app.include_router(
    dashboard_router,
    prefix="/api/v1"
)


app.include_router(
    analytics_router,
    prefix="/api/v1"
)


app.include_router(
    department_analytics_router,
    prefix="/api/v1"
)


app.include_router(
    officer_analytics_router,
    prefix="/api/v1"
)


app.include_router(
    citizen_analytics_router,
    prefix="/api/v1"
)


app.include_router(
    chart_router,
    prefix="/api/v1"
)


app.include_router(
    recent_activity_router,
    prefix="/api/v1"
)



# Officer Management

app.include_router(
    officer_management_router,
    prefix="/api/v1"
)



# Notifications

app.include_router(
    notification_router,
    prefix="/api/v1"
)



# Translation

app.include_router(
    translation_router,
    prefix="/api/v1"
)