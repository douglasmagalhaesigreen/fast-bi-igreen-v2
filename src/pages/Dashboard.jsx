import React, { useState, useEffect } from 'react';
import { dashboardService } from '../services/api';
import LineChartComponent from '../components/charts/LineChartComponent';
import BarChartComponent from '../components/charts/BarChartComponent';
import PieChartComponent from '../components/charts/PieChartComponent';
import { Loader2 } from 'lucide-react';

const Dashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const metricsRes = await dashboardService.getMetrics();
        const chartsRes = await dashboardService.getChartData();
        setMetrics(metricsRes.data);
        setChartData(chartsRes.data);
        setError('');
      } catch (err) {
        console.error("Falha ao buscar dados do dashboard:", err);
        setError('Não foi possível carregar os dados do dashboard.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-12 h-12 animate-spin text-green-500" />
      </div>
    );
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div className='p-8'>
      <h1 className='text-3xl font-bold text-gray-800 dark:text-white mb-6'>Dashboard Principal</h1>
      
      {/* Cards de Métricas */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg'>
          <h2 className='text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2'>Total kWh</h2>
          <p className='text-3xl font-bold text-green-600 dark:text-green-400'>{metrics?.kwhTotal?.toLocaleString('pt-BR') || 'N/A'}</p>
        </div>
        <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg'>
          <h2 className='text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2'>Clientes Ativos</h2>
          <p className='text-3xl font-bold text-blue-600 dark:text-blue-400'>{metrics?.clientesAtivos?.toLocaleString('pt-BR') || 'N/A'}</p>
          <p className='text-sm text-gray-500 dark:text-gray-400 mt-2'>+{metrics?.clientesNovos || 0} novos este mês</p>
        </div>
        <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg'>
          <h2 className='text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2'>Faturamento</h2>
          <p className='text-3xl font-bold text-purple-600 dark:text-purple-400'>{metrics?.faturamento?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || 'N/A'}</p>
        </div>
        <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg'>
          <h2 className='text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2'>Eficiência</h2>
          <p className='text-3xl font-bold text-orange-600 dark:text-orange-400'>{metrics?.eficiencia || 'N/A'}%</p>
        </div>
        <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg'>
          <h2 className='text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2'>Consumo Médio</h2>
          <p className='text-3xl font-bold text-pink-600 dark:text-pink-400'>{metrics?.consumoMedio || 'N/A'} kWh</p>
        </div>
        <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg'>
          <h2 className='text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2'>Alertas</h2>
          <p className='text-3xl font-bold text-red-600 dark:text-red-400'>{metrics?.alertas || 0}</p>
        </div>
      </div>

      {/* Gráficos */}
      {chartData && (
        <>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6'>
            <LineChartComponent data={chartData.consumoMensal} title="Evolução do Consumo Mensal" />
            <BarChartComponent data={chartData.dadosRegionais} title="Distribuição por Região" />
          </div>
          <div className='mt-6'>
            <PieChartComponent data={chartData.distribuicaoTipo} title="Distribuição por Tipo de Cliente" />
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;