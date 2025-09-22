from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from sqlalchemy import text
from datetime import datetime, timedelta
from decimal import Decimal

dashboard_bp = Blueprint('dashboard', __name__)

def decimal_to_float(obj):
    """Converter Decimal para float para serialização JSON"""
    if isinstance(obj, Decimal):
        return float(obj)
    return obj

@dashboard_bp.route('/api/dashboard/metrics', methods=['GET'])
@jwt_required()
def get_metrics():
    """
    Retorna as métricas principais do dashboard
    """
    try:
        with db.engine.connect() as conn:
            metrics = {}
            
            # 1. Total de Clientes Ativos
            result = conn.execute(text("""
                SELECT COUNT(DISTINCT idcliente) as total 
                FROM "CLIENTES" 
                WHERE status = 'ATIVO' 
                   OR (data_ativo IS NOT NULL AND dtcancelado IS NULL)
            """))
            metrics['clientes_ativos'] = result.fetchone()[0] or 0
            
            # 2. Consumo Total kWh (último mês)
            result = conn.execute(text("""
                SELECT 
                    COALESCE(SUM(energiainjetada), 0) as total_kwh,
                    COUNT(DISTINCT idcliente) as clientes_faturados
                FROM "RCB_CLIENTES"
                WHERE mesreferencia >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
                  AND mesreferencia < DATE_TRUNC('month', CURRENT_DATE)
            """))
            row = result.fetchone()
            metrics['consumo_kwh'] = row[0] or 0
            metrics['clientes_faturados'] = row[1] or 0
            
            # 3. Faturamento Total (último mês)
            result = conn.execute(text("""
                SELECT 
                    COALESCE(SUM(valorapagar), 0) as faturamento,
                    COALESCE(AVG(valorapagar), 0) as ticket_medio
                FROM "RCB_CLIENTES"
                WHERE mesreferencia >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
                  AND mesreferencia < DATE_TRUNC('month', CURRENT_DATE)
                  AND dtpagamento IS NOT NULL
            """))
            row = result.fetchone()
            metrics['faturamento'] = decimal_to_float(row[0])
            metrics['ticket_medio'] = decimal_to_float(row[1])
            
            # 4. Taxa de Inadimplência
            result = conn.execute(text("""
                SELECT 
                    COUNT(CASE WHEN dtpagamento IS NULL AND dtvencimento < CURRENT_DATE THEN 1 END) as inadimplentes,
                    COUNT(*) as total
                FROM "RCB_CLIENTES"
                WHERE mesreferencia >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
                  AND mesreferencia < DATE_TRUNC('month', CURRENT_DATE)
            """))
            row = result.fetchone()
            inadimplentes = row[0] or 0
            total = row[1] or 1
            metrics['taxa_inadimplencia'] = round((inadimplentes / total) * 100, 2)
            
            # 5. Economia Gerada
            result = conn.execute(text("""
                SELECT 
                    COALESCE(SUM(valorseria - valorapagar), 0) as economia
                FROM "RCB_CLIENTES"
                WHERE mesreferencia >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
                  AND mesreferencia < DATE_TRUNC('month', CURRENT_DATE)
                  AND valorseria IS NOT NULL 
                  AND valorapagar IS NOT NULL
            """))
            metrics['economia_gerada'] = decimal_to_float(result.fetchone()[0])
            
            # 6. Crescimento de Clientes (mês atual vs mês anterior)
            result = conn.execute(text("""
                WITH mes_atual AS (
                    SELECT COUNT(*) as total 
                    FROM "CLIENTES" 
                    WHERE DATE_TRUNC('month', data_ativo) = DATE_TRUNC('month', CURRENT_DATE)
                ),
                mes_anterior AS (
                    SELECT COUNT(*) as total 
                    FROM "CLIENTES" 
                    WHERE DATE_TRUNC('month', data_ativo) = DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
                )
                SELECT 
                    ma.total as atual,
                    mp.total as anterior,
                    CASE 
                        WHEN mp.total > 0 THEN ((ma.total - mp.total)::float / mp.total) * 100
                        ELSE 0 
                    END as crescimento
                FROM mes_atual ma, mes_anterior mp
            """))
            row = result.fetchone()
            metrics['novos_clientes_mes'] = row[0] or 0
            metrics['crescimento_clientes'] = round(row[2] or 0, 2)
            
            return jsonify(metrics), 200
            
    except Exception as e:
        print(f"Erro em get_metrics: {str(e)}")
        return jsonify({'error': 'Erro ao buscar métricas'}), 500


