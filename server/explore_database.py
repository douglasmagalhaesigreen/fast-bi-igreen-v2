#!/usr/bin/env python
"""
Script para explorar as tabelas existentes no banco (somente leitura)
"""
import os
import psycopg2
import pandas as pd
from dotenv import load_dotenv
from tabulate import tabulate

load_dotenv()

# Configurações
db_host = os.environ.get('DB_HOST', '162.141.111.95')
db_port = os.environ.get('DB_PORT', '5432')
db_name = os.environ.get('DB_NAME', 'IGREEN')
db_user = os.environ.get('DB_USER', 'bi_igreen')
db_password = os.environ.get('DB_PASSWORD', 'iGr33n@2025')

try:
    # Conectar
    conn = psycopg2.connect(
        host=db_host,
        port=db_port,
        database=db_name,
        user=db_user,
        password=db_password
    )
    cursor = conn.cursor()
    
    print("🔍 Explorando banco de dados IGREEN...")
    print("="*60)
    
    # Listar todos os schemas
    cursor.execute("""
        SELECT DISTINCT table_schema 
        FROM information_schema.tables 
        WHERE table_schema NOT IN ('pg_catalog', 'information_schema', 'pg_toast')
        ORDER BY table_schema
    """)
    schemas = cursor.fetchall()
    print(f"\n📁 Schemas encontrados: {[s[0] for s in schemas]}")
    
    # Listar todas as tabelas acessíveis
    cursor.execute("""
        SELECT table_schema, table_name 
        FROM information_schema.tables 
        WHERE table_schema NOT IN ('pg_catalog', 'information_schema', 'pg_toast')
        ORDER BY table_schema, table_name
    """)
    
    tables = cursor.fetchall()
    if tables:
        print("\n📊 Tabelas disponíveis para leitura:")
        for schema, table in tables:
            # Contar registros
            try:
                cursor.execute(f"SELECT COUNT(*) FROM {schema}.{table}")
                count = cursor.fetchone()[0]
                print(f"   ✅ {schema}.{table} ({count} registros)")
                
                # Mostrar colunas
                cursor.execute(f"""
                    SELECT column_name, data_type 
                    FROM information_schema.columns 
                    WHERE table_schema = '{schema}' 
                    AND table_name = '{table}'
                    ORDER BY ordinal_position
                """)
                columns = cursor.fetchall()
                for col, dtype in columns[:5]:  # Mostrar apenas 5 primeiras colunas
                    print(f"      - {col}: {dtype}")
                if len(columns) > 5:
                    print(f"      ... e mais {len(columns)-5} colunas")
                    
            except Exception as e:
                print(f"   ❌ {schema}.{table} (sem permissão de leitura)")
    else:
        print("\n❌ Nenhuma tabela encontrada")
    
    # Tentar algumas queries comuns
    print("\n🔎 Tentando queries comuns...")
    
    common_tables = [
        ('public', 'clientes'),
        ('public', 'clients'),
        ('public', 'consumo'),
        ('public', 'consumption'),
        ('public', 'usuarios'),
        ('public', 'users'),
        ('bi_igreen', 'clientes'),
        ('bi_igreen', 'consumo'),
    ]
    
    for schema, table in common_tables:
        try:
            cursor.execute(f"SELECT * FROM {schema}.{table} LIMIT 1")
            print(f"   ✅ Tabela {schema}.{table} existe e é legível")
        except:
            pass
    
    cursor.close()
    conn.close()
    
except Exception as e:
    print(f"❌ Erro: {e}")
