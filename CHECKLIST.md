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
