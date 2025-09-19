import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, Map, Settings, Tv, LogOut, User, Bell, Search, Zap, ChevronLeft, ChevronRight, Layers } from 'lucide-react';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import ThemeToggle from '../common/ThemeToggle';

// Páginas (features)
import Dashboard from '../../features/dashboard/Dashboard';
import Reports from '../../features/reports/Reports';
import MapPage from '../../features/map/Map';
import SettingsPage from '../../features/settings/Settings';

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Fallbacks para exibição de dados do usuário
  const displayName = user?.name || user?.fullName || user?.full_name || user?.username || user?.email || 'Usuário';
  const displayRole = user?.role || user?.perfil || user?.profile || '';
  const displayEmail = user?.email || user?.username || '';
  const emailText = displayEmail || 'email@exemplo.com';
  const atIndex = emailText.indexOf('@');
  const emailLocal = atIndex > -1 ? emailText.slice(0, atIndex) : emailText;
  const emailDomain = atIndex > -1 ? emailText.slice(atIndex + 1) : '';

  useEffect(() => {
    const savedSidebarState = localStorage.getItem('sidebarExpanded');
    if (savedSidebarState !== null) {
      setSidebarExpanded(JSON.parse(savedSidebarState));
    }
  }, []);

  const toggleSidebar = () => {
    const newState = !sidebarExpanded;
    setSidebarExpanded(newState);
    localStorage.setItem('sidebarExpanded', JSON.stringify(newState));
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/reports', icon: FileText, label: 'Relatórios' },
    { path: '/map', icon: Map, label: 'Mapa' },
  ];

  return (
    <div className='min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300 flex'>
      {/* Sidebar */}
      <Motion.aside
        initial={false}
        animate={{ width: sidebarExpanded ? 256 : 80 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className='bg-white dark:bg-gray-800 shadow-xl border-r dark:border-gray-700 flex flex-col relative z-40'
      >
        <div className='p-4 border-b dark:border-gray-700'>
          <div className='flex items-center justify-between'>
            <Motion.div className='flex items-center space-x-3' animate={{ justifyContent: sidebarExpanded ? 'flex-start' : 'center' }}>
              <div className='w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0'>
                <Zap className='w-6 h-6 text-white' />
              </div>
              <AnimatePresence>
                {sidebarExpanded && (
                  <Motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                    <h2 className='text-lg font-bold text-gray-800 dark:text-white whitespace-nowrap'>Fast BI iGreen</h2>
                  </Motion.div>
                )}
              </AnimatePresence>
            </Motion.div>
          </div>
        </div>

        <nav className='flex-1 p-4 space-y-2 flex flex-col'>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link key={item.path} to={item.path}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${active ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'} ${!sidebarExpanded ? 'justify-center' : ''}`}
                title={!sidebarExpanded ? item.label : ''}
              >
                <Icon className='w-5 h-5 flex-shrink-0' />
                <AnimatePresence>
                  {sidebarExpanded && (
                    <Motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }} className='font-medium whitespace-nowrap'>
                      {item.label}
                    </Motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
          <Link to='/dashboard-tv' target='_blank'
            className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 ${!sidebarExpanded ? 'justify-center' : ''}`}
            title={!sidebarExpanded ? 'Dashboard TV' : ''}
          >
            <Tv className='w-5 h-5 flex-shrink-0' />
            <AnimatePresence>
              {sidebarExpanded && (
                <Motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }} className='font-medium whitespace-nowrap'>
                  Dashboard TV
                </Motion.span>
              )}
            </AnimatePresence>
          </Link>
          <div className='mt-auto' />
        </nav>

        <div className='p-4 border-t dark:border-gray-700'>
          <div className='flex justify-center'>
            <button onClick={toggleSidebar} aria-label={sidebarExpanded ? 'Recolher menu' : 'Expandir menu'} title={sidebarExpanded ? 'Recolher menu' : 'Expandir menu'}
              className='group relative p-2 rounded-full transition-colors duration-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none'
            >
              <Motion.div key={sidebarExpanded ? 'expanded' : 'collapsed'} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className='flex items-center justify-center text-gray-600 dark:text-gray-300'>
                {sidebarExpanded ? <ChevronLeft className='w-5 h-5' /> : <ChevronRight className='w-5 h-5' />}
              </Motion.div>
            </button>
          </div>
        </div>
      </Motion.aside>

      <div className='flex-1 flex flex-col'>
        <header className='bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex-1 max-w-xl'>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
                <input type='text' placeholder='Pesquisar...'
                  className='w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'
                />
              </div>
            </div>

            <div className='flex items-center space-x-4 ml-6'>
              <button className='p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative'>
                <Bell className='w-5 h-5 text-gray-600 dark:text-gray-300' />
                <span className='absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full'></span>
              </button>
              <ThemeToggle size='sm' />
              <div className='relative'>
                <button onClick={() => setShowUserMenu(!showUserMenu)} className='flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'>
                  <div className='w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center'>
                    <User className='w-4 h-4 text-white' />
                  </div>
                  <div className='text-left max-w-[10rem]'>
                    <p className='text-sm font-medium text-gray-700 dark:text-gray-200 truncate' title={displayName}>{displayName}</p>
                    <p className='text-xs text-gray-500 dark:text-gray-400 truncate' title={displayRole || 'Perfil'}>{displayRole || 'Admin'}</p>
                  </div>
                </button>
                <AnimatePresence>
                  {showUserMenu && (
                    <Motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                      className='absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 py-2 z-50'
                    >
                      <div className='px-4 py-2 border-b dark:border-gray-700'>
                        <p className='text-sm font-medium text-gray-800 dark:text-gray-200 truncate' title={displayName}>{displayName}</p>
                        <p
                          className='text-xs text-gray-500 dark:text-gray-400 whitespace-normal break-words leading-snug'
                          style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                          title={emailText}
                        >
                          <span>{emailLocal}</span>
                          {atIndex > -1 && <wbr />}
                          {atIndex > -1 && <span>@{emailDomain}</span>}
                        </p>
                      </div>
                      <Link to='/area-selection' className='block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700' onClick={() => setShowUserMenu(false)}>
                        <Layers className='w-4 h-4 inline mr-2' /> Seleção de Área
                      </Link>
                      <Link to='/settings' className='block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700' onClick={() => setShowUserMenu(false)}>
                        <Settings className='w-4 h-4 inline mr-2' /> Configurações
                      </Link>
                      <button onClick={handleLogout} className='w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center'>
                        <LogOut className='w-4 h-4 mr-2' /> Sair
                      </button>
                    </Motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        <main className='flex-1 overflow-auto'>
            {/* O Outlet renderizará as rotas aninhadas (Dashboard, Reports, etc.) */}
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/map" element={<MapPage />} />
                <Route path="/settings" element={<SettingsPage />} />
            </Routes>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;