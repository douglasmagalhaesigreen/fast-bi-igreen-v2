import axios from 'axios';

// Garante que a URL da API seja lida das variáveis de ambiente
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor para adicionar o token de acesso em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para lidar com tokens expirados e tentar renová-los
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Se o erro for 401 (Não Autorizado) e ainda não tentamos repetir a requisição
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          // Tenta obter um novo access_token usando o refresh_token
          const response = await api.post('/auth/refresh', { refresh_token: refreshToken });
          const { access_token } = response.data;
          
          localStorage.setItem('access_token', access_token);
          api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Se a renovação falhar, desloga o usuário
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Serviços de Autenticação
export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  verify: () => api.get('/auth/verify')
};

// Serviços do Dashboard
export const dashboardService = {
  getMetrics: () => api.get('/dashboard/metrics'),
  getChartData: () => api.get('/dashboard/chart-data')
};

export default api;