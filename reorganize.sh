#!/bin/bash

echo "🚀 Iniciando a reorganização da estrutura de pastas do projeto..."
echo "================================================================"

# --- 1. Criar a nova estrutura de pastas ---
echo "📁 Criando novas pastas..."
mkdir -p src/components/ui
mkdir -p src/components/layout
mkdir -p src/features/auth/components
mkdir -p src/features/dashboard
mkdir -p src/features/reports
mkdir -p src/features/map
mkdir -p src/features/settings

# --- 2. Mover os arquivos existentes ---
echo "🚚 Movendo arquivos para seus novos locais..."

# Mover páginas para dentro de 'features'
if [ -f "src/pages/Login.jsx" ]; then
    mv src/pages/Login.jsx src/features/auth/Login.jsx
    echo "   - Login.jsx movido para src/features/auth/"
fi

if [ -f "src/pages/Dashboard.jsx" ]; then
    mv src/pages/Dashboard.jsx src/features/dashboard/Dashboard.jsx
    echo "   - Dashboard.jsx movido para src/features/dashboard/"
fi

if [ -f "src/pages/Reports.jsx" ]; then
    mv src/pages/Reports.jsx src/features/reports/Reports.jsx
    echo "   - Reports.jsx movido para src/features/reports/"
fi

if [ -f "src/pages/Map.jsx" ]; then
    mv src/pages/Map.jsx src/features/map/Map.jsx
    echo "   - Map.jsx movido para src/features/map/"
fi

if [ -f "src/pages/Settings.jsx" ]; then
    mv src/pages/Settings.jsx src/features/settings/Settings.jsx
    echo "   - Settings.jsx movido para src/features/settings/"
fi

# Mover layouts para 'components/layout'
if [ -f "src/layouts/MainLayout.jsx" ]; then
    mv src/layouts/MainLayout.jsx src/components/layout/MainLayout.jsx
    echo "   - MainLayout.jsx movido para src/components/layout/"
fi

# Mover ProtectedRoute para 'features/auth/components'
if [ -f "src/components/auth/ProtectedRoute.jsx" ]; then
    mv src/components/auth/ProtectedRoute.jsx src/features/auth/components/ProtectedRoute.jsx
    echo "   - ProtectedRoute.jsx movido para src/features/auth/components/"
fi

# --- 3. Limpeza (Opcional) ---
# Remove as pastas antigas se estiverem vazias
echo "🧹 Limpando pastas antigas..."
rmdir src/pages 2>/dev/null && echo "   - Pasta src/pages/ removida."
rmdir src/layouts 2>/dev/null && echo "   - Pasta src/layouts/ removida."
rmdir src/components/auth 2>/dev/null && echo "   - Pasta src/components/auth/ removida."


echo "================================================================"
echo "✅ Reorganização concluída!"
echo ""