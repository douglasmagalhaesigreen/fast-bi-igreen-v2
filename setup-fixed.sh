#!/bin/bash

# ===========================================
# FAST BI IGREEN V2 - SCRIPT DE SETUP CORRIGIDO
# ===========================================

set -e  # Parar em caso de erro

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para print colorido
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Verificar se está no diretório correto
if [ ! -f "package.json" ]; then
    print_error "package.json não encontrado! Execute este script na raiz do projeto fast-bi-igreen-v2"
    exit 1
fi

print_status "🚀 Iniciando setup do Fast BI iGreen v2 (VERSÃO CORRIGIDA)..."

# ===========================================
# PASSO 1: BACKUP DOS ARQUIVOS EXISTENTES
# ===========================================
print_step "1. Criando backup dos arquivos existentes..."

BACKUP_DIR="backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

# Fazer backup dos arquivos que serão substituídos
[ -f "src/App.jsx" ] && cp "src/App.jsx" "$BACKUP_DIR/App.jsx.backup"
[ -f "package.json" ] && cp "package.json" "$BACKUP_DIR/package.json.backup"
[ -f "README.md" ] && cp "README.md" "$BACKUP_DIR/README.md.backup"

print_status "Backup criado em: $BACKUP_DIR"

# ===========================================
# PASSO 2: LIMPAR DEPENDÊNCIAS CONFLITANTES
# ===========================================
print_step "2. Limpando dependências conflitantes..."

# Remover node_modules e package-lock.json para evitar conflitos
if [ -d "node_modules" ]; then
    print_status "Removendo node_modules antigo..."
    rm -rf node_modules
fi

if [ -f "package-lock.json" ]; then
    print_status "Removendo package-lock.json..."
    rm -f package-lock.json
fi

if [ -f "yarn.lock" ]; then
    print_status "Removendo yarn.lock..."
    rm -f yarn.lock
fi

# ===========================================
# PASSO 3: CRIAR ESTRUTURA DE DIRETÓRIOS
# ===========================================
print_step "3. Criando estrutura de diretórios..."

mkdir -p src/hooks
mkdir -p src/utils  
mkdir -p src/contexts
mkdir -p src/components
mkdir -p src/pages

print_status "Estrutura de diretórios criada"

# ===========================================
# PASSO 4: CRIAR ARQUIVOS DE CONFIGURAÇÃO
# ===========================================
print_step "4. Criando arquivos de configuração..."

# .env.example
cat > .env.example << 'EOF'
# Configurações do Banco de Dados
DB_HOST=localhost
DB_PORT=5432
DB_NAME=igreen_db
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_SSL=false

# Configurações de Segurança
JWT_SECRET=seu_jwt_secret_muito_seguro_aqui
PORT=3001

# Ambiente
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
EOF

# .env (se não existir)
if [ ! -f ".env" ]; then
    cp .env.example .env
    print_warning "Arquivo .env criado. IMPORTANTE: Configure suas credenciais reais!"
fi

# vite.config.js
cat > vite.config.js << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['recharts']
        }
      }
    }
  }
})
EOF

# tailwind.config.js
cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
EOF

# postcss.config.js
cat > postcss.config.js << 'EOF'
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF

print_status "Arquivos de configuração criados"

# ===========================================
# PASSO 5: CRIAR index.html
# ===========================================
if [ ! -f "index.html" ]; then
    print_step "5. Criando index.html..."
    
cat > index.html << 'EOF'
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Fast BI iGreen v2</title>
    <meta name="description" content="Dashboard de BI para monitoramento de energia elétrica" />
    <meta name="keywords" content="bi, dashboard, energia, igreen" />
</head>
<body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
</body>
</html>
EOF

    print_status "index.html criado"
else
    print_status "index.html já existe, mantendo o atual"
fi

# ===========================================
# PASSO 6: CRIAR ARQUIVOS REACT BASE
# ===========================================
print_step "6. Criando arquivos React base..."

