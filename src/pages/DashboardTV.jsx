import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, TrendingUp, Users, Activity, BarChart3, 
  Calendar, MapPin, DollarSign, Gauge 
} from 'lucide-react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Registrar componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const DashboardTV = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeMetric, setActiveMetric] = useState(0);
  const [data, setData] = useState({
    kwhTotal: 1234567,
    clientesAtivos: 892,
    clientesNovos: 45,
    faturamento: 2456789,
    consumoMedio: 342,
    eficiencia: 94.5
  });

  // Atualizar relógio
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Rotação automática de métricas
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveMetric((prev) => (prev + 1) % 3);
    }, 10000); // Muda a cada 10 segundos
    return () => clearInterval(timer);
  }, []);

  // Auto-refresh dos dados
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Aqui você faria a chamada real para a API
        // const response = await dashboardService.getTVData();
        // setData(response.data);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    fetchData();
    const timer = setInterval(fetchData, 30000); // Atualiza a cada 30 segundos
    return () => clearInterval(timer);
  }, []);

  // Configuração dos gráficos
  const lineChartData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    datasets: [
      {
        label: 'Consumo (MWh)',
        data: [420, 480, 510, 490, 520, 580, 620, 610, 590, 630, 680, 720],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Meta (MWh)',
        data: [400, 450, 500, 500, 550, 600, 600, 650, 650, 700, 700, 750],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderDash: [5, 5],
        tension: 0.4,
        fill: false
      }
    ]
  };

  const barChartData = {
    labels: ['Norte', 'Nordeste', 'Centro-Oeste', 'Sudeste', 'Sul'],
    datasets: [
      {
        label: 'Clientes Ativos',
        data: [120, 280, 95, 340, 157],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(251, 146, 60, 0.8)',
          'rgba(147, 51, 234, 0.8)',
          'rgba(236, 72, 153, 0.8)'
        ]
      }
    ]
  };

  const doughnutData = {
    labels: ['Residencial', 'Comercial', 'Industrial'],
    datasets: [
      {
        data: [45, 35, 20],
        backgroundColor: [
          'rgba(16, 185, 129, 0.9)',
          'rgba(59, 130, 246, 0.9)',
          'rgba(251, 146, 60, 0.9)'
        ],
        borderWidth: 0
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          color: '#e5e7eb',
          font: {
            size: 14
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleFont: {
          size: 14
        },
        bodyFont: {
          size: 13
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(75, 85, 99, 0.2)'
        },
        ticks: {
          color: '#9ca3af',
          font: {
            size: 12
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(75, 85, 99, 0.2)'
        },
        ticks: {
          color: '#9ca3af',
          font: {
            size: 12
          }
        }
      }
    }
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('pt-BR').format(num);
  };

  const formatCurrency = (num) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(num);
  };

  const metrics = [
    {
      icon: <Zap className="w-8 h-8" />,
      label: 'Total kWh Vendido',
      value: formatNumber(data.kwhTotal),
      unit: 'kWh',
      trend: '+12.5%',
      color: 'from-green-400 to-emerald-600'
    },
    {
      icon: <Users className="w-8 h-8" />,
      label: 'Clientes Ativos',
      value: formatNumber(data.clientesAtivos),
      unit: '',
      trend: '+8.3%',
      color: 'from-blue-400 to-indigo-600'
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      label: 'Faturamento Mensal',
      value: formatCurrency(data.faturamento),
      unit: '',
      trend: '+15.7%',
      color: 'from-purple-400 to-pink-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6 overflow-hidden">
      {/* Header */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex justify-between items-center mb-8"
      >
        <div className="flex items-center space-x-4">
          <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Fast BI iGreen
            </h1>
            <p className="text-gray-400 text-sm">Dashboard de Monitoramento</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold font-mono">
            {currentTime.toLocaleTimeString('pt-BR')}
          </div>
          <div className="text-gray-400">
            {currentTime.toLocaleDateString('pt-BR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>
      </motion.header>

      {/* Métricas Principais - Rotativas */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <AnimatePresence mode="wait">
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ 
                scale: activeMetric === index ? 1.05 : 1,
                opacity: 1
              }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className={`relative overflow-hidden rounded-2xl p-6 ${
                activeMetric === index 
                  ? 'bg-gradient-to-br ' + metric.color + ' shadow-2xl' 
                  : 'bg-gray-800/50 backdrop-blur-sm'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className={`inline-flex p-3 rounded-xl ${
                    activeMetric === index 
                      ? 'bg-white/20' 
                      : 'bg-gradient-to-br ' + metric.color
                  }`}>
                    {metric.icon}
                  </div>
                  <p className={`mt-4 text-sm ${
                    activeMetric === index ? 'text-white/90' : 'text-gray-400'
                  }`}>
                    {metric.label}
                  </p>
                  <p className="text-3xl font-bold mt-2">
                    {metric.value}
                    <span className="text-lg ml-1">{metric.unit}</span>
                  </p>
                </div>
                <div className={`flex items-center px-3 py-1 rounded-full ${
                  activeMetric === index 
                    ? 'bg-white/20' 
                    : 'bg-green-900/50'
                }`}>
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span className="text-sm font-semibold">{metric.trend}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {/* Gráfico de Linha */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="col-span-2 bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6"
        >
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-green-400" />
            Evolução Mensal de Consumo
          </h3>
          <div className="h-64">
            <Line data={lineChartData} options={chartOptions} />
          </div>
        </motion.div>

        {/* Gráfico de Rosca */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6"
        >
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-blue-400" />
            Distribuição por Segmento
          </h3>
          <div className="h-64">
            <Doughnut data={doughnutData} options={{
              ...chartOptions,
              plugins: {
                ...chartOptions.plugins,
                legend: {
                  ...chartOptions.plugins.legend,
                  position: 'bottom'
                }
              }
            }} />
          </div>
        </motion.div>
      </div>

      {/* Tabelas e Métricas Secundárias */}
      <div className="grid grid-cols-2 gap-6">
        {/* Gráfico de Barras - Clientes por Região */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6"
        >
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-purple-400" />
            Clientes por Região
          </h3>
          <div className="h-56">
            <Bar data={barChartData} options={chartOptions} />
          </div>
        </motion.div>

        {/* KPIs Adicionais */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6"
        >
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <Gauge className="w-5 h-5 mr-2 text-orange-400" />
            Indicadores de Performance
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
              <span className="text-gray-300">Consumo Médio/Cliente</span>
              <span className="text-xl font-bold text-green-400">{data.consumoMedio} kWh</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
              <span className="text-gray-300">Taxa de Eficiência</span>
              <span className="text-xl font-bold text-blue-400">{data.eficiencia}%</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
              <span className="text-gray-300">Novos Clientes (Mês)</span>
              <span className="text-xl font-bold text-purple-400">+{data.clientesNovos}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
              <span className="text-gray-300">Ticket Médio</span>
              <span className="text-xl font-bold text-orange-400">
                {formatCurrency(data.faturamento / data.clientesAtivos)}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Rodapé com Status */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8 flex justify-between items-center text-sm text-gray-500"
      >
        <div className="flex items-center space-x-6">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
            Sistema Online
          </div>
          <div>Última atualização: {currentTime.toLocaleTimeString('pt-BR')}</div>
        </div>
        <div>
          © 2025 iGreen Energy - Energia Sustentável
        </div>
      </motion.footer>
    </div>
  );
};

export default DashboardTV;