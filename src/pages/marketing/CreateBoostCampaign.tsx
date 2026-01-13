/**
 * CREATE BOOST CAMPAIGN - Interface style Uber Ads
 * 
 * Permet aux utilisateurs autorisés de créer des campagnes publicitaires
 * pour booster leurs publications Marketplace et Info Globale
 * 
 * Rôles autorisés: Fournisseur, Artisan, CM, Banquier, Investisseur, Comptable
 * Budget max: 100€ par campagne
 * Badge invisible: Campagnes non marquées visuellement
 */

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Target, 
  DollarSign, 
  Calendar, 
  Eye, 
  BarChart3,
  CreditCard,
  AlertCircle,
  CheckCircle,
  Pause,
  Play,
  Trash2,
  Sparkles
} from 'lucide-react';
import { useBoostCampaignStore } from '@/stores/boostCampaignStore';
import StripeCheckout from '@/components/forms/StripeCheckout';
import { formatAmountForStripe } from '@/config/stripe';

interface Campaign {
  id: string;
  title: string;
  target: 'marketplace' | 'infoglobale' | 'both';
  plan: 'basic' | 'premium' | 'platinum';
  price: number;
  duration: number;
  status: 'active' | 'paused' | 'completed';
  createdAt: Date;
  expiresAt: Date;
  stats: {
    views: number;
    clicks: number;
    ctr: number;
  };
}

const BOOST_PLANS = {
  basic: {
    name: 'Basic',
    price: 5,
    duration: 7,
    multiplier: 1.5,
    estimatedViews: 120,
    color: 'from-blue-500 to-blue-600',
    icon: '🥉'
  },
  premium: {
    name: 'Premium',
    price: 20,
    duration: 14,
    multiplier: 3.0,
    estimatedViews: 500,
    color: 'from-purple-500 to-purple-600',
    icon: '🥈'
  },
  platinum: {
    name: 'Platinum',
    price: 50,
    duration: 30,
    multiplier: 5.0,
    estimatedViews: 1200,
    color: 'from-amber-500 to-amber-600',
    icon: '🥇'
  }
};

const MAX_BUDGET_PER_CAMPAIGN = 100;

