import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import { 
  Eye, EyeOff, Loader2, Zap, Mail, Lock, 
  AlertCircle, CheckCircle, User
} from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import ThemeToggle from '../components/common/ThemeToggle';

const Login = () => {
  const navigate = useNavigate();
  useTheme();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Verificar se já está logado
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/');
    }
  }, [navigate]);

  // Validação de email
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpar erro ao digitar
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validações
    if (!formData.email || !formData.password) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    if (!validateEmail(formData.email)) {
      setError('Por favor, insira um email válido');
      return;
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulação de login - SUBSTITUIR pela chamada real da API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Login de demonstração (remover em produção)
      if (formData.email === 'admin@igreen.com' && formData.password === '123456') {
        // Salvar token
        const fakeToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';
        localStorage.setItem('token', fakeToken);
        localStorage.setItem('user', JSON.stringify({
          name: 'Administrador',
          email: formData.email,
          role: 'admin'
        }));
        
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        } else {
          sessionStorage.setItem('token', fakeToken);
        }

        setSuccess('Login realizado com sucesso!');
        
        setTimeout(() => {
          navigate('/');
        }, 1000);
      } else {
        setError('Email ou senha incorretos');
      }
    } catch (err) {
      setError('Erro ao fazer login. Tente novamente.');
      console.error('Erro no login:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Animações
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 transition-colors duration-300 relative overflow-hidden">
      {/* Background animado - REINTEGRADO */}
      <div className="absolute inset-0 opacity-20 z-0">
        {[...Array(5)].map((_, i) => (
          <Motion.div
            key={i}
            className="absolute rounded-full bg-green-500"
            style={{
              width: Math.random() * 400 + 100,
              height: Math.random() * 400 + 100,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      {/* Toggle de tema flutuante */}
      <div className="fixed top-4 right-4 md:top-6 md:right-6 z-50">
        <ThemeToggle
          knobStyle={{ top: '50%', marginTop: '-14px' }}
        />
      </div>

      {/* Container principal com Flexbox e z-index para ficar na frente */}
      <div className="w-full max-w-5xl flex rounded-2xl overflow-hidden shadow-2xl relative z-10">
        {/* Contêiner do Vídeo */}
        <Motion.div
          initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden md:flex flex-1 relative overflow-hidden bg-black"
        >
          <video
            className="absolute inset-0 w-full h-full object-cover object-[45%_center]"
            /* object-[45%_center]: desloca ligeiramente o foco para a esquerda (default seria 50%) */
            src="/videos/bi-animation.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
        </Motion.div>
        
        {/* Contêiner do Formulário de Login */}
        <Motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex-1 p-8 bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl shadow-2xl rounded-2xl border border-gray-200 dark:border-gray-700 md:rounded-l-none"
        >
          {/* Logo e Título */}
          <Motion.div 
            variants={itemVariants}
            className="text-center mb-8"
          >
            <Motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 200,
                delay: 0.2 
              }}
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full mb-4 shadow-lg"
            >
              <Zap className="w-10 h-10 text-white" />
            </Motion.div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Fast BI iGreen
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Sistema de Business Intelligence
            </p>
          </Motion.div>

          {/* Mensagens de erro/sucesso */}
          {error && (
            <Motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-lg flex items-center border bg-red-50 border-red-200 text-red-700 dark:bg-red-900/50 dark:border-red-700 dark:text-red-200"
            >
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </Motion.div>
          )}

          {success && (
            <Motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-lg flex items-center border bg-green-50 border-green-200 text-green-700 dark:bg-green-900/50 dark:border-green-700 dark:text-green-200"
            >
              <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
              <span className="text-sm">{success}</span>
            </Motion.div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Campo Email */}
            <Motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  placeholder="seu@email.com"
                  disabled={isLoading}
                />
              </div>
            </Motion.div>

            {/* Campo Senha */}
            <Motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-12 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                  )}
                </button>
              </div>
            </Motion.div>

            {/* Lembrar-me e Esqueci a senha */}
            <Motion.div 
              variants={itemVariants}
              className="flex items-center justify-between"
            >
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-green-600 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:ring-green-500 focus:ring-2"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Lembrar-me
                </span>
              </label>
              <button
                type="button"
                onClick={() => console.log('Recuperar senha')}
                className="text-sm text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300 transition-colors"
              >
                Esqueceu a senha?
              </button>
            </Motion.div>

            {/* Botão de Login */}
            <Motion.div variants={itemVariants}>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  'Entrar'
                )}
              </button>
            </Motion.div>
          </form>

          {/* Credenciais de Demo */}
          <Motion.div 
            variants={itemVariants}
            className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-200 dark:border-gray-600"
          >
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
              <strong className="text-gray-800 dark:text-gray-300">Credenciais de demonstração:</strong>
            </p>
            <div className="space-y-1">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                <User className="w-3 h-3 inline mr-1" />
                Email: admin@igreen.com
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                <Lock className="w-3 h-3 inline mr-1" />
                Senha: 123456
              </p>
            </div>
          </Motion.div>

          {/* Footer */}
          <Motion.p 
            variants={itemVariants}
            className="text-center text-xs text-gray-500 dark:text-gray-400 mt-6"
          >
            © 2025 iGreen Energy. Todos os direitos reservados.
          </Motion.p>
        </Motion.div>
      </div>
    </div>
  );
};

export default Login;