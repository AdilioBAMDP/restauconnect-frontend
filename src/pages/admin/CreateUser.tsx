
import React, { useState } from 'react';
import CreateUserForm from '@/components/admin/CreateUserForm';
import Header from '@/components/layout/Header';
import { useUser } from '@/contexts/useUser';
import { ArrowLeft } from 'lucide-react';
import { useUserDashboardNavigation } from '@/utils/navigationUtils';
import { useAppStore } from '@/stores/appStore';

interface CreatedUser {
  username: string;
  email: string;
  password: string;
  role: string;
}

interface AdminCreateUserPageProps {
  onNavigate: (page: string) => void;
}

const AdminCreateUserPage: React.FC<AdminCreateUserPageProps> = () => {
  const { navigateTo } = useAppStore();
  const { currentUser } = useUser();
  const { navigateToUserDashboard } = useUserDashboardNavigation();
  const [createdUsers, setCreatedUsers] = useState<CreatedUser[]>([]);
  const [success, setSuccess] = useState('');

  // Autoriser tous les rôles d'administration (admin, super_admin)
  // Vérifie si le rôle courant est super_admin (le seul admin possible dans UserRole)
  const isAdmin = currentUser && currentUser.role === 'super_admin';
  if (!isAdmin) {
    return <div className="text-center mt-10 text-red-600">Accès refusé. Réservé à l'administrateur.</div>;
  }

  const handleCreate = (newUser: CreatedUser) => {
    setCreatedUsers(prev => [...prev, newUser]);
    setSuccess(`Utilisateur "${newUser.username}" créé !`);
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">

      
      
            <Header currentPage="create-user" onNavigate={(page) => navigateTo(page as any)} />

<div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => navigateTo('admin-dashboard' as any)}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour au tableau de bord
        </button>
        
        <CreateUserForm onCreate={handleCreate} />
        {success && <div className="mt-4 text-green-600">{success}</div>}
        <div className="mt-8">
          <h3 className="font-bold mb-2">Utilisateurs créés (session) :</h3>
          <ul>
            {createdUsers.map((u, i) => (
              <li key={i} className="border-b py-1">{u.username} ({u.email}) - {u.role}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminCreateUserPage;
