import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, TrendingUp, DollarSign, Calendar, Building2, MapPin } from 'lucide-react';

interface Investment {
  id: string;
  restaurant: string;
  location: string;
  amount: number;
  shares: number;
  currentValue: number;
  roi: number;
  startDate: string;
  status: 'active' | 'closed' | 'pending';
}

interface InvestorPortfolioProps {
  investments: Investment[];
}

export function InvestorPortfolio({ investments }: InvestorPortfolioProps) {
  const activeInvestments = investments.filter(inv => inv.status === 'active');
  const totalValue = activeInvestments.reduce((sum, inv) => sum + inv.currentValue, 0);
  const totalInvested = activeInvestments.reduce((sum, inv) => sum + inv.amount, 0);
  const overallROI = ((totalValue - totalInvested) / totalInvested) * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Mon Portfolio</h2>
        <div className="flex items-center space-x-2 text-emerald-600">
          <TrendingUp className="w-5 h-5" />
          <span className="font-semibold">ROI Global: {overallROI.toFixed(2)}%</span>
        </div>
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-blue-700 font-medium">Total Investi</span>
            <DollarSign className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-blue-900">
            {totalInvested.toLocaleString('fr-FR')} €
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-emerald-700 font-medium">Valeur Actuelle</span>
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-3xl font-bold text-emerald-900">
            {totalValue.toLocaleString('fr-FR')} €
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-purple-700 font-medium">Investissements</span>
            <PieChart className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-3xl font-bold text-purple-900">
            {activeInvestments.length}
          </div>
        </div>
      </div>

      {/* Investments List */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Investissements Actifs</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {activeInvestments.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Aucun investissement actif pour le moment
            </div>
          ) : (
            activeInvestments.map((investment, index) => (
              <motion.div
                key={investment.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <Building2 className="w-5 h-5 text-gray-400" />
                      <h4 className="text-lg font-semibold text-gray-900">{investment.restaurant}</h4>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {investment.location}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(investment.startDate).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-6 text-right">
                    <div>
                      <p className="text-sm text-gray-500">Investi</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {investment.amount.toLocaleString('fr-FR')} €
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Valeur</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {investment.currentValue.toLocaleString('fr-FR')} €
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Parts</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {investment.shares}%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">ROI</p>
                      <p className={`text-lg font-semibold ${
                        investment.roi >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {investment.roi >= 0 ? '+' : ''}{investment.roi.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
