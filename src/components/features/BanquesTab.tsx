import React, { useState } from 'react';
import { useBusinessStore } from '@/stores/businessStore';
import { 
  CreditCard, 
  MapPin, 
  Phone, 
  Mail, 
  Star, 
  DollarSign, 
  Clock, 
  FileText, 
  Send,
  Filter,
  MessageCircle,
  Building2,
  TrendingUp,
  CheckCircle
} from 'lucide-react';

const BanquesTab: React.FC = () => {
  const {
    bankPartners,
    loanOffers,
    bankConversations,
    getBanksByLocation,
    getLoanOffersByType,
    createBankConversation,
    sendBankMessage
  } = useBusinessStore();

  const [activeSection, setActiveSection] = useState<'partners' | 'offers' | 'conversations'>('partners');
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [conversationSubject, setConversationSubject] = useState('');
  const [conversationMessage, setConversationMessage] = useState('');
  const [filterType, setFilterType] = useState<'credit_professionnel' | 'pret_equipement' | 'credit_tresorerie' | 'pret_immobilier_pro' | 'leasing' | ''>('');

  // Données actives selon la section
  const activeBanks = getBanksByLocation();
  const activeOffers = getLoanOffersByType(filterType as 'credit_professionnel' | 'pret_equipement' | 'credit_tresorerie' | 'pret_immobilier_pro' | 'leasing' | undefined);

  const handleCreateConversation = () => {
    if (selectedBank && conversationSubject && conversationMessage) {
      createBankConversation(selectedBank, conversationSubject, conversationMessage);
      setConversationSubject('');
      setConversationMessage('');
      setSelectedBank(null);
      setActiveSection('conversations');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const renderPartners = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Partenaires Bancaires</h3>
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            onChange={(e) => setFilterType(e.target.value as 'credit_professionnel' | 'pret_equipement' | 'credit_tresorerie' | 'pret_immobilier_pro' | 'leasing' | '')}
          >
            <option value="">Tous les types</option>
            <option value="banque_traditionnelle">Banque traditionnelle</option>
            <option value="credit_mutuel">Crédit Mutuel</option>
            <option value="banque_populaire">Banque Populaire</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeBanks.map((bank) => (
          <div key={bank.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{bank.name}</h4>
                  <p className="text-sm text-gray-500">{bank.type.replace('_', ' ')}</p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium">{bank.rating}</span>
                <span className="text-xs text-gray-500">({bank.reviewCount})</span>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{bank.location.city}, {bank.location.region}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Phone className="h-4 w-4" />
                <span>{bank.contact.phone}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Mail className="h-4 w-4" />
                <span>{bank.contact.email}</span>
              </div>
            </div>

            <div className="mb-4">
              <h5 className="text-sm font-medium text-gray-900 mb-2">Spécialités</h5>
              <div className="flex flex-wrap gap-1">
                {bank.specialties.map((specialty, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-md"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => setSelectedBank(bank.id)}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Contacter</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderOffers = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Offres de Financement</h3>
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as 'credit_professionnel' | 'pret_equipement' | 'credit_tresorerie' | 'pret_immobilier_pro' | 'leasing' | '')}
          >
            <option value="">Tous les types</option>
            <option value="credit_professionnel">Crédit professionnel</option>
            <option value="pret_equipement">Prêt équipement</option>
            <option value="credit_tresorerie">Crédit trésorerie</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {activeOffers.map((offer) => (
          <div key={offer.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="font-semibold text-gray-900">{offer.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{offer.bankName}</p>
              </div>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md">
                {offer.type.replace('_', ' ')}
              </span>
            </div>

            <p className="text-sm text-gray-600 mb-4">{offer.description}</p>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Montant</span>
                </div>
                <p className="text-sm text-gray-600">
                  {formatCurrency(offer.conditions.minAmount)} - {formatCurrency(offer.conditions.maxAmount)}
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Taux</span>
                </div>
                <p className="text-sm text-gray-600">
                  {offer.conditions.interestRateMin}% - {offer.conditions.interestRateMax}%
                </p>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium">Délai de traitement</span>
              </div>
              <p className="text-sm text-gray-600">{offer.processingTime}</p>
            </div>

            <div className="mb-4">
              <h5 className="text-sm font-medium text-gray-900 mb-2">Avantages</h5>
              <ul className="space-y-1">
                {offer.advantages?.slice(0, 3).map((advantage, index) => (
                  <li key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span>{advantage}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => setSelectedBank(offer.bankId)}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Send className="h-4 w-4" />
              <span>Demander un devis</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderConversations = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Messages Bancaires</h3>
      
      {bankConversations.length === 0 ? (
        <div className="text-center py-8">
          <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Aucune conversation en cours</p>
          <p className="text-sm text-gray-400 mt-2">Contactez une banque pour commencer</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bankConversations.map((conversation) => (
            <div key={conversation.id} className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium text-gray-900">{conversation.subject}</h4>
                  <p className="text-sm text-gray-600">
                    {bankPartners.find(b => b.id === conversation.bankId)?.name}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-md ${
                  conversation.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {conversation.status}
                </span>
              </div>
              
              <div className="text-sm text-gray-500">
                {conversation.messages.length} message(s) - 
                Dernière activité: {new Date(conversation.lastActivity).toLocaleDateString('fr-FR')}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Navigation */}
      <div className="mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveSection('partners')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeSection === 'partners'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Partenaires ({activeBanks.length})
          </button>
          <button
            onClick={() => setActiveSection('offers')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeSection === 'offers'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Offres ({activeOffers.length})
          </button>
          <button
            onClick={() => setActiveSection('conversations')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeSection === 'conversations'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Messages ({bankConversations.length})
          </button>
        </nav>
      </div>

      {/* Contenu */}
      {activeSection === 'partners' && renderPartners()}
      {activeSection === 'offers' && renderOffers()}
      {activeSection === 'conversations' && renderConversations()}

      {/* Modal de contact */}
      {selectedBank && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Contacter la banque</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sujet
                </label>
                <input
                  type="text"
                  value={conversationSubject}
                  onChange={(e) => setConversationSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Demande de financement équipement"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  value={conversationMessage}
                  onChange={(e) => setConversationMessage(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Décrivez votre projet et vos besoins de financement..."
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setSelectedBank(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleCreateConversation}
                disabled={!conversationSubject || !conversationMessage}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Envoyer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BanquesTab;