# src/main.jsx
cat > src/main.jsx << 'EOF'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
EOF

# src/index.css
cat > src/index.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

html.dark {
  color-scheme: dark;
}

html.light {
  color-scheme: light;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 
               'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  box-sizing: border-box;
}

/* Scrollbar personalizada */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  @apply bg-gray-100 dark:bg-gray-800;
}

::-webkit-scrollbar-thumb {
  @apply bg-gray-300 dark:bg-gray-600 rounded-full;
}

::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-400 dark:bg-gray-500;
}

/* Animações personalizadas */
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.shimmer {
  animation: shimmer 2s infinite;
}
EOF

print_status "Arquivos React base criados"

# ===========================================
# PASSO 7: ATUALIZAR PACKAGE.JSON COM VERSÕES COMPATÍVEIS
# ===========================================
print_step "7. Atualizando package.json com versões compatíveis..."

# Detectar versão atual do React se existir
CURRENT_REACT_VERSION="18.2.0"
if [ -f "package.json" ]; then
    EXISTING_REACT=$(grep -o '"react": "[^"]*"' package.json | sed 's/"react": "//g' | sed 's/"//g' || echo "18.2.0")
    if [[ $EXISTING_REACT != *"^"* ]]; then
        CURRENT_REACT_VERSION=$EXISTING_REACT
    else
        CURRENT_REACT_VERSION=$(echo $EXISTING_REACT | sed 's/\^//g')
    fi
fi

print_status "Usando React versão: $CURRENT_REACT_VERSION"

# Criar package.json com versões compatíveis
cat > package.json << EOF
{
  "name": "fast-bi-igreen-v2",
  "version": "2.0.0",
  "description": "Dashboard de BI para monitoramento de energia elétrica",
  "main": "server.js",
  "type": "module",
  "scripts": {
    "dev": "concurrently \"npm run server\" \"npm run client\"",
    "server": "nodemon server.js",
    "client": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "start": "node server.js",
    "setup": "./setup.sh",
    "db:setup": "psql -f setup-database.sql"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "pg": "^8.11.3",
    "bcrypt": "^5.1.1",
    "jsonwebtoken": "^9.0.2",
    "dotenv": "^16.3.1",
    "helmet": "^7.0.0",
    "express-rate-limit": "^6.10.0",
    "react": "$CURRENT_REACT_VERSION",
    "react-dom": "$CURRENT_REACT_VERSION",
    "recharts": "^2.8.0",
    "lucide-react": "^0.400.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.37",
    "@types/react-dom": "^18.2.15",
    "@vitejs/plugin-react": "^4.1.1",
    "autoprefixer": "^10.4.16",
    "concurrently": "^8.2.2",
    "nodemon": "^3.0.1",
    "postcss": "^8.4.31",
    "tailwindcss": "^3.3.5",
    "vite": "^4.5.0"
  },
  "keywords": [
    "bi",
    "dashboard",
    "energy",
    "postgresql",
    "react",
    "igreen"
  ],
  "author": "Douglas MSI Green",
  "license": "MIT"
}
EOF

print_status "package.json atualizado com versões compatíveis"

# ===========================================
# PASSO 8: CRIAR HOOKS
# ===========================================
print_step "8. Criando hooks personalizados..."

# src/hooks/useApi.js - Versão básica para funcionar
cat > src/hooks/useApi.js << 'EOF'
import { useState, useEffect, useCallback } from 'react';

