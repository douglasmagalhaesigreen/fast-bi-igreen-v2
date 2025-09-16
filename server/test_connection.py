#!/usr/bin/env python
"""
Script para testar a conexão com o banco de dados
"""
import os
from dotenv import load_dotenv
from urllib.parse import quote_plus
import psycopg2

# Carregar variáveis de ambiente
load_dotenv()

# Configurações
db_host = os.environ.get('DB_HOST', '162.141.111.95')
db_port = os.environ.get('DB_PORT', '5432')
db_name = os.environ.get('DB_NAME', 'IGREEN')
db_user = os.environ.get('DB_USER', 'bi_igreen')
db_password = os.environ.get('DB_PASSWORD', 'iGr33n@2025')

print("🔍 Testando conexão com PostgreSQL...")
print(f"   Host: {db_host}")
print(f"   Port: {db_port}")
print(f"   Database: {db_name}")
print(f"   User: {db_user}")
print(f"   Password: {'*' * len(db_password)}")

try:
    # Conectar diretamente
    conn = psycopg2.connect(
        host=db_host,
        port=db_port,
        database=db_name,
        user=db_user,
        password=db_password
    )
    print("✅ Conexão direta bem-sucedida!")
    
    # Testar query
    cursor = conn.cursor()
    cursor.execute('SELECT version();')
    version = cursor.fetchone()
    print(f"✅ PostgreSQL versão: {version[0]}")
    
    cursor.close()
    conn.close()
    
    # Testar URL do SQLAlchemy
    password_encoded = quote_plus(db_password)
    url = f"postgresql://{db_user}:{password_encoded}@{db_host}:{db_port}/{db_name}"
    print(f"\n✅ URL SQLAlchemy gerada corretamente:")
    print(f"   postgresql://{db_user}:****@{db_host}:{db_port}/{db_name}")
    
except Exception as e:
    print(f"❌ Erro na conexão: {e}")
    print("\nPossíveis soluções:")
    print("1. Verifique se o servidor PostgreSQL está acessível")
    print("2. Verifique as credenciais no arquivo .env")
    print("3. Verifique se o firewall permite a conexão")
