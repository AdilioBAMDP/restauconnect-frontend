import React from 'react';
import { Shield, Check } from 'lucide-react';

interface RoleCardProps {
  role: {
    id: string;
    name: string;
    description: string;
    permissions: string[];
  };
  onSelect: (roleId: string) => void;
  isSelected?: boolean;
}

const RoleCard: React.FC<RoleCardProps> = ({ role, onSelect, isSelected = false }) => {
  const getRoleColor = (roleId: string) => {
    const colors: Record<string, string> = {
      owner: 'border-purple-300 bg-purple-50',
      dispatcher: 'border-blue-300 bg-blue-50',
      accountant: 'border-green-300 bg-green-50',
      driver: 'border-orange-300 bg-orange-50',
      maintenance_manager: 'border-yellow-300 bg-yellow-50'
    };
    return colors[roleId] || 'border-gray-300 bg-gray-50';
  };

  const getRoleIcon = (roleId: string) => {
    return isSelected ? 'bg-blue-600' : 'bg-gray-200';
  };

  const permissionLabels: Record<string, string> = {
    MANAGE_FLEET: 'Gérer la flotte',
    VIEW_FLEET: 'Voir la flotte',
    MANAGE_DRIVERS: 'Gérer les chauffeurs',
    VIEW_DRIVERS: 'Voir les chauffeurs',
    ASSIGN_DRIVERS: 'Assigner chauffeurs',
    MANAGE_USERS: 'Gérer utilisateurs',
    VIEW_USERS: 'Voir utilisateurs',
    CREATE_DOCUMENTS: 'Créer documents',
    VIEW_DOCUMENTS: 'Voir documents',
    SIGN_DOCUMENTS: 'Signer documents',
    MANAGE_DELIVERIES: 'Gérer livraisons',
    VIEW_DELIVERIES: 'Voir livraisons',
    ASSIGN_DELIVERIES: 'Assigner livraisons',
    MANAGE_MAINTENANCE: 'Gérer maintenance',
    VIEW_MAINTENANCE: 'Voir maintenance',
    SCHEDULE_MAINTENANCE: 'Planifier maintenance',
    VIEW_ANALYTICS: 'Voir analytics',
    VIEW_FINANCIAL_DATA: 'Voir finances',
    MANAGE_PAYROLL: 'Gérer paie',
    VIEW_MARKETPLACE: 'Voir marketplace',
    BID_ON_OFFERS: 'Enchérir offres'
  };

  return (
    <div
      onClick={() => onSelect(role.id)}
      className={`relative border-2 rounded-lg p-6 cursor-pointer transition-all ${
        isSelected ? 'border-blue-500 shadow-lg' : getRoleColor(role.id)
      } hover:shadow-md`}
    >
      {/* Badge de sélection */}
      {isSelected && (
        <div className="absolute top-4 right-4 bg-blue-600 text-white rounded-full p-1">
          <Check className="h-5 w-5" />
        </div>
      )}

      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className={`p-3 rounded-lg ${getRoleIcon(role.id)}`}>
          <Shield className={`h-6 w-6 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900">{role.name}</h3>
          <p className="text-sm text-gray-600 mt-1">{role.description}</p>
        </div>
      </div>

      {/* Permissions */}
      <div className="border-t border-gray-200 pt-4">
        <p className="text-xs font-semibold text-gray-500 uppercase mb-3">
          Permissions incluses ({role.permissions.length})
        </p>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {role.permissions.map((permission) => (
            <div key={permission} className="flex items-center gap-2 text-sm text-gray-700">
              <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
              <span>{permissionLabels[permission] || permission}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Note pour owner */}
      {role.id === 'owner' && (
        <div className="mt-4 bg-purple-100 border border-purple-300 rounded-lg p-3">
          <p className="text-xs text-purple-900 font-medium">
            ⭐ Accès complet à toutes les fonctionnalités
          </p>
        </div>
      )}
    </div>
  );
};

export default RoleCard;