const API_BASE_URL = import.meta.env.NODE_ENV === 'production' 
  ? 'https://seu-dominio.com/api' 
  : 'http://localhost:3001/api';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('fast-bi-token');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('fast-bi-token', token);
  }

  removeToken() {
    this.token = null;
    localStorage.removeItem('fast-bi-token');
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (this.token) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, config);
      
      if (response.status === 401) {
        this.removeToken();
        window.location.reload();
        return null;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const apiClient = new ApiClient();

export const useApi = (endpoint, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { immediate = true, dependencies = [] } = options;

  const execute = useCallback(async () => {
    if (!endpoint) return;

    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get(endpoint);
      setData(response);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    if (immediate && endpoint) {
      execute();
    }
  }, [execute, immediate, ...dependencies]);

  return { data, loading, error, execute };
};

export const useDashboardMetrics = () => useApi('/dashboard/metrics');
export const useMonthlyData = () => useApi('/dashboard/monthly-data');
export const useRegionalData = () => useApi('/dashboard/regional-data');
EOF

# src/utils/formatters.js
cat > src/utils/formatters.js << 'EOF'
export const formatters = {
  currency: (value, locale = 'pt-BR', currency = 'BRL') => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
    }).format(value);
  },

  number: (value, locale = 'pt-BR') => {
    return new Intl.NumberFormat(locale).format(value);
  },

  percentage: (value, decimals = 1) => {
    return `${Number(value).toFixed(decimals)}%`;
  },

  energy: (value) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M kWh`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}k kWh`;
    }
    return `${value} kWh`;
  }
};
EOF

print_status "Hooks e utils criados"

# ===========================================
# PASSO 9: CRIAR ARQUIVO .gitignore
# ===========================================
if [ ! -f ".gitignore" ]; then
    print_step "9. Criando .gitignore..."
    
cat > .gitignore << 'EOF'
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Dependency directories
node_modules/
jspm_packages/

# Optional npm cache directory
.npm

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env
.env.test
.env.production

# Build output
dist/
build/

# Editor directories and files
.vscode/
.idea/
*.swp
*.swo
*~

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Coverage directory used by tools like istanbul
coverage/

# ESLint cache
.eslintcache

# Backup files
backup_*/
*.backup
EOF

    print_status ".gitignore criado"
fi

# ===========================================
# PASSO 10: CONFIGURAÇÃO DO BANCO DE DADOS
# ===========================================
print_step "10. Configuração do banco de dados..."

print_warning "ATENÇÃO: Configure suas credenciais do banco no arquivo .env"
print_status "Exemplo de configuração:"
echo "DB_HOST=localhost"
echo "DB_PORT=5432" 
echo "DB_NAME=seu_banco_igreen"
echo "DB_USER=seu_usuario"
echo "DB_PASSWORD=sua_senha"
echo ""

read -p "Deseja configurar as credenciais agora? (y/n): " configure_db

if [ "$configure_db" = "y" ] || [ "$configure_db" = "Y" ]; then
    read -p "Host do banco (localhost): " db_host
    db_host=${db_host:-localhost}
    
    read -p "Porta do banco (5432): " db_port  
    db_port=${db_port:-5432}
    
    read -p "Nome do banco: " db_name
    
    read -p "Usuário do banco: " db_user
    
    read -s -p "Senha do banco: " db_password
    echo ""
    
    read -p "JWT Secret (deixe em branco para gerar automático): " jwt_secret
    if [ -z "$jwt_secret" ]; then
        jwt_secret=$(openssl rand -base64 32 2>/dev/null || date | md5sum | cut -d' ' -f1)
    fi
    
    # Atualizar .env
    sed -i.bak "s/DB_HOST=.*/DB_HOST=$db_host/" .env
    sed -i.bak "s/DB_PORT=.*/DB_PORT=$db_port/" .env
    sed -i.bak "s/DB_NAME=.*/DB_NAME=$db_name/" .env
    sed -i.bak "s/DB_USER=.*/DB_USER=$db_user/" .env
    sed -i.bak "s/DB_PASSWORD=.*/DB_PASSWORD=$db_password/" .env
    sed -i.bak "s/JWT_SECRET=.*/JWT_SECRET=$jwt_secret/" .env
    
    rm .env.bak
    print_status "Credenciais configuradas no .env"
fi

# ===========================================
# PASSO 11: INSTALAR DEPENDÊNCIAS COM --legacy-peer-deps
# ===========================================
print_step "11. Instalando dependências com resolução de conflitos..."