@dashboard_bp.route('/api/dashboard/chart/consumo-mensal', methods=['GET'])
@jwt_required()
def get_consumo_mensal():
    """
    Retorna dados de consumo dos últimos 6 meses
    """
    try:
        months = request.args.get('months', 6, type=int)
        
        with db.engine.connect() as conn:
            result = conn.execute(text("""
                SELECT 
                    TO_CHAR(mesreferencia, 'Mon/YY') as mes,
                    DATE_PART('month', mesreferencia) as mes_num,
                    DATE_PART('year', mesreferencia) as ano,
                    SUM(energiainjetada) as consumo_total,
                    AVG(energiainjetada) as consumo_medio,
                    COUNT(DISTINCT idcliente) as num_clientes
                FROM "RCB_CLIENTES"
                WHERE mesreferencia >= CURRENT_DATE - INTERVAL :months
                GROUP BY mesreferencia, TO_CHAR(mesreferencia, 'Mon/YY')
                ORDER BY mesreferencia ASC
            """), {'months': f'{months} months'})
            
            data = []
            for row in result:
                data.append({
                    'mes': row[0],
                    'consumo_total': float(row[3] or 0),
                    'consumo_medio': float(row[4] or 0),
                    'num_clientes': row[5] or 0
                })
            
            return jsonify(data), 200
            
    except Exception as e:
        print(f"Erro em get_consumo_mensal: {str(e)}")
        return jsonify({'error': 'Erro ao buscar consumo mensal'}), 500


@dashboard_bp.route('/api/dashboard/chart/distribuicao-regional', methods=['GET'])
@jwt_required()
def get_distribuicao_regional():
    """
    Retorna distribuição de clientes por estado/região
    """
    try:
        with db.engine.connect() as conn:
            # Por estado
            result = conn.execute(text("""
                SELECT 
                    COALESCE(ufconsumo, uf) as estado,
                    COUNT(DISTINCT c.idcliente) as total_clientes,
                    SUM(r.energiainjetada) as consumo_total,
                    AVG(r.valorapagar) as ticket_medio
                FROM "CLIENTES" c
                LEFT JOIN (
                    SELECT idcliente, energiainjetada, valorapagar
                    FROM "RCB_CLIENTES"
                    WHERE mesreferencia >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
                ) r ON c.idcliente = r.idcliente
                WHERE c.status = 'ATIVO' OR (c.data_ativo IS NOT NULL AND c.dtcancelado IS NULL)
                GROUP BY COALESCE(ufconsumo, uf)
                HAVING COALESCE(ufconsumo, uf) IS NOT NULL
                ORDER BY total_clientes DESC
            """))
            
            estados = []
            for row in result:
                estados.append({
                    'estado': row[0],
                    'clientes': row[1] or 0,
                    'consumo': float(row[2] or 0),
                    'ticket_medio': decimal_to_float(row[3] or 0)
                })
            
            # Agrupar por região
            regioes = {
                'Norte': ['AC', 'AP', 'AM', 'PA', 'RO', 'RR', 'TO'],
                'Nordeste': ['AL', 'BA', 'CE', 'MA', 'PB', 'PE', 'PI', 'RN', 'SE'],
                'Centro-Oeste': ['DF', 'GO', 'MT', 'MS'],
                'Sudeste': ['ES', 'MG', 'RJ', 'SP'],
                'Sul': ['PR', 'RS', 'SC']
            }
            
            distribuicao_regional = []
            for regiao, ufs in regioes.items():
                total_clientes = sum(e['clientes'] for e in estados if e['estado'] in ufs)
                total_consumo = sum(e['consumo'] for e in estados if e['estado'] in ufs)
                
                if total_clientes > 0:
                    distribuicao_regional.append({
                        'regiao': regiao,
                        'clientes': total_clientes,
                        'consumo': total_consumo,
                        'percentual': 0  # Será calculado no frontend
                    })
            
            # Calcular percentuais
            total = sum(r['clientes'] for r in distribuicao_regional)
            for r in distribuicao_regional:
                r['percentual'] = round((r['clientes'] / total) * 100, 2) if total > 0 else 0
            
            return jsonify({
                'por_estado': estados[:10],  # Top 10 estados
                'por_regiao': distribuicao_regional
            }), 200
            
    except Exception as e:
        print(f"Erro em get_distribuicao_regional: {str(e)}")
        return jsonify({'error': 'Erro ao buscar distribuição regional'}), 500


