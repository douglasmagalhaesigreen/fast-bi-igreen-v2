#!/usr/bin/env python3
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from urllib.parse import quote_plus

load_dotenv()

# Montar URL de conexão
db_user = os.environ.get('DB_USER', 'bi_igreen')
db_password = quote_plus(os.environ.get('DB_PASSWORD', 'iGr33n@2025'))
db_host = os.environ.get('DB_HOST', '162.141.111.95')
db_port = os.environ.get('DB_PORT', '5432')
db_name = os.environ.get('DB_NAME', 'IGREEN')

DATABASE_URL = f"postgresql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"

engine = create_engine(DATABASE_URL)

print("🔍 Verificando acesso à tabela USUARIOS...")
print("=" * 50)

try:
    with engine.connect() as conn:
        # Teste básico de conexão
        result = conn.execute(text('SELECT 1'))
        print("✅ Conexão estabelecida!")
        
        # Verificar acesso à tabela USUARIOS (maiúscula)
        result = conn.execute(text("""
            SELECT COUNT(*) FROM "USUARIOS"
        """))
        count = result.fetchone()[0]
        print(f"✅ Tabela USUARIOS acessível!")
        print(f"📊 Total de usuários: {count}")
        
        # Verificar estrutura das colunas importantes
        result = conn.execute(text("""
            SELECT codigo, nome, email, password 
            FROM "USUARIOS" 
            WHERE password IS NOT NULL 
            LIMIT 1
        """))
        
        if result.rowcount > 0:
            print("✅ Campos de login encontrados (email, password)")
        
        print("\n✅ Tudo pronto para conectar com o banco!")
        
except Exception as e:
    print(f"❌ Erro: {e}")
