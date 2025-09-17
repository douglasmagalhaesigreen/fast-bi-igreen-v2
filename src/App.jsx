import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, LayoutDashboard, FileText, Map, Settings, 
  Tv, Sun, Moon, LogOut, User, Menu, X,
  ChevronLeft, ChevronRight, Bell, Search, Zap
} from 'lucide-react';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import { ThemeProvider } from './contexts/ThemeContext';
import ThemeToggle from './components/common/ThemeToggle';
import DashboardTV from './pages/DashboardTV';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import LineChartComponent from './components/charts/LineChartComponent';
import BarChartComponent from './components/charts/BarChartComponent';
import PieChartComponent from './components/charts/PieChartComponent';
import AreaSelection from './pages/AreaSelection';

// Componentes das páginas
const Dashboard = () => {
  // Dados para os gráficos
  const consumoMensal = [
    { mes: 'Jan', consumo: 420, meta: 400 },
    { mes: 'Fev', consumo: 380, meta: 400 },
    { mes: 'Mar', consumo: 450, meta: 420 },
    { mes: 'Abr', consumo: 490, meta: 450 },
    { mes: 'Mai', consumo: 520, meta: 480 },
    { mes: 'Jun', consumo: 480, meta: 500 },
  ];

  const dadosRegionais = [
    { regiao: 'Norte', clientes: 120, consumo: 380 },
    { regiao: 'Nordeste', clientes: 280, consumo: 720 },
    { regiao: 'Centro-Oeste', clientes: 95, consumo: 290 },
    { regiao: 'Sudeste', clientes: 340, consumo: 980 },
    { regiao: 'Sul', clientes: 157, consumo: 440 },
  ];

  // Dados para o gráfico de pizza
  const distribuicaoTipo = [
    { name: 'Residencial', value: 45 },
    { name: 'Comercial', value: 35 },
    { name: 'Industrial', value: 20 },
  ];

  return (
    <div className='p-8'>
      <h1 className='text-3xl font-bold text-gray-800 dark:text-white mb-6'>Dashboard Principal</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg'>
          <h2 className='text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2'>Total kWh</h2>
          <p className='text-3xl font-bold text-green-600 dark:text-green-400'>1,234,567</p>
          <p className='text-sm text-gray-500 dark:text-gray-400 mt-2'>+12% desde o último mês</p>
        </div>
        <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg'>
          <h2 className='text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2'>Clientes Ativos</h2>
          <p className='text-3xl font-bold text-blue-600 dark:text-blue-400'>892</p>
          <p className='text-sm text-gray-500 dark:text-gray-400 mt-2'>+45 novos este mês</p>
        </div>
        <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg'>
          <h2 className='text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2'>Faturamento</h2>
          <p className='text-3xl font-bold text-purple-600 dark:text-purple-400'>R$ 2.456.789</p>
          <p className='text-sm text-gray-500 dark:text-gray-400 mt-2'>+8% desde o último mês</p>
        </div>
        <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg'>
          <h2 className='text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2'>Eficiência</h2>
          <p className='text-3xl font-bold text-orange-600 dark:text-orange-400'>94.5%</p>
          <p className='text-sm text-gray-500 dark:text-gray-400 mt-2'>Meta: 95%</p>
        </div>
        <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg'>
          <h2 className='text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2'>Consumo Médio</h2>
          <p className='text-3xl font-bold text-pink-600 dark:text-pink-400'>342 kWh</p>
          <p className='text-sm text-gray-500 dark:text-gray-400 mt-2'>Por cliente/mês</p>
        </div>
        <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg'>
          <h2 className='text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2'>Alertas</h2>
          <p className='text-3xl font-bold text-red-600 dark:text-red-400'>3</p>
          <p className='text-sm text-gray-500 dark:text-gray-400 mt-2'>Requerem atenção</p>
        </div>
      </div>

      {/* Gráficos */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6'>
        <LineChartComponent 
          data={consumoMensal} 
          title="Evolução do Consumo Mensal" 
        />
        <BarChartComponent 
          data={dadosRegionais} 
          title="Distribuição por Região" 
        />
      </div>

      {/* Gráfico de Pizza */}
      <div className='mt-6'>
        <PieChartComponent 
          data={distribuicaoTipo} 
          title="Distribuição por Tipo de Cliente" 
        />
      </div>
    </div>
  );
};

const Reports = () => (
  <div className='p-8'>
    <h1 className='text-3xl font-bold text-gray-800 dark:text-white mb-6'>Relatórios</h1>
    <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg'>
      <p className='text-gray-600 dark:text-gray-300'>Página de relatórios em desenvolvimento...</p>
    </div>
  </div>
);

const MapPage = () => (
  <div className='p-8'>
    <h1 className='text-3xl font-bold text-gray-800 dark:text-white mb-6'>Mapa de Clientes</h1>
    <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg'>
      <p className='text-gray-600 dark:text-gray-300'>Mapa em desenvolvimento...</p>
    </div>
  </div>
);

const SettingsPage = () => (
  <div className='p-8'>
    <h1 className='text-3xl font-bold text-gray-800 dark:text-white mb-6'>Configurações</h1>
    <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg'>
      <p className='text-gray-600 dark:text-gray-300'>Configurações em desenvolvimento...</p>
    </div>
  </div>
);

// Componente de Layout Principal com Menu Lateral
const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Theme handled by ThemeToggle component
  const [user, setUser] = useState(null);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    // Carregar dados do usuário
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Carregar preferência do sidebar
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
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
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
        {/* Logo e Toggle */}
        <div className='p-4 border-b dark:border-gray-700'>
          <div className='flex items-center justify-between'>
            <Motion.div 
              className='flex items-center space-x-3'
              animate={{ justifyContent: sidebarExpanded ? 'flex-start' : 'center' }}
            >
              <div className='w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0'>
                <Zap className='w-6 h-6 text-white' />
              </div>
              <AnimatePresence>
                {sidebarExpanded && (
                  <Motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h2 className='text-lg font-bold text-gray-800 dark:text-white whitespace-nowrap'>
                      Fast BI iGreen
                    </h2>
                  </Motion.div>
                )}
              </AnimatePresence>
            </Motion.div>
          </div>
        </div>

        {/* Menu Items */}
  <nav className='flex-1 p-4 space-y-2 flex flex-col'>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200
                  ${active 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }
                  ${!sidebarExpanded ? 'justify-center' : ''}
                `}
                title={!sidebarExpanded ? item.label : ''}
              >
                <Icon className='w-5 h-5 flex-shrink-0' />
                <AnimatePresence>
                  {sidebarExpanded && (
                    <Motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className='font-medium whitespace-nowrap'
                    >
                      {item.label}
                    </Motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}

          {/* Botão Dashboard TV */}
          <Link
            to='/dashboard-tv'
            target='_blank'
            className={`
              flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200
              text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700
              ${!sidebarExpanded ? 'justify-center' : ''}
            `}
            title={!sidebarExpanded ? 'Dashboard TV' : ''}
          >
            <Tv className='w-5 h-5 flex-shrink-0' />
            <AnimatePresence>
              {sidebarExpanded && (
                <Motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className='font-medium whitespace-nowrap'
                >
                  Dashboard TV
                </Motion.span>
              )}
            </AnimatePresence>
          </Link>

          {/* Toggle Sidebar (reposicionado acima do container de sair) */}
          {/* Espaço para empurrar o botão inferior */}
          <div className='mt-auto' />

        </nav>

        {/* Bottom Section apenas com botão de expandir/recolher */}
        <div className='p-4 border-t dark:border-gray-700'>
          <div className='flex justify-center'>
            <button
              onClick={toggleSidebar}
              aria-label={sidebarExpanded ? 'Recolher menu lateral' : 'Expandir menu lateral'}
              title={sidebarExpanded ? 'Recolher menu' : 'Expandir menu'}
              className='group relative p-2 rounded-full transition-colors duration-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none'
            >
              <Motion.div
                key={sidebarExpanded ? 'expanded' : 'collapsed'}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className='flex items-center justify-center text-gray-600 dark:text-gray-300'
              >
                {sidebarExpanded ? (
                  <ChevronLeft className='w-5 h-5' />
                ) : (
                  <ChevronRight className='w-5 h-5' />
                )}
              </Motion.div>
            </button>
          </div>
        </div>

  {/* Botão de toggle removido da posição absoluta original */}
      </Motion.aside>

      {/* Main Content */}
      <div className='flex-1 flex flex-col'>
        {/* Top Header */}
        <header className='bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 px-6 py-4'>
          <div className='flex items-center justify-between'>
            {/* Search Bar */}
            <div className='flex-1 max-w-xl'>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
                <input
                  type='text'
                  placeholder='Pesquisar...'
                  className='w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'
                />
              </div>
            </div>

            {/* Right Section */}
            <div className='flex items-center space-x-4 ml-6'>
              {/* Notifications */}
              <button className='p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative'>
                <Bell className='w-5 h-5 text-gray-600 dark:text-gray-300' />
                <span className='absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full'></span>
              </button>

              {/* Theme Toggle */}
              <ThemeToggle size='sm' />

              {/* User Menu */}
              <div className='relative'>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className='flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'
                >
                  <div className='w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center'>
                    <User className='w-4 h-4 text-white' />
                  </div>
                  <div className='text-left'>
                    <p className='text-sm font-medium text-gray-700 dark:text-gray-200'>
                      {user?.name || 'Usuário'}
                    </p>
                    <p className='text-xs text-gray-500 dark:text-gray-400'>
                      {user?.role || 'Admin'}
                    </p>
                  </div>
                </button>
                
                <AnimatePresence>
                  {showUserMenu && (
                    <Motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className='absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 py-2 z-50'
                    >
                      <div className='px-4 py-2 border-b dark:border-gray-700'>
                        <p className='text-sm font-medium text-gray-800 dark:text-gray-200'>
                          {user?.name || 'Usuário'}
                        </p>
                        <p className='text-xs text-gray-500 dark:text-gray-400'>
                          {user?.email || 'email@exemplo.com'}
                        </p>
                      </div>
                      <Link
                        to='/settings'
                        className='block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Settings className='w-4 h-4 inline mr-2' />
                        Configurações
                      </Link>
                      <button
                        onClick={handleLogout}
                        className='w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center'
                      >
                        <LogOut className='w-4 h-4 mr-2' />
                        Sair
                      </button>
                    </Motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className='flex-1 overflow-auto'>
          <Routes>
            <Route path='/' element={<Dashboard />} />
            <Route path='/reports' element={<Reports />} />
            <Route path='/map' element={<MapPage />} />
            <Route path='/settings' element={<SettingsPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

// App principal
function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Rota de Login */}
          <Route path='/login' element={<Login />} />
          
          {/* Rota de Seleção de Área */}
          <Route 
            path='/area-selection' 
            element={
              <ProtectedRoute>
                <AreaSelection />
              </ProtectedRoute>
            } 
          />
          
          {/* Rota do Dashboard TV (protegida) */}
          <Route 
            path='/dashboard-tv' 
            element={
              <ProtectedRoute>
                <DashboardTV />
              </ProtectedRoute>
            } 
          />
          
          {/* Rotas protegidas do sistema principal */}
          <Route 
            path='/*' 
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
