from flask import Blueprint, jsonify, request, send_file
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from sqlalchemy import text
from datetime import datetime, timedelta
from decimal import Decimal
from openpyxl import Workbook
from openpyxl.utils import get_column_letter
import io
import traceback

dashboard_bp = Blueprint('dashboard', __name__)

def decimal_to_float(obj):
    """Converter Decimal para float para serialização JSON"""
    if isinstance(obj, Decimal):
        return float(obj)
    return obj

# ========================================
# DASHBOARD COM ESTRUTURA DE FILTROS
# PRONTO PARA RECEBER CARDS COM QUERIES
# ========================================

@dashboard_bp.route('/api/dashboard/available-dates', methods=['GET'])
@jwt_required()
def get_available_dates():
    """
    Retorna as datas disponíveis na base para o filtro
    """
    try:
        with db.engine.connect() as conn:
            result = conn.execute(text("""
                SELECT to_char("data cadastro", 'MM/YYYY') AS mes_ano,
                       to_char("data cadastro", 'YYYY-MM') AS mes_valor,
                       MIN("data cadastro") AS data_ordenacao
                FROM public."V_CUSTOMER"
                WHERE "data cadastro" IS NOT NULL
                GROUP BY to_char("data cadastro", 'MM/YYYY'), to_char("data cadastro", 'YYYY-MM')
                ORDER BY MIN("data cadastro") DESC
            """))
            
            dates = []
            for row in result:
                dates.append({
                    'label': row[0],  # MM/YYYY format
                    'value': row[1]   # YYYY-MM format
                })
            
            return jsonify(dates), 200
            
    except Exception as e:
        print(f"Erro em get_available_dates: {str(e)}")
        return jsonify({'error': 'Erro ao buscar datas disponíveis'}), 500


@dashboard_bp.route('/api/dashboard/card/<card_name>', methods=['GET'])
@jwt_required()
def get_card_data(card_name):
    """
    Endpoint genérico para dados de cards
    Suporta filtro de data e modo consolidado
    """
    try:
        # Parâmetros da requisição
        date_filter = request.args.get('date')  # YYYY-MM format
        consolidated = request.args.get('consolidated', 'false').lower() == 'true'
        
        with db.engine.connect() as conn:
            result = {'value': 0, 'available': False}
            
            # Card: Total de Ativações
            if card_name == 'total_ativacoes':
                if consolidated:
                    # Query do número consolidado
                    query_result = conn.execute(text("""
                        SELECT COUNT(*) AS total_clientes_consolidados
                        FROM public."V_CUSTOMER"
                        WHERE "data ativo" IS NOT NULL
                    """))
                else:
                    # Converter YYYY-MM para MM/YYYY
                    if date_filter:
                        year, month = date_filter.split('-')
                        date_format = f"{month}/{year}"
                        
                        # Query do número por mês
                        query_result = conn.execute(text("""
                            SELECT COUNT(*) AS total_clientes_no_mes
                            FROM public."V_CUSTOMER"
                            WHERE to_char("data ativo", 'MM/YYYY') = :date_format
                        """), {'date_format': date_format})
                    else:
                        query_result = None
                
                if query_result:
                    row = query_result.fetchone()
                    result = {
                        'value': row[0] if row else 0,
                        'available': True
                    }
            
            return jsonify(result), 200
            
    except Exception as e:
        print(f"Erro em get_card_data para {card_name}: {str(e)}")
        return jsonify({'error': f'Erro ao buscar dados do card {card_name}'}), 500


def safe_excel_value(value):
    """Converter valor para formato seguro para Excel"""
    if value is None:
        return ''
    elif isinstance(value, Decimal):
        return float(value)
    elif isinstance(value, (datetime, )):
        # Datas datetime para string
        return value.strftime('%Y-%m-%d %H:%M:%S') if hasattr(value, 'hour') else value.strftime('%Y-%m-%d')
    elif hasattr(value, 'date'):
        # Objetos date para string
        return value.strftime('%Y-%m-%d')
    else:
        # Qualquer outro tipo: converter para string
        return str(value)


