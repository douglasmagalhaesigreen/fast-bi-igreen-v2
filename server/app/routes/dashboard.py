from flask import jsonify
from flask_jwt_extended import jwt_required
from app.routes import dashboard_bp
from app.services.data_service import DataService

@dashboard_bp.route('/metrics', methods=['GET'])
@jwt_required()
def get_metrics():
    """Retorna métricas do dashboard"""
    try:
        metrics = DataService.get_dashboard_metrics()
        return jsonify(metrics), 200
    except Exception as e:
        # Se houver erro, retorna dados mock
        return jsonify({
            'kwhTotal': 1234567,
            'clientesAtivos': 892,
            'clientesNovos': 45,
            'faturamento': 2456789,
            'consumoMedio': 342,
            'eficiencia': 94.5,
            'alertas': 3,
            'error': str(e)
        }), 200

@dashboard_bp.route('/chart-data', methods=['GET'])
@jwt_required()
def get_chart_data():
    """Retorna dados para os gráficos"""
    try:
        data = DataService.get_chart_data()
        return jsonify(data), 200
    except Exception as e:
        # Retorna dados mock em caso de erro
        return jsonify({
            'consumoMensal': [
                {'mes': 'Jan', 'consumo': 420, 'meta': 400},
                {'mes': 'Fev', 'consumo': 380, 'meta': 400},
                {'mes': 'Mar', 'consumo': 450, 'meta': 420},
                {'mes': 'Abr', 'consumo': 490, 'meta': 450},
                {'mes': 'Mai', 'consumo': 520, 'meta': 480},
                {'mes': 'Jun', 'consumo': 480, 'meta': 500},
            ],
            'dadosRegionais': [
                {'regiao': 'Norte', 'clientes': 120, 'consumo': 380},
                {'regiao': 'Nordeste', 'clientes': 280, 'consumo': 720},
                {'regiao': 'Centro-Oeste', 'clientes': 95, 'consumo': 290},
                {'regiao': 'Sudeste', 'clientes': 340, 'consumo': 980},
                {'regiao': 'Sul', 'clientes': 157, 'consumo': 440},
            ],
            'distribuicaoTipo': [
                {'name': 'Residencial', 'value': 45},
                {'name': 'Comercial', 'value': 35},
                {'name': 'Industrial', 'value': 20}
            ],
            'error': str(e)
        }), 200
