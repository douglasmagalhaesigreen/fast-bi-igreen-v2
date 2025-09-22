import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboardService';

export const useDashboardMetrics = () => {
  return useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: dashboardService.getMetrics,
    refetchInterval: 60000, // Atualizar a cada minuto
    staleTime: 30000,
  });
};

export const useDashboardCharts = () => {
  const consumoMensal = useQuery({
    queryKey: ['consumo-mensal'],
    queryFn: () => dashboardService.getConsumoMensal(6),
    staleTime: 5 * 60 * 1000,
  });

  const distribuicaoRegional = useQuery({
    queryKey: ['distribuicao-regional'],
    queryFn: dashboardService.getDistribuicaoRegional,
    staleTime: 5 * 60 * 1000,
  });

  const faturamentoEvolucao = useQuery({
    queryKey: ['faturamento-evolucao'],
    queryFn: dashboardService.getFaturamentoEvolucao,
    staleTime: 5 * 60 * 1000,
  });

  return {
    consumoMensal,
    distribuicaoRegional,
    faturamentoEvolucao
  };
};
