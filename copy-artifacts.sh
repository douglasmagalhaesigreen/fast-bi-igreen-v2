#!/bin/bash

# ===========================================
# SCRIPT PARA COPIAR CÓDIGOS DOS ARTEFATOS
# ===========================================

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() { echo -e "${GREEN}[INFO]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
print_error() { echo -e "${RED}[ERROR]${NC} $1"; }
print_step() { echo -e "${BLUE}[STEP]${NC} $1"; }

print_status "🔄 Copiando códigos dos artefatos Claude..."

# ===========================================
# VERIFICAR SE ESTAMOS NO DIRETÓRIO CORRETO
# ===========================================
if [ ! -f "package.json" ]; then
    print_error "Execute este script na raiz do projeto!"
    exit 1
fi

# ===========================================
# INSTRUÇÕES PARA O USUÁRIO
# ===========================================
print_step "INSTRUÇÕES PARA COPIAR OS ARTEFATOS:"
echo ""
print_warning "Você precisa copiar manualmente os seguintes códigos do Claude:"
echo ""

echo "📄 ARQUIVO: server.js (na raiz)"
echo "   👉 Copie TODO o código do artefato 'Backend API - Estrutura para PostgreSQL'"
echo ""

echo "📄 ARQUIVO: src/App.jsx"  
echo "   👉 Copie TODO o código do artefato 'Fast BI iGreen v2 - Sistema Completo'"
echo ""

echo "📄 ARQUIVO: setup-database.sql (na raiz)"
echo "   👉 Copie TODO o código do artefato 'Scripts SQL para Setup do Fast BI'"
echo ""

echo "📄 ARQUIVO: src/hooks/useApi.js (SUBSTITUIR o existente)"
echo "   👉 Copie TODO o código do artefato 'Hooks React para API Integration'"
echo ""

print_step "PASSO A PASSO:"
echo ""
echo "1️⃣  Abra o Claude e localize os artefatos mencionados acima"
echo "2️⃣  Para cada arquivo, copie TODO o conteúdo do artefato"
echo "3️⃣  Cole no arquivo correspondente do seu projeto"
echo "4️⃣  Salve todos os arquivos"
echo "5️⃣  Execute: npm run dev"
echo ""

# ===========================================
# CRIAR TEMPLATE DOS ARQUIVOS PRINCIPAIS
# ===========================================
print_step "Criando templates dos arquivos principais..."

# Template server.js
if [ ! -f "server.js" ] || [ ! -s "server.js" ]; then
cat > server.js << 'EOF'
// =============================================
// COPIE AQUI O CÓDIGO DO ARTEFATO:
// "Backend API - Estrutura para PostgreSQL"
// =============================================

console.log('⚠️  ATENÇÃO: Copie o código do artefato "Backend API" aqui!');
process.exit(1);
EOF
fi

# Template setup-database.sql
if [ ! -f "setup-database.sql" ] || [ ! -s "setup-database.sql" ]; then
cat > setup-database.sql << 'EOF'
-- =============================================
-- COPIE AQUI O CÓDIGO DO ARTEFATO:
-- "Scripts SQL para Setup do Fast BI"
-- =============================================

-- IMPORTANTE: Execute este script no seu PostgreSQL
-- após copiar o código completo do artefato
EOF
fi

# Verificar se App.jsx existe
if [ ! -f "src/App.jsx" ]; then
cat > src/App.jsx << 'EOF'
// =============================================
// COPIE AQUI O CÓDIGO DO ARTEFATO:  
// "Fast BI iGreen v2 - Sistema Completo"
// =============================================

import React from 'react';

export default function App() {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>⚠️ ATENÇÃO</h1>
      <p>Copie o código do artefato "Fast BI iGreen v2 - Sistema Completo" aqui!</p>
    </div>
  );
}
EOF
fi

print_status "Templates criados"

# ===========================================
# VERIFICAR ARQUIVOS CRIADOS
# ===========================================
print_step "Verificando estrutura criada:"

check_file() {
    if [ -f "$1" ]; then
        echo "✅ $1"
    else
        echo "❌ $1 (FALTANDO)"
    fi
}

echo ""
echo "📁 Arquivos de configuração:"
check_file "package.json"
check_file ".env"
check_file "vite.config.js"
check_file "tailwind.config.js"
check_file "postcss.config.js"

echo ""
echo "📁 Arquivos principais:"
check_file "server.js"
check_file "setup-database.sql"
check_file "index.html"

echo ""
echo "📁 Arquivos React:"
check_file "src/main.jsx"
check_file "src/index.css"
check_file "src/App.jsx"

echo ""
echo "📁 Hooks e Utils:"
check_file "src/hooks/useApi.js"
check_file "src/utils/formatters.js"

# ===========================================
# COMANDOS FINAIS
# ===========================================
print_step "Comandos para depois de copiar os códigos:"
echo ""
echo "# 1. Executar SQL no PostgreSQL:"
echo "psql -U seu_usuario -d seu_banco -f setup-database.sql"
echo ""
echo "# 2. Iniciar o projeto:"
echo "npm run dev"
echo ""
echo "# 3. Ou separadamente:"
echo "npm run server  # Terminal 1"
echo "npm run client  # Terminal 2"
echo ""

print_warning "⚠️  NÃO ESQUEÇA de configurar o arquivo .env com suas credenciais reais!"

# ===========================================
# CRIAR CHECKLIST
# ===========================================
cat > CHECKLIST.md << 'EOF'
# 📋 CHECKLIST - Fast BI iGreen v2

## ✅ Setup Estrutura (Concluído pelo script)
- [x] Estrutura de diretórios criada
- [x] package.json atualizado
- [x] Arquivos de configuração criados
- [x] Dependências instaladas

## 📝 PENDENTE - Copiar Códigos dos Artefatos

### 🔴 CRÍTICO - Arquivos Principais
- [ ] **server.js** - Copiar código do artefato "Backend API - Estrutura para PostgreSQL"
- [ ] **src/App.jsx** - Copiar código do artefato "Fast BI iGreen v2 - Sistema Completo"  
- [ ] **setup-database.sql** - Copiar código do artefato "Scripts SQL para Setup do Fast BI"

### 🟡 IMPORTANTE - Hooks e Utils
- [ ] **src/hooks/useApi.js** - Copiar código do artefato "Hooks React para API Integration"

### ⚙️ Configuração
- [ ] Configurar credenciais no arquivo **.env**
- [ ] Executar SQL no PostgreSQL: `psql -U usuario -d banco -f setup-database.sql`

### 🧪 Testes
- [ ] Executar `npm run dev`
- [ ] Testar login com: admin@igreen.com / 123456
- [ ] Verificar se o dashboard carrega
- [ ] Testar modo TV

## 🚨 Em caso de problemas:
1. Verificar logs do servidor: `npm run server`
2. Verificar console do navegador
3. Confirmar se o banco está rodando
4. Verificar credenciais no .env
EOF

print_status "Checklist criado em: CHECKLIST.md"
print_status "🎯 Agora copie os códigos dos artefatos conforme as instruções acima!"
