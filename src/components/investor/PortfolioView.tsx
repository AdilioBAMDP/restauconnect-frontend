import React from 'react';
import { Investment } from '@/services/financialServices';

interface PortfolioViewProps {
  portfolio: Investment[];
}

const PortfolioView: React.FC<PortfolioViewProps> = ({ portfolio }) => {
  if (portfolio.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Mon Portfolio</h3>
        <div className="text-center py-8 text-gray-500">
          Aucun investissement dans votre portfolio pour le moment
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">
          Mon Portfolio Détaillé
        </h2>
      </div>
      <div className="divide-y divide-gray-200">
        {portfolio.map((investment) => (
          <div key={investment._id || Math.random()} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Investissement #{investment._id ? investment._id.slice(-6) : 'N/A'}
                </h3>
                <p className="text-sm text-gray-500">
                  {investment.shares || 0} parts - {(investment.amount || 0).toLocaleString()}€
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-green-600">
                  ROI: {investment.roi || 0}%
                </p>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  investment.status === 'confirmed' ? 'text-green-600 bg-green-100' :
                  investment.status === 'pending' ? 'text-yellow-600 bg-yellow-100' :
                  'text-red-600 bg-red-100'
                }`}>
                  {investment.status || 'unknown'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PortfolioView;