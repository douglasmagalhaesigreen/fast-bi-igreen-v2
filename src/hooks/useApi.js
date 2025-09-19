// src/hooks/useApi.js - Hook personalizado para API
import { useState, useEffect, useCallback } from 'react';

// Configuração base da API
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://seu-dominio.com/api' 
  : 'http://localhost:3001/api';

// Cliente HTTP personalizado
class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('fast-bi-token');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('fast-bi-token', token);
  }

  removeToken() {
    this.token = null;
    localStorage.removeItem('fast-bi-token');
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Adicionar token se disponível
    if (this.token) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, config);
      
      // Se token expirou, fazer logout
      if (response.status === 401) {
        this.removeToken();
        window.location.reload();
        return null;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // Métodos HTTP
  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

// Instância global do cliente
export const apiClient = new ApiClient();

// Hook para requisições API com estado
export const useApi = (endpoint, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    immediate = true,
    dependencies = [],
    onSuccess,
    onError,
  } = options;

  const execute = useCallback(async (customEndpoint, customOptions = {}) => {
    const finalEndpoint = customEndpoint || endpoint;
    if (!finalEndpoint) return;

    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get(finalEndpoint, customOptions);
      setData(response);
      
      if (onSuccess) {
        onSuccess(response);
      }

      return response;
    } catch (err) {
      const errorMessage = err.message || 'Erro na requisição';
      setError(errorMessage);
      
      if (onError) {
        onError(err);
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, [endpoint, onSuccess, onError]);

  useEffect(() => {
    if (immediate && endpoint) {
      execute();
    }
  }, [execute, immediate, ...dependencies]);

  return {
    data,
    loading,
    error,
    execute,
    refetch: () => execute()
  };
};

// Hook específico para métricas do dashboard
export const useDashboardMetrics = () => {
  return useApi('/dashboard/metrics', {
    onError: (error) => console.error('Erro ao carregar métricas:', error)
  });
};

// Hook para dados mensais
export const useMonthlyData = () => {
  return useApi('/dashboard/monthly-data', {
    onError: (error) => console.error('Erro ao carregar dados mensais:', error)
  });
};

// Hook para dados regionais
export const useRegionalData = () => {
  return useApi('/dashboard/regional-data', {
    onError: (error) => console.error('Erro ao carregar dados regionais:', error)
  });
};

// Hook para lista de clientes
export const useClients = (filters = {}) => {
  const [queryString, setQueryString] = useState('');

  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    setQueryString(params.toString());
  }, [filters]);

  return useApi(`/clients${queryString ? `?${queryString}` : ''}`, {
    dependencies: [queryString],
    onError: (error) => console.error('Erro ao carregar clientes:', error)
  });
};

// Hook para analytics
export const useAnalytics = (dateRange = {}) => {
  const [queryString, setQueryString] = useState('');

  useEffect(() => {
    const params = new URLSearchParams();
    if (dateRange.startDate) params.append('startDate', dateRange.startDate);
    if (dateRange.endDate) params.append('endDate', dateRange.endDate);
    setQueryString(params.toString());
  }, [dateRange]);

  return useApi(`/analytics/overview${queryString ? `?${queryString}` : ''}`, {
    dependencies: [queryString],
    onError: (error) => console.error('Erro ao carregar analytics:', error)
  });
};

