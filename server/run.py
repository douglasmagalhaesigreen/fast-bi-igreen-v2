#!/usr/bin/env python
"""
Arquivo principal para executar a aplicação Flask
"""
import os
import sys
from pathlib import Path

# Adicionar o diretório do projeto ao path
sys.path.insert(0, str(Path(__file__).parent))

from app import create_app
from dotenv import load_dotenv

# Carregar variáveis de ambiente
load_dotenv()

# Criar a aplicação
config_name = os.environ.get('FLASK_ENV', 'development')
app = create_app(config_name)

if __name__ == '__main__':
    # Configurações para desenvolvimento
    host = os.environ.get('FLASK_HOST', '0.0.0.0')
    port = int(os.environ.get('FLASK_PORT', 5000))
    debug = os.environ.get('FLASK_DEBUG', 'True').lower() == 'true'
    
    print(f"""
    ╔═══════════════════════════════════════════╗
    ║       Fast BI iGreen Server v2.0          ║
    ╠═══════════════════════════════════════════╣
    ║  Ambiente: {config_name:31}║
    ║  Host: {host:35}║
    ║  Porta: {port:34}║
    ║  Debug: {str(debug):34}║
    ║  Database: {os.environ.get('DB_NAME', 'N/A'):31}║
    ╚═══════════════════════════════════════════╝
    
    🚀 Servidor iniciando...
    📍 Acesse: http://localhost:{port}
    📍 API: http://localhost:{port}/api
    
    Pressione CTRL+C para parar o servidor
    """)
    
    app.run(
        host=host,
        port=port,
        debug=debug,
        use_reloader=debug
    )