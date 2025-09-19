#!/usr/bin/env python
"""
Script para coletar todas as informações necessárias do banco de dados
para configurar o sistema de autenticação e dashboard
"""
import os
import psycopg2
from dotenv import load_dotenv
from tabulate import tabulate

load_dotenv()

def get_connection():
    return psycopg2.connect(
        host=os.environ.get('DB_HOST', '162.141.111.95'),
        port=os.environ.get('DB_PORT', '5432'),
        database=os.environ.get('DB_NAME', 'IGREEN'),
        user=os.environ.get('DB_USER', 'bi_igreen'),
        password=os.environ.get('DB_PASSWORD', 'iGr33n@2025')
    )

def check_table_access(cursor, table_name):
    """Verifica se temos acesso de leitura a uma tabela"""
    try:
        cursor.execute(f"SELECT COUNT(*) FROM {table_name} LIMIT 1")
        count = cursor.fetchone()[0]
        return True, count
    except:
        return False, 0

def get_table_columns(cursor, schema, table):
    """Obtém as colunas de uma tabela"""
    try:
        cursor.execute("""
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_schema = %s AND table_name = %s
            ORDER BY ordinal_position
            LIMIT 15
        """, (schema, table))
        return cursor.fetchall()
    except:
        return []

def main():
    print("="*80)
    print("ANÁLISE DO BANCO DE DADOS - FAST BI IGREEN")
    print("="*80)
    
    conn = get_connection()
    cursor = conn.cursor()
    
    # 1. TABELAS DE USUÁRIOS/LOGIN
    print("\n📌 1. TABELAS DE AUTENTICAÇÃO (possíveis usuários/login)")
    print("-"*60)
    
    auth_tables = [
        'public.USUARIOS',
        'public.USERS',
        'public.CONSULTOR',
        'public.USUARIOS_EMPRESA',
        'public.V_USERS',
        'public.V_CONSULTOR',
        'public.V_CONSULTANT'
    ]
    
    accessible_auth = []
    for table in auth_tables:
        has_access, count = check_table_access(cursor, table)
        if has_access:
            print(f"✅ {table}: {count} registros")
            columns = get_table_columns(cursor, 'public', table.split('.')[1])
            if columns:
                print("   Colunas principais:")
                for col, dtype in columns[:8]:  # Mostrar apenas 8 primeiras
                    print(f"      - {col}: {dtype}")
            accessible_auth.append(table)
        else:
            print(f"❌ {table}: Sem acesso")
    
    # 2. TABELAS DE CLIENTES
    print("\n📌 2. TABELAS DE CLIENTES (dados principais)")
    print("-"*60)
    
    client_tables = [
        'public.CLIENTES',
        'public.V_CLIENTES',
        'public.V_CUSTOMER',
        'public.CNX_SOLAR',
        'public.CNX_TELECOM',
        'public.CONEXAOLIVRE'
    ]
    
    accessible_clients = []
    for table in client_tables:
        has_access, count = check_table_access(cursor, table)
        if has_access:
            print(f"✅ {table}: {count} registros")
            accessible_clients.append(table)
        else:
            print(f"❌ {table}: Sem acesso")
    
    # 3. TABELAS DE CONSUMO/FATURAMENTO
    print("\n📌 3. TABELAS DE CONSUMO/FATURAMENTO")
    print("-"*60)
    
    consumption_tables = [
        'public.RCB_CLIENTES',
        'public.V_RCB_CLIENTES',
        'public.FATURAS_CLIENTES_DISTRIBUIDORAS',
        'public.historico_kwh',
        'public.CONSUMPTIONS'
    ]
    
    accessible_consumption = []
    for table in consumption_tables:
        has_access, count = check_table_access(cursor, table)
        if has_access:
            print(f"✅ {table}: {count} registros")
            accessible_consumption.append(table)
        else:
            print(f"❌ {table}: Sem acesso")
    
    # 4. VIEWS DISPONÍVEIS
    print("\n📌 4. VIEWS DISPONÍVEIS (relatórios prontos)")
    print("-"*60)
    
    cursor.execute("""
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'VIEW'
        AND table_name LIKE 'V_%'
        ORDER BY table_name
        LIMIT 20
    """)
    
    views = cursor.fetchall()
    accessible_views = []
    for (view_name,) in views:
        has_access, count = check_table_access(cursor, f'public.{view_name}')
        if has_access:
            print(f"✅ public.{view_name}: {count} registros")
            accessible_views.append(f'public.{view_name}')
    
    # 5. TESTE DE LOGIN (se temos acesso a tabelas de usuário)
    print("\n📌 5. TESTE DE ESTRUTURA PARA LOGIN")
    print("-"*60)
    
    if accessible_auth:
        test_table = accessible_auth[0]
        print(f"Analisando estrutura de: {test_table}")
        
        # Buscar colunas que parecem ser de login
        cursor.execute(f"""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = '{test_table.split('.')[1]}'
            AND (
                LOWER(column_name) LIKE '%email%' OR
                LOWER(column_name) LIKE '%login%' OR
                LOWER(column_name) LIKE '%senha%' OR
                LOWER(column_name) LIKE '%password%' OR
                LOWER(column_name) LIKE '%user%' OR
                LOWER(column_name) LIKE '%nome%'
            )
        """)
        
        login_columns = cursor.fetchall()
        if login_columns:
            print("Colunas relevantes para autenticação:")
            for (col,) in login_columns:
                print(f"   - {col}")
    
    # 6. RESUMO FINAL
    print("\n📌 6. RESUMO - TABELAS ACESSÍVEIS")
    print("-"*60)
    print(f"Tabelas de autenticação: {len(accessible_auth)}")
    print(f"Tabelas de clientes: {len(accessible_clients)}")
    print(f"Tabelas de consumo: {len(accessible_consumption)}")
    print(f"Views disponíveis: {len(accessible_views)}")
    
    # 7. QUERY DE EXEMPLO
    if accessible_auth:
        print("\n📌 7. EXEMPLO DE DADOS (sem informações sensíveis)")
        print("-"*60)
        
        try:
            # Pegar estrutura de exemplo sem dados sensíveis
            cursor.execute(f"""
                SELECT COUNT(*) as total_usuarios,
                       COUNT(DISTINCT CASE WHEN ATIVO = 1 THEN ID_CONSULTOR END) as ativos
                FROM public.CONSULTOR
            """)
            result = cursor.fetchone()
            if result:
                print(f"CONSULTOR: {result[0]} total, {result[1]} ativos")
        except:
            pass
    
    cursor.close()
    conn.close()
    
    print("\n" + "="*80)
    print("ANÁLISE CONCLUÍDA")
    print("="*80)

if __name__ == '__main__':
    main()
