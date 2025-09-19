from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from app.models.usuario import Usuario
from app import db
import logging

auth_bp = Blueprint('auth', __name__)
logger = logging.getLogger(__name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({'error': 'Email e senha são obrigatórios'}), 400
        
        # Buscar usuário no banco
        usuario = Usuario.query.filter_by(email=email).first()
        
        if not usuario:
            logger.warning(f"Tentativa de login com email não encontrado: {email}")
            return jsonify({'error': 'Credenciais inválidas'}), 401
        
        # Verificar senha
        if not usuario.check_password(password):
            logger.warning(f"Senha incorreta para o email: {email}")
            return jsonify({'error': 'Credenciais inválidas'}), 401
        
        # Verificar se usuário está ativo
        if not usuario.is_active:
            return jsonify({'error': 'Usuário inativo'}), 403
        
        # Criar tokens JWT
        access_token = create_access_token(identity=str(usuario.codigo))
        refresh_token = create_refresh_token(identity=str(usuario.codigo))
        
        logger.info(f"Login bem-sucedido para: {email}")
        
        return jsonify({
            'access_token': access_token,
            'refresh_token': refresh_token,
            'user': usuario.to_dict()
        }), 200
        
    except Exception as e:
        logger.error(f"Erro no login: {str(e)}")
        return jsonify({'error': 'Erro interno do servidor'}), 500

@auth_bp.route('/verify', methods=['GET'])
@jwt_required()
def verify_token():
    try:
        user_id = get_jwt_identity()
        usuario = Usuario.query.get(user_id)
        
        if not usuario:
            return jsonify({'error': 'Usuário não encontrado'}), 404
            
        return jsonify({
            'valid': True,
            'user': usuario.to_dict()
        }), 200
        
    except Exception as e:
        logger.error(f"Erro ao verificar token: {str(e)}")
        return jsonify({'error': 'Token inválido'}), 401

@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    try:
        user_id = get_jwt_identity()
        access_token = create_access_token(identity=user_id)
        
        return jsonify({'access_token': access_token}), 200
        
    except Exception as e:
        logger.error(f"Erro ao renovar token: {str(e)}")
        return jsonify({'error': 'Erro ao renovar token'}), 500
