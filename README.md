Voici les instructions complètes pour déployer la plateforme sur votre VM Ubuntu locale :

## 📋 Guide de Déploiement Local - Niger Digital Vehicle Sticker System

### 1. Prérequis à installer

```bash
# Mettre à jour le système
sudo apt update && sudo apt upgrade -y

# Installer Node.js 18+ (via NodeSource)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Installer Yarn
sudo npm install -g yarn

# Installer Python 3.11+
sudo apt install -y python3 python3-pip python3-venv

# Installer MongoDB
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg --dearmor -o /usr/share/keyrings/mongodb-server-7.0.gpg
echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt update
sudo apt install -y mongodb-org

# Démarrer MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

### 2. Cloner le projet

```bash
# Cloner depuis GitHub (remplacez par votre URL)
git clone https://github.com/VOTRE_USERNAME/niger-sticker-system.git
cd niger-sticker-system
```

### 3. Configurer le Backend

```bash
# Aller dans le dossier backend
cd backend

# Créer un environnement virtuel Python
python3 -m venv venv
source venv/bin/activate

# Installer les dépendances
pip install -r requirements.txt

# Créer le fichier .env
cat > .env << 'EOF'
MONGO_URL=mongodb://localhost:27017
DB_NAME=niger_sticker_db
CORS_ORIGINS=*
JWT_SECRET=votre-cle-secrete-jwt-production-2026
RESEND_API_KEY=votre-cle-resend-si-vous-en-avez-une
SENDER_EMAIL=onboarding@resend.dev
FRONTEND_URL=http://localhost:3000
EOF

# Démarrer le backend (en arrière-plan)
uvicorn server:app --host 0.0.0.0 --port 8001 --reload &
```

### 4. Configurer le Frontend

```bash
# Aller dans le dossier frontend (depuis la racine du projet)
cd ../frontend

# Créer le fichier .env
cat > .env << 'EOF'
REACT_APP_BACKEND_URL=http://localhost:8001
EOF

# Installer les dépendances
yarn install

# Démarrer le frontend
yarn start
```

### 5. Initialiser les données

```bash
# Créer les utilisateurs de test (dans un nouveau terminal)
curl -X POST http://localhost:8001/api/seed
```

### 6. Accéder à l'application

| Portail | URL | Identifiants |
|---------|-----|--------------|
| **Citoyen** | http://localhost:3000 | Créer un compte |
| **Admin DGI** | http://localhost:3000/admin/login | `superadmin` / `superadmin123` |
| **Agent** | http://localhost:3000/agent/login | `agent_niamey` / `agent123` |

---

### 🔧 Script de démarrage automatique (optionnel)

Créez un fichier `start.sh` à la racine :

```bash
#!/bin/bash

# Démarrer MongoDB si pas actif
sudo systemctl start mongod

# Démarrer le backend
cd backend
source venv/bin/activate
uvicorn server:app --host 0.0.0.0 --port 8001 &
BACKEND_PID=$!

# Attendre que le backend soit prêt
sleep 3

# Démarrer le frontend
cd ../frontend
yarn start &
FRONTEND_PID=$!

echo "✅ Application démarrée!"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:8001/api"
echo ""
echo "Pour arrêter: kill $BACKEND_PID $FRONTEND_PID"

wait
```

Rendez-le exécutable : `chmod +x start.sh`

---

### 📝 Notes importantes

1. **MongoDB** doit être en cours d'exécution avant de lancer le backend
2. **Ports utilisés** : 3000 (frontend), 8001 (backend), 27017 (MongoDB)
3. **Emails** : En mode simulation par défaut. Pour activer les vrais emails, obtenez une clé API sur https://resend.com
=========> API  TOKEN FROM RESEND: re_8jWNsn4A_2ggWo8uAUBTnhcy7KJL36FYX
