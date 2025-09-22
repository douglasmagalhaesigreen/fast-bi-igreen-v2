import api from './api';

export const dashboardService = {
  // Métricas principais
  getMetrics: async () => {
    const response = await api.get('/dashboard/metrics');
    return response.data;
  },

  // Gráfico de consumo mensal
  getConsumoMensal: async (months = 6) => {
    const response = await api.get(`/dashboard/chart/consumo-mensal?months=${months}`);
    return response.data;
  },

  // Distribuição regional
  getDistribuicaoRegional: async () => {
    const response = await api.get('/dashboard/chart/distribuicao-regional');
    return response.data;
  },

  // Evolução do faturamento
  getFaturamentoEvolucao: async () => {
    const response = await api.get('/dashboard/chart/faturamento-evolucao');
    return response.data;
  },

  // Top clientes
  getTopClientes: async (limit = 10) => {
    const response = await api.get(`/dashboard/chart/top-clientes?limit=${limit}`);
    return response.data;
  },

  // KPIs com comparação
  getKPIs: async () => {
    const response = await api.get('/dashboard/kpis');
    return response.data;
  }
};
