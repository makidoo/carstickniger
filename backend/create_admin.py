from database import SessionLocal
from models import AdminUser
from passlib.context import CryptContext
import uuid
from datetime import datetime

# Configuration
db = SessionLocal()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_super_admin():
    print("🔄 Vérification de l'existant...")
    if db.query(AdminUser).filter(AdminUser.username == "admin").first():
        print("⚠️  L'utilisateur 'admin' existe déjà.")
        return

    print("🚀 Création du Super Admin...")
    admin = AdminUser(
        id=str(uuid.uuid4()),
        username="admin",
        hashed_password=pwd_context.hash("admin123"), # Mot de passe: admin123
        role="super_admin",
        first_name="Super",
        last_name="Admin",
        region="Niamey",
        created_at=datetime.now()
    )
    
    db.add(admin)
    db.commit()
    print("✅  SUCCÈS : Compte Admin créé !")
    print("👉 User: admin")
    print("👉 Pass: admin123")

if __name__ == "__main__":
    try:
        create_super_admin()
    except Exception as e:
        print(f"❌ ERREUR : {e}")
    finally:
        db.close()