import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { logger } from '@/components/utils/logger';
import { 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  Mail,
  Phone,
  MapPin,
  User
} from 'lucide-react';
import toast from 'react-hot-toast';

interface PendingUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  profile?: {
    description?: string;
    specialties?: string[];
    businessInfo?: {
      companyName?: string;
      siret?: string;
    };
  };
  location?: {
    address?: string;
    city?: string;
    postalCode?: string;
  };
}

interface RegistrationStats {
  pending: number;
  approved: number;
  rejected: number;
  total: number;
}

interface PendingRegistrationsComponentProps {
  token: string;
}

const PendingRegistrationsComponent: React.FC<PendingRegistrationsComponentProps> = ({ token }) => {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [stats, setStats] = useState<RegistrationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<PendingUser | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [comments, setComments] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [processing, setProcessing] = useState(false);

  // Charger les données initiales
  const loadPendingRegistrations = useCallback(async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/pending-registrations`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPendingUsers(data.data || []);
      } else {
        throw new Error('Erreur lors du chargement des demandes');
      }
    } catch (error) {
      logger.error('Erreur lors du chargement des demandes d\'inscription', error);
      toast.error('Erreur lors du chargement des demandes d\'inscription');
    }
  }, [token]);

  const loadRegistrationStats = useCallback(async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/registration-stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.data);
      }
    } catch (error) {
      logger.error('Erreur lors du chargement des statistiques', error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadPendingRegistrations();
    loadRegistrationStats();
  }, [loadPendingRegistrations, loadRegistrationStats]);

  const handleAction = (user: PendingUser, action: 'approve' | 'reject') => {
    setSelectedUser(user);
    setActionType(action);
    setShowModal(true);
    setComments('');
    setRejectionReason('');
  };

  const confirmAction = async () => {
    if (!selectedUser || !actionType) return;

    setProcessing(true);
    try {
      const endpoint = actionType === 'approve' 
        ? `/api/admin/approve-registration/${selectedUser._id}`
        : `/api/admin/reject-registration/${selectedUser._id}`;

      const body = actionType === 'approve' 
        ? { comments }
        : { reason: rejectionReason, comments };

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        toast.success(`Inscription ${actionType === 'approve' ? 'approuvée' : 'rejetée'} avec succès`);
        
        // Recharger les données
        await Promise.all([
          loadPendingRegistrations(),
          loadRegistrationStats()
        ]);
        
        setShowModal(false);
        setSelectedUser(null);
        setActionType(null);
      } else {
        throw new Error('Erreur lors de l\'action');
      }
    } catch (error) {
      logger.error(`Erreur lors de l'${actionType === 'approve' ? 'approbation' : 'rejet'}`, error);
      toast.error(`Erreur lors de l'${actionType === 'approve' ? 'approbation' : 'rejet'}`);
    } finally {
      setProcessing(false);
    }
  };

  const getRoleDisplayName = (role: string) => {
    const roleNames: { [key: string]: string } = {
      'restaurant': 'Restaurant',
      'artisan': 'Artisan',
      'fournisseur': 'Fournisseur',
      'candidat': 'Candidat',
      'community_manager': 'Community Manager',
      'banquier': 'Banquier',
      'livreur': 'Livreur',
      'investisseur': 'Investisseur',
      'comptable': 'Comptable'
    };
    return roleNames[role] || role;
  };

  const getRoleColor = (role: string) => {
    const colors: { [key: string]: string } = {
      'restaurant': 'bg-blue-100 text-blue-800',
      'artisan': 'bg-green-100 text-green-800',
      'fournisseur': 'bg-purple-100 text-purple-800',
      'candidat': 'bg-yellow-100 text-yellow-800',
      'community_manager': 'bg-pink-100 text-pink-800',
      'banquier': 'bg-indigo-100 text-indigo-800',
      'livreur': 'bg-orange-100 text-orange-800',
      'investisseur': 'bg-red-100 text-red-800',
      'comptable': 'bg-gray-100 text-gray-800'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
        <span className="ml-3 text-lg text-gray-600">Chargement des demandes...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques */}
      <div className="bg-white rounded-lg shadow-md border">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Users className="w-6 h-6 text-blue-600 mr-2" />
              Demandes d'inscription
            </h2>
            <button
              onClick={() => {
                loadPendingRegistrations();
                loadRegistrationStats();
              }}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualiser
            </button>
          </div>
        </div>

        {stats && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-yellow-600 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">En attente</p>
                    <p className="text-xl font-bold text-yellow-900">{stats.pending}</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-green-800">Approuvées</p>
                    <p className="text-xl font-bold text-green-900">{stats.approved}</p>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <XCircle className="w-5 h-5 text-red-600 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-red-800">Rejetées</p>
                    <p className="text-xl font-bold text-red-900">{stats.rejected}</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-blue-600 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">Total</p>
                    <p className="text-xl font-bold text-blue-900">{stats.total}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Liste des demandes en attente */}
      <div className="bg-white rounded-lg shadow-md border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Demandes en attente de validation ({pendingUsers.length})
          </h3>
        </div>

        {pendingUsers.length === 0 ? (
          <div className="p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune demande en attente</h3>
            <p className="text-gray-600">Toutes les inscriptions ont été traitées.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {pendingUsers.map((user) => (
              <motion.div
                key={user._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="flex-shrink-0">
                        <User className="w-10 h-10 text-gray-400 bg-gray-100 rounded-full p-2" />
                      </div>
                      
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">{user.name}</h4>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                            {getRoleDisplayName(user.role)}
                          </span>
                          <span className="text-sm text-gray-500">
                            {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="w-4 h-4 mr-2" />
                        {user.email}
                      </div>
                      
                      {user.phone && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="w-4 h-4 mr-2" />
                          {user.phone}
                        </div>
                      )}
                      
                      {user.location?.city && (
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mr-2" />
                          {user.location.city}
                        </div>
                      )}
                    </div>

                    {user.profile?.description && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-700 line-clamp-2">
                          {user.profile.description}
                        </p>
                      </div>
                    )}

                    {user.profile?.specialties && user.profile.specialties.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Spécialisations:</p>
                        <div className="flex flex-wrap gap-1">
                          {user.profile.specialties.slice(0, 5).map((specialty, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                            >
                              {specialty}
                            </span>
                          ))}
                          {user.profile.specialties.length > 5 && (
                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                              +{user.profile.specialties.length - 5} autres
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleAction(user, 'approve')}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approuver
                    </button>
                    
                    <button
                      onClick={() => handleAction(user, 'reject')}
                      className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Rejeter
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de confirmation */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {actionType === 'approve' ? 'Approuver l\'inscription' : 'Rejeter l\'inscription'}
            </h3>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Utilisateur: <span className="font-medium">{selectedUser.name}</span>
              </p>
              <p className="text-sm text-gray-600">
                Email: <span className="font-medium">{selectedUser.email}</span>
              </p>
            </div>

            {actionType === 'reject' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Raison du rejet *
                </label>
                <select
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Sélectionner une raison</option>
                  <option value="documents_incomplete">Documents incomplets</option>
                  <option value="information_incorrecte">Informations incorrectes</option>
                  <option value="profil_inadequat">Profil inadéquat</option>
                  <option value="violation_conditions">Violation des conditions</option>
                  <option value="autre">Autre raison</option>
                </select>
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Commentaires {actionType === 'reject' ? '(optionnel)' : ''}
              </label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder={actionType === 'approve' 
                  ? 'Commentaires d\'approbation...' 
                  : 'Commentaires supplémentaires...'
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowModal(false)}
                disabled={processing}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Annuler
              </button>
              
              <button
                onClick={confirmAction}
                disabled={processing || (actionType === 'reject' && !rejectionReason)}
                className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 ${
                  actionType === 'approve' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {processing ? (
                  <div className="flex items-center justify-center">
                    <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                    Traitement...
                  </div>
                ) : (
                  actionType === 'approve' ? 'Approuver' : 'Rejeter'
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default PendingRegistrationsComponent;
