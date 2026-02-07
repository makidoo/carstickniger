from fastapi import FastAPI, APIRouter, HTTPException, Depends, status, Query
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func, desc, or_
from typing import List, Optional
from datetime import datetime, timedelta, timezone
import os
import logging
import uuid
import io
import base64
import random
import string
import resend
from passlib.context import CryptContext
from jose import jwt, JWTError
import qrcode
from dotenv import load_dotenv

# --- IMPORTS LOCAUX ---
from database import engine, get_db
import models
import schemas

load_dotenv()

# Config
resend.api_key = os.environ.get('RESEND_API_KEY')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
SECRET_KEY = os.environ.get('JWT_SECRET', 'secret_key_provisoire_niger_2026')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# Init DB
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Niger Digital Vehicle Sticker (Windows/PostgreSQL)")
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ===================== HELPERS =====================

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

def create_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Token invalide")
        
        user = db.query(models.User).filter(models.User.id == user_id).first()
        if user: return user
        
        admin = db.query(models.AdminUser).filter(models.AdminUser.id == user_id).first()
        if admin: return admin
            
        raise HTTPException(status_code=401, detail="Utilisateur introuvable")
    except JWTError:
        raise HTTPException(status_code=401, detail="Token invalide")

def generate_qr_code(data: str) -> str:
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(data)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")
    buffer = io.BytesIO()
    img.save(buffer, format="PNG")
    return base64.b64encode(buffer.getvalue()).decode()

def generate_transaction_id() -> str:
    return f"TXN-{''.join(random.choices(string.ascii_uppercase + string.digits, k=12))}"

def log_audit(db: Session, user_id: str, action: str, module: str, details: dict):
    try:
        new_log = models.AuditLog(
            id=str(uuid.uuid4()), user_id=user_id, action=action, module=module,
            details=str(details), timestamp=datetime.now(timezone.utc)
        )
        db.add(new_log)
        db.commit()
    except Exception as e:
        logger.error(f"Audit log failed: {e}")

# ===================== AUTH CITOYEN =====================

