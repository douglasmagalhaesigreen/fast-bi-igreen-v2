from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
import logging
from logging.handlers import RotatingFileHandler
import os

db = SQLAlchemy()
jwt = JWTManager()
bcrypt = Bcrypt()

def create_app(config_name='development'):
    app = Flask(__name__)
    
    # Carregar configurações
    from config import config
    app.config.from_object(config[config_name])
    
    # Inicializar extensões
    db.init_app(app)
    jwt.init_app(app)
    bcrypt.init_app(app)
    
    # Configurar CORS
    CORS(app, resources={
        r"/api/*": {
            "origins": ["http://localhost:4200", "http://localhost:5173"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })
    
    # Configurar logging
    if not os.path.exists('logs'):
        os.mkdir('logs')
    
    file_handler = RotatingFileHandler('logs/app.log', maxBytes=10240000, backupCount=10)
    file_handler.setFormatter(logging.Formatter(
        '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
    ))
    file_handler.setLevel(logging.INFO)
    app.logger.addHandler(file_handler)
    app.logger.setLevel(logging.INFO)
    app.logger.info('Fast BI iGreen API iniciando...')
    
    # Registrar blueprints
    from app.routes.auth import auth_bp
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    # Importar rotas do dashboard
    from app.routes.dashboard import dashboard_bp
    app.register_blueprint(dashboard_bp)
    
    # Health check
    @app.route('/api/health')
    def health_check():
        return {'status': 'healthy', 'service': 'Fast BI iGreen API'}, 200
    
    return app
