import React, { useState, useEffect } from 'react';
import { Calendar, Download, ChevronDown, Users, Activity } from 'lucide-react';
import MetricCard from '../../components/dashboard/MetricCard';
import ExportPreviewModal from '../../components/dashboard/ExportPreviewModal';
import { useDashboardCard } from '../../hooks/useDashboardCard';
import { useSettings } from '../../contexts/SettingsContext';

const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState('consolidated');
  const [availableDates, setAvailableDates] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ NOVO Hook para buscar dados do card Total de Cadastrados
  const clientesCadastrados = useDashboardCard('clientes_cadastrados', selectedDate);
  
  // Hook para buscar dados do card Total de Ativações
  const totalAtivacoes = useDashboardCard('total_ativacoes', selectedDate);
  
  // Context de configurações
  const { settings } = useSettings();

  // Buscar datas disponíveis ao carregar o componente
  useEffect(() => {
    const fetchAvailableDates = async () => {
      try {
        const response = await fetch('/api/dashboard/available-dates', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        });
        
        if (response.ok) {
          const dates = await response.json();
          setAvailableDates(dates);
          
          // Selecionar a data mais recente por padrão (primeiro item da lista - DESC)
          if (dates.length > 0) {
            const mostRecentDate = dates[0];
            setSelectedDate(mostRecentDate.value);
          }
        }
      } catch (error) {
        console.error('Erro ao buscar datas disponíveis:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableDates();
  }, []);

  // ✅ Função para lidar com clique no card de Cadastrados
  const handleCadastradosClick = () => {
    if (settings.showExportPreview) {
      clientesCadastrados.openPreview();
    } else {
      clientesCadastrados.exportData();
    }
  };

  // Função para lidar com clique no card de Ativações
  const handleAtivacoesClick = () => {
    if (settings.showExportPreview) {
      totalAtivacoes.openPreview();
    } else {
      totalAtivacoes.exportData();
    }
  };

  // Obter label da data selecionada
  const getSelectedLabel = () => {
    if (selectedDate === 'consolidated') return 'Consolidado';
    const found = availableDates.find(d => d.value === selectedDate);
    return found ? found.label : selectedDate;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header com Filtro */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard Principal
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Visão geral do sistema iGreen Energy
          </p>
        </div>

        {/* Filtro de Data - Posicionado no canto superior direito */}
        <div className="flex items-center gap-2 ml-4">
          <Calendar className="w-4 h-4 text-gray-500" />
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              disabled={loading}
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors
                       focus:ring-2 focus:ring-green-500 focus:border-transparent
                       disabled:opacity-50 min-w-[140px] text-sm"
            >
              <span className="flex-1 text-left">
                {loading ? 'Carregando...' : getSelectedLabel()}
              </span>
              <ChevronDown className={`w-3 h-3 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown com altura fixa e scroll */}
            {isDropdownOpen && !loading && (
              <div className="absolute top-full right-0 mt-1 w-full bg-white dark:bg-gray-700 
                            border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-50
                            max-h-64 overflow-hidden">
                {/* Opção Consolidado - sempre visível */}
                <button
                  onClick={() => {
                    setSelectedDate('consolidated');
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 
                            transition-colors rounded-t-lg text-sm
                            ${selectedDate === 'consolidated' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 font-medium' : 'text-gray-900 dark:text-white'}`}
                >
                  <div className="flex items-center justify-between">
                    <span>Consolidado</span>
                    {selectedDate === 'consolidated' && (
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                    )}
                  </div>
                </button>

                {/* Divisor */}
                <div className="border-t border-gray-200 dark:border-gray-600" />

                {/* Container com scroll para as datas */}
                <div className="max-h-48 overflow-y-auto">
                  {availableDates.map((date, index) => (
                    <button
                      key={date.value}
                      onClick={() => {
                        setSelectedDate(date.value);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 
                                transition-colors text-sm ${index === availableDates.length - 1 ? 'rounded-b-lg' : ''}
                                ${selectedDate === date.value ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 font-medium' : 'text-gray-900 dark:text-white'}`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{date.label}</span>
                        {selectedDate === date.value && (
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cards Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* ✅ NOVO CARD: Total de Cadastrados (À ESQUERDA) */}
        <MetricCard
          title="Total de Cadastrados"
          value={clientesCadastrados.data?.value}
          change={clientesCadastrados.data?.change}
          icon={Users}
          color="blue"
          format="number"
          loading={clientesCadastrados.loading}
          exporting={clientesCadastrados.exporting}
          onClick={handleCadastradosClick}
          clickable={true}
        />

        {/* Card: Total de Ativações (À DIREITA) */}
        <MetricCard
          title="Total de Ativações"
          value={totalAtivacoes.data?.value}
          change={totalAtivacoes.data?.change}
          icon={Activity}
          color="green"
          format="number"
          loading={totalAtivacoes.loading}
          exporting={totalAtivacoes.exporting}
          onClick={handleAtivacoesClick}
          clickable={true}
        />
        
        {/* Espaço para cards futuros */}
      </div>

      {/* ✅ Modal de Prévia para Clientes Cadastrados */}
      <ExportPreviewModal
        isOpen={clientesCadastrados.showPreview}
        onClose={clientesCadastrados.closePreview}
        cardName="clientes_cadastrados"
        cardTitle="Total de Cadastrados"
        selectedDate={selectedDate}
        onDownload={clientesCadastrados.exportData}
      />

      {/* Modal de Prévia para Total de Ativações */}
      <ExportPreviewModal
        isOpen={totalAtivacoes.showPreview}
        onClose={totalAtivacoes.closePreview}
        cardName="total_ativacoes"
        cardTitle="Total de Ativações"
        selectedDate={selectedDate}
        onDownload={totalAtivacoes.exportData}
      />

      {/* Overlay para fechar dropdown */}
      {isDropdownOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;