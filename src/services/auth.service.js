import api from './api';

export const authService = {
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    return response;
  },

  async logout() {
    const response = await api.post('/auth/logout');
    return response;
  },

  async register(userData) {
    const response = await api.post('/auth/register', userData);
    return response;
  },

  async verifyToken() {
    try {
      const response = await api.get('/auth/verify');
      return response.data;
    } catch (error) {
      return null;
    }
  },

  async refreshToken() {
    const refresh_token = localStorage.getItem('refresh_token');
    if (!refresh_token) {
      throw new Error('No refresh token available');
    }
    
    const response = await api.post('/auth/refresh', { refresh_token });
    const { access_token } = response.data;
    
    localStorage.setItem('access_token', access_token);
    return access_token;
  },

  async resetPassword(email) {
    const response = await api.post('/auth/reset-password', { email });
    return response;
  },

  async updatePassword(token, newPassword) {
    const response = await api.post('/auth/update-password', {
      token,
      new_password: newPassword
    });
    return response;
  }
};