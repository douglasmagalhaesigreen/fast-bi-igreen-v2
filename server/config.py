import os
from datetime import timedelta
from dotenv import load_dotenv
from urllib.parse import quote_plus

# Carregar variáveis de ambiente
load_dotenv()

class Config:
    """Configuração base"""
    # Flask
    SECRET_KEY = os.environ.get('SECRET_KEY', 'iGr33n@012')
    
    # Database - Modo SOMENTE LEITURA
    db_user = os.environ.get('DB_USER', 'bi_igreen')
    db_password = quote_plus(os.environ.get('DB_PASSWORD', 'iGr33n@2025'))
    db_host = os.environ.get('DB_HOST', '162.141.111.95')
    db_port = os.environ.get('DB_PORT', '5432')
    db_name = os.environ.get('DB_NAME', 'IGREEN')
    
    SQLALCHEMY_DATABASE_URI = (
        f"postgresql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"
    )
    
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_size': 10,
        'pool_recycle': 3600,
        'pool_pre_ping': True,
    }
    
    # JWT - Usando autenticação local (sem banco)
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'iGr33n@JWT#2025')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
    
    # CORS
    CORS_ORIGINS = ['http://localhost:4200', 'http://localhost:5173', '*']
    
    # Modo somente leitura
    READ_ONLY_MODE = True

class DevelopmentConfig(Config):
    """Configuração de desenvolvimento"""
    DEBUG = True
    TESTING = False

class ProductionConfig(Config):
    """Configuração de produção"""
    DEBUG = False
    TESTING = False

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