// src/hooks/useAuth.js - Hook de autenticação integrado
import { useState, useEffect, useContext, createContext } from 'react';
import { apiClient } from './useApi';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('fast-bi-token');
    const userData = localStorage.getItem('fast-bi-user');

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
        apiClient.setToken(token);
      } catch (error) {
        console.error('Erro ao recuperar dados do usuário:', error);
        logout();
      }
    }

    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      
      const response = await apiClient.post('/auth/login', { email, password });
      
      if (response.success) {
        setUser(response.user);
        setIsAuthenticated(true);
        apiClient.setToken(response.token);
        
        // Salvar no localStorage
        localStorage.setItem('fast-bi-user', JSON.stringify(response.user));
        localStorage.setItem('fast-bi-token', response.token);
        
        return { success: true };
      } else {
        return { success: false, error: response.error || 'Erro no login' };
      }
    } catch (error) {
      console.error('Erro no login:', error);
      return { success: false, error: error.message || 'Erro de conexão' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Tentar fazer logout no servidor
      if (isAuthenticated) {
        await apiClient.post('/auth/logout');
      }
    } catch (error) {
      console.error('Erro ao fazer logout no servidor:', error);
    } finally {
      // Limpar estado local sempre
      setUser(null);
      setIsAuthenticated(false);
      apiClient.removeToken();
      localStorage.removeItem('fast-bi-user');
      localStorage.removeItem('fast-bi-token');
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// src/hooks/useRealTimeData.js - Hook para dados em tempo real
import { useState, useEffect, useRef } from 'react';

export const useRealTimeData = (endpoint, interval = 30000) => {
  const [data, setData] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const intervalRef = useRef(null);

  const fetchData = async () => {
    try {
      const response = await apiClient.get(endpoint);
      setData(response);
      setLastUpdate(new Date());
      setIsConnected(true);
    } catch (error) {
      console.error('Erro ao buscar dados em tempo real:', error);
      setIsConnected(false);
    }
  };

  useEffect(() => {
    // Buscar dados imediatamente
    fetchData();

    // Configurar interval para atualizações automáticas
    intervalRef.current = setInterval(fetchData, interval);

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [endpoint, interval]);

  // Pausar/retomar atualizações
  const pauseUpdates = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const resumeUpdates = () => {
    if (!intervalRef.current) {
      intervalRef.current = setInterval(fetchData, interval);
    }
  };

  return {
    data,
    isConnected,
    lastUpdate,
    pauseUpdates,
    resumeUpdates,
    refresh: fetchData
  };
};

// src/hooks/useLocalStorage.js - Hook para persistência local
import { useState, useEffect } from 'react';

export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Erro ao ler localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Erro ao salvar localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};

// src/hooks/useDebounce.js - Hook para debounce de pesquisas
import { useState, useEffect } from 'react';

export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// src/hooks/useNotifications.js - Hook para sistema de notificações
import { useState, useCallback } from 'react';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((notification) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      type: 'info', // info, success, warning, error
      duration: 5000,
      ...notification
    };

    setNotifications(prev => [...prev, newNotification]);

    // Auto remove após duração especificada
    if (newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }

    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Métodos de conveniência
  const showSuccess = useCallback((message, options = {}) => {
    return addNotification({
      type: 'success',
      title: 'Sucesso',
      message,
      ...options
    });
  }, [addNotification]);

  const showError = useCallback((message, options = {}) => {
    return addNotification({
      type: 'error',
      title: 'Erro',
      message,
      duration: 8000, // Erros ficam mais tempo
      ...options
    });
  }, [addNotification]);

  const showWarning = useCallback((message, options = {}) => {
    return addNotification({
      type: 'warning',
      title: 'Atenção',
      message,
      ...options
    });
  }, [addNotification]);

  const showInfo = useCallback((message, options = {}) => {
    return addNotification({
      type: 'info',
      title: 'Informação',
      message,
      ...options
    });
  }, [addNotification]);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
};

// src/utils/apiEndpoints.js - Centralizador de endpoints
export const API_ENDPOINTS = {
  // Autenticação
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile'
  },

  // Dashboard
  DASHBOARD: {
    METRICS: '/dashboard/metrics',
    MONTHLY_DATA: '/dashboard/monthly-data',
    REGIONAL_DATA: '/dashboard/regional-data',
    PERFORMANCE: '/dashboard/performance'
  },

  // Clientes
  CLIENTS: {
    LIST: '/clients',
    DETAIL: (id) => `/clients/${id}`,
    CREATE: '/clients',
    UPDATE: (id) => `/clients/${id}`,
    DELETE: (id) => `/clients/${id}`,
    SEARCH: '/clients/search'
  },

  // Analytics
  ANALYTICS: {
    OVERVIEW: '/analytics/overview',
    TRENDS: '/analytics/trends',
    REPORTS: '/analytics/reports'
  }
};

// src/utils/errorHandler.js - Tratamento centralizado de erros
export class ApiError extends Error {
  constructor(message, status, code) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

export const handleApiError = (error, showNotification = null) => {
  console.error('API Error:', error);

  let userMessage = 'Ocorreu um erro inesperado';
  
  if (error instanceof ApiError) {
    switch (error.status) {
      case 400:
        userMessage = 'Dados inválidos enviados';
        break;
      case 401:
        userMessage = 'Sessão expirada. Faça login novamente';
        break;
      case 403:
        userMessage = 'Você não tem permissão para esta ação';
        break;
      case 404:
        userMessage = 'Recurso não encontrado';
        break;
      case 500:
        userMessage = 'Erro interno do servidor';
        break;
      default:
        userMessage = error.message || 'Erro na comunicação com o servidor';
    }
  } else if (error.message) {
    userMessage = error.message;
  }

  // Mostrar notificação se função foi fornecida
  if (showNotification && typeof showNotification === 'function') {
    showNotification(userMessage, { type: 'error' });
  }

  return userMessage;
};

// src/contexts/AppContext.js - Context principal da aplicação
import React, { createContext, useContext, useReducer } from 'react';

// Estado inicial da aplicação
const initialState = {
  theme: 'light',
  sidebarCollapsed: false,
  activeView: 'dashboard',
  filters: {
    dateRange: {
      start: null,
      end: null
    },
    region: 'all',
    status: 'all'
  },
  cache: {},
  lastUpdated: null
};

// Actions para o reducer
const ACTIONS = {
  SET_THEME: 'SET_THEME',
  TOGGLE_SIDEBAR: 'TOGGLE_SIDEBAR',
  SET_ACTIVE_VIEW: 'SET_ACTIVE_VIEW',
  SET_FILTERS: 'SET_FILTERS',
  UPDATE_CACHE: 'UPDATE_CACHE',
  CLEAR_CACHE: 'CLEAR_CACHE',
  SET_LAST_UPDATED: 'SET_LAST_UPDATED'
};

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_THEME:
      return { ...state, theme: action.payload };
    
