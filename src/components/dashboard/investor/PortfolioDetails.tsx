import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Filter } from 'lucide-react';

interface Investment {
  id: string;
  projectName: string;
  amount: number;
  currentValue: number;
  returnRate: number;
  status: 'active' | 'pending' | 'completed';
  investmentDate: string;
  category: string;
}

interface PortfolioDetailsProps {
  investments: Investment[];
  navigateTo: (page: string) => void;
}

export const PortfolioDetails: React.FC<PortfolioDetailsProps> = ({ 
  investments,
  navigateTo 
}) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const filteredInvestments = investments.filter(inv => 
    filter === 'all' || inv.status === filter
  );

  const totalValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const totalReturn = totalValue - totalInvested;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-4">Mon Portfolio</h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm opacity-80">Valeur Totale</p>
            <p className="text-2xl font-bold">{totalValue.toLocaleString()}€</p>
          </div>
          <div>
            <p className="text-sm opacity-80">Investi</p>
            <p className="text-2xl font-bold">{totalInvested.toLocaleString()}€</p>
          </div>
          <div>
            <p className="text-sm opacity-80">Retour</p>
            <p className="text-2xl font-bold">
              {totalReturn > 0 ? '+' : ''}{totalReturn.toLocaleString()}€
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <Filter className="w-5 h-5 text-gray-600" />
        <div className="flex gap-2">
          {(['all', 'active', 'completed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === f
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {f === 'all' ? 'Tous' : f === 'active' ? 'Actifs' : 'Terminés'}
            </button>
          ))}
        </div>
      </div>

      {/* Investments Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Projet</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Catégorie</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Investi</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Valeur</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Retour</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredInvestments.map((inv) => (
                <tr key={inv.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold">{inv.projectName}</p>
                      <p className="text-sm text-gray-500">{inv.investmentDate}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{inv.category}</td>
                  <td className="px-6 py-4 text-right font-medium">{inv.amount.toLocaleString()}€</td>
                  <td className="px-6 py-4 text-right font-medium">{inv.currentValue.toLocaleString()}€</td>
                  <td className="px-6 py-4 text-right">
                    <div className={`flex items-center justify-end gap-1 font-semibold ${
                      inv.returnRate >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {inv.returnRate >= 0 ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      <span>{inv.returnRate > 0 ? '+' : ''}{inv.returnRate}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      inv.status === 'active' ? 'bg-green-100 text-green-800' :
                      inv.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {inv.status === 'active' ? 'Actif' : inv.status === 'pending' ? 'En attente' : 'Terminé'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <button
        onClick={() => navigateTo('marketplace')}
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold"
      >
        + Nouvel Investissement
      </button>
    </div>
  );
};
