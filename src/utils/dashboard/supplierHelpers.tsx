// Status color mapping - LOGIQUE MÉTIER CRITIQUE
export const getOrderStatusColor = (status: string): string => {
  switch (status) {
    case 'confirmed':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'preparing':
      return 'bg-blue-100 text-blue-800';
    case 'delivered':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Status label mapping - FR translations
export const getOrderStatusLabel = (status: string): string => {
  switch (status) {
    case 'confirmed':
      return 'Confirmée';
    case 'pending':
      return 'En attente';
    case 'preparing':
      return 'En préparation';
    case 'delivered':
      return 'Livrée';
    default:
      return status;
  }
};

// Status emoji mapping
export const getOrderStatusEmoji = (status: string): string => {
  switch (status) {
    case 'confirmed':
      return '✅';
    case 'pending':
      return '⏳';
    case 'preparing':
      return '🔄';
    case 'delivered':
      return '🚚';
    default:
      return '';
  }
};
