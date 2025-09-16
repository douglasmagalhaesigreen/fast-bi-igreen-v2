"""
Serviço para leitura de dados do banco (somente leitura)
"""
import psycopg2
import pandas as pd
from flask import current_app
import os
from datetime import datetime, timedelta

class DataService:
    @staticmethod
    def get_connection():
        """Criar conexão com o banco"""
        return psycopg2.connect(
            host=os.environ.get('DB_HOST', '162.141.111.95'),
            port=os.environ.get('DB_PORT', '5432'),
            database=os.environ.get('DB_NAME', 'IGREEN'),
            user=os.environ.get('DB_USER', 'bi_igreen'),
            password=os.environ.get('DB_PASSWORD', 'iGr33n@2025')
        )
    
    @staticmethod
    def execute_query(query, params=None):
        """Executar query e retornar resultados"""
        conn = DataService.get_connection()
        try:
            df = pd.read_sql_query(query, conn, params=params)
            return df.to_dict('records')
        finally:
            conn.close()
    
    @staticmethod
    def get_dashboard_metrics():
        """Buscar métricas do dashboard"""
        # Queries genéricas que devem funcionar com qualquer estrutura
        metrics = {
            'kwhTotal': 1234567,  # Valor default
            'clientesAtivos': 892,
            'clientesNovos': 45,
            'faturamento': 2456789,
            'consumoMedio': 342,
            'eficiencia': 94.5,
            'alertas': 3
        }
        
        try:
            # Tentar buscar dados reais se houver tabelas
            conn = DataService.get_connection()
            cursor = conn.cursor()
            
            # Verificar se existe tabela de clientes
            cursor.execute("""
                SELECT COUNT(*) as total 
                FROM information_schema.tables 
                WHERE table_name LIKE '%client%' 
                OR table_name LIKE '%cliente%'
            """)
            
            if cursor.fetchone()[0] > 0:
                # Temos tabelas, vamos tentar queries
                try:
                    cursor.execute("SELECT COUNT(*) FROM public.clientes WHERE ativo = true")
                    metrics['clientesAtivos'] = cursor.fetchone()[0]
                except:
                    pass
                
                try:
                    # Consumo total
                    cursor.execute("""
                        SELECT SUM(kwh) 
                        FROM public.consumo 
                        WHERE data >= CURRENT_DATE - INTERVAL '30 days'
                    """)
                    result = cursor.fetchone()
                    if result[0]:
                        metrics['kwhTotal'] = int(result[0])
                except:
                    pass
            
            cursor.close()
            conn.close()
            
        except Exception as e:
            print(f"Usando dados mock: {e}")
        
        return metrics
    
    @staticmethod
    def get_chart_data():
        """Buscar dados para gráficos"""
        # Dados padrão
        data = {
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
            ]
        }
        
        try:
            # Tentar buscar dados reais se disponível
            conn = DataService.get_connection()
            cursor = conn.cursor()
            
            # Query exemplo para consumo mensal (adaptar conforme estrutura real)
            cursor.execute("""
                SELECT 
                    EXTRACT(MONTH FROM data) as mes,
                    SUM(kwh) as consumo
                FROM public.consumo
                WHERE data >= CURRENT_DATE - INTERVAL '6 months'
                GROUP BY EXTRACT(MONTH FROM data)
                ORDER BY mes
            """)
            
            # Se conseguir dados, usar eles
            results = cursor.fetchall()
            if results:
                meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
                data['consumoMensal'] = []
                for mes_num, consumo in results:
                    data['consumoMensal'].append({
                        'mes': meses[int(mes_num)-1],
                        'consumo': float(consumo),
                        'meta': float(consumo) * 0.95
                    })
            
            cursor.close()
            conn.close()
            
        except Exception as e:
            print(f"Usando dados mock para gráficos: {e}")
        
        return data
