import React, { useState, useEffect } from 'react';
import { Newspaper, AlertTriangle, DollarSign, CloudRain } from 'lucide-react';
import axios from 'axios';

interface InfoData {
  news: Array<{
    id: string;
    title: string;
    summary: string;
    category: 'regulation' | 'industry' | 'technology';
    date: string;
    source: string;
  }>;
  regulations: Array<{
    id: string;
    title: string;
    description: string;
    effectiveDate: string;
    severity: 'info' | 'warning' | 'critical';
  }>;
  fuelPrices: {
    diesel: number;
    gasoline: number;
    trend: 'up' | 'down' | 'stable';
    lastUpdate: string;
  };
  weather: {
    alerts: Array<{
      region: string;
      type: string;
      severity: 'low' | 'medium' | 'high';
      description: string;
    }>;
  };
}

const NewsSection: React.FC = () => {
  const [data, setData] = useState<InfoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'news' | 'regulations' | 'fuel' | 'weather'>('news');

  useEffect(() => {
    loadInfo();
  }, []);

  const loadInfo = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token') || localStorage.getItem('authToken') || localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/transporteur-tms/info', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(response.data.data);
    } catch (error) {
      console.error('Erreur chargement informations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-600 mt-4">Chargement...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <p className="text-gray-600">Aucune information disponible</p>
      </div>
    );
  }

  const getCategoryBadge = (category: string) => {
    const badges: Record<string, { color: string; label: string }> = {
      regulation: { color: 'bg-red-100 text-red-700', label: '📋 Réglementation' },
      industry: { color: 'bg-blue-100 text-blue-700', label: '🏭 Industrie' },
      technology: { color: 'bg-purple-100 text-purple-700', label: '💻 Technologie' }
    };
    return badges[category] || badges.industry;
  };

  const getSeverityBadge = (severity: string) => {
    const badges: Record<string, { color: string; icon: string }> = {
      info: { color: 'bg-blue-100 text-blue-700', icon: 'ℹ️' },
      warning: { color: 'bg-orange-100 text-orange-700', icon: '⚠️' },
      critical: { color: 'bg-red-100 text-red-700', icon: '🚨' },
      low: { color: 'bg-green-100 text-green-700', icon: '🟢' },
      medium: { color: 'bg-orange-100 text-orange-700', icon: '🟠' },
      high: { color: 'bg-red-100 text-red-700', icon: '🔴' }
    };
    return badges[severity] || badges.info;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Informations Temps Réel</h2>
        <p className="text-gray-600 mt-1">Actualités, réglementations et données du secteur</p>
      </div>

      {/* Navigation tabs */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('news')}
            className={`flex-1 px-6 py-3 font-medium transition-colors ${
              activeTab === 'news'
                ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Newspaper className="inline h-5 w-5 mr-2" />
            Actualités
          </button>
          <button
            onClick={() => setActiveTab('regulations')}
            className={`flex-1 px-6 py-3 font-medium transition-colors ${
              activeTab === 'regulations'
                ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <AlertTriangle className="inline h-5 w-5 mr-2" />
            Réglementations
          </button>
          <button
            onClick={() => setActiveTab('fuel')}
            className={`flex-1 px-6 py-3 font-medium transition-colors ${
              activeTab === 'fuel'
                ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <DollarSign className="inline h-5 w-5 mr-2" />
            Prix Carburant
          </button>
          <button
            onClick={() => setActiveTab('weather')}
            className={`flex-1 px-6 py-3 font-medium transition-colors ${
              activeTab === 'weather'
                ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <CloudRain className="inline h-5 w-5 mr-2" />
            Météo & Trafic
          </button>
        </div>

        <div className="p-6">
          {/* Actualités */}
          {activeTab === 'news' && (
            <div className="space-y-4">
              {data.news.length === 0 ? (
                <p className="text-center text-gray-500 py-8">Aucune actualité disponible</p>
              ) : (
                data.news.map((article) => {
                  const badge = getCategoryBadge(article.category);
                  return (
                    <div key={article.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-gray-900 flex-1">{article.title}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-medium ml-4 ${badge.color}`}>
                          {badge.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{article.summary}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{article.source}</span>
                        <span>{new Date(article.date).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Réglementations */}
          {activeTab === 'regulations' && (
            <div className="space-y-4">
              {data.regulations.length === 0 ? (
                <p className="text-center text-gray-500 py-8">Aucune alerte réglementaire</p>
              ) : (
                data.regulations.map((regulation) => {
                  const badge = getSeverityBadge(regulation.severity);
                  return (
                    <div key={regulation.id} className={`border-2 rounded-lg p-4 ${badge.color.replace('text-', 'border-')}`}>
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{badge.icon}</span>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 mb-1">{regulation.title}</h3>
                          <p className="text-sm text-gray-700 mb-2">{regulation.description}</p>
                          <p className="text-xs text-gray-600">
                            Date d'application: {new Date(regulation.effectiveDate).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Prix Carburant */}
          {activeTab === 'fuel' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">⛽ Diesel</h3>
                    <span className={`text-xl ${data.fuelPrices.trend === 'up' ? 'text-red-600' : data.fuelPrices.trend === 'down' ? 'text-green-600' : 'text-gray-600'}`}>
                      {data.fuelPrices.trend === 'up' ? '↗️' : data.fuelPrices.trend === 'down' ? '↘️' : '➡️'}
                    </span>
                  </div>
                  <p className="text-4xl font-bold text-gray-900">{data.fuelPrices.diesel.toFixed(3)}€</p>
                  <p className="text-sm text-gray-700 mt-1">par litre</p>
                </div>

                <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">⛽ Essence</h3>
                    <span className={`text-xl ${data.fuelPrices.trend === 'up' ? 'text-red-600' : data.fuelPrices.trend === 'down' ? 'text-green-600' : 'text-gray-600'}`}>
                      {data.fuelPrices.trend === 'up' ? '↗️' : data.fuelPrices.trend === 'down' ? '↘️' : '➡️'}
                    </span>
                  </div>
                  <p className="text-4xl font-bold text-gray-900">{data.fuelPrices.gasoline.toFixed(3)}€</p>
                  <p className="text-sm text-gray-700 mt-1">par litre</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">
                  Dernière mise à jour: {new Date(data.fuelPrices.lastUpdate).toLocaleString('fr-FR')}
                </p>
              </div>
            </div>
          )}

          {/* Météo & Trafic */}
          {activeTab === 'weather' && (
            <div className="space-y-4">
              {data.weather.alerts.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-green-600 text-lg font-medium">✅ Aucune alerte météo</p>
                  <p className="text-sm text-gray-600 mt-2">Conditions de circulation normales</p>
                </div>
              ) : (
                data.weather.alerts.map((alert, index) => {
                  const badge = getSeverityBadge(alert.severity);
                  return (
                    <div key={index} className={`border-2 rounded-lg p-4 ${badge.color.replace('text-', 'border-')}`}>
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{badge.icon}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-gray-900">{alert.type}</h3>
                            <span className="text-sm text-gray-600">- {alert.region}</span>
                          </div>
                          <p className="text-sm text-gray-700">{alert.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsSection;
