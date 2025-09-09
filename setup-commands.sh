#!/bin/bash

# ========================================
# SETUP COMPLETO - Fast BI iGreen v2
# ========================================

echo "🚀 Iniciando setup do Fast BI iGreen v2..."

# ----------------------------------------
# FRONTEND SETUP
# ----------------------------------------
echo "📦 Configurando Frontend..."

# 1. Criar arquivo .env do frontend
cat > .env << 'EOF'
# Frontend Environment Variables
VITE_API_URL=http://localhost:5000/api
VITE_REFRESH_INTERVAL=30000
VITE_TV_REFRESH_INTERVAL=10000
VITE_APP_NAME=Fast BI iGreen
VITE_APP_VERSION=2.0.0
EOF

echo "✅ Arquivo .env do frontend criado"

# ----------------------------------------
# BACKEND SETUP
# ----------------------------------------
echo "📦 Configurando Backend..."

# 2. Criar estrutura do backend
mkdir -p server/{app,migrations,logs,uploads}
mkdir -p server/app/{auth,api,models,services,utils}

# 3. Criar arquivo .env do backend
cat > server/.env << 'EOF'
# Backend Environment Variables
FLASK_APP=run.py
FLASK_ENV=development
FLASK_DEBUG=True
SECRET_KEY=iGr33n@012
FLASK_SECRET_KEY=iGr33n@012

# Database Configuration
DATABASE_URL=postgresql://bi_igreen:iGr33n@2025@162.141.111.95:5432/IGREEN
DB_HOST=162.141.111.95
DB_PORT=5432
DB_NAME=IGREEN
DB_USER=bi_igreen
DB_PASSWORD=iGr33n@2025

# JWT Configuration
JWT_SECRET_KEY=iGr33n@JWT#2025Secret
JWT_ACCESS_TOKEN_EXPIRES=3600
JWT_REFRESH_TOKEN_EXPIRES=2592000

# CORS Configuration
CORS_ORIGINS=http://localhost:3000,http://localhost:5173

# Logging
LOG_LEVEL=DEBUG
LOG_FILE=app.log
EOF

echo "✅ Arquivo .env do backend criado"

# 4. Criar arquivo requirements.txt no servidor
cat > server/requirements.txt << 'EOF'
Flask==3.0.0
Flask-CORS==4.0.0
Flask-JWT-Extended==4.5.3
Flask-SQLAlchemy==3.1.1
Flask-Migrate==4.0.5
Flask-Bcrypt==1.0.1
psycopg2-binary==2.9.9
SQLAlchemy==2.0.23
python-dotenv==1.0.0
marshmallow==3.20.1
pandas==2.1.4
openpyxl==3.1.2
redis==5.0.1
gunicorn==21.2.0
EOF

echo "✅ requirements.txt criado"

# ----------------------------------------
# INSTRUÇÕES FINAIS
# ----------------------------------------
echo ""
echo "════════════════════════════════════════════════════════════"
echo "✅ Setup básico concluído!"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "📋 PRÓXIMOS PASSOS:"
echo ""
echo "1️⃣  FRONTEND (Terminal 1):"
echo "   cd ~/fast-bi-igreen-v2"
echo "   npm run dev"
echo ""
echo "2️⃣  BACKEND (Terminal 2):"
echo "   cd ~/fast-bi-igreen-v2/server"
echo "   python3 -m venv venv"
echo "   source venv/bin/activate"
echo "   pip install -r requirements.txt"
echo "   python run.py"
echo ""
echo "3️⃣  ACESSAR:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:5000/api"
echo "   Dashboard TV: http://localhost:3000/dashboard-tv"
echo ""
echo "════════════════════════════════════════════════════════════"
echo "⚠️  IMPORTANTE:"
echo "   - Verifique se o PostgreSQL está acessível"
echo "   - Os arquivos .env foram criados com suas credenciais"
echo "   - NÃO commite os arquivos .env no git!"
echo "════════════════════════════════════════════════════════════"