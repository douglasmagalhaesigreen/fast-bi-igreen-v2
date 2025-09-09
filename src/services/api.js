import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor para adicionar token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor para lidar com erros
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Se o erro for 401 e não for uma tentativa de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Tentar renovar o token
        const refresh_token = localStorage.getItem('refresh_token');
        if (refresh_token) {
          const response = await axios.post(`${API_URL}/auth/refresh`, {
            refresh_token
          });
          
          const { access_token } = response.data;
          localStorage.setItem('access_token', access_token);
          
          // Retry da requisição original com novo token
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Se o refresh falhar, fazer logout
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        toast.error('Sessão expirada. Por favor, faça login novamente.');
        return Promise.reject(refreshError);
      }
    }

    // Tratamento de outros erros
    if (error.response) {
      // Erro do servidor
      const message = error.response.data?.message || 'Erro no servidor';
      
      switch (error.response.status) {
        case 400:
          toast.error(`Requisição inválida: ${message}`);
          break;
        case 403:
          toast.error('Você não tem permissão para esta ação');
          break;
        case 404:
          toast.error('Recurso não encontrado');
          break;
        case 500:
          toast.error('Erro interno do servidor');
          break;
        default:
          toast.error(message);
      }
    } else if (error.request) {
      // Erro de rede
      toast.error('Erro de conexão. Verifique sua internet.');
    } else {
      // Erro na configuração
      toast.error('Erro ao processar requisição');
    }

    return Promise.reject(error);
  }
);

export default api;