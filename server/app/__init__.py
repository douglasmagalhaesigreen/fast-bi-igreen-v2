from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
import logging
from logging.handlers import RotatingFileHandler
import os

# Inicializar extensões
db = SQLAlchemy()
migrate = Migrate()
cors = CORS()
jwt = JWTManager()
bcrypt = Bcrypt()


def create_app(config_name='development'):
    """Factory function para criar a aplicação Flask"""
    
    # Criar a aplicação
    app = Flask(__name__)
    
    # Carregar configurações
    from app.config import config
    app.config.from_object(config[config_name])
    
    # Inicializar extensões
    db.init_app(app)
    migrate.init_app(app, db)
    cors.init_app(app, resources={
        r"/api/*": {
            "origins": app.config['CORS_ORIGINS'],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })
    jwt.init_app(app)
    bcrypt.init_app(app)
    
    # Configurar logging
    if not app.debug and not app.testing:
        if not os.path.exists('logs'):
            os.mkdir('logs')
        file_handler = RotatingFileHandler(
            f"logs/{app.config['LOG_FILE']}",
            maxBytes=10240000,
            backupCount=10
        )
        file_handler.setFormatter(logging.Formatter(
            '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
        ))
        file_handler.setLevel(getattr(logging, app.config['LOG_LEVEL']))
        app.logger.addHandler(file_handler)
        app.logger.setLevel(getattr(logging, app.config['LOG_LEVEL']))
        app.logger.info('Fast BI iGreen startup')
    
    # Registrar blueprints
    from app.auth.routes import auth_bp
    from app.api.dashboard import dashboard_bp
    from app.api.reports import reports_bp
    from app.api.exports import exports_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')
    app.register_blueprint(reports_bp, url_prefix='/api/reports')
    app.register_blueprint(exports_bp, url_prefix='/api/exports')
    
    # Rota de health check
    @app.route('/api/health')
    def health_check():
        return {
            'status': 'healthy',
            'service': 'Fast BI iGreen API',
            'version': '2.0.0',
            'database': 'connected' if db.engine else 'disconnected'
        }
    
    # Handlers de erro do JWT
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return {'message': 'Token expirado', 'error': 'token_expired'}, 401
    
    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return {'message': 'Token inválido', 'error': 'invalid_token'}, 401
    
    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return {'message': 'Token não fornecido', 'error': 'authorization_required'}, 401
    
    # Criar tabelas se não existirem
    with app.app_context():
        try:
            db.create_all()
            app.logger.info('Tabelas do banco de dados criadas/verificadas')
        except Exception as e:
            app.logger.error(f'Erro ao criar tabelas: {str(e)}')
    
    return app