import React, { useState, useEffect, useCallback } from 'react';
import { Users, UserPlus, AlertCircle, CheckCircle, X, ArrowLeft, Home, Settings } from 'lucide-react';
import CreateUserForm from './CreateUserForm';
import UserList from './UserList';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  phone?: string;
  companyName?: string;
  location?: string;
  isActive?: boolean;
  createdAt?: string;
  lastLogin?: string;
}

interface ApiUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  companyName?: string;
  location?: string;
  isActive?: boolean;
  createdAt?: string;
  lastLogin?: string;
}

interface NotificationProps {
  type: 'success' | 'error';
  message: string;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ type, message, onClose }) => (
  <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-6 py-4 rounded-lg shadow-lg border ${
    type === 'success' 
      ? 'bg-green-50 border-green-200 text-green-800' 
      : 'bg-red-50 border-red-200 text-red-800'
  }`}>
    {type === 'success' ? (
      <CheckCircle className="w-5 h-5 text-green-600" />
    ) : (
      <AlertCircle className="w-5 h-5 text-red-600" />
    )}
    <span className="font-medium">{message}</span>
    <button
      onClick={onClose}
      className="ml-2 p-1 hover:bg-white hover:bg-opacity-50 rounded"
    >
      <X className="w-4 h-4" />
    </button>
  </div>
);

interface AdminCreateUserPageProps {
  onNavigate?: (page: string) => void;
}

const AdminCreateUserPage: React.FC<AdminCreateUserPageProps> = ({ onNavigate }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<'create' | 'list'>('create');
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);

  const showNotification = useCallback((type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  }, []);

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/users`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();
      
      if (result.success) {
        // Mapper les données de l'API vers le format frontend
        const usersArray = result.data?.users || result.data?.data?.users || result.data || [];
        const mappedUsers: User[] = usersArray.map((user: ApiUser) => ({
          id: user._id,
          // Bug 5 fix: fallback firstName+lastName si name est vide
          username: user.name || `${(user as any).firstName || ''} ${(user as any).lastName || ''}`.trim() || user.email,
          email: user.email,
          role: user.role,
          phone: user.phone,
          companyName: user.companyName,
          location: user.location,
          isActive: user.isActive,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin
        }));
        setUsers(mappedUsers);
      } else {
        throw new Error(result.error || 'Erreur lors du chargement des utilisateurs');
      }
    } catch (error) {
      console.error('Erreur:', error);
      showNotification('error', 'Erreur lors du chargement des utilisateurs');
      setUsers([]); // Pas de fallback - forcer l'utilisation de l'API
    } finally {
      setIsLoading(false);
    }
  }, [showNotification]);

  // Charger les utilisateurs au démarrage
  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleCreateUser = async (userData: {
    username: string;
    email: string;
    password: string;
    role: string;
    phone?: string;
    companyName?: string;
    location?: string;
  }) => {
    try {
      // Mapper les données pour l'API backend
      const nameParts = userData.username.split(' ');
      const apiData = {
        email: userData.email,
        password: userData.password,
        role: userData.role,
        firstName: nameParts[0] || userData.username,
        lastName: nameParts.slice(1).join(' ') || 'User',
        phone: userData.phone || '',
        companyName: userData.companyName || '',
        location: userData.location || '',
        isActive: true
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/users`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(apiData)
      });

      const result = await response.json();

      if (result.success) {
        // Mapper la réponse pour l'interface
        const newUser: User = {
          id: result.data._id,
          username: result.data.name,
          email: result.data.email,
          role: result.data.role,
          phone: result.data.phone,
          companyName: result.data.companyName,
          location: result.data.location,
          isActive: result.data.isActive,
          createdAt: result.data.createdAt
        };
        
        setUsers(prev => [...prev, newUser]);
        showNotification('success', `Utilisateur ${userData.username} créé avec succès`);
        setActiveTab('list');
      } else {
        throw new Error(result.error || 'Erreur lors de la création');
      }
    } catch (error) {
      console.error('Erreur création:', error);
      showNotification('error', error instanceof Error ? error.message : 'Erreur lors de la création');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    if (!confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur ${user.username} ?`)) {
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();

      if (result.success) {
        setUsers(prev => prev.filter(u => u.id !== userId));
        showNotification('success', `Utilisateur ${user.username} supprimé`);
      } else {
        throw new Error(result.error || 'Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Erreur suppression:', error);
      showNotification('error', error instanceof Error ? error.message : 'Erreur lors de la suppression');
    }
  };

  const handleToggleUserStatus = async (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    try {
      // Bug 3 fix: utiliser le bon endpoint PATCH /admin/users/:id/toggle-status
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/users/${userId}/toggle-status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();

      if (result.success) {
        setUsers(prev => prev.map(u => 
          u.id === userId 
            ? { ...u, isActive: !u.isActive } 
            : u
        ));
        showNotification('success', `Statut de ${user.username} modifié`);
      } else {
        throw new Error(result.error || 'Erreur lors de la modification du statut');
      }
    } catch (error) {
      console.error('Erreur toggle status:', error);
      showNotification('error', error instanceof Error ? error.message : 'Erreur lors du changement de statut');
    }
  };

  const handleEditUser = (user: User) => {
    console.log('Éditer utilisateur:', user);
    // Pré-remplir le formulaire avec les données de l'utilisateur
    setActiveTab('create');
    showNotification('info', `Mode édition pour ${user.username} - Fonction à implémenter complètement`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec navigation */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              {/* Bouton retour */}
              <button
                onClick={() => onNavigate && onNavigate('admin-dashboard')}
                className="mr-2 p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                title="Retour au dashboard admin"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              
              <div className="bg-blue-100 p-2 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Gestion des utilisateurs</h1>
                <p className="text-sm text-gray-600">Administration des comptes utilisateurs</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Navigation rapide */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate && onNavigate('dashboard')}
                  className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                  title="Accueil"
                >
                  <Home className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onNavigate && onNavigate('settings')}
                  className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                  title="Paramètres"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>
              
              <div className="bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setActiveTab('create')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'create'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <UserPlus className="w-4 h-4" />
                  Créer utilisateur
                </button>
                <button
                  onClick={() => setActiveTab('list')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'list'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  Liste utilisateurs ({users.length})
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Chargement...</span>
          </div>
        ) : (
          <>
            {activeTab === 'create' && (
              <CreateUserForm onCreate={handleCreateUser} />
            )}

            {activeTab === 'list' && (
              <UserList 
                users={users}
                onDelete={handleDeleteUser}
                onEdit={handleEditUser}
                onToggleStatus={handleToggleUserStatus}
              />
            )}
          </>
        )}
      </div>

      {/* Notifications */}
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
};

export default AdminCreateUserPage;
