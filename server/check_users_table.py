#!/usr/bin/env python
"""
Script para verificar tabelas de usuários disponíveis
"""
import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

db_host = os.environ.get('DB_HOST', '162.141.111.95')
db_port = os.environ.get('DB_PORT', '5432')
db_name = os.environ.get('DB_NAME', 'IGREEN')
db_user = os.environ.get('DB_USER', 'bi_igreen')
db_password = os.environ.get('DB_PASSWORD', 'iGr33n@2025')

try:
    conn = psycopg2.connect(
        host=db_host,
        port=db_port,
        database=db_name,
        user=db_user,
        password=db_password
    )
    cursor = conn.cursor()
    
    print("🔍 Procurando tabelas de usuários...")
    
    # Possíveis tabelas de usuários
    possible_tables = [
        'public.USUARIOS',
        'public.USERS',
        'public.CONSULTOR',
        'public.V_USERS',
        'public.V_CONSULTOR',
        'public.USUARIOS_EMPRESA'
    ]
    
    for table in possible_tables:
        try:
            # Tentar contar registros
            cursor.execute(f"SELECT COUNT(*) FROM {table}")
            count = cursor.fetchone()[0]
            print(f"✅ {table}: {count} registros")
            
            # Mostrar estrutura da tabela
            cursor.execute(f"""
                SELECT column_name, data_type 
                FROM information_schema.columns 
                WHERE table_schema = 'public' 
                AND table_name = '{table.split('.')[1]}'
                ORDER BY ordinal_position
                LIMIT 10
            """)
            
            columns = cursor.fetchall()
            if columns:
                print("   Colunas:")
                for col, dtype in columns:
                    print(f"   - {col}: {dtype}")
                    
            # Tentar ver um registro de exemplo (sem dados sensíveis)
            cursor.execute(f"""
                SELECT * FROM {table} LIMIT 1
            """)
            sample = cursor.fetchone()
            if sample:
                print(f"   Registro de exemplo encontrado (campos: {len(sample)})")
                
        except Exception as e:
            print(f"❌ {table}: Sem acesso ({str(e)[:50]}...)")
    
    cursor.close()
    conn.close()
    
except Exception as e:
    print(f"❌ Erro: {e}")
