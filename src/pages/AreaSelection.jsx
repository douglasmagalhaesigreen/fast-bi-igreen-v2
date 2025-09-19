import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import { 
  Zap, Network, Sun, Phone, Square, Radio,
  ArrowRight, Lock, LogOut
} from 'lucide-react';
import ThemeToggle from '../components/common/ThemeToggle';
import { useAuth } from '../hooks/useAuth';

const AreaSelection = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [selectedArea, setSelectedArea] = useState(null);

  const handleLogout = async () => {
    try {
      await logout();
      try {
        // broadcast simples entre abas (opcional)
        localStorage.setItem('logout', String(Date.now()));
      } catch {
        // noop
      }
    } finally {
      navigate('/login', { replace: true });
    }
  };

  const areas = [
    {
      id: 'green',
      name: 'Green',
      description: 'Gestão de energia sustentável',
      icon: Zap,
      color: 'from-green-400 to-emerald-600',
      hoverColor: 'hover:from-green-500 hover:to-emerald-700',
      shadowColor: 'shadow-green-500/25',
      available: true,
      path: '/'
    },
    {
      id: 'expansao',
      name: 'Expansão',
      description: 'Rede de distribuição e crescimento',
      icon: Network,
      color: 'from-blue-400 to-indigo-600',
      hoverColor: 'hover:from-blue-500 hover:to-indigo-700',
      shadowColor: 'shadow-blue-500/25',
      available: false,
      path: '/expansion'
    },
    {
      id: 'solar',
      name: 'Solar',
      description: 'Energia solar fotovoltaica',
      icon: Sun,
      color: 'from-yellow-400 to-orange-600',
      hoverColor: 'hover:from-yellow-500 hover:to-orange-700',
      shadowColor: 'shadow-orange-500/25',
      available: false,
      path: '/solar'
    },
    {
      id: 'telecom',
      name: 'Telecom',
      description: 'Soluções de telecomunicações',
      icon: Phone,
      color: 'from-purple-400 to-pink-600',
      hoverColor: 'hover:from-purple-500 hover:to-pink-700',
      shadowColor: 'shadow-purple-500/25',
      available: false,
      path: '/telecom'
    },
    {
      id: 'placas',
      name: 'Placas',
      description: 'Gestão de placas solares',
      icon: Square,
      color: 'from-cyan-400 to-teal-600',
      hoverColor: 'hover:from-cyan-500 hover:to-teal-700',
      shadowColor: 'shadow-cyan-500/25',
      available: false,
      path: '/panels'
    },
    {
      id: 'livre',
      name: 'Livre',
      description: 'Mercado livre de energia',
      icon: Radio,
      color: 'from-red-400 to-rose-600',
      hoverColor: 'hover:from-red-500 hover:to-rose-700',
      shadowColor: 'shadow-red-500/25',
      available: false,
      path: '/free-market'
    }
  ];

  const handleAreaClick = (area) => {
    if (area.available) {
      setSelectedArea(area.id);
      setTimeout(() => {
        navigate(area.path);
      }, 300);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Header */}
      <div className="flex justify-between items-center p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Fast BI iGreen
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Theme Toggle (componente unificado) */}
          <ThemeToggle size="sm" />
          
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-lg"
          >
            <LogOut className="w-4 h-4" />
            <span>Sair</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center px-6 py-12">
        <Motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Selecione sua área:
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Escolha o módulo que deseja acessar
          </p>
        </Motion.div>

        <Motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full"
        >
          {areas.map((area) => {
            const Icon = area.icon;
            const isSelected = selectedArea === area.id;
            
            return (
              <Motion.div
                key={area.id}
                variants={itemVariants}
                whileHover={area.available ? { scale: 1.03 } : {}}
                whileTap={area.available ? { scale: 0.98 } : {}}
                onClick={() => handleAreaClick(area)}
                className={`
                  relative group cursor-pointer
                  ${!area.available && 'cursor-not-allowed'}
                `}
              >
                <div className={`
                  relative overflow-hidden rounded-2xl p-8
                  bg-white dark:bg-gray-800 
                  shadow-xl hover:shadow-2xl
                  transition-all duration-300
                  ${area.available ? area.shadowColor : 'opacity-60'}
                  ${isSelected && 'ring-4 ring-green-500'}
                `}>
                  {/* Background Gradient */}
                  <div className={`
                    absolute inset-0 bg-gradient-to-br ${area.color}
                    opacity-10 group-hover:opacity-20 transition-opacity duration-300
                  `} />
                  
                  {/* Lock Overlay for Unavailable */}
                  {!area.available && (
                    <div className="absolute inset-0 bg-gray-900/10 dark:bg-gray-900/30 backdrop-blur-[1px] rounded-2xl flex items-center justify-center z-10">
                      <div className="bg-gray-800/90 dark:bg-gray-900/90 text-white px-4 py-2 rounded-full flex items-center space-x-2">
                        <Lock className="w-4 h-4" />
                        <span className="text-sm font-semibold">Em breve</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="relative z-5">
                    <div className={`
                      w-16 h-16 rounded-xl bg-gradient-to-br ${area.color}
                      flex items-center justify-center mb-4
                      ${area.available && 'group-hover:scale-110 transition-transform duration-300'}
                    `}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                      {area.name}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                      {area.description}
                    </p>
                    
                    {area.available && (
                      <div className="flex items-center text-green-600 dark:text-green-400">
                        <span className="text-sm font-medium">Acessar</span>
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    )}
                  </div>
                </div>
              </Motion.div>
            );
          })}
        </Motion.div>

        {/* Info Footer */}
        <Motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Em breve mais áreas estarão disponíveis. Fique atento às atualizações!
          </p>
        </Motion.div>
      </div>
    </div>
  );
};

export default AreaSelection;