export default function CreateBoostCampaign() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [title, setTitle] = useState('');
  const [target, setTarget] = useState<'marketplace' | 'infoglobale' | 'both'>('marketplace');
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'premium' | 'platinum'>('basic');
  const [stripeMode, setStripeMode] = useState<'simulation' | 'real'>('simulation');
  const [budgetError, setBudgetError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showStripeCheckout, setShowStripeCheckout] = useState(false);

  const {
    campaigns,
    totalSpent,
    avgROI,
    createCampaign,
    pauseCampaign,
    resumeCampaign,
    deleteCampaign,
    fetchCampaigns
  } = useBoostCampaignStore();

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  // Validation budget max
  useEffect(() => {
    const plan = BOOST_PLANS[selectedPlan];
    if (plan.price > MAX_BUDGET_PER_CAMPAIGN) {
      setBudgetError(`Budget max ${MAX_BUDGET_PER_CAMPAIGN}€ dépassé !`);
    } else {
      setBudgetError('');
    }
  }, [selectedPlan]);

  const activeCampaigns = campaigns.filter(c => c.status === 'active');

  const handleCreateCampaign = async () => {
    const plan = BOOST_PLANS[selectedPlan];

    if (plan.price > MAX_BUDGET_PER_CAMPAIGN) {
      setBudgetError(`Le budget ne peut pas dépasser ${MAX_BUDGET_PER_CAMPAIGN}€`);
      return;
    }

    if (!title.trim()) {
      alert('Veuillez entrer un titre pour votre campagne');
      return;
    }

    // Simulation ou vrai paiement Stripe
    if (stripeMode === 'simulation') {
      console.log('[SIMULATION] Paiement simulé:', plan.price, '€');
      await createCampaign({
        title,
        target,
        plan: selectedPlan,
        price: plan.price,
        duration: plan.duration
      });
      setPaymentSuccess(true);
      setTimeout(() => {
        setPaymentSuccess(false);
        setShowCreateForm(false);
        setTitle('');
      }, 2000);
    } else {
      // Ouvrir le modal Stripe pour paiement réel
      setShowStripeCheckout(true);
    }
  };

  // Gestion du succès du paiement Stripe
  const handleStripeSuccess = async () => {
    const plan = BOOST_PLANS[selectedPlan];
    
    await createCampaign({
      title,
      target,
      plan: selectedPlan,
      price: plan.price,
      duration: plan.duration
    });
    
    setShowStripeCheckout(false);
    setPaymentSuccess(true);
    
    setTimeout(() => {
      setPaymentSuccess(false);
      setShowCreateForm(false);
      setTitle('');
    }, 2000);
  };

  const calculateROI = (campaign: Campaign): string => {
    const baseViews = 100;
    // const boost = BOOST_PLANS[campaign.plan].multiplier; // Calculé côté serveur
    const gained = (campaign.stats.views - baseViews) / campaign.price;
    return `+${Math.round(gained * 100)}%`;
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Sparkles className="w-8 h-8" />
              Campagnes Publicitaires
            </h1>
            <p className="text-purple-100 mt-2">
              Boostez vos publications et gagnez en visibilité
            </p>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-purple-50 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            {showCreateForm ? '✕ Fermer' : '➕ Nouvelle Campagne'}
          </button>
        </div>
      </div>

      {/* Stats globales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Campagnes Actives</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{activeCampaigns.length}</p>
            </div>
            <TrendingUp className="w-12 h-12 text-blue-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Budget Total Dépensé</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{totalSpent}€</p>
            </div>
            <DollarSign className="w-12 h-12 text-purple-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">ROI Moyen</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">+{avgROI}%</p>
            </div>
            <BarChart3 className="w-12 h-12 text-green-500 opacity-20" />
          </div>
        </div>
      </div>

      {/* Formulaire création campagne */}
      {showCreateForm && (
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-purple-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Target className="w-6 h-6 text-purple-600" />
            Créer une Campagne
          </h2>

          {/* Titre */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📝 Titre de la campagne
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Promotion produits bio automne 2025"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
              maxLength={100}
            />
            <p className="text-xs text-gray-500 mt-1">{title.length}/100 caractères</p>
          </div>

          {/* Cible */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              🎯 Cibler
            </label>
            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={() => setTarget('marketplace')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  target === 'marketplace'
                    ? 'border-purple-500 bg-purple-50 shadow-lg'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <p className="font-semibold text-gray-900">🛒 Marketplace</p>
                <p className="text-xs text-gray-500 mt-1">Publications communautaires</p>
              </button>

              <button
                onClick={() => setTarget('infoglobale')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  target === 'infoglobale'
                    ? 'border-purple-500 bg-purple-50 shadow-lg'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <p className="font-semibold text-gray-900">📢 Info Globale</p>
                <p className="text-xs text-gray-500 mt-1">Annonces temps réel</p>
              </button>

              <button
                onClick={() => setTarget('both')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  target === 'both'
                    ? 'border-purple-500 bg-purple-50 shadow-lg'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <p className="font-semibold text-gray-900">🎯 Les Deux</p>
                <p className="text-xs text-gray-500 mt-1">Visibilité maximale</p>
              </button>
            </div>
          </div>

          {/* Plans */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              💰 Choisir une formule
            </label>
            <div className="grid grid-cols-3 gap-6">
              {(Object.keys(BOOST_PLANS) as Array<keyof typeof BOOST_PLANS>).map((key) => {
                const plan = BOOST_PLANS[key];
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedPlan(key)}
                    className={`relative p-6 rounded-2xl border-3 transition-all transform hover:scale-105 ${
                      selectedPlan === key
                        ? 'border-purple-500 shadow-2xl bg-gradient-to-br ' + plan.color + ' text-white'
                        : 'border-gray-200 hover:border-purple-300 bg-white'
                    }`}
                  >
                    <div className="text-4xl mb-2">{plan.icon}</div>
                    <h3 className={`text-xl font-bold mb-2 ${selectedPlan === key ? 'text-white' : 'text-gray-900'}`}>
                      {plan.name}
                    </h3>
                    <p className={`text-3xl font-extrabold mb-2 ${selectedPlan === key ? 'text-white' : 'text-purple-600'}`}>
                      {plan.price}€
                    </p>
                    <p className={`text-sm mb-4 ${selectedPlan === key ? 'text-purple-100' : 'text-gray-600'}`}>
                      {plan.duration} jours
                    </p>
                    <div className={`space-y-2 text-sm ${selectedPlan === key ? 'text-white' : 'text-gray-700'}`}>
                      <p>• Multiplicateur ×{plan.multiplier}</p>
                      <p>• ~{plan.estimatedViews} vues</p>
                      <p>• Score +{Math.round(plan.multiplier * 20)}</p>
                    </div>
                    {selectedPlan === key && (
                      <div className="absolute top-3 right-3">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Erreur budget */}
          {budgetError && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-700 font-medium">{budgetError}</p>
            </div>
          )}

          {/* Prévisualisation */}
          <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-purple-200">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-purple-600" />
              Prévisualisation
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-purple-600">+{Math.round(BOOST_PLANS[selectedPlan].multiplier * 20)}</p>
                <p className="text-xs text-gray-600">Score boost</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">+{Math.round((BOOST_PLANS[selectedPlan].multiplier - 1) * 100)}%</p>
                <p className="text-xs text-gray-600">Visibilité</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">{BOOST_PLANS[selectedPlan].duration}j</p>
                <p className="text-xs text-gray-600">Durée</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">
                  {new Date(Date.now() + BOOST_PLANS[selectedPlan].duration * 24 * 60 * 60 * 1000).toLocaleDateString()}
                </p>
                <p className="text-xs text-gray-600">Expiration</p>
              </div>
            </div>
          </div>

          {/* Mode paiement */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              💳 Mode de paiement
            </label>
            <div className="flex gap-4">
              <button
                onClick={() => setStripeMode('simulation')}
                className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                  stripeMode === 'simulation'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-green-300'
                }`}
              >
                <p className="font-semibold">🧪 Simulation (Tests)</p>
                <p className="text-xs text-gray-500">Paiement fictif instantané</p>
              </button>
              <button
                onClick={() => setStripeMode('real')}
                className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                  stripeMode === 'real'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <p className="font-semibold">💳 Stripe (Réel)</p>
                <p className="text-xs text-gray-500">Paiement sécurisé</p>
              </button>
            </div>
          </div>

          {/* Boutons actions */}
          <div className="flex gap-4">
            <button
              onClick={handleCreateCampaign}
              disabled={!!budgetError || !title.trim()}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              <CreditCard className="w-5 h-5" />
              Payer {BOOST_PLANS[selectedPlan].price}€
            </button>
            <button
              onClick={() => setShowCreateForm(false)}
              className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
            >
              ❌ Annuler
            </button>
          </div>

          {/* Success message */}
          {paymentSuccess && (
            <div className="mt-4 p-4 bg-green-50 border-2 border-green-200 rounded-xl flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <p className="text-green-700 font-semibold">✅ Campagne créée avec succès !</p>
            </div>
          )}
        </div>
      )}

      {/* Liste campagnes actives */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-purple-600" />
          Campagnes Actives ({activeCampaigns.length})
        </h2>

        {activeCampaigns.length === 0 ? (
          <div className="bg-gray-50 rounded-xl p-12 text-center">
            <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Aucune campagne active</p>
            <p className="text-gray-400 text-sm mt-2">Créez votre première campagne pour booster vos publications !</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeCampaigns.map((campaign) => {
              const plan = BOOST_PLANS[campaign.plan];
              const daysLeft = Math.ceil((campaign.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

              return (
                <div key={campaign.id} className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100 hover:border-purple-300 transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-3xl">{plan.icon}</span>
                        <h3 className="text-xl font-bold text-gray-900">{campaign.title}</h3>
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                          {plan.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-6 text-sm text-gray-600">
                        <span>💰 Budget: {campaign.price}€</span>
                        <span>⏰ Expire dans: {daysLeft} jours</span>
                        <span>🎯 Cible: {campaign.target === 'both' ? 'Marketplace + Info' : campaign.target}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-blue-600">{campaign.stats.views}</p>
                      <p className="text-xs text-gray-600">Vues (+{Math.round((campaign.stats.views / 100 - 1) * 100)}%)</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-purple-600">{campaign.stats.clicks}</p>
                      <p className="text-xs text-gray-600">Clics</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-green-600">{campaign.stats.ctr.toFixed(1)}%</p>
                      <p className="text-xs text-gray-600">CTR</p>
                    </div>
                    <div className="bg-amber-50 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-amber-600">{calculateROI(campaign)}</p>
                      <p className="text-xs text-gray-600">ROI</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => pauseCampaign(campaign.id)}
                      className="flex-1 px-4 py-2 border-2 border-amber-300 text-amber-700 rounded-lg hover:bg-amber-50 transition-all flex items-center justify-center gap-2 font-semibold"
                    >
                      <Pause className="w-4 h-4" />
                      Mettre en pause
                    </button>
                    <button
                      className="flex-1 px-4 py-2 border-2 border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-all flex items-center justify-center gap-2 font-semibold"
                    >
                      <BarChart3 className="w-4 h-4" />
                      Statistiques
                    </button>
                    <button
                      onClick={() => deleteCampaign(campaign.id)}
                      className="px-4 py-2 border-2 border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-all flex items-center justify-center gap-2 font-semibold"
                    >
                      <Trash2 className="w-4 h-4" />
                      Arrêter
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Campagnes en pause */}
      {campaigns.filter(c => c.status === 'paused').length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Pause className="w-6 h-6 text-amber-600" />
            Campagnes en Pause ({campaigns.filter(c => c.status === 'paused').length})
          </h2>
          <div className="space-y-4">
            {campaigns.filter(c => c.status === 'paused').map((campaign) => {
              const plan = BOOST_PLANS[campaign.plan];
              return (
                <div key={campaign.id} className="bg-gray-50 rounded-xl shadow p-6 border-2 border-gray-200 opacity-75">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{plan.icon}</span>
                      <div>
                        <h3 className="text-lg font-bold text-gray-700">{campaign.title}</h3>
                        <p className="text-sm text-gray-500">{plan.name} - {campaign.price}€</p>
                      </div>
                    </div>
                    <button
                      onClick={() => resumeCampaign(campaign.id)}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all flex items-center gap-2 font-semibold"
                    >
                      <Play className="w-4 h-4" />
                      Reprendre
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Info budget max */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-blue-900">Budget Maximum Autorisé</p>
          <p className="text-sm text-blue-700 mt-1">
            Le budget maximum par campagne est de <span className="font-bold">{MAX_BUDGET_PER_CAMPAIGN}€</span>. 
            Cette limite garantit un usage responsable des campagnes publicitaires.
          </p>
        </div>
      </div>

      {/* Modal Stripe Checkout */}
      {showStripeCheckout && (
        <StripeCheckout
          amount={formatAmountForStripe(BOOST_PLANS[selectedPlan].price)}
          campaignTitle={title || 'Ma campagne'}
          planName={`${selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)} - ${BOOST_PLANS[selectedPlan].duration} jours`}
          onSuccess={handleStripeSuccess}
          onCancel={() => setShowStripeCheckout(false)}
        />
      )}
    </div>
  );
}
