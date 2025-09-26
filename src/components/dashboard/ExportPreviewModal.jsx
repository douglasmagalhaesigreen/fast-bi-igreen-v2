import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Download, FileSpreadsheet, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ExportPreviewModal = ({ 
  isOpen, 
  onClose, 
  cardName, 
  cardTitle,
  selectedDate,
  onDownload 
}) => {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [downloading, setDownloading] = useState(false);
  
  const itemsPerPage = 50;

  useEffect(() => {
    if (isOpen && cardName) {
      fetchPreviewData();
    }
  }, [isOpen, cardName, selectedDate]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const fetchPreviewData = async () => {
    setLoading(true);
    setError(null);

    try {
      const consolidated = selectedDate === 'consolidated';
      const params = new URLSearchParams({
        consolidated: consolidated.toString(),
        ...(consolidated ? {} : { date: selectedDate })
      });

      const response = await fetch(`/api/dashboard/export/${cardName}?${params}&preview=true`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        
        // ✅ NOVO FORMATO: Backend envia columns + rows separadamente
        if (result.columns && result.rows) {
          setColumns(result.columns);
          setRows(result.rows);
          console.log('✅ Ordem das colunas preservada:', result.columns.slice(0, 5));
        } else {
          // Fallback para formato antigo (se houver)
          const data = result.data || [];
          if (data.length > 0) {
            setColumns(Object.keys(data[0]));
            setRows(data.map(row => Object.values(row)));
          }
        }
      } else {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }
    } catch (err) {
      console.error('Erro ao buscar dados da prévia:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      // Fechar modal primeiro para mostrar animação no card
      onClose();
      
      // Executar download
      await onDownload();
    } catch (err) {
      console.error('Erro no download:', err);
    } finally {
      setDownloading(false);
    }
  };

  const getPaginatedRows = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return rows.slice(startIndex, startIndex + itemsPerPage);
  };

  const totalPages = Math.ceil(rows.length / itemsPerPage);
  const paginatedRows = getPaginatedRows();

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
        style={{ zIndex: 999999, margin: 0, padding: '16px' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Prévia de Exportação - {cardTitle}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedDate === 'consolidated' ? 'Dados consolidados' : `Período: ${selectedDate.replace(/(\d{4})-(\d{2})/, '$2/$1')}`}
                  {rows.length > 0 && ` • Primeiros ${Math.min(rows.length, 50)} registros exibidos • ${columns.length} colunas`}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handleDownload}
                disabled={loading || downloading || rows.length === 0}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 
                         text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {downloading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                <span>{downloading ? 'Gerando...' : 'Download Excel'}</span>
              </button>
              
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <span className="text-gray-600 dark:text-gray-400">Carregando dados...</span>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <p className="text-red-600 dark:text-red-400 mb-2">Erro ao carregar dados</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{error}</p>
                  <button
                    onClick={fetchPreviewData}
                    className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Tentar novamente
                  </button>
                </div>
              </div>
            ) : rows.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <FileSpreadsheet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">Nenhum dado encontrado</p>
                </div>
              </div>
            ) : (
              <div className="p-6">
                {/* Container com scroll horizontal e vertical */}
                <div className="overflow-auto max-h-[60vh] border border-gray-200 dark:border-gray-600 rounded-lg">
                  <table className="w-full text-sm min-w-max">
                    <thead className="sticky top-0 bg-gray-50 dark:bg-gray-700 z-10">
                      <tr>
                        {columns.map((column, index) => (
                          <th
                            key={`col-${index}`}
                            className="text-left p-3 font-medium text-gray-900 dark:text-white border-b dark:border-gray-600 whitespace-nowrap min-w-[120px]"
                          >
                            {column}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedRows.map((row, rowIndex) => (
                        <tr
                          key={`row-${rowIndex}`}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700 border-b dark:border-gray-700 last:border-b-0"
                        >
                          {row.map((cellValue, cellIndex) => (
                            <td
                              key={`cell-${rowIndex}-${cellIndex}`}
                              className="p-3 text-gray-700 dark:text-gray-300 whitespace-nowrap min-w-[120px] max-w-[200px] truncate"
                              title={cellValue}
                            >
                              {cellValue || '-'}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Paginação */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6 pt-4 border-t dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, rows.length)} de {rows.length.toLocaleString('pt-BR')} registros
                    </p>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600"
                      >
                        Anterior
                      </button>
                      
                      <span className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400">
                        Página {currentPage} de {totalPages}
                      </span>
                      
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600"
                      >
                        Próxima
                      </button>
                    </div>
                  </div>
                )}

              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

export default ExportPreviewModal;