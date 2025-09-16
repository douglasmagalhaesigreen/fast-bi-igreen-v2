from flask import jsonify
from flask_jwt_extended import jwt_required
from app.routes import reports_bp

@reports_bp.route('/list', methods=['GET'])
@jwt_required()
def get_reports():
    """Lista de relatórios disponíveis"""
    return jsonify({
        'reports': [
            {'id': 1, 'name': 'Relatório Mensal', 'type': 'monthly'},
            {'id': 2, 'name': 'Relatório de Consumo', 'type': 'consumption'},
            {'id': 3, 'name': 'Relatório de Clientes', 'type': 'clients'}
        ]
    })
