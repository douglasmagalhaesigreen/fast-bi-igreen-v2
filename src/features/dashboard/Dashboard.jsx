import React from 'react';
import { 
  Activity, Users, DollarSign, TrendingUp, 
  Battery, AlertTriangle, Zap, PieChart 
} from 'lucide-react';
import MetricCard from '../../components/dashboard/MetricCard';
import LineChartComponent from '../../components/charts/LineChartComponent';
import BarChartComponent from '../../components/charts/BarChartComponent';
import PieChartComponent from '../../components/charts/PieChartComponent';
import { useDashboardMetrics, useDashboardCharts } from '../../hooks/useDashboardData';
import { Loader2 } from 'lucide-react';

const Dashboard = () => {
  const { data: metrics, isLoading: metricsLoading } = useDashboardMetrics();
  const { consumoMensal, distribuicaoRegional } = useDashboardCharts();

  if (metricsLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-green-500" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard Principal
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Visão geral do sistema iGreen Energy
        </p>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Clientes Ativos"
          value={metrics?.clientes_ativos}
          change={metrics?.crescimento_clientes}
          icon={Users}
          color="blue"
          format="number"
        />
        <MetricCard
          title="Consumo Total"
          value={metrics?.consumo_kwh}
          icon={Zap}
          color="green"
          format="kwh"
        />
        <MetricCard
          title="Faturamento"
          value={metrics?.faturamento}
          icon={DollarSign}
          color="purple"
          format="currency"
        />
        <MetricCard
          title="Economia Gerada"
          value={metrics?.economia_gerada}
          icon={TrendingUp}
          color="teal"
          format="currency"
        />
      </div>

      {/* Métricas Secundárias */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Clientes Faturados"
          value={metrics?.clientes_faturados}
          icon={Activity}
          color="orange"
          format="number"
        />
        <MetricCard
          title="Ticket Médio"
          value={metrics?.ticket_medio}
          icon={PieChart}
          color="pink"
          format="currency"
        />
        <MetricCard
          title="Taxa Inadimplência"
          value={metrics?.taxa_inadimplencia}
          icon={AlertTriangle}
          color="orange"
          format="percent"
        />
        <MetricCard
          title="Novos Clientes"
          value={metrics?.novos_clientes_mes}
          change={metrics?.crescimento_clientes}
          icon={Users}
          color="green"
          format="number"
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {consumoMensal.data && (
          <LineChartComponent
            data={consumoMensal.data}
            title="Evolução do Consumo Mensal"
            dataKey="consumo_total"
            xAxisKey="mes"
          />
        )}
        
        {distribuicaoRegional.data && (
          <BarChartComponent
            data={distribuicaoRegional.data.por_regiao || []}
            title="Distribuição por Região"
            dataKey="clientes"
            xAxisKey="regiao"
          />
        )}
      </div>

      {/* Gráfico de Pizza */}
      {distribuicaoRegional.data && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PieChartComponent
            data={distribuicaoRegional.data.por_regiao || []}
            title="Distribuição de Clientes por Região"
            dataKey="clientes"
            nameKey="regiao"
          />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
