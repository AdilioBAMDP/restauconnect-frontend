import React from 'react';
import { logger } from '@/utils/logger';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onShowNotifications?: () => void;
  onShowAuth?: () => void;
  notificationCount?: number;
}

const HeaderSimple: React.FC<HeaderProps> = ({ 
  currentPage, 
  onNavigate,
  onShowAuth
}) => {
  const handleClearStorage = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      alert('✅ Stockage nettoyé ! Rechargez la page (F5)');
      window.location.reload();
    } catch (error) {
      logger.error('Erreur lors du nettoyage du stockage', error);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-gray-900">Web Spider</h1>
          <span className="text-sm text-gray-500">Page: {currentPage}</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onNavigate('home')}
            className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
          >
            🏠 Accueil
          </button>
          <button
            onClick={() => onNavigate('search')}
            className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
          >
            🔍 Rechercher
          </button>
          <button
            onClick={() => onNavigate('test-accounts')}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
          >
            🧪 Comptes Test
          </button>
          <button
            onClick={handleClearStorage}
            className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
            title="Nettoyer le localStorage saturé"
          >
            🧹 Nettoyer
          </button>
          {onShowAuth && (
            <button
              onClick={onShowAuth}
              className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200"
            >
              🔐 Connexion
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default HeaderSimple;
