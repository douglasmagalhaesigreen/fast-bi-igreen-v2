#!/bin/bash

echo "🚀 Iniciando setup completo do Fast BI iGreen v2..."
echo "================================================"

# 1. CRIAR ESTRUTURA DE PASTAS
echo "📁 Criando estrutura de pastas..."
mkdir -p src/{styles,components,contexts,hooks,layouts,pages,services,utils}
mkdir -p src/components/{auth,common,charts,dashboard}

# 2. CRIAR ARQUIVOS DE CONFIGURAÇÃO
echo "⚙️ Criando arquivos de configuração..."

# tailwind.config.js
cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#10b981',
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
      },
    },
  },
  plugins: [],
}
