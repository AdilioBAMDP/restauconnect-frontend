import React from 'react';

export function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('fr-FR');
}

export function getStatusBadge(status: string) {
  switch (status) {
    case 'draft':
      return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">📝 Brouillon</span>;
    case 'sent':
      return <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">📤 Envoyé</span>;
    case 'accepted':
      return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">✅ Accepté</span>;
    case 'rejected':
      return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">❌ Refusé</span>;
    case 'pending':
      return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">⏳ En attente</span>;
    case 'paid':
      return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">💰 Payée</span>;
    case 'overdue':
      return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">⚠️ En retard</span>;
    default:
      return null;
  }
}
