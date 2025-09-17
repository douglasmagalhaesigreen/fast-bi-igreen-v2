import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import {
  Zap, LayoutDashboard, FileText, Map, Settings,
  Menu, X, LogOut, User, Bell, Search, 
  Sun, Moon, Monitor, ChevronDown, Tv
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const menuItems = [
    {
      path: '/',
      label: 'Dashboard',
      icon: LayoutDashboard
    },
    {
      path: '/reports',
      label: 'Relatórios',
      icon: FileText
    },
    {
      path: '/map',
      label: 'Mapa',
      icon: Map
    },
    {
      path: '/settings',
      label: 'Configurações',
      icon: Settings
    }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const notifications = [
    {
      id: 1,
      title: 'Novo relatório disponível',
      message: 'O relatório mensal de consumo está pronto',
      time: '5 min atrás',
      read: false
    },
    {
      id: 2,
      title: 'Meta atingida',
      message: 'A meta de eficiência foi alcançada este mês',
      time: '2 horas atrás',
      read: false
    },
    {
      id: 3,
      title: 'Atualização do sistema',
      message: 'Nova versão disponível para download',
      time: '1 dia atrás',
      read: true
    }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-light-bg-secondary dark:bg-dark-bg-primary transition-colors duration-300">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {sidebarOpen && (
          <Motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-dark-bg-secondary shadow-xl z-40"
          >
            {/* Logo */}
            <div className="p-6 border-b border-light-border dark:border-dark-border">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-light-text-primary dark:text-dark-text-primary">
                    Fast BI
                  </h2>
                  <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                    iGreen Energy
                  </p>
                </div>
              </div>
            </div>

            {/* Menu de Navegação */}
            <nav className="p-4 space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Motion.button
                    key={item.path}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(item.path)}
                    className={`
                      w-full flex items-center space-x-3 px-4 py-3 rounded-lg
                      transition-all duration-200
                      ${isActive
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md'
                        : 'text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Motion.button>
                );
              })}

              {/* Botão Dashboard TV */}
              <Motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.open('/dashboard-tv', '_blank')}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary transition-all duration-200"
              >
                <Tv className="w-5 h-5" />
                <span className="font-medium">Dashboard TV</span>
              </Motion.button>
            </nav>

            {/* Informações do Usuário */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-light-border dark:border-dark-border">
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-light-bg-tertiary dark:bg-dark-bg-tertiary">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                    {user?.name || 'Usuário'}
                  </p>
                  <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                    {user?.email || 'usuario@igreen.com'}
                  </p>
                </div>
              </div>
            </div>
          </Motion.aside>
        )}
      </AnimatePresence>

      {/* Conteúdo Principal */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {/* Header */}
        <header className="bg-white dark:bg-dark-bg-secondary shadow-sm border-b border-light-border dark:border-dark-border">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              {/* Toggle Sidebar */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary transition-colors"
              >
                {sidebarOpen ? (
                  <X className="w-5 h-5 text-light-text-secondary dark:text-dark-text-secondary" />
                ) : (
                  <Menu className="w-5 h-5 text-light-text-secondary dark:text-dark-text-secondary" />
                )}
              </button>

              {/* Barra de Pesquisa */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-light-text-tertiary dark:text-dark-text-tertiary" />
                <input
                  type="text"
                  placeholder="Pesquisar..."
                  className="pl-10 pr-4 py-2 w-80 rounded-lg border border-light-border dark:border-dark-border bg-light-bg-primary dark:bg-dark-bg-primary text-light-text-primary dark:text-dark-text-primary placeholder-light-text-tertiary dark:placeholder-dark-text-tertiary focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Toggle Tema */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary transition-colors"
              >
                {theme === 'light' ? (
                  <Moon className="w-5 h-5 text-light-text-secondary dark:text-dark-text-secondary" />
                ) : (
                  <Sun className="w-5 h-5 text-light-text-secondary dark:text-dark-text-secondary" />
                )}
              </button>

              {/* Notificações */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="p-2 rounded-lg hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary transition-colors relative"
                >
                  <Bell className="w-5 h-5 text-light-text-secondary dark:text-dark-text-secondary" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </button>

                {/* Dropdown de Notificações */}
                <AnimatePresence>
                  {notificationsOpen && (
                    <Motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-80 bg-white dark:bg-dark-bg-secondary rounded-lg shadow-xl border border-light-border dark:border-dark-border overflow-hidden z-50"
                    >
                      <div className="p-4 border-b border-light-border dark:border-dark-border">
                        <h3 className="font-semibold text-light-text-primary dark:text-dark-text-primary">
                          Notificações
                        </h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.map((notif) => (
                          <div
                            key={notif.id}
                            className={`p-4 border-b border-light-border dark:border-dark-border hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary cursor-pointer ${
                              !notif.read ? 'bg-green-50 dark:bg-green-900/10' : ''
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium text-light-text-primary dark:text-dark-text-primary">
                                  {notif.title}
                                </p>
                                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mt-1">
                                  {notif.message}
                                </p>
                                <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mt-2">
                                  {notif.time}
                                </p>
                              </div>
                              {!notif.read && (
                                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </Motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Menu do Perfil */}
              <div className="relative">
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <ChevronDown className="w-4 h-4 text-light-text-secondary dark:text-dark-text-secondary" />
                </button>

                {/* Dropdown do Perfil */}
                <AnimatePresence>
                  {profileMenuOpen && (
                    <Motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-bg-secondary rounded-lg shadow-xl border border-light-border dark:border-dark-border overflow-hidden z-50"
                    >
                      <button
                        onClick={() => navigate('/settings')}
                        className="w-full px-4 py-3 text-left hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary transition-colors flex items-center space-x-3"
                      >
                        <User className="w-4 h-4 text-light-text-secondary dark:text-dark-text-secondary" />
                        <span className="text-sm text-light-text-primary dark:text-dark-text-primary">
                          Meu Perfil
                        </span>
                      </button>
                      <button
                        onClick={() => navigate('/settings')}
                        className="w-full px-4 py-3 text-left hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary transition-colors flex items-center space-x-3"
                      >
                        <Settings className="w-4 h-4 text-light-text-secondary dark:text-dark-text-secondary" />
                        <span className="text-sm text-light-text-primary dark:text-dark-text-primary">
                          Configurações
                        </span>
                      </button>
                      <div className="border-t border-light-border dark:border-dark-border">
                        <button
                          onClick={handleLogout}
                          className="w-full px-4 py-3 text-left hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center space-x-3"
                        >
                          <LogOut className="w-4 h-4 text-red-600" />
                          <span className="text-sm text-red-600">Sair</span>
                        </button>
                      </div>
                    </Motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        {/* Conteúdo da Página */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;