@dashboard_bp.route('/api/dashboard/export/<card_name>', methods=['GET'])
@jwt_required()
def export_card_data(card_name):
    """
    Endpoint para exportar listas detalhadas em Excel ou retornar dados para prévia
    """
    try:
        print(f"=== Iniciando exportação {card_name} ===")
        
        # Parâmetros da requisição
        date_filter = request.args.get('date')
        consolidated = request.args.get('consolidated', 'false').lower() == 'true'
        preview = request.args.get('preview', 'false').lower() == 'true'  # Novo parâmetro
        
        with db.engine.connect() as conn:
            query_result = None
            
            # Card: Total de Ativações
            if card_name == 'total_ativacoes':
                # Query base com ordem das colunas EXATAMENTE igual
                base_select = """
                    SELECT "código"::text as codigo,
                           COALESCE("nome"::text, '') as nome,
                           COALESCE("data ativo"::text, '') as data_ativo,
                           COALESCE("instalacao"::text, '') as instalacao,
                           COALESCE("celular"::text, '') as celular,
                           COALESCE("cidade"::text, '') as cidade,
                           COALESCE("região"::text, '') as regiao,
                           COALESCE("média consumo"::text, '') as media_consumo,
                           COALESCE("devolutiva"::text, '') as devolutiva,
                           COALESCE("data cadastro"::text, '') as data_cadastro,
                           COALESCE("cpf"::text, '') as cpf,
                           COALESCE("numero cliente"::text, '') as numero_cliente,
                           COALESCE("data ult. alteração"::text, '') as data_ult_alteracao,
                           COALESCE("celular 2"::text, '') as celular_2,
                           COALESCE("email"::text, '') as email,
                           COALESCE("rg"::text, '') as rg,
                           COALESCE("orgão emissor"::text, '') as orgao_emissor,
                           COALESCE("data injeção"::text, '') as data_injecao,
                           COALESCE("id licenciado"::text, '') as id_licenciado,
                           COALESCE("licenciado"::text, '') as licenciado,
                           COALESCE("celular consultor"::text, '') as celular_consultor,
                           COALESCE("cep"::text, '') as cep,
                           COALESCE("endereco"::text, '') as endereco,
                           COALESCE("numero"::text, '') as numero,
                           COALESCE("bairro"::text, '') as bairro,
                           COALESCE("complemento"::text, '') as complemento,
                           COALESCE("cnpj"::text, '') as cnpj,
                           COALESCE("razao"::text, '') as razao,
                           COALESCE("fantasia"::text, '') as fantasia,
                           COALESCE("UF consumo"::text, '') as uf_consumo,
                           COALESCE("classificacao"::text, '') as classificacao,
                           COALESCE("chave contrato"::text, '') as chave_contrato,
                           COALESCE("chave assinatura cliente"::text, '') as chave_assinatura_cliente,
                           COALESCE("chave solatio"::text, '') as chave_solatio,
                           COALESCE("cashback"::text, '') as cashback,
                           COALESCE("codigo solatio"::text, '') as codigo_solatio,
                           COALESCE("enviado comerc"::text, '') as enviado_comerc,
                           COALESCE("obs"::text, '') as obs,
                           COALESCE("posvenda"::text, '') as posvenda,
                           COALESCE("retido"::text, '') as retido,
                           COALESCE("verificado"::text, '') as verificado,
                           COALESCE("rateio"::text, '') as rateio,
                           COALESCE("validado sucesso"::text, '') as validado_sucesso,
                           COALESCE("status sucesso"::text, '') as status_sucesso,
                           COALESCE("doc. enviado"::text, '') as doc_enviado,
                           COALESCE("link Documento"::text, '') as link_documento,
                           COALESCE("link Conta Energia"::text, '') as link_conta_energia,
                           COALESCE("link Cartão CNPJ"::text, '') as link_cartao_cnpj,
                           COALESCE("link Documento Frente"::text, '') as link_documento_frente,
                           COALESCE("link Documento Verso"::text, '') as link_documento_verso,
                           COALESCE("link Conta Energia 2"::text, '') as link_conta_energia_2,
                           COALESCE("link Contrato Social"::text, '') as link_contrato_social,
                           COALESCE("link Comprovante de pagamento"::text, '') as link_comprovante_pagamento,
                           COALESCE("link Estatuto Convenção"::text, '') as link_estatuto_convencao,
                           COALESCE("senha pdf"::text, '') as senha_pdf,
                           COALESCE("usuario ult alteracao"::text, '') as usuario_ult_alteracao,
                           COALESCE("elegibilidade"::text, '') as elegibilidade,
                           COALESCE("id plano club pj"::text, '') as id_plano_club_pj,
                           COALESCE("data cancelamento"::text, '') as data_cancelamento,
                           COALESCE("data ativação original"::text, '') as data_ativacao_original,
                           COALESCE("fornecedora"::text, '') as fornecedora,
                           COALESCE("desconto cliente"::text, '') as desconto_cliente,
                           COALESCE("data nascimento"::text, '') as data_nascimento,
                           COALESCE("Origem"::text, '') as origem,
                           COALESCE("Forma de pagamento"::text, '') as forma_pagamento,
                           COALESCE("Status Financeiro"::text, '') as status_financeiro,
                           COALESCE("Login Distribuidora"::text, '') as login_distribuidora,
                           COALESCE("Senha Distribuidora"::text, '') as senha_distribuidora,
                           COALESCE("Cliente"::text, '') as cliente,
                           COALESCE("Representante"::text, '') as representante,
                           COALESCE("nacionalidade"::text, '') as nacionalidade,
                           COALESCE("profissao"::text, '') as profissao,
                           COALESCE("estadocivil"::text, '') as estadocivil,
                           COALESCE("forma pagamento"::text, '') as forma_pagamento_2,
                           COALESCE("Observação Compartilhada"::text, '') as observacao_compartilhada,
                           COALESCE("Auto Conexão"::text, '') as auto_conexao,
                           COALESCE("Link assinatura"::text, '') as link_assinatura,
                           COALESCE("Link Documentos"::text, '') as link_documentos,
                           COALESCE("Data Validado Sucesso"::text, '') as data_validado_sucesso,
                           COALESCE("Devolutiva interna"::text, '') as devolutiva_interna
                    FROM public."V_CUSTOMER"
                    WHERE "data ativo" IS NOT NULL"""
                
                # Construir query final baseada nos parâmetros
                if consolidated:
                    print("Executando query consolidada...")
                    where_clause = ""
                else:
                    if date_filter:
                        year, month = date_filter.split('-')
                        date_format = f"{month}/{year}"
                        print(f"Executando query mensal: {date_format}")
                        where_clause = " AND to_char(\"data ativo\", 'MM/YYYY') = :date_format"
                    else:
                        return jsonify({'error': 'Filtro de data é obrigatório para consulta não consolidada'}), 400
                
                # Query completa com ordenação consistente
                full_query = base_select + where_clause + " ORDER BY \"código\" ASC"
                
                # Adicionar LIMIT apenas para prévia
                if preview:
                    full_query += " LIMIT 50"
                
                # Executar query
                if consolidated or not date_filter:
                    query_result = conn.execute(text(full_query))
                else:
                    query_result = conn.execute(text(full_query), {'date_format': date_format})
            
            if query_result is None:
                return jsonify({'error': 'Nenhum dado encontrado'}), 404
            
            # Obter dados
            print("Obtendo dados da query...")
            rows = query_result.fetchall()
            if not rows:
                return jsonify({'error': 'Nenhum registro encontrado'}), 404
            
            # Obter nomes das colunas
            column_names = list(query_result.keys())
            
            # Se for uma requisição de prévia, retornar dados em JSON
            if preview:
                print(f"Retornando prévia com {len(rows)} registros...")
                data = []
                for row in rows:
                    row_dict = {}
                    for i, value in enumerate(row):
                        row_dict[column_names[i]] = value if value else ''
                    data.append(row_dict)
                
                return jsonify({'data': data, 'count': len(data)}), 200
            
            # Caso contrário, gerar Excel
            print(f"Processando {len(rows)} registros para Excel...")
            
            # Criar arquivo Excel
            print("Criando arquivo Excel...")
            wb = Workbook()
            ws = wb.active
            
            # Nome da planilha
            sheet_name = 'Consolidado' if consolidated else date_filter.replace('-', '_')
            ws.title = sheet_name
            
            # Escrever cabeçalhos
            for col_idx, header in enumerate(column_names, 1):
                ws.cell(row=1, column=col_idx, value=str(header))
            
            # Escrever dados com tratamento robusto
            for row_idx, row_data in enumerate(rows, 2):
                if row_idx % 1000 == 0:  # Log a cada 1000 linhas
                    print(f"Processando linha {row_idx}...")
                
                for col_idx, cell_value in enumerate(row_data, 1):
                    try:
                        safe_value = safe_excel_value(cell_value)
                        ws.cell(row=row_idx, column=col_idx, value=safe_value)
                    except Exception as cell_error:
                        # Em caso de erro, usar string vazia
                        print(f"Erro na célula [{row_idx}, {col_idx}]: {str(cell_error)}")
                        ws.cell(row=row_idx, column=col_idx, value='')
            
            # Ajustar largura das colunas
            print("Ajustando largura das colunas...")
            for column_cells in ws.columns:
                length = max(len(str(cell.value or '')) for cell in column_cells)
                ws.column_dimensions[get_column_letter(column_cells[0].column)].width = min(length + 2, 50)
            
            # Salvar Excel em buffer
            print("Salvando arquivo Excel...")
            excel_buffer = io.BytesIO()
            wb.save(excel_buffer)
            excel_buffer.seek(0)
            
            # Nome do arquivo com timestamp
            from datetime import datetime
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            period = 'consolidado' if consolidated else date_filter.replace('-', '')
            filename = f"total_ativacoes_{period}_{timestamp}.xlsx"
            
            print(f"Enviando arquivo: {filename}")
            
            return send_file(
                excel_buffer,
                as_attachment=True,
                download_name=filename,
                mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            )
            
    except Exception as e:
        print(f"Erro geral em export_card_data para {card_name}: {str(e)}")
        print(f"Traceback: {traceback.format_exc()}")
        return jsonify({'error': f'Erro ao exportar dados: {str(e)}'}), 500


# ========================================
# FUNÇÕES AUXILIARES
# ========================================

def calc_variacao(atual, anterior):
    """Calcula variação percentual entre dois valores"""
    if anterior and anterior > 0:
        return round(((atual - anterior) / anterior) * 100, 2)
    return 0


def format_response_data(data, decimal_fields=None):
    """Formata dados da resposta convertendo Decimal para float"""
    if decimal_fields is None:
        decimal_fields = []
    
    if isinstance(data, list):
        return [format_response_data(item, decimal_fields) for item in data]
    elif isinstance(data, dict):
        formatted = {}
        for key, value in data.items():
            if key in decimal_fields and isinstance(value, Decimal):
                formatted[key] = decimal_to_float(value)
            elif isinstance(value, (dict, list)):
                formatted[key] = format_response_data(value, decimal_fields)
            else:
                formatted[key] = decimal_to_float(value) if isinstance(value, Decimal) else value
        return formatted
    else:
        return decimal_to_float(data) if isinstance(data, Decimal) else data