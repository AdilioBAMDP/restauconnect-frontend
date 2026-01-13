import React from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, TrendingDown, CheckCircle } from 'lucide-react';

interface RiskItem {
  id: string;
  client: string;
  loanAmount: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  factors: string[];
  score: number;
}

interface BankerRiskProps {
  risks: RiskItem[];
}

export function BankerRisk({ risks }: BankerRiskProps) {
  const getRiskBadge = (level: string) => {
    const styles = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800'
    };
    const labels = {
      low: 'Faible',
      medium: 'Modéré',
      high: 'Élevé',
      critical: 'Critique'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[level as keyof typeof styles]}`}>
        {labels[level as keyof typeof labels]}
      </span>
    );
  };

  const criticalRisks = risks.filter(r => r.riskLevel === 'critical' || r.riskLevel === 'high');

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Gestion des Risques</h2>

      {criticalRisks.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
            <span className="text-red-800 font-medium">
              {criticalRisks.length} client{criticalRisks.length > 1 ? 's' : ''} à risque élevé
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-green-900">
            {risks.filter(r => r.riskLevel === 'low').length}
          </div>
          <p className="text-sm text-green-700">Risque faible</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg text-center">
          <Shield className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-yellow-900">
            {risks.filter(r => r.riskLevel === 'medium').length}
          </div>
          <p className="text-sm text-yellow-700">Risque modéré</p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg text-center">
          <TrendingDown className="w-8 h-8 text-orange-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-orange-900">
            {risks.filter(r => r.riskLevel === 'high').length}
          </div>
          <p className="text-sm text-orange-700">Risque élevé</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg text-center">
          <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-red-900">
            {risks.filter(r => r.riskLevel === 'critical').length}
          </div>
          <p className="text-sm text-red-700">Risque critique</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 bg-gray-50 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Détail des risques</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {risks.map((risk, index) => (
            <motion.div
              key={risk.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-6 hover:bg-gray-50"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900">{risk.client}</h4>
                  <p className="text-sm text-gray-600">
                    Prêt: {risk.loanAmount.toLocaleString('fr-FR')} €
                  </p>
                </div>
                <div className="text-right">
                  {getRiskBadge(risk.riskLevel)}
                  <p className="text-sm text-gray-600 mt-1">Score: {risk.score}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Facteurs de risque:</p>
                <div className="flex flex-wrap gap-2">
                  {risk.factors.map((factor, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                    >
                      {factor}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