@dashboard_bp.route('/api/dashboard/chart/faturamento-evolucao', methods=['GET'])
@jwt_required()
def get_faturamento_evolucao():
    """
    Retorna evolução do faturamento e comparação com metas
    """
    try:
        with db.engine.connect() as conn:
            result = conn.execute(text("""
                SELECT 
                    TO_CHAR(mesreferencia, 'Mon/YY') as mes,
                    SUM(valorapagar) as faturamento_total,
                    SUM(valorseria) as potencial_total,
                    COUNT(DISTINCT idcliente) as clientes_pagantes,
                    AVG(valorapagar) as ticket_medio,
                    SUM(CASE WHEN dtpagamento IS NOT NULL THEN valorapagar ELSE 0 END) as recebido,
                    SUM(CASE WHEN dtpagamento IS NULL AND dtvencimento < CURRENT_DATE THEN valorapagar ELSE 0 END) as inadimplente
                FROM "RCB_CLIENTES"
                WHERE mesreferencia >= CURRENT_DATE - INTERVAL '12 months'
                GROUP BY mesreferencia, TO_CHAR(mesreferencia, 'Mon/YY')
                ORDER BY mesreferencia ASC
            """))
            
            data = []
            for row in result:
                data.append({
                    'mes': row[0],
                    'faturamento': decimal_to_float(row[1]),
                    'potencial': decimal_to_float(row[2]),
                    'clientes': row[3] or 0,
                    'ticket_medio': decimal_to_float(row[4]),
                    'recebido': decimal_to_float(row[5]),
                    'inadimplente': decimal_to_float(row[6])
                })
            
            return jsonify(data), 200
            
    except Exception as e:
        print(f"Erro em get_faturamento_evolucao: {str(e)}")
        return jsonify({'error': 'Erro ao buscar evolução do faturamento'}), 500


@dashboard_bp.route('/api/dashboard/chart/top-clientes', methods=['GET'])
@jwt_required()
def get_top_clientes():
    """
    Retorna top clientes por consumo/faturamento
    """
    try:
        limit = request.args.get('limit', 10, type=int)
        
        with db.engine.connect() as conn:
            result = conn.execute(text("""
                SELECT 
                    c.nome,
                    c.razao,
                    c.ufconsumo,
                    SUM(r.energiainjetada) as consumo_total,
                    SUM(r.valorapagar) as faturamento_total,
                    AVG(r.valorapagar) as ticket_medio,
                    COUNT(r.idrcb) as num_faturas
                FROM "CLIENTES" c
                INNER JOIN "RCB_CLIENTES" r ON c.idcliente = r.idcliente
                WHERE r.mesreferencia >= CURRENT_DATE - INTERVAL '3 months'
                GROUP BY c.idcliente, c.nome, c.razao, c.ufconsumo
                ORDER BY faturamento_total DESC
                LIMIT :limit
            """), {'limit': limit})
            
            data = []
            for row in result:
                nome_display = row[1] if row[1] else row[0]  # Usar razão social se disponível
                data.append({
                    'nome': nome_display[:50] if nome_display else 'N/A',
                    'estado': row[2] or 'N/A',
                    'consumo': float(row[3] or 0),
                    'faturamento': decimal_to_float(row[4]),
                    'ticket_medio': decimal_to_float(row[5]),
                    'num_faturas': row[6] or 0
                })
            
            return jsonify(data), 200
            
    except Exception as e:
        print(f"Erro em get_top_clientes: {str(e)}")
        return jsonify({'error': 'Erro ao buscar top clientes'}), 500


