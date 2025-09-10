import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, TrendingUp, Users, Activity, BarChart3, 
  Calendar, MapPin, DollarSign, Gauge, AlertCircle,
  Wifi, WifiOff, ArrowLeft, Maximize2, Minimize2
} from 'lucide-react';
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
import { Line, Bar, Doughnut } from 'react-chartjs-2';

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
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeMetric, setActiveMetric] = useState(0);
  const [isOnline, setIsOnline] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [data, setData] = useState({
    kwhTotal: 1234567,
    clientesAtivos: 892,
    clientesNovos: 45,
    faturamento: 2456789,
    consumoMedio: 342,
    eficiencia: 94.5,
    alertas: 3
  });

  // Auto-hide dos controles
  useEffect(() => {
    let timeout;
    const resetTimeout = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setShowControls(false);
      }, 5000); // Esconde após 5 segundos de inatividade
    };

    // Eventos que mostram os controles
    const handleMouseMove = () => resetTimeout();
    const handleKeyPress = () => resetTimeout();

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('keypress', handleKeyPress);
    
    // Iniciar o timeout
    resetTimeout();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('keypress', handleKeyPress);
      clearTimeout(timeout);
    };
  }, []);

  // Atalhos de teclado
  useEffect(() => {
    const handleKeyDown = (e) => {
      // ESC - Sair do fullscreen ou voltar ao dashboard
      if (e.key === 'Escape') {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else {
          navigate('/');
        }
      }
      // F - Toggle fullscreen
      if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      }
      // B - Back to dashboard
      if (e.key === 'b' || e.key === 'B') {
        navigate('/');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  // Função para toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Detectar mudanças no fullscreen
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

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
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Verificar conexão
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Auto-refresh dos dados
  useEffect(() => {
    const fetchData = async () => {
      try {
        setData(prevData => ({
          ...prevData,
          kwhTotal: prevData.kwhTotal + Math.floor(Math.random() * 100),
          consumoMedio: 342 + Math.floor(Math.random() * 10) - 5,
          eficiencia: Math.min(100, Math.max(90, prevData.eficiencia + (Math.random() * 2 - 1)))
        }));
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    fetchData();
    const timer = setInterval(fetchData, 30000);
    return () => clearInterval(timer);
  }, []);

  // Configuração dos gráficos
  const lineChartData = {
    labels: ['00h', '04h', '08h', '12h', '16h', '20h', '24h'],
    datasets: [
      {
        label: 'Consumo Hoje',
        data: [320, 280, 350, 420, 480, 510, 490],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Consumo Ontem',
        data: [300, 290, 340, 400, 460, 490, 470],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderDash: [5, 5],
        tension: 0.4,
        fill: false
      }
    ]
  };

  const barChartData = {
    labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
    datasets: [
      {
        label: 'Novos Clientes',
        data: [12, 19, 8, 15, 22, 9, 14],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(251, 146, 60, 0.8)',
          'rgba(147, 51, 234, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(250, 204, 21, 0.8)',
          'rgba(239, 68, 68, 0.8)'
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
            size: 12
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
            size: 11
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
            size: 11
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4 overflow-hidden relative">
      
      {/* Controles Flutuantes */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-4 left-4 z-50 flex gap-2"
          >
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800/80 hover:bg-gray-700/80 backdrop-blur-sm rounded-lg transition-all duration-200 group"
              title="Voltar ao Dashboard (B)"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm">Voltar</span>
            </button>
            
            <button
              onClick={toggleFullscreen}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800/80 hover:bg-gray-700/80 backdrop-blur-sm rounded-lg transition-all duration-200"
              title="Tela Cheia (F)"
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
              <span className="text-sm">{isFullscreen ? 'Sair' : 'Tela Cheia'}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Indicador de Atalhos */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-4 left-4 z-50"
          >
            <div className="bg-gray-800/60 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-gray-400">
              <span className="font-semibold">Atalhos:</span> 
              <span className="ml-2">ESC - Sair</span>
              <span className="ml-2">F - Tela Cheia</span>
              <span className="ml-2">B - Voltar</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex justify-between items-center mb-6"
      >
        <div className="flex items-center space-x-4 ml-32">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl">
            <Zap className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Fast BI iGreen
            </h1>
            <p className="text-gray-400 text-sm">Dashboard de Monitoramento</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          {/* Status de Conexão */}
          <div className="flex items-center space-x-2">
            {isOnline ? (
              <>
                <Wifi className="w-5 h-5 text-green-400" />
                <span className="text-sm text-green-400">Online</span>
              </>
            ) : (
              <>
                <WifiOff className="w-5 h-5 text-red-400" />
                <span className="text-sm text-red-400">Offline</span>
              </>
            )}
          </div>
          
          {/* Relógio */}
          <div className="text-right">
            <div className="text-2xl font-bold font-mono">
              {currentTime.toLocaleTimeString('pt-BR')}
            </div>
            <div className="text-gray-400 text-sm">
              {currentTime.toLocaleDateString('pt-BR', { 
                weekday: 'long', 
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </div>
          </div>
        </div>
      </motion.header>

      {/* Métricas Principais - Rotativas */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <AnimatePresence mode="wait">
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ 
                scale: activeMetric === index ? 1.02 : 1,
                opacity: 1
              }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`relative overflow-hidden rounded-xl p-5 ${
                activeMetric === index 
                  ? 'bg-gradient-to-br ' + metric.color + ' shadow-2xl' 
                  : 'bg-gray-800/50 backdrop-blur-sm'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className={`inline-flex p-2 rounded-xl ${
                    activeMetric === index 
                      ? 'bg-white/20' 
                      : 'bg-gradient-to-br ' + metric.color
                  }`}>
                    {metric.icon}
                  </div>
                  <p className={`mt-3 text-sm ${
                    activeMetric === index ? 'text-white/90' : 'text-gray-400'
                  }`}>
                    {metric.label}
                  </p>
                  <p className="text-2xl font-bold mt-1">
                    {metric.value}
                    <span className="text-base ml-1">{metric.unit}</span>
                  </p>
                </div>
                <div className={`flex items-center px-2 py-1 rounded-full text-xs ${
                  activeMetric === index 
                    ? 'bg-white/20' 
                    : 'bg-green-900/50'
                }`}>
                  <TrendingUp className="w-3 h-3 mr-1" />
                  <span className="font-semibold">{metric.trend}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {/* Gráfico de Linha */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="col-span-2 bg-gray-800/50 backdrop-blur-sm rounded-xl p-4"
        >
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-green-400" />
            Consumo em Tempo Real
          </h3>
          <div className="h-48">
            <Line data={lineChartData} options={chartOptions} />
          </div>
        </motion.div>

        {/* Gráfico de Rosca */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4"
        >
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-blue-400" />
            Distribuição
          </h3>
          <div className="h-48">
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
      <div className="grid grid-cols-2 gap-4">
        {/* Gráfico de Barras - Novos Clientes */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4"
        >
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <Users className="w-5 h-5 mr-2 text-purple-400" />
            Novos Clientes (Semana)
          </h3>
          <div className="h-40">
            <Bar data={barChartData} options={chartOptions} />
          </div>
        </motion.div>

        {/* KPIs Adicionais */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4"
        >
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <Gauge className="w-5 h-5 mr-2 text-orange-400" />
            Indicadores de Performance
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-2 bg-gray-700/30 rounded-lg">
              <span className="text-gray-300 text-sm">Consumo Médio/Cliente</span>
              <span className="text-lg font-bold text-green-400">{data.consumoMedio} kWh</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-700/30 rounded-lg">
              <span className="text-gray-300 text-sm">Taxa de Eficiência</span>
              <div className="flex items-center">
                <div className="w-24 bg-gray-700 rounded-full h-2 mr-2">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-emerald-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${data.eficiencia}%` }}
                  ></div>
                </div>
                <span className="text-lg font-bold text-blue-400">{data.eficiencia.toFixed(1)}%</span>
              </div>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-700/30 rounded-lg">
              <span className="text-gray-300 text-sm">Novos Clientes (Mês)</span>
              <span className="text-lg font-bold text-purple-400">+{data.clientesNovos}</span>
            </div>
            {data.alertas > 0 && (
              <div className="flex justify-between items-center p-2 bg-red-900/30 rounded-lg animate-pulse">
                <span className="text-red-400 text-sm flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  Alertas Ativos
                </span>
                <span className="text-lg font-bold text-red-400">{data.alertas}</span>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Rodapé com Status */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-4 flex justify-between items-center text-xs text-gray-500"
      >
        <div className="flex items-center space-x-6">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
            Sistema Operacional
          </div>
          <div>Última atualização: {currentTime.toLocaleTimeString('pt-BR')}</div>
          <div>Auto-refresh: 30s</div>
        </div>
        <div>
          © 2025 iGreen Energy - Energia Sustentável
        </div>
      </motion.footer>
    </div>
  );
};

export default DashboardTV;