if command -v npm >/dev/null 2>&1; then
    print_status "Instalando com --legacy-peer-deps para resolver conflitos..."
    npm install --legacy-peer-deps
    
    if [ $? -eq 0 ]; then
        print_status "✅ Dependências instaladas com sucesso"
    else
        print_warning "⚠️  Tentando instalação alternativa..."
        npm install --force
        
        if [ $? -eq 0 ]; then
            print_status "✅ Dependências instaladas com --force"
        else
            print_error "❌ Erro na instalação das dependências"
            print_warning "Tente executar manualmente: npm install --legacy-peer-deps"
        fi
    fi
else
    print_error "NPM não encontrado! Instale o Node.js primeiro"
    exit 1
fi

# ===========================================
# PASSO 12: CRIAR TEMPLATES DOS ARQUIVOS PRINCIPAIS
# ===========================================
print_step "12. Criando templates dos arquivos principais..."

# Template server.js
cat > server.js << 'EOF'
// =============================================
// COPIE AQUI O CÓDIGO DO ARTEFATO:
// "Backend API - Estrutura para PostgreSQL"
// =============================================

console.log('⚠️  ATENÇÃO: Copie o código do artefato "Backend API" aqui!');
console.log('📝 Execute: ./copy-artifacts.sh para ver instruções detalhadas');
// process.exit(1);
EOF

# Template setup-database.sql
cat > setup-database.sql << 'EOF'
-- =============================================
-- COPIE AQUI O CÓDIGO DO ARTEFATO:
-- "Scripts SQL para Setup do Fast BI"
-- =============================================

-- IMPORTANTE: Execute este script no seu PostgreSQL
-- após copiar o código completo do artefato
EOF

# App.jsx básico para não dar erro
if [ ! -f "src/App.jsx" ] || grep -q "COPIE AQUI" src/App.jsx; then
cat > src/App.jsx << 'EOF'
// =============================================
// COPIE AQUI O CÓDIGO DO ARTEFATO:  
// "Fast BI iGreen v2 - Sistema Completo"
// =============================================

import React from 'react';

export default function App() {
  return (
    <div style={{ 
      padding: '40px', 
      textAlign: 'center', 
      fontFamily: 'system-ui',
      backgroundColor: '#f0f9ff',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        maxWidth: '500px'
      }}>
        <h1 style={{color: '#059669', marginBottom: '20px'}}>⚠️ Setup Incompleto</h1>
        <p style={{color: '#374151', marginBottom: '15px'}}>
          <strong>Copie o código do artefato "Fast BI iGreen v2 - Sistema Completo" aqui!</strong>
        </p>
        <div style={{
          backgroundColor: '#fef3c7',
          padding: '15px',
          borderRadius: '8px',
          border: '1px solid #f59e0b',
          marginTop: '20px'
        }}>
          <p style={{color: '#92400e', margin: 0, fontSize: '14px'}}>
            📝 Execute: <code>./copy-artifacts.sh</code> para ver instruções detalhadas
          </p>
        </div>
      </div>
    </div>
  );
}
EOF
fi

print_status "Templates criados"

# ===========================================
# PASSO 13: MENSAGEM FINAL
# ===========================================
print_status "🎉 Setup concluído com sucesso!"
echo ""
print_step "Próximos passos:"
echo "1. Execute: ./copy-artifacts.sh (para ver instruções de cópia)"
echo "2. Copie os códigos dos artefatos conforme instruções"
echo "3. Execute o script SQL: psql -U seu_usuario -d seu_banco -f setup-database.sql"
echo "4. Execute: npm run dev"
echo ""
print_status "✅ Problemas de conflito de dependências resolvidos!"
print_status "✅ React e Lucide-React com versões compatíveis"
print_status "✅ Instalação realizada com --legacy-peer-deps"
echo ""
print_status "Arquivos de backup salvos em: $BACKUP_DIR"
echo ""
print_warning "🔗 IMPORTANTE: Execute './copy-artifacts.sh' para continuar!"
