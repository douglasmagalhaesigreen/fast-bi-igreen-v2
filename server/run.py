#!/usr/bin/env python
"""
Arquivo principal para executar a aplicação Flask - MODO SOMENTE LEITURA
"""
import os
import sys
from dotenv import load_dotenv

# Carregar variáveis de ambiente
load_dotenv()

# Adicionar o diretório ao path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app

# Criar a aplicação
config_name = os.environ.get('FLASK_ENV', 'development')
app = create_app(config_name)

if __name__ == '__main__':
    # Configurações do servidor
    host = os.environ.get('FLASK_HOST', '0.0.0.0')
    port = int(os.environ.get('FLASK_PORT', 5556))
    
    print(f"""
    ╔═══════════════════════════════════════════╗
    ║   Fast BI iGreen API v2.0 - READ ONLY     ║
    ╠═══════════════════════════════════════════╣
    ║  Modo: SOMENTE LEITURA                    ║
    ║  Ambiente: {config_name:31}║
    ║  Host: {host:35}║
    ║  Porta: {port:34}║
    ║  Database: {os.environ.get('DB_NAME'):31}║
    ╚═══════════════════════════════════════════╝
    
    🔍 Servidor em modo SOMENTE LEITURA
    📍 API: http://localhost:{port}/api
    📍 Health Check: http://localhost:{port}/api/health
    
    ⚠️  Autenticação usando dados locais (sem banco)
    
    Pressione CTRL+C para parar
    """)
    
    app.run(
        host=host,
        port=port,
        debug=app.config['DEBUG']
    )
