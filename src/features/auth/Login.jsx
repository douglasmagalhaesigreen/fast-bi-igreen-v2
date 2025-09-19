import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Loader2, Zap, Mail, Lock, AlertCircle, CheckCircle, ArrowRight, X } from 'lucide-react';
import ThemeToggle from '../../components/common/ThemeToggle';
import { useAuth } from '../../hooks/useAuth';

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [touched, setTouched] = useState({ email: false, password: false });

  // Se já estiver autenticado, redireciona para o dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/area-selection');
    }
  }, [isAuthenticated, navigate]);

  // Auto-dismiss das mensagens após 4s
  useEffect(() => {
    if (!error && !success) return;
    const timer = setTimeout(() => {
      if (error) setError('');
      if (success) setSuccess('');
    }, 4000);
    return () => clearTimeout(timer);
  }, [error, success]);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleBlur = (field) => setTouched(prev => ({ ...prev, [field]: true }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    // validações
    if (!formData.email || !formData.password) {
      setError('Por favor, preencha todos os campos');
      return;
    }
    if (!validateEmail(formData.email)) {
      setError('Email inválido');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      const response = await login(formData.email, formData.password);
      if (response) {
        setSuccess('Login realizado com sucesso! Redirecionando...');
        setTimeout(() => navigate('/area-selection'), 1000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Email ou senha incorretos');
      console.error('Erro no login:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Animações
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, when: "beforeChildren", staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 transition-colors duration-300 relative overflow-hidden">
      {/* Fundo animado suave com blobs (substitui padrão radial estático) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <Motion.div
          className="absolute -top-24 -left-24 w-80 h-80 md:w-[28rem] md:h-[28rem] bg-green-400/40 dark:bg-emerald-400/25 rounded-full blur-3xl"
          animate={{ x: [0, 60, 0], y: [0, 40, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
        />
        <Motion.div
          className="absolute -bottom-32 -right-32 w-96 h-96 md:w-[32rem] md:h-[32rem] bg-emerald-500/35 dark:bg-teal-400/25 rounded-full blur-3xl"
          animate={{ x: [0, -50, 0], y: [0, -30, 0], rotate: [0, -8, 0] }}
          transition={{ duration: 28, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <Motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 md:w-[24rem] md:h-[24rem] bg-teal-400/25 dark:bg-green-300/25 rounded-full blur-3xl"
          animate={{ scale: [1, 1.15, 1], opacity: [0.45, 0.6, 0.45] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </div>

      <div className="fixed top-4 right-4 md:top-6 md:right-6 z-50">
        <ThemeToggle size="sm" />
      </div>

      {/* Pop-ups de mensagens abaixo do ThemeToggle (topo direito) */}
      <div className="pointer-events-none fixed top-16 md:top-20 left-0 right-0 z-50 flex justify-end pr-4 md:pr-6">
        <AnimatePresence mode="wait">
          {error && (
            <Motion.div
              key="error"
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.28, ease: 'easeInOut' }}
              className="pointer-events-auto mx-4 md:mx-0 px-4 py-3 rounded-xl shadow-lg border bg-white/90 dark:bg-gray-800/90 backdrop-blur text-red-700 dark:text-red-300 border-red-200 dark:border-red-800 flex items-center"
              role="alert"
              aria-live="assertive"
            >
              <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
              <span className="text-sm">{error}</span>
              <button
                type="button"
                aria-label="Fechar"
                onClick={() => setError('')}
                className="ml-3 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-red-700 hover:text-red-800 dark:text-red-300 dark:hover:text-red-200"
              >
                <X className="w-4 h-4" />
              </button>
            </Motion.div>
          )}
          {!error && success && (
            <Motion.div
              key="success"
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.28, ease: 'easeInOut' }}
              className="pointer-events-auto mx-4 md:mx-0 px-4 py-3 rounded-xl shadow-lg border bg-white/90 dark:bg-gray-800/90 backdrop-blur text-green-700 dark:text-green-300 border-green-200 dark:border-green-800 flex items-center"
              role="status"
              aria-live="polite"
            >
              <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
              <span className="text-sm">{success}</span>
              <button
                type="button"
                aria-label="Fechar"
                onClick={() => setSuccess('')}
                className="ml-3 p-1 rounded hover:bg-green-50 dark:hover:bg-green-900/20 text-green-700 hover:text-green-800 dark:text-green-300 dark:hover:text-green-200"
              >
                <X className="w-4 h-4" />
              </button>
            </Motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="w-full max-w-5xl flex rounded-2xl overflow-hidden shadow-2xl relative z-10 bg-white dark:bg-gray-800">
        {/* Painel de vídeo restaurado */}
        <Motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="hidden lg:flex flex-1 relative overflow-hidden"
        >
          <video
            src="/videos/bi-animation.mp4"
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
          >
            Seu navegador não suporta a tag de vídeo.
          </video>
        </Motion.div>

        {/* formulário */}
        <Motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex-1 p-8 lg:p-12 bg-white dark:bg-gray-800 flex flex-col min-h-[560px] sm:min-h-[600px] md:min-h-[70vh] lg:min-h-[80vh]"
        >
          <Motion.div variants={itemVariants} className="text-center mb-8">
            <Motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl mb-4 shadow-lg"
            >
              <Zap className="w-10 h-10 text-white" />
            </Motion.div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Bem-vindo de volta</h1>
            <p className="text-gray-600 dark:text-gray-400">Faça login para acessar o sistema</p>
          </Motion.div>

          <div className="flex-1 flex items-center">
            <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md mx-auto">
            <Motion.div variants={itemVariants}>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={() => handleBlur('email')}
                  className={`w-full pl-10 pr-3 py-3 bg-gray-50 dark:bg-gray-900/50 border-2 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                    touched.email && !validateEmail(formData.email) ? 'border-red-300 dark:border-red-600' : 'border-gray-200 dark:border-gray-700'
                  }`}
                  placeholder="Digite seu e-mail"
                  disabled={isLoading}
                />
              </div>
            </Motion.div>

            <Motion.div variants={itemVariants}>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={() => handleBlur('password')}
                  className="w-full pl-10 pr-12 py-3 bg-gray-50 dark:bg-gray-900/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  placeholder="Digite sua senha"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </Motion.div>

            <Motion.div variants={itemVariants} className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500" />
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Lembrar-me</span>
              </label>
            </Motion.div>

            <Motion.div variants={itemVariants}>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center group"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  <>
                    Entrar no sistema
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </Motion.div>
            </form>
          </div>

          <Motion.p variants={itemVariants} className="text-center text-xs text-gray-500 dark:text-gray-400 mt-8">
            © 2025 iGreen Energy. Todos os direitos reservados.
          </Motion.p>
        </Motion.div>
      </div>
    </div>
  );
};

export default Login;