@api_router.post("/auth/register", response_model=schemas.TokenResponse)
def register(data: schemas.UserCreate, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.phone == data.phone).first()
    if existing:
        raise HTTPException(status_code=400, detail="Numéro déjà enregistré")
    
    new_user = models.User(
        id=str(uuid.uuid4()), phone=data.phone, hashed_password=hash_password(data.password),
        first_name=data.first_name, last_name=data.last_name, email=data.email,
        national_id=data.national_id, role="citizen", created_at=datetime.now(timezone.utc)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    token = create_token({"sub": new_user.id, "role": "citizen"})
    return {"access_token": token, "token_type": "bearer", "user": new_user}

@api_router.post("/auth/login", response_model=schemas.TokenResponse)
def login(data: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.phone == data.phone).first()
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Identifiants incorrects")
    token = create_token({"sub": user.id, "role": user.role})
    return {"access_token": token, "token_type": "bearer", "user": user}

# ===================== AUTH ADMIN =====================

@api_router.post("/auth/admin/login", response_model=schemas.TokenResponse)
def admin_login(data: schemas.AdminLogin, db: Session = Depends(get_db)):
    user = db.query(models.AdminUser).filter(models.AdminUser.username == data.username).first()
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Identifiants admin incorrects")
    
    token = create_token({"sub": user.id, "role": user.role, "region": user.region})
    
    # Mapping "phone" -> "username" pour satisfaire le frontend
    user_response = {
        "id": user.id, "phone": user.username, "username": user.username, "status": "active",
        "first_name": user.first_name, "last_name": user.last_name, "role": user.role,
        "created_at": user.created_at, "email": None, "national_id": None, "language": "fr"
    }
    return {"access_token": token, "token_type": "bearer", "user": user_response}

@api_router.get("/auth/me", response_model=schemas.UserResponse)
def get_me(current_user = Depends(get_current_user)):
    if hasattr(current_user, "username"):
        return {
            "id": current_user.id, "phone": current_user.username, "username": current_user.username,
            "status": "active", "first_name": current_user.first_name, "last_name": current_user.last_name,
            "role": current_user.role, "created_at": current_user.created_at, "email": None,
            "national_id": None, "language": "fr"
        }
    return current_user

# ===================== VEHICULES & VIGNETTES =====================

@api_router.post("/vehicles", response_model=schemas.VehicleResponse)
def create_vehicle(data: schemas.VehicleCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    existing = db.query(models.Vehicle).filter(models.Vehicle.registration_number == data.registration_number.upper()).first()
    if existing: raise HTTPException(status_code=400, detail="Véhicule déjà enregistré")
    
    new_vehicle = models.Vehicle(
        id=str(uuid.uuid4()), user_id=current_user.id, registration_number=data.registration_number.upper(),
        **data.model_dump(exclude={'registration_number'}), created_at=datetime.now(timezone.utc)
    )
    db.add(new_vehicle)
    db.commit()
    db.refresh(new_vehicle)
    log_audit(db, current_user.id, "CREATE", "vehicles", {"vehicle_id": new_vehicle.id})
    return new_vehicle

@api_router.get("/vehicles", response_model=List[schemas.VehicleResponse])
def get_vehicles(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return db.query(models.Vehicle).filter(models.Vehicle.user_id == current_user.id).all()

@api_router.get("/vehicles/{vehicle_id}", response_model=schemas.VehicleResponse)
def get_vehicle_detail(vehicle_id: str, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    vehicle = db.query(models.Vehicle).filter(models.Vehicle.id == vehicle_id, models.Vehicle.user_id == current_user.id).first()
    if not vehicle: raise HTTPException(status_code=404, detail="Véhicule non trouvé")
    return vehicle

@api_router.post("/stickers/purchase", response_model=schemas.StickerResponse)
def purchase_sticker(data: schemas.StickerPurchase, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    vehicle = db.query(models.Vehicle).filter(models.Vehicle.id == data.vehicle_id, models.Vehicle.user_id == current_user.id).first()
    if not vehicle: raise HTTPException(status_code=404, detail="Véhicule non trouvé")
    
    active = db.query(models.Sticker).filter(
        models.Sticker.vehicle_id == vehicle.id, models.Sticker.status == "valid",
        models.Sticker.end_date > datetime.now(timezone.utc)
    ).first()
    if active: raise HTTPException(status_code=400, detail="Vignette déjà valide")

    base_price = 10000 if vehicle.vehicle_type == "motorcycle" else 50000 if vehicle.vehicle_type == "truck" else 25000
    amount = base_price * data.validity_years
    points = int(amount / 1000)
    
    sticker_id = str(uuid.uuid4())
    start = datetime.now(timezone.utc)
    end = start + timedelta(days=365 * data.validity_years)
    txn_id = generate_transaction_id()
    qr_data = f"NIGER-VIGNETTE|{vehicle.registration_number}|{sticker_id}|{end.date()}"
    
    new_sticker = models.Sticker(
        id=sticker_id, vehicle_id=vehicle.id, user_id=current_user.id,
        registration_number=vehicle.registration_number, status="valid", start_date=start, end_date=end,
        amount_paid=amount, payment_method=data.payment_method, transaction_id=txn_id,
        qr_code=generate_qr_code(qr_data), loyalty_points=points, created_at=datetime.now(timezone.utc)
    )
    new_payment = models.Payment(
        id=str(uuid.uuid4()), user_id=current_user.id, sticker_id=sticker_id, amount=amount,
        payment_method=data.payment_method, status="completed", transaction_ref=txn_id,
        created_at=datetime.now(timezone.utc)
    )
    if hasattr(current_user, 'loyalty_points'):
        current_user.loyalty_points = (current_user.loyalty_points or 0) + points

    db.add(new_sticker)
    db.add(new_payment)
    db.commit()
    db.refresh(new_sticker)
    return new_sticker

@api_router.get("/stickers", response_model=List[schemas.StickerResponse])
def get_my_stickers(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return db.query(models.Sticker).filter(models.Sticker.user_id == current_user.id).order_by(desc(models.Sticker.created_at)).all()

# ===================== VERIFICATION & ADMIN =====================

@api_router.get("/verify/{registration_number}", response_model=schemas.VerificationResult)
def verify_vehicle(registration_number: str, db: Session = Depends(get_db)):
    reg_num = registration_number.upper()
    vehicle = db.query(models.Vehicle).filter(models.Vehicle.registration_number == reg_num).first()
    
    if not vehicle:
        return schemas.VerificationResult(
            registration_number=reg_num, owner_name="Non trouvé", status="inactive", status_color="red",
            vehicle_type="unknown", make="N/A", model="N/A"
        )
    
    sticker = db.query(models.Sticker).filter(models.Sticker.vehicle_id == vehicle.id).order_by(desc(models.Sticker.created_at)).first()
    status_v, color, valid_from, valid_until = "inactive", "red", None, None
    
    if sticker:
        now = datetime.now(timezone.utc)
        s_end = sticker.end_date.replace(tzinfo=timezone.utc) if sticker.end_date.tzinfo is None else sticker.end_date
        if s_end > now: status_v, color = "valid", "green"
        else: status_v, color = "invalid", "orange"
        valid_from, valid_until = sticker.start_date, sticker.end_date

    owner = db.query(models.User).filter(models.User.id == vehicle.user_id).first()
    return schemas.VerificationResult(
        registration_number=reg_num, owner_name=f"{owner.first_name} {owner.last_name}" if owner else "Inconnu",
        status=status_v, status_color=color, valid_from=valid_from, valid_until=valid_until,
        vehicle_type=vehicle.vehicle_type, make=vehicle.make, model=vehicle.model
    )

@api_router.get("/admin/users", response_model=List[schemas.UserResponse])
def get_admin_users(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    if current_user.role not in ["super_admin", "admin"]: raise HTTPException(status_code=403, detail="Interdit")
    admins = db.query(models.AdminUser).all()
    results = []
    for user in admins:
        results.append({
            "id": user.id, "phone": user.username, "username": user.username, "status": "active",
            "first_name": user.first_name, "last_name": user.last_name, "role": user.role,
            "created_at": user.created_at, "email": None, "national_id": None, "language": "fr", "loyalty_points": 0
        })
    return results

@api_router.post("/admin/users", response_model=schemas.UserResponse)
def create_admin_user(data: schemas.AdminUserCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    if current_user.role not in ["super_admin", "admin"]: raise HTTPException(status_code=403, detail="Interdit")
    if db.query(models.AdminUser).filter(models.AdminUser.username == data.username).first():
        raise HTTPException(status_code=400, detail="Nom d'utilisateur pris")

    new_admin = models.AdminUser(
        id=str(uuid.uuid4()), username=data.username, hashed_password=hash_password(data.password),
        role=data.role, first_name=data.first_name, last_name=data.last_name, region=data.region,
        created_at=datetime.now(timezone.utc)
    )
    db.add(new_admin)
    db.commit()
    db.refresh(new_admin)
    return {
        "id": new_admin.id, "phone": new_admin.username, "username": new_admin.username, "status": "active",
        "first_name": new_admin.first_name, "last_name": new_admin.last_name, "role": new_admin.role,
        "created_at": new_admin.created_at, "email": None, "national_id": None, "language": "fr"
    }

@api_router.get("/admin/dashboard", response_model=schemas.DashboardStats)
def get_admin_dashboard(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    if current_user.role not in ["super_admin", "admin", "supervisor"]: raise HTTPException(status_code=403, detail="Interdit")
    
    total_vehicles = db.query(models.Vehicle).count()
    active_stickers = db.query(models.Sticker).filter(models.Sticker.status == "valid", models.Sticker.end_date > datetime.now(timezone.utc)).count()
    revenue = db.query(func.sum(models.Payment.amount)).scalar() or 0.0
    daily = db.query(func.sum(models.Payment.amount)).filter(models.Payment.created_at >= datetime.now(timezone.utc).replace(hour=0, minute=0, second=0)).scalar() or 0.0
    
    return {
        "total_vehicles": total_vehicles, "active_stickers": active_stickers,
        "total_revenue": revenue, "daily_revenue": daily
    }

@api_router.get("/admin/tax-configs", response_model=List[schemas.TaxConfigResponse])
def get_tax_configs(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    if current_user.role not in ["super_admin", "admin"]: raise HTTPException(status_code=403, detail="Interdit")
    return db.query(models.TaxConfig).all()

app.include_router(api_router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True, allow_methods=["*"], allow_headers=["*"],
)
@app.get("/")
def root(): return {"message": "Niger Digital Vehicle Sticker API - Windows PostgreSQL Ready"}