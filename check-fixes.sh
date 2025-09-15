#!/bin/bash

echo "Verificando correções aplicadas..."

# Verificar Tooltips
if grep -q "labelStyle.*color.*#fff" src/components/charts/LineChartComponent.jsx; then
  echo "✅ Tooltip do LineChart corrigido"
else
  echo "❌ Tooltip do LineChart precisa correção"
fi

if grep -q "labelStyle.*color.*#fff" src/components/charts/BarChartComponent.jsx; then
  echo "✅ Tooltip do BarChart corrigido"
else
  echo "❌ Tooltip do BarChart precisa correção"
fi

if grep -q "labelStyle.*color.*#fff" src/components/charts/PieChartComponent.jsx; then
  echo "✅ Tooltip do PieChart corrigido"
else
  echo "❌ Tooltip do PieChart precisa correção"
fi

# Verificar menu lateral
if grep -q "h-screen.*fixed.*left-0.*top-0" src/App.jsx; then
  echo "✅ Menu lateral fixo aplicado"
else
  echo "❌ Menu lateral precisa ser fixado"
fi

echo "Verificação completa!"
