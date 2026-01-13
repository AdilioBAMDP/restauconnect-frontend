import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, User } from 'lucide-react';

interface Loan {
  id: string;
  client: string;
  amount: number;
  interestRate: number;
  duration: number;
  startDate: string;
  status: 'active' | 'pending' | 'completed' | 'defaulted';
  paidAmount: number;
  nextPayment: string;
}

interface BankerLoansProps {
  loans: Loan[];
}

export function BankerLoans({ loans }: BankerLoansProps) {
  const [filter, setFilter] = useState<'all' | 'active' | 'pending' | 'completed'>('all');

  const filtered = loans.filter(l => filter === 'all' || l.status === filter);

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-blue-100 text-blue-800',
      defaulted: 'bg-red-100 text-red-800'
    };
    const labels = {
      active: 'Actif',
      pending: 'En attente',
      completed: 'Remboursé',
      defaulted: 'Défaut'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Portefeuille de Prêts</h2>
        <div className="flex space-x-2">
          {(['all', 'active', 'pending', 'completed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === f ? 'bg-slate-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f === 'all' ? 'Tous' : 
               f === 'active' ? 'Actifs' :
               f === 'pending' ? 'En attente' : 'Remboursés'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filtered.map((loan, index) => {
          const progress = (loan.paidAmount / loan.amount) * 100;
          return (
            <motion.div
              key={loan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white p-6 rounded-lg shadow-lg border border-gray-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <h3 className="font-semibold text-gray-900">{loan.client}</h3>
                </div>
                {getStatusBadge(loan.status)}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Montant</p>
                  <p className="text-lg font-bold text-gray-900">
                    {loan.amount.toLocaleString('fr-FR')} €
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Taux</p>
                  <p className="text-lg font-bold text-gray-900">{loan.interestRate}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Durée</p>
                  <p className="text-lg font-bold text-gray-900">{loan.duration} mois</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Début</p>
                  <p className="text-lg font-bold text-gray-900">
                    {new Date(loan.startDate).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>

              {loan.status === 'active' && (
                <>
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Progression</span>
                      <span className="text-sm font-semibold text-gray-900">{progress.toFixed(1)}%</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {loan.paidAmount.toLocaleString('fr-FR')} € / {loan.amount.toLocaleString('fr-FR')} €
                    </p>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2 text-blue-700">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm font-medium">Prochain paiement</span>
                    </div>
                    <span className="text-sm font-bold text-blue-900">
                      {new Date(loan.nextPayment).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
