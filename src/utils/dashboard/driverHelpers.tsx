/**
 * Helpers pour DriverDashboard
 * Fonctions utilitaires pour status, urgence, etc.
 */

export const getUrgencyColor = (urgency: string): string => {
  switch (urgency) {
    case 'express': 
      return 'bg-red-100 text-red-800';
    case 'urgent': 
      return 'bg-orange-100 text-orange-800';
    default: 
      return 'bg-blue-100 text-blue-800';
  }
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'pending': 
      return 'bg-gray-100 text-gray-800';
    case 'assigned': 
      return 'bg-blue-100 text-blue-800';
    case 'pickup': 
      return 'bg-yellow-100 text-yellow-800';
    case 'in_transit': 
      return 'bg-purple-100 text-purple-800';
    case 'delivered': 
      return 'bg-green-100 text-green-800';
    case 'failed': 
      return 'bg-red-100 text-red-800';
    default: 
      return 'bg-gray-100 text-gray-800';
  }
};

export const getUrgencyLabel = (urgency: string): string => {
  switch (urgency) {
    case 'express': 
      return '🚀 Express';
    case 'urgent': 
      return '⚡ Urgent';
    default: 
      return '📅 Normal';
  }
};
