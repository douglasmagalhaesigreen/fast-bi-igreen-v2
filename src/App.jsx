import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Home, LayoutDashboard, FileText, Map, Settings, Tv, Sun, Moon, LogOut, User } from 'lucide-react';
import { ThemeProvider } from './contexts/ThemeContext';
import { useTheme } from './hooks/useTheme';
import DashboardTV from './pages/DashboardTV';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

// Componentes das páginas
const Dashboard = () => (
  <div className='p-8'>
    <h1 className='text-3xl font-bold text-gray-800 dark:text-white mb-6'>Dashboard Principal</h1>
    <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
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
    </div>
  </div>
);

const Reports = () => (
  <div className='p-8'>
    <h1 className='text-3xl font-bold text-gray-800 dark:text-white'>Relatórios</h1>
    <p className='text-gray-600 dark:text-gray-300 mt-4'>Página de relatórios em desenvolvimento...</p>
  </div>
);

const MapPage = () => (
  <div className='p-8'>
    <h1 className='text-3xl font-bold text-gray-800 dark:text-white'>Mapa de Clientes</h1>
    <p className='text-gray-600 dark:text-gray-300 mt-4'>Mapa em desenvolvimento...</p>
  </div>
);

const SettingsPage = () => (
  <div className='p-8'>
    <h1 className='text-3xl font-bold text-gray-800 dark:text-white'>Configurações</h1>
    <p className='text-gray-600 dark:text-gray-300 mt-4'>Configurações em desenvolvimento...</p>
  </div>
);

// Componente de Layout Principal
const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [user, setUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    // Carregar dados do usuário
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className='min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300'>
      {/* Header */}
      <header className='bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='flex items-center space-x-2'>
                <div className='w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg flex items-center justify-center'>
                  <Home className='w-6 h-6 text-white' />
                </div>
                <span className='text-xl font-bold text-gray-800 dark:text-white'>Fast BI iGreen</span>
              </div>
            </div>
            
            <nav className='flex items-center space-x-6'>
              <Link 
                to='/' 
                className={`flex items-center space-x-2 transition-colors ${
                  isActive('/') 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400'
                }`}
              >
                <LayoutDashboard className='w-5 h-5' />
                <span>Dashboard</span>
              </Link>
              <Link 
                to='/reports' 
                className={`flex items-center space-x-2 transition-colors ${
                  isActive('/reports') 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400'
                }`}
              >
                <FileText className='w-5 h-5' />
                <span>Relatórios</span>
              </Link>
              <Link 
                to='/map' 
                className={`flex items-center space-x-2 transition-colors ${
                  isActive('/map') 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400'
                }`}
              >
                <Map className='w-5 h-5' />
                <span>Mapa</span>
              </Link>
              <Link 
                to='/settings' 
                className={`flex items-center space-x-2 transition-colors ${
                  isActive('/settings') 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400'
                }`}
              >
                <Settings className='w-5 h-5' />
                <span>Configurações</span>
              </Link>
              <Link 
                to='/dashboard-tv'
                target='_blank'
                className='flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors'
              >
                <Tv className='w-5 h-5' />
                <span>TV</span>
              </Link>
              
              {/* Botão de Tema */}
              <button
                onClick={toggleTheme}
                className='p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors'
                aria-label='Alternar tema'
              >
                {theme === 'light' ? (
                  <Moon className='w-5 h-5' />
                ) : (
                  <Sun className='w-5 h-5' />
                )}
              </button>

              {/* Menu do Usuário */}
              <div className='relative'>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className='flex items-center space-x-2 p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors'
                >
                  <User className='w-5 h-5' />
                  <span className='text-sm'>{user?.name || 'Usuário'}</span>
                </button>
                
                {showUserMenu && (
                  <div className='absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 py-2 z-50'>
                    <div className='px-4 py-2 border-b dark:border-gray-700'>
                      <p className='text-sm font-medium text-gray-800 dark:text-gray-200'>
                        {user?.name || 'Usuário'}
                      </p>
                      <p className='text-xs text-gray-500 dark:text-gray-400'>
                        {user?.email || 'email@exemplo.com'}
                      </p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className='w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2'
                    >
                      <LogOut className='w-4 h-4' />
                      <span>Sair</span>
                    </button>
                  </div>
                )}
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Conteúdo */}
      <main className='transition-colors duration-300'>
        <Routes>
          <Route path='/' element={<Dashboard />} />
          <Route path='/reports' element={<Reports />} />
          <Route path='/map' element={<MapPage />} />
          <Route path='/settings' element={<SettingsPage />} />
        </Routes>
      </main>
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
