import React from 'react';
import Header from '@/components/layout/Header';
import { ArrowLeft } from 'lucide-react';
import { useUserDashboardNavigation } from '@/utils/navigationUtils';
import { useAuthStore } from '@/stores/authStore';

interface TestConnectionProps {
  onNavigate: (page: string) => void;
}

// Composant pour tester l'Admin
const AdminTestButton: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const { loginAsAdmin } = useAuthStore();
  
  const handleAdminLogin = () => {
    loginAsAdmin();
    onNavigate('admin-dashboard');
  };
  
  return (
    <button
      onClick={handleAdminLogin}
      className="w-full px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
    >
      🛡️ Connexion Admin Test
    </button>
  );
};

const TestConnection: React.FC<TestConnectionProps> = ({ onNavigate }) => {
  const { navigateToUserDashboard } = useUserDashboardNavigation();
  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="test-connection" onNavigate={onNavigate} />
      
      <div className="flex items-center justify-center py-8">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
          <button
            onClick={() => navigateToUserDashboard(onNavigate)}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </button>
        <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          🔗 Test de Connexion
        </h1>
        
        <div className="space-y-4">
          <div className="p-4 bg-green-100 rounded-lg">
            <h2 className="text-lg font-semibold text-green-800">✅ Frontend Chargé</h2>
            <p className="text-sm text-green-700">
              Le frontend React fonctionne correctement
            </p>
          </div>
          
          <div className="p-4 bg-red-100 rounded-lg">
            <h2 className="text-lg font-semibold text-red-800">🛡️ Test Admin</h2>
            <p className="text-sm text-red-700 mb-3">
              Activer l'utilisateur Admin pour tester le dashboard administrateur
            </p>
            <AdminTestButton onNavigate={onNavigate} />
          </div>
          
          <div className="p-4 bg-blue-100 rounded-lg">
            <h2 className="text-lg font-semibold text-blue-800">📡 Test API</h2>
            <p className="text-sm text-blue-700">
              Cliquez sur le bouton pour tester la connexion backend
            </p>
            <button 
              onClick={() => {
                fetch('http://localhost:5000/health')
                  .then(res => res.json())
                  .then(data => {
                    alert('✅ Backend connecté: ' + data.message);
                  })
                  .catch(err => {
                    alert('❌ Erreur backend: ' + err.message);
                  });
              }}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Tester Backend
            </button>
          </div>
          
          <div className="p-4 bg-yellow-100 rounded-lg">
            <h2 className="text-lg font-semibold text-yellow-800">⚠️ Debug Info</h2>
            <div className="text-sm text-yellow-700 space-y-1">
              <div>Frontend URL: {window.location.origin}</div>
              <div>API URL: {import.meta.env.VITE_API_URL || 'http://localhost:5000'}</div>
              <div>Environnement: {import.meta.env.MODE}</div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default TestConnection;
