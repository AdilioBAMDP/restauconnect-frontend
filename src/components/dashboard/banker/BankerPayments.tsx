import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowDownCircle, CheckCircle } from 'lucide-react';

interface Payment {
  id: string;
  loanId: string;
  client: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: 'upcoming' | 'paid' | 'late' | 'missed';
  type: 'principal' | 'interest' | 'full';
}

interface BankerPaymentsProps {
  payments: Payment[];
}

export function BankerPayments({ payments }: BankerPaymentsProps) {
  const upcoming = payments.filter(p => p.status === 'upcoming');
  const late = payments.filter(p => p.status === 'late');

  const getStatusBadge = (status: string) => {
    const styles = {
      upcoming: 'bg-blue-100 text-blue-800',
      paid: 'bg-green-100 text-green-800',
      late: 'bg-orange-100 text-orange-800',
      missed: 'bg-red-100 text-red-800'
    };
    const labels = {
      upcoming: 'À venir',
      paid: 'Payé',
      late: 'En retard',
      missed: 'Manqué'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Gestion des Paiements</h2>

      {/* Alerts */}
      {late.length > 0 && (
        <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
          <div className="flex items-center">
            <ArrowDownCircle className="w-5 h-5 text-orange-600 mr-2" />
            <span className="text-orange-800 font-medium">
              {late.length} paiement{late.length > 1 ? 's' : ''} en retard nécessite{late.length > 1 ? 'nt' : ''} votre attention
            </span>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 p-6 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-blue-700 font-medium">À venir (30j)</span>
            <Calendar className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-blue-900">{upcoming.length}</div>
          <p className="text-sm text-blue-600 mt-1">
            {upcoming.reduce((sum, p) => sum + p.amount, 0).toLocaleString('fr-FR')} €
          </p>
        </div>

        <div className="bg-green-50 p-6 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-green-700 font-medium">Payés ce mois</span>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-green-900">
            {payments.filter(p => p.status === 'paid').length}
          </div>
          <p className="text-sm text-green-600 mt-1">
            {payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0).toLocaleString('fr-FR')} €
          </p>
        </div>

        <div className="bg-orange-50 p-6 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-orange-700 font-medium">En retard</span>
            <ArrowDownCircle className="w-5 h-5 text-orange-600" />
          </div>
          <div className="text-3xl font-bold text-orange-900">{late.length}</div>
          <p className="text-sm text-orange-600 mt-1">
            {late.reduce((sum, p) => sum + p.amount, 0).toLocaleString('fr-FR')} €
          </p>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Montant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Échéance</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {payments.slice(0, 20).map((payment, index) => (
                <motion.tr
                  key={payment.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.03 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {payment.client}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 capitalize">
                    {payment.type === 'principal' ? 'Principal' :
                     payment.type === 'interest' ? 'Intérêts' : 'Complet'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-gray-900">
                    {payment.amount.toLocaleString('fr-FR')} €
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      {new Date(payment.dueDate).toLocaleDateString('fr-FR')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {getStatusBadge(payment.status)}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
