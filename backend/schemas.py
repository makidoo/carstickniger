from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional, List
from datetime import datetime

class ORMBaseModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)

# --- USERS ---
class UserBase(ORMBaseModel):
    phone: str
    username: Optional[str] = None  # FIX: Pour l'affichage Admin
    status: Optional[str] = "active" # FIX: Pour le badge vert
    first_name: str
    last_name: str
    email: Optional[EmailStr] = None
    national_id: Optional[str] = None
    role: Optional[str] = "citizen"
    language: Optional[str] = "fr"

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    phone: str
    password: str

class AdminLogin(BaseModel):
    username: str
    password: str

class AdminUserCreate(BaseModel):
    username: str
    password: str
    role: str
    first_name: str
    last_name: str
    region: Optional[str] = None

class UserResponse(UserBase):
    id: str
    created_at: datetime
    loyalty_points: Optional[int] = 0

# --- TOKENS ---
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenResponse(Token):
    user: UserResponse

# --- VEHICLES ---
class VehicleBase(ORMBaseModel):
    registration_number: str
    vehicle_type: str 
    make: str
    model: str
    energy_type: str 
    engine_power: int 
    chassis_number: str
    year_of_manufacture: int
    region: str = "Niamey"

class VehicleCreate(VehicleBase):
    pass

class VehicleResponse(VehicleBase):
    id: str
    user_id: str
    created_at: datetime

# --- STICKERS ---
class StickerBase(ORMBaseModel):
    validity_years: int = 1

class StickerPurchase(StickerBase):
    vehicle_id: str
    payment_method: str

class StickerResponse(ORMBaseModel):
    id: str
    vehicle_id: str
    user_id: str
    registration_number: str
    status: str
    start_date: datetime
    end_date: datetime
    amount_paid: float
    payment_method: str
    transaction_id: str
    qr_code: str
    created_at: datetime

# --- OTHERS ---
class VerificationResult(BaseModel):
    registration_number: str
    owner_name: str
    status: str
    status_color: str
    valid_from: Optional[datetime] = None
    valid_until: Optional[datetime] = None
    vehicle_type: str
    make: str
    model: str

class DashboardStats(BaseModel):
    total_vehicles: int
    active_stickers: int
    total_revenue: float
    daily_revenue: float
    
class TaxConfigResponse(ORMBaseModel):
    id: str
    vehicle_category: str
    base_amount: float
    status: str