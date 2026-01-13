import React, { useState } from 'react';
import { Users, Plus, Mail, Phone, Shield, Edit, Trash2 } from 'lucide-react';

interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'owner' | 'dispatcher' | 'accountant' | 'driver' | 'maintenance_manager';
  phone?: string;
  active: boolean;
  permissions: string[];
}

interface UserFormProps {
  onClose: () => void;
  onSave: (user: Partial<User>) => void;
  editUser?: User | null;
}

const UserForm: React.FC<UserFormProps> = ({ onClose, onSave, editUser }) => {
  const [formData, setFormData] = useState<Partial<User>>({
    email: editUser?.email || '',
    firstName: editUser?.firstName || '',
    lastName: editUser?.lastName || '',
    role: editUser?.role || 'driver',
    phone: editUser?.phone || '',
    active: editUser?.active ?? true,
    permissions: editUser?.permissions || []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const roles = [
    { value: 'owner', label: 'Propriétaire', color: 'text-purple-700', permissions: 21 },
    { value: 'dispatcher', label: 'Dispatcheur', color: 'text-blue-700', permissions: 12 },
    { value: 'accountant', label: 'Comptable', color: 'text-green-700', permissions: 8 },
    { value: 'driver', label: 'Chauffeur', color: 'text-orange-700', permissions: 5 },
    { value: 'maintenance_manager', label: 'Gestionnaire maintenance', color: 'text-red-700', permissions: 6 }
  ];

  const defaultPermissionsByRole: Record<string, string[]> = {
    owner: ['MANAGE_FLEET', 'VIEW_FLEET', 'CREATE_DOCUMENTS', 'SIGN_DOCUMENTS', 'VIEW_DOCUMENTS', 'MANAGE_DRIVERS', 'VIEW_DRIVERS', 'MANAGE_DELIVERIES', 'VIEW_DELIVERIES', 'MANAGE_MAINTENANCE', 'VIEW_MAINTENANCE', 'VIEW_ANALYTICS', 'VIEW_FINANCIAL_DATA', 'MANAGE_USERS', 'VIEW_USERS', 'MANAGE_MARKETPLACE', 'VIEW_MARKETPLACE', 'MANAGE_SETTINGS', 'VIEW_INFO', 'EXPORT_DATA', 'MANAGE_DOCUMENTS'],
    dispatcher: ['VIEW_FLEET', 'CREATE_DOCUMENTS', 'VIEW_DOCUMENTS', 'VIEW_DRIVERS', 'MANAGE_DELIVERIES', 'VIEW_DELIVERIES', 'VIEW_MAINTENANCE', 'VIEW_ANALYTICS', 'VIEW_MARKETPLACE', 'VIEW_INFO', 'SIGN_DOCUMENTS', 'MANAGE_DOCUMENTS'],
    accountant: ['VIEW_FLEET', 'VIEW_DOCUMENTS', 'VIEW_DRIVERS', 'VIEW_DELIVERIES', 'VIEW_ANALYTICS', 'VIEW_FINANCIAL_DATA', 'EXPORT_DATA', 'VIEW_INFO'],
    driver: ['VIEW_FLEET', 'SIGN_DOCUMENTS', 'VIEW_DOCUMENTS', 'VIEW_DELIVERIES', 'VIEW_INFO'],
    maintenance_manager: ['VIEW_FLEET', 'MANAGE_MAINTENANCE', 'VIEW_MAINTENANCE', 'VIEW_DOCUMENTS', 'VIEW_ANALYTICS', 'VIEW_INFO']
  };

  const handleRoleChange = (role: string) => {
    setFormData({
      ...formData,
      role: role as any,
      permissions: defaultPermissionsByRole[role] || []
    });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email) newErrors.email = 'Email requis';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email invalide';
    
    if (!formData.firstName) newErrors.firstName = 'Prénom requis';
    if (!formData.lastName) newErrors.lastName = 'Nom requis';
    
    if (formData.phone && !/^\+?[\d\s()-]+$/.test(formData.phone)) {
      newErrors.phone = 'Numéro de téléphone invalide';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSave(formData);
    }
  };

  const selectedRole = roles.find(r => r.value === formData.role);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="h-6 w-6 text-blue-600" />
              <h3 className="text-xl font-bold text-gray-900">
                {editUser ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
              </h3>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Informations personnelles */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Informations personnelles</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prénom <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Jean"
                />
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Dupont"
                />
                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
              </div>
            </div>
          </div>

          {/* Coordonnées */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Coordonnées</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="inline h-4 w-4 mr-1" />
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="jean.dupont@example.com"
                  disabled={!!editUser}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="inline h-4 w-4 mr-1" />
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="+33 6 12 34 56 78"
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
            </div>
          </div>

          {/* Rôle et permissions */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              <Shield className="inline h-5 w-5 mr-2" />
              Rôle et permissions
            </h4>
            <div className="grid grid-cols-1 gap-3">
              {roles.map((role) => (
                <button
                  key={role.value}
                  onClick={() => handleRoleChange(role.value)}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    formData.role === role.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`font-semibold ${role.color}`}>{role.label}</p>
                      <p className="text-sm text-gray-600">{role.permissions} permissions</p>
                    </div>
                    {formData.role === role.value && (
                      <div className="h-5 w-5 rounded-full bg-blue-600 flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
            {selectedRole && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-900">
                  <strong>{selectedRole.permissions} permissions</strong> seront attribuées à ce rôle
                </p>
              </div>
            )}
          </div>

          {/* Statut */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="h-5 w-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Utilisateur actif</span>
            </label>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {editUser ? 'Enregistrer' : 'Créer l\'utilisateur'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserForm;
