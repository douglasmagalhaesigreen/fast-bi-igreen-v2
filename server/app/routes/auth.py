from flask import jsonify, request
from flask_jwt_extended import create_access_token, create_refresh_token
from app.routes import auth_bp

@auth_bp.route('/login', methods=['POST'])
def login():
    """Endpoint de login"""
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    # TODO: Validar credenciais no banco
    # Por enquanto, validação mock
    if email == 'admin@igreen.com' and password == '123456':
        access_token = create_access_token(identity=email)
        refresh_token = create_refresh_token(identity=email)
        
        return jsonify({
            'access_token': access_token,
            'refresh_token': refresh_token,
            'user': {
                'name': 'Administrador',
                'email': email,
                'role': 'admin'
            }
        }), 200
    
    return jsonify({'message': 'Credenciais inválidas'}), 401

@auth_bp.route('/verify', methods=['GET'])
def verify():
    """Verificar token"""
    return jsonify({'message': 'Token válido'}), 200
