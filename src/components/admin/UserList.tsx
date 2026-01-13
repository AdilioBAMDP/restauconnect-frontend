import React, { useState, useMemo } from 'react';
import { Search, Edit, Trash2, Eye, Mail, Phone, MapPin, Building, Calendar, UserCheck, UserX, Crown, Key, Lock } from 'lucide-react';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  phone?: string;
  companyName?: string;
  location?: string | {
    address?: string;
    city?: string;
    postalCode?: string;
    coordinates?: number[];
  };
  isActive?: boolean;
  createdAt?: string;
  lastLogin?: string;
}

interface UserListProps {
  users: User[];
  onDelete: (id: string) => void;
  onEdit?: (user: User) => void;
  onToggleStatus?: (id: string) => void;
}

const UserList: React.FC<UserListProps> = ({ users, onDelete, onEdit, onToggleStatus }) => {
  const [editUser, setEditUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState<Partial<User>>({});
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordResetLoading, setPasswordResetLoading] = useState(false);
  const [passwordResetError, setPasswordResetError] = useState<string | null>(null);
  const [passwordResetSuccess, setPasswordResetSuccess] = useState(false);

  const handleEditClick = (user: User) => {
    setEditUser(user);
    setEditForm(user);
    setEditError(null);
    setShowPasswordReset(false);
    setNewPassword('');
    setConfirmPassword('');
    setPasswordResetError(null);
    setPasswordResetSuccess(false);
  };

  const handlePasswordReset = async () => {
    if (!editUser) return;
    
    setPasswordResetError(null);
    setPasswordResetSuccess(false);

    // Validation
    if (!newPassword || newPassword.length < 6) {
      setPasswordResetError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordResetError('Les mots de passe ne correspondent pas');
      return;
    }

    setPasswordResetLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/actions/reset-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: editUser.id,
          newPassword: newPassword
        })
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Erreur lors de la réinitialisation');
      }

      setPasswordResetSuccess(true);
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordReset(false);
      
      setTimeout(() => {
        setPasswordResetSuccess(false);
      }, 3000);

    } catch (error: any) {
      setPasswordResetError(error.message || 'Erreur lors de la réinitialisation');
    } finally {
      setPasswordResetLoading(false);
    }
  };

  const handleEditChange = (field: keyof User, value: string) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const currentUserId = localStorage.getItem('user_id');
  
  const handleEditSave = async () => {
    if (!editUser) return;
    // Empêcher la modification de son propre rôle
    if (editUser.id === currentUserId && editForm.role && editForm.role !== editUser.role) {
      setEditError("Vous ne pouvez pas modifier votre propre rôle administrateur.");
      return;
    }
    if (editForm.role && editForm.role !== editUser.role) {
      if (!window.confirm(`Changer le rôle de ${editUser.username} de ${editUser.role} vers ${editForm.role} ?`)) {
        return;
      }
    }
    setEditLoading(true);
    setEditError(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/users/${editUser.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editForm)
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.error || 'Erreur lors de la modification');
      setEditUser(null);
      setEditForm({});
      window.location.reload();
    } catch (error: any) {
      setEditError(error.message || 'Erreur lors de la modification');
    } finally {
      setEditLoading(false);
    }
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('username');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const roleInfo = {
    restaurant: { label: 'Restaurant', icon: '🍽️', color: 'bg-orange-100 text-orange-800' },
    artisan: { label: 'Artisan', icon: '🔧', color: 'bg-blue-100 text-blue-800' },
    fournisseur: { label: 'Fournisseur', icon: '📦', color: 'bg-green-100 text-green-800' },
    candidat: { label: 'Candidat', icon: '👤', color: 'bg-gray-100 text-gray-800' },
    community_manager: { label: 'Community Manager', icon: '📢', color: 'bg-purple-100 text-purple-800' },
    banquier: { label: 'Banquier', icon: '🏦', color: 'bg-indigo-100 text-indigo-800' },
    investisseur: { label: 'Investisseur', icon: '💼', color: 'bg-yellow-100 text-yellow-800' },
    comptable: { label: 'Comptable', icon: '📊', color: 'bg-teal-100 text-teal-800' },
    livreur: { label: 'Livreur', icon: '🚗', color: 'bg-red-100 text-red-800' },
    admin: { label: 'Admin', icon: '🛡️', color: 'bg-yellow-100 text-yellow-800 font-bold border border-yellow-400' },
    super_admin: { label: 'Super Admin', icon: '⚡', color: 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 font-bold border border-purple-400' }
  };

  const filteredAndSortedUsers = useMemo(() => {
    const filtered = users.filter(user => {
      const matchesSearch = (user.username?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                           (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                           (user.companyName?.toLowerCase() || '').includes(searchTerm.toLowerCase());
      
      const matchesRole = !roleFilter || user.role === roleFilter;
      const matchesStatus = !statusFilter || 
                           (statusFilter === 'active' && user.isActive !== false) ||
                           (statusFilter === 'inactive' && user.isActive === false);

      return matchesSearch && matchesRole && matchesStatus;
    });

    // Tri
    filtered.sort((a, b) => {
      let aVal = a[sortBy as keyof User] || '';
      let bVal = b[sortBy as keyof User] || '';
      
      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();

      if (sortOrder === 'asc') {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
      }
    });

    return filtered;
  }, [users, searchTerm, roleFilter, statusFilter, sortBy, sortOrder]);

  const uniqueRoles = Array.from(new Set(users.map(u => u.role)));

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Gestion des utilisateurs</h2>
            <p className="text-gray-600">
              {filteredAndSortedUsers.length} utilisateur{filteredAndSortedUsers.length > 1 ? 's' : ''} 
              {filteredAndSortedUsers.length !== users.length && ` sur ${users.length}`}
            </p>
          </div>
          
          {/* Statistiques rapides */}
          <div className="flex gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{users.filter(u => u.isActive !== false).length}</div>
              <div className="text-sm text-gray-600">Actifs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{users.filter(u => u.isActive === false).length}</div>
              <div className="text-sm text-gray-600">Inactifs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{users.filter(u => u.role === 'super_admin').length}</div>
              <div className="text-sm text-gray-600">Admins</div>
            </div>
          </div>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher par nom, email ou entreprise..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tous les rôles</option>
            {uniqueRoles.map(role => (
              <option key={role} value={role}>
                {roleInfo[role as keyof typeof roleInfo]?.label || role}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tous les statuts</option>
            <option value="active">Actifs</option>
            <option value="inactive">Inactifs</option>
          </select>

          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field);
              setSortOrder(order as 'asc' | 'desc');
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="username-asc">Nom A→Z</option>
            <option value="username-desc">Nom Z→A</option>
            <option value="email-asc">Email A→Z</option>
            <option value="role-asc">Rôle A→Z</option>
            <option value="createdAt-desc">Plus récents</option>
            <option value="createdAt-asc">Plus anciens</option>
          </select>
        </div>
      </div>

      {/* Liste des utilisateurs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {filteredAndSortedUsers.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Search className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun utilisateur trouvé</h3>
            <p className="text-gray-600">Essayez de modifier vos critères de recherche.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredAndSortedUsers.map((user) => {
              const roleConfig = roleInfo[user.role as keyof typeof roleInfo] || 
                                { label: user.role, icon: '👤', color: 'bg-gray-100 text-gray-800' };

              return (
                <div key={user.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    {/* Informations utilisateur */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                            {(user.username || 'U').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                              {user.username || 'Utilisateur'}
                              {user.role === 'super_admin' && <Crown className="w-4 h-4 text-yellow-500" />}
                              {user.isActive === false && <UserX className="w-4 h-4 text-red-500" />}
                              {user.isActive !== false && <UserCheck className="w-4 h-4 text-green-500" />}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Mail className="w-3 h-3" />
                              {user.email}
                            </div>
                          </div>
                        </div>

                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${roleConfig.color}`}>
                          <span className="mr-1">{roleConfig.icon}</span>
                          {roleConfig.label}
                        </div>
                      </div>

                      {/* Informations supplémentaires */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        {user.phone && (
                          <div key={`${user.id}-phone`} className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {user.phone}
                          </div>
                        )}
                        {user.companyName && (
                          <div key={`${user.id}-company`} className="flex items-center gap-1">
                            <Building className="w-3 h-3" />
                            {user.companyName}
                          </div>
                        )}
                        {user.location && (
                          <div key={`${user.id}-location`} className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {typeof user.location === 'string' 
                              ? user.location 
                              : `${user.location.city || ''} ${user.location.postalCode || ''}`.trim() || user.location.address || 'N/A'
                            }
                          </div>
                        )}
                      </div>

                      {user.createdAt && (
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Créé le {formatDate(user.createdAt)}
                          </span>
                          {user.lastLogin && (
                            <span>Dernière connexion: {formatDate(user.lastLogin)}</span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => console.log('Voir profil', user.id)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Voir le profil"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleEditClick(user)}
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      {onToggleStatus && (
                        <button
                          onClick={() => onToggleStatus(user.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            user.isActive === false 
                              ? 'text-gray-400 hover:text-green-600 hover:bg-green-50' 
                              : 'text-gray-400 hover:text-orange-600 hover:bg-orange-50'
                          }`}
                          title={user.isActive === false ? 'Activer' : 'Désactiver'}
                        >
                          {user.isActive === false ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                        </button>
                      )}

                      {user.role !== 'super_admin' && (
                        <button
                          onClick={() => onDelete(user.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal d'édition utilisateur */}
      {editUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40" onClick={() => setEditUser(null)}>
          <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-2xl font-bold mb-6 text-gray-900">Éditer l'utilisateur</h3>
            
            <div className="space-y-4">
              {/* Nom d'utilisateur */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom d'utilisateur</label>
                <input 
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  value={editForm.username || ''} 
                  onChange={e => handleEditChange('username', e.target.value)} 
                  placeholder="Nom d'utilisateur"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  type="email"
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  value={editForm.email || ''} 
                  onChange={e => handleEditChange('email', e.target.value)} 
                  placeholder="email@example.com"
                />
              </div>

              {/* Téléphone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                <input 
                  type="tel"
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  value={editForm.phone || ''} 
                  onChange={e => handleEditChange('phone', e.target.value)} 
                  placeholder="+33 6 12 34 56 78"
                />
              </div>

              {/* Entreprise */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Entreprise</label>
                <input 
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  value={editForm.companyName || ''} 
                  onChange={e => handleEditChange('companyName', e.target.value)} 
                  placeholder="Nom de l'entreprise"
                />
              </div>

              {/* Localisation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                <input 
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  value={typeof editForm.location === 'string' ? editForm.location : (editForm.location?.city || '')} 
                  onChange={e => handleEditChange('location', e.target.value)} 
                  placeholder="Paris, Lyon, Marseille..."
                />
              </div>

              {/* Rôle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rôle {editUser.id === currentUserId && <span className="text-red-600">(non modifiable pour soi-même)</span>}
                </label>
                <select
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  value={editForm.role || ''}
                  onChange={e => handleEditChange('role', e.target.value)}
                  disabled={editUser.id === currentUserId}
                >
                  {Object.keys(roleInfo).map(role => (
                    <option key={role} value={role}>
                      {roleInfo[role as keyof typeof roleInfo]?.icon} {roleInfo[role as keyof typeof roleInfo]?.label || role}
                    </option>
                  ))}
                </select>
              </div>

              {/* Section Réinitialisation mot de passe */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <button
                  type="button"
                  onClick={() => setShowPasswordReset(!showPasswordReset)}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  <Key className="w-4 h-4" />
                  {showPasswordReset ? 'Masquer' : 'Réinitialiser le mot de passe'}
                </button>

                {showPasswordReset && (
                  <div className="mt-4 space-y-3 bg-gray-50 p-4 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <Lock className="w-4 h-4 inline mr-1" />
                        Nouveau mot de passe
                      </label>
                      <input
                        type="password"
                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        placeholder="Minimum 6 caractères"
                        minLength={6}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <Lock className="w-4 h-4 inline mr-1" />
                        Confirmer le mot de passe
                      </label>
                      <input
                        type="password"
                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        placeholder="Retapez le mot de passe"
                      />
                    </div>

                    {passwordResetError && (
                      <div className="bg-red-50 border border-red-200 rounded p-2">
                        <p className="text-sm text-red-800">{passwordResetError}</p>
                      </div>
                    )}

                    {passwordResetSuccess && (
                      <div className="bg-green-50 border border-green-200 rounded p-2">
                        <p className="text-sm text-green-800">✓ Mot de passe réinitialisé avec succès!</p>
                      </div>
                    )}

                    <button
                      onClick={handlePasswordReset}
                      disabled={passwordResetLoading || !newPassword || !confirmPassword}
                      className="w-full px-4 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium disabled:bg-orange-300 disabled:cursor-not-allowed"
                    >
                      {passwordResetLoading ? 'Réinitialisation...' : '🔑 Réinitialiser le mot de passe'}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {editError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-4">
                <p className="text-sm text-red-800">{editError}</p>
              </div>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <button 
                className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium" 
                onClick={() => setEditUser(null)} 
                disabled={editLoading}
              >
                Annuler
              </button>
              <button 
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-blue-400" 
                onClick={handleEditSave} 
                disabled={editLoading}
              >
                {editLoading ? 'Enregistrement...' : '✓ Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
