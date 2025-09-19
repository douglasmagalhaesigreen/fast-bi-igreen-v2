#!/usr/bin/env python3
import os
import sys
from app import create_app, db
from dotenv import load_dotenv
from sqlalchemy import text

# Carregar variáveis de ambiente
load_dotenv()

# Criar aplicação
app = create_app(os.getenv('FLASK_ENV', 'development'))

def test_db_connection():
    """Testa a conexão com o banco de dados"""
    try:
        with app.app_context():
            # Testa conexão
            with db.engine.connect() as connection:
                result = connection.execute(text('SELECT 1'))
                print("✅ Conexão com o banco de dados estabelecida!")
                
                # Verifica se consegue acessar a tabela USUARIOS
                try:
                    result = connection.execute(text('SELECT COUNT(*) FROM "USUARIOS"'))
                    count = result.fetchone()[0]
                    print(f"✅ Tabela USUARIOS encontrada!")
                    print(f"📊 Total de usuários no banco: {count}")
                    
                    # Verifica se há usuários com senha
                    result = connection.execute(text("""
                        SELECT COUNT(*) FROM "USUARIOS" 
                        WHERE password IS NOT NULL AND password != ''
                    """))
                    with_password = result.fetchone()[0]
                    print(f"🔑 Usuários com senha configurada: {with_password}")
                    
                except Exception as e:
                    print(f"⚠️ Erro ao acessar tabela USUARIOS: {e}")
                    
    except Exception as e:
        print(f"❌ Erro ao conectar com o banco: {e}")
        sys.exit(1)

if __name__ == '__main__':
    print("""
╔═══════════════════════════════════════════╗
║       Fast BI iGreen API v2.0             ║
╠═══════════════════════════════════════════╣
║  Ambiente: {}                     ║
║  Host: 0.0.0.0                            ║
║  Porta: 5555                              ║
║  Database: IGREEN                         ║
║  Modo: READ-ONLY (Somente Leitura)        ║
╚═══════════════════════════════════════════╝
    """.format(os.getenv('FLASK_ENV', 'development').ljust(11)))
    
    print("🚀 Servidor iniciando...")
    print("📍 API: http://localhost:5555/api")
    print("📍 Health Check: http://localhost:5555/api/health\n")
    
    # Testar conexão com o banco
    test_db_connection()
    
    # Iniciar servidor
    app.run(
        host='0.0.0.0',
        port=5555,
        debug=True
    )