    case ACTIONS.TOGGLE_SIDEBAR:
      return { ...state, sidebarCollapsed: !state.sidebarCollapsed };
    
    case ACTIONS.SET_ACTIVE_VIEW:
      return { ...state, activeView: action.payload };
    
    case ACTIONS.SET_FILTERS:
      return { 
        ...state, 
        filters: { ...state.filters, ...action.payload }
      };
    
    case ACTIONS.UPDATE_CACHE:
      return {
        ...state,
        cache: { ...state.cache, [action.key]: action.data },
        lastUpdated: new Date().toISOString()
      };
    
    case ACTIONS.CLEAR_CACHE:
      return { ...state, cache: {} };
    
    case ACTIONS.SET_LAST_UPDATED:
      return { ...state, lastUpdated: action.payload };
    
    default:
      return state;
  }
};

// Context
const AppContext = createContext();

// Provider
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Actions
  const setTheme = (theme) => {
    dispatch({ type: ACTIONS.SET_THEME, payload: theme });
    localStorage.setItem('fast-bi-theme', theme);
  };

  const toggleSidebar = () => {
    dispatch({ type: ACTIONS.TOGGLE_SIDEBAR });
  };

  const setActiveView = (view) => {
    dispatch({ type: ACTIONS.SET_ACTIVE_VIEW, payload: view });
  };

  const setFilters = (filters) => {
    dispatch({ type: ACTIONS.SET_FILTERS, payload: filters });
  };

  const updateCache = (key, data) => {
    dispatch({ type: ACTIONS.UPDATE_CACHE, key, data });
  };

  const clearCache = () => {
    dispatch({ type: ACTIONS.CLEAR_CACHE });
  };

  const value = {
    ...state,
    setTheme,
    toggleSidebar,
    setActiveView,
    setFilters,
    updateCache,
    clearCache
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Hook para usar o context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp deve ser usado dentro de AppProvider');
  }
  return context;
};

// src/utils/formatters.js - Funções de formatação
export const formatters = {
  // Formatar valores monetários
  currency: (value, locale = 'pt-BR', currency = 'BRL') => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(value);
  },

  // Formatar números
  number: (value, locale = 'pt-BR', options = {}) => {
    return new Intl.NumberFormat(locale, options).format(value);
  },

  // Formatar datas
  date: (date, locale = 'pt-BR', options = {}) => {
    const defaultOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    
    return new Intl.DateTimeFormat(locale, { ...defaultOptions, ...options })
      .format(new Date(date));
  },

  // Formatar data/hora
  datetime: (date, locale = 'pt-BR') => {
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  },

  // Formatar percentual
  percentage: (value, decimals = 1) => {
    return `${Number(value).toFixed(decimals)}%`;
  },

  // Formatar kWh
  energy: (value) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M kWh`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}k kWh`;
    }
    return `${value} kWh`;
  },

  // Formatar nome próprio
  capitalizeFirst: (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },

  // Formatar CPF/CNPJ
  document: (value) => {
    if (!value) return '';
    
    const cleaned = value.replace(/\D/g, '');
    
    if (cleaned.length === 11) {
      // CPF
      return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (cleaned.length === 14) {
      // CNPJ
      return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
    
    return value;
  }
};

// src/utils/validators.js - Funções de validação
export const validators = {
  email: (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  },

  password: (password) => {
    return password && password.length >= 6;
  },

  cpf: (cpf) => {
    if (!cpf) return false;
    
    const cleaned = cpf.replace(/\D/g, '');
    if (cleaned.length !== 11) return false;
    
    // Verificar se não são todos dígitos iguais
    if (/^(\d)\1+$/.test(cleaned)) return false;
    
    // Validação do CPF
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleaned.charAt(i)) * (10 - i);
    }
    
    let digit = 11 - (sum % 11);
    if (digit >= 10) digit = 0;
    
    if (digit !== parseInt(cleaned.charAt(9))) return false;
    
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleaned.charAt(i)) * (11 - i);
    }
    
    digit = 11 - (sum % 11);
    if (digit >= 10) digit = 0;
    
    return digit === parseInt(cleaned.charAt(10));
  },

  cnpj: (cnpj) => {
    if (!cnpj) return false;
    
    const cleaned = cnpj.replace(/\D/g, '');
    if (cleaned.length !== 14) return false;
    
    // Verificar se não são todos dígitos iguais
    if (/^(\d)\1+$/.test(cleaned)) return false;
    
    // Validação do CNPJ
    const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += parseInt(cleaned.charAt(i)) * weights1[i];
    }
    
    let digit = sum % 11;
    digit = digit < 2 ? 0 : 11 - digit;
    
    if (digit !== parseInt(cleaned.charAt(12))) return false;
    
    sum = 0;
    for (let i = 0; i < 13; i++) {
      sum += parseInt(cleaned.charAt(i)) * weights2[i];
    }
    
    digit = sum % 11;
    digit = digit < 2 ? 0 : 11 - digit;
    
    return digit === parseInt(cleaned.charAt(13));
  },

  required: (value) => {
    return value !== null && value !== undefined && value !== '';
  }
};