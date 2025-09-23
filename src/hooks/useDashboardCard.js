import { useState, useEffect } from 'react';

export const useDashboardCard = (cardName, selectedDate) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (!cardName || !selectedDate) return;

    const fetchCardData = async () => {
      setLoading(true);
      setError(null);

      try {
        const consolidated = selectedDate === 'consolidated';
        const params = new URLSearchParams({
          consolidated: consolidated.toString(),
          ...(consolidated ? {} : { date: selectedDate })
        });

        const response = await fetch(`/api/dashboard/card/${cardName}?${params}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        });

        if (response.ok) {
          const result = await response.json();
          setData(result);
        } else {
          throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }
      } catch (err) {
        console.error(`Erro ao buscar dados do card ${cardName}:`, err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCardData();
  }, [cardName, selectedDate]);

  const exportData = async () => {
    if (exporting) return; // Prevenir múltiplas exportações simultâneas
    
    setExporting(true);
    
    try {
      const consolidated = selectedDate === 'consolidated';
      const params = new URLSearchParams({
        consolidated: consolidated.toString(),
        ...(consolidated ? {} : { date: selectedDate })
      });

      const response = await fetch(`/api/dashboard/export/${cardName}?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      if (response.ok) {
        // Para download de Excel, tratar como blob
        const blob = await response.blob();
        
        // Extrair nome do arquivo do header ou criar um padrão
        const contentDisposition = response.headers.get('Content-Disposition');
        let filename = `${cardName}_${consolidated ? 'consolidado' : selectedDate}.xlsx`;
        
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
          if (filenameMatch && filenameMatch[1]) {
            filename = filenameMatch[1].replace(/['"]/g, '');
          }
        }
        
        // Criar link para download
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        return { success: true, filename };
      } else {
        const error = await response.json();
        throw new Error(error.error || `Erro ${response.status}: ${response.statusText}`);
      }
    } catch (err) {
      console.error(`Erro ao exportar dados do card ${cardName}:`, err);
      throw err;
    } finally {
      setExporting(false);
    }
  };

  return { data, loading, error, exportData, exporting };

  return { data, loading, error, exportData };
};