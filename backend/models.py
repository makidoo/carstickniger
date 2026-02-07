from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey, Boolean, Text
from sqlalchemy.orm import relationship
from database import Base
import datetime

# --- UTILISATEURS ---
class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, index=True)
    phone = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    first_name = Column(String)
    last_name = Column(String)
    email = Column(String, nullable=True)
    national_id = Column(String, nullable=True)
    role = Column(String, default="citizen")
    language = Column(String, default="fr")
    loyalty_points = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    vehicles = relationship("Vehicle", back_populates="owner")
    stickers = relationship("Sticker", back_populates="user")
    payments = relationship("Payment", back_populates="user")

class AdminUser(Base):
    __tablename__ = "admin_users"
    id = Column(String, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String) # super_admin, admin, supervisor, agent
    first_name = Column(String)
    last_name = Column(String)
    region = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

# --- VÉHICULES & VIGNETTES ---
class Vehicle(Base):
    __tablename__ = "vehicles"
    id = Column(String, primary_key=True, index=True)
    registration_number = Column(String, unique=True, index=True)
    user_id = Column(String, ForeignKey("users.id"))
    vehicle_type = Column(String)
    make = Column(String)
    model = Column(String)
    energy_type = Column(String)
    engine_power = Column(Integer)
    chassis_number = Column(String)
    year_of_manufacture = Column(Integer)
    region = Column(String, default="Niamey")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    owner = relationship("User", back_populates="vehicles")
    stickers = relationship("Sticker", back_populates="vehicle")

class Sticker(Base):
    __tablename__ = "stickers"
    id = Column(String, primary_key=True, index=True)
    vehicle_id = Column(String, ForeignKey("vehicles.id"))
    user_id = Column(String, ForeignKey("users.id"))
    registration_number = Column(String)
    status = Column(String) # valid, expired
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    amount_paid = Column(Float)
    payment_method = Column(String)
    transaction_id = Column(String)
    qr_code = Column(Text)
    loyalty_points = Column(Integer)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    vehicle = relationship("Vehicle", back_populates="stickers")
    user = relationship("User", back_populates="stickers")

# --- FINANCE & LOGS ---
class Payment(Base):
    __tablename__ = "payments"
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"))
    sticker_id = Column(String)
    amount = Column(Float)
    payment_method = Column(String)
    status = Column(String)
    transaction_ref = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    user = relationship("User", back_populates="payments")

class TaxConfig(Base):
    __tablename__ = "tax_configs"
    id = Column(String, primary_key=True, index=True)
    vehicle_category = Column(String)
    engine_power_min = Column(Integer)
    engine_power_max = Column(Integer)
    base_amount = Column(Float)
    multi_year_discount = Column(Float)
    status = Column(String, default="active")
    effective_date = Column(DateTime, default=datetime.datetime.utcnow)

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String)
    action = Column(String)
    module = Column(String)
    details = Column(Text)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

class Inspection(Base):
    __tablename__ = "inspections"
    id = Column(String, primary_key=True, index=True)
    agent_id = Column(String)
    vehicle_registration = Column(String)
    status_at_control = Column(String)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    notes = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

class NotificationLog(Base):
    __tablename__ = "notification_logs"
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String)
    sticker_id = Column(String)
    type = Column(String)
    channel = Column(String)
    recipient = Column(String)
    status = Column(String)
    sent_at = Column(DateTime, default=datetime.datetime.utcnow)