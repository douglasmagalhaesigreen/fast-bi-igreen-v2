#!/bin/bash

echo "🚀 Configurando Backend Flask..."

# Criar ambiente virtual
python3 -m venv venv
source venv/bin/activate

# Instalar dependências
pip install -r requirements.txt

echo "✅ Dependências instaladas"

# Testar conexão com o banco
python3 -c "
from config import Config
import psycopg2
try:
    conn = psycopg2.connect(
        host='${DB_HOST:-162.141.111.95}',
        port='${DB_PORT:-5432}',
        database='${DB_NAME:-IGREEN}',
        user='${DB_USER:-bi_igreen}',
        password='${DB_PASSWORD:-iGr33n@2025}'
    )
    print('✅ Conexão com PostgreSQL bem-sucedida!')
    conn.close()
except Exception as e:
    print(f'❌ Erro na conexão: {e}')
"

echo "
Para iniciar o servidor:
1. source venv/bin/activate
2. python run.py
"
