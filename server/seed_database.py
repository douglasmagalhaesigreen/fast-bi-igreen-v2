#!/usr/bin/env python
"""
Script para popular o banco com dados de teste
"""
import os
import sys
import random
from datetime import datetime, timedelta

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app, db
from app.models import User, Client, Consumption

app = create_app('development')

def seed_database():
    with app.app_context():
        # Limpar tabelas existentes
        print("🗑️  Limpando tabelas existentes...")
        db.drop_all()
        db.create_all()
        
        # Criar usuário admin
        print("👤 Criando usuário admin...")
        admin = User(
            name='Administrador',
            email='admin@igreen.com',
            role='admin'
        )
        admin.set_password('123456')
        db.session.add(admin)
        
        # Criar clientes de teste
        print("👥 Criando clientes...")
        regions = ['Norte', 'Nordeste', 'Centro-Oeste', 'Sudeste', 'Sul']
        types = ['Residencial', 'Comercial', 'Industrial']
        
        clients = []
        for i in range(50):
            client = Client(
                name=f'Cliente {i+1}',
                email=f'cliente{i+1}@example.com',
                phone=f'11{90000000+i}',
                document=f'{10000000000+i}',
                type=random.choice(types),
                region=random.choice(regions),
                active=random.choice([True, True, True, False])  # 75% ativos
            )
            clients.append(client)
            db.session.add(client)
        
        db.session.commit()
        
        # Criar consumos
        print("⚡ Criando dados de consumo...")
        for client in clients:
            # Últimos 6 meses de consumo
            for month_offset in range(6):
                date = datetime.now() - timedelta(days=30*month_offset)
                
                base_kwh = {
                    'Residencial': 200,
                    'Comercial': 500,
                    'Industrial': 2000
                }.get(client.type, 300)
                
                consumption = Consumption(
                    client_id=client.id,
                    month=date.month,
                    year=date.year,
                    kwh=base_kwh + random.uniform(-50, 100),
                    value=(base_kwh + random.uniform(-50, 100)) * 0.75
                )
                db.session.add(consumption)
        
        db.session.commit()
        print("✅ Banco de dados populado com sucesso!")
        
        # Estatísticas
        print("\n📊 Estatísticas:")
        print(f"   Usuários: {User.query.count()}")
        print(f"   Clientes: {Client.query.count()}")
        print(f"   Registros de consumo: {Consumption.query.count()}")

if __name__ == '__main__':
    seed_database()
