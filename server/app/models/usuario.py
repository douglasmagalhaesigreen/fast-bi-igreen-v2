from app import db
from flask_bcrypt import Bcrypt
from datetime import datetime

bcrypt = Bcrypt()

class Usuario(db.Model):
    __tablename__ = 'USUARIOS'  # Nome exato da tabela em maiúscula
    __table_args__ = {'schema': 'public', 'extend_existing': True}
    
    codigo = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(255))
    email = db.Column(db.String(255), nullable=False)
    password = db.Column(db.String(255))  # Campo com senha bcrypt
    senha = db.Column(db.String(255))  # Campo legado
    administrador = db.Column(db.String(1))
    master = db.Column(db.String(1))
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime)
    updated_at = db.Column(db.DateTime)
    
    def check_password(self, password_input):
        """Verifica se a senha está correta"""
        if self.password:
            try:
                # Bcrypt precisa de bytes
                return bcrypt.check_password_hash(self.password, password_input)
            except Exception as e:
                print(f"Erro ao verificar senha: {e}")
                return False
        return False
    
    def to_dict(self):
        return {
            'codigo': self.codigo,
            'nome': self.nome,
            'email': self.email,
            'is_admin': self.administrador == 'S' if self.administrador else False,
            'is_master': self.master == 'S' if self.master else False,
            'is_active': self.is_active if self.is_active is not None else True
        }
