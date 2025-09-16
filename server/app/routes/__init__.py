from flask import Blueprint

# Criar blueprints
auth_bp = Blueprint('auth', __name__)
dashboard_bp = Blueprint('dashboard', __name__)
reports_bp = Blueprint('reports', __name__)

# Importar rotas
from app.routes import auth, dashboard, reports
