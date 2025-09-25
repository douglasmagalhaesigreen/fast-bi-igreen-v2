import React from 'react';
import { Settings as SettingsIcon, Eye, Download, Save } from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';

const Settings = () => {
  const { settings, updateSettings } = useSettings();

  const handleTogglePreview = () => {
    updateSettings({ showExportPreview: !settings.showExportPreview });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Configurações
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Personalize o comportamento do sistema
        </p>
      </div>

      {/* Configurações de Exportação */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div className="p-6 border-b dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Download className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Configurações de Exportação
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Controle como os dados são exportados dos cards
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Prévia de Exportação */}
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className={`p-2 rounded-lg ${settings.showExportPreview ? 'bg-green-100 dark:bg-green-900' : 'bg-gray-100 dark:bg-gray-700'}`}>
                <Eye className={`w-5 h-5 ${settings.showExportPreview ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`} />
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Prévia de Exportação
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Quando ativada, ao clicar nos cards, uma prévia dos dados será exibida antes do download
                  </p>
                </div>
                
                <button
                  onClick={handleTogglePreview}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                    ${settings.showExportPreview ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                      ${settings.showExportPreview ? 'translate-x-6' : 'translate-x-1'}`}
                  />
                </button>
              </div>

              {/* Descrição detalhada */}
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Como funciona:
                </h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• <strong>Ativada:</strong> Clique no card → Abre prévia em modal → Botão para download</li>
                  <li>• <strong>Desativada:</strong> Clique no card → Download direto do arquivo Excel</li>
                </ul>
              </div>

              {/* Status atual */}
              <div className="mt-4 flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${settings.showExportPreview ? 'bg-green-500' : 'bg-gray-400'}`} />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Status: {settings.showExportPreview ? 'Prévia ativada' : 'Download direto'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Outras configurações futuras */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div className="p-6 border-b dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <SettingsIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Outras Configurações
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Configurações adicionais serão adicionadas aqui
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Novas configurações serão disponibilizadas em breve...
            </p>
          </div>
        </div>
      </div>

      {/* Informações sobre persistência */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Save className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
              Configurações Automáticas
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              Suas configurações são salvas automaticamente e aplicadas em todas as sessões futuras.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;