@dashboard_bp.route('/api/dashboard/kpis', methods=['GET'])
@jwt_required()
def get_kpis():
    """
    Retorna KPIs principais com comparação período anterior
    """
    try:
        with db.engine.connect() as conn:
            # Período atual (último mês completo)
            result = conn.execute(text("""
                WITH periodo_atual AS (
                    SELECT 
                        COUNT(DISTINCT idcliente) as clientes,
                        SUM(energiainjetada) as consumo,
                        SUM(valorapagar) as faturamento,
                        AVG(valorapagar) as ticket_medio,
                        SUM(CASE WHEN dtpagamento IS NOT NULL THEN 1 ELSE 0 END)::float / 
                            NULLIF(COUNT(*), 0) * 100 as taxa_pagamento
                    FROM "RCB_CLIENTES"
                    WHERE mesreferencia >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
                      AND mesreferencia < DATE_TRUNC('month', CURRENT_DATE)
                ),
                periodo_anterior AS (
                    SELECT 
                        COUNT(DISTINCT idcliente) as clientes,
                        SUM(energiainjetada) as consumo,
                        SUM(valorapagar) as faturamento,
                        AVG(valorapagar) as ticket_medio,
                        SUM(CASE WHEN dtpagamento IS NOT NULL THEN 1 ELSE 0 END)::float / 
                            NULLIF(COUNT(*), 0) * 100 as taxa_pagamento
                    FROM "RCB_CLIENTES"
                    WHERE mesreferencia >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '2 months')
                      AND mesreferencia < DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
                )
                SELECT 
                    pa.clientes as clientes_atual,
                    pp.clientes as clientes_anterior,
                    pa.consumo as consumo_atual,
                    pp.consumo as consumo_anterior,
                    pa.faturamento as faturamento_atual,
                    pp.faturamento as faturamento_anterior,
                    pa.ticket_medio as ticket_atual,
                    pp.ticket_medio as ticket_anterior,
                    pa.taxa_pagamento as taxa_pagamento_atual,
                    pp.taxa_pagamento as taxa_pagamento_anterior
                FROM periodo_atual pa, periodo_anterior pp
            """))
            
            row = result.fetchone()
            
            def calc_variacao(atual, anterior):
                if anterior and anterior > 0:
                    return round(((atual - anterior) / anterior) * 100, 2)
                return 0
            
            kpis = {
                'clientes': {
                    'atual': row[0] or 0,
                    'anterior': row[1] or 0,
                    'variacao': calc_variacao(row[0] or 0, row[1] or 0)
                },
                'consumo': {
                    'atual': float(row[2] or 0),
                    'anterior': float(row[3] or 0),
                    'variacao': calc_variacao(row[2] or 0, row[3] or 0)
                },
                'faturamento': {
                    'atual': decimal_to_float(row[4]),
                    'anterior': decimal_to_float(row[5]),
                    'variacao': calc_variacao(row[4] or 0, row[5] or 0)
                },
                'ticket_medio': {
                    'atual': decimal_to_float(row[6]),
                    'anterior': decimal_to_float(row[7]),
                    'variacao': calc_variacao(row[6] or 0, row[7] or 0)
                },
                'taxa_pagamento': {
                    'atual': round(row[8] or 0, 2),
                    'anterior': round(row[9] or 0, 2),
                    'variacao': calc_variacao(row[8] or 0, row[9] or 0)
                }
            }
            
            return jsonify(kpis), 200
            
    except Exception as e:
        print(f"Erro em get_kpis: {str(e)}")
        return jsonify({'error': 'Erro ao buscar KPIs'}), 500