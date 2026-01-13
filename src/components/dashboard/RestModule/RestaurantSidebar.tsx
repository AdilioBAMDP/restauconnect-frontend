import React, { useState, useEffect } from 'react';
import { Bell, MessageSquare, Calendar, ArrowRight, ChevronDown, ChevronUp, Users, Store, Truck, Hammer } from 'lucide-react';
import { useConversationStore } from '@/stores/conversationStore';

interface Event {
  title?: string;
  date?: string | Date;
}

interface Partner {
  id: string;
  name: string;
  role: string;
  specialty?: string;
  rating?: number;
  verified?: boolean;
  location?: string;
}

interface CompleteSidebarProps {
  upcomingEvents?: Event[];
  messagesCount?: number;
  professionalsCount?: number;
  avgRating?: number;
  activeOffers?: number;
  currentUserRole?: string;
  partners?: Partner[];
  onNavigate?: (path: string) => void;
  [key: string]: unknown;
}

export const CompleteSidebar: React.FC<CompleteSidebarProps> = ({
  upcomingEvents = [],
  messagesCount = 0,
  professionalsCount = 0,
  avgRating = 0,
  activeOffers = 0,
  partners = [],
  currentUserRole = '',
  onNavigate
}) => {
  const [isPartnersOpen, setIsPartnersOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const { unreadConversationsCount, fetchUnreadCount } = useConversationStore();

  // Charger le compteur de messages non lus
  useEffect(() => {
    fetchUnreadCount();
  }, [fetchUnreadCount]);

  // Grouper les partenaires par catégorie
  const partnersByCategory = partners.reduce((acc, partner) => {
    const category = partner.role || 'autre';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(partner);
    return acc;
  }, {} as Record<string, Partner[]>);

  // Labels des catégories
  const categoryLabels: Record<string, { label: string; icon: React.ReactNode }> = {
    'restaurant': { label: 'Restaurants', icon: <Store className="w-4 h-4" /> },
    'fournisseur': { label: 'Fournisseurs', icon: <Truck className="w-4 h-4" /> },
    'artisan': { label: 'Artisans', icon: <Hammer className="w-4 h-4" /> },
    'transporteur': { label: 'Transporteurs', icon: <Truck className="w-4 h-4" /> },
    'banquier': { label: 'Banquiers', icon: <Users className="w-4 h-4" /> },
    'comptable': { label: 'Comptables', icon: <Users className="w-4 h-4" /> },
  };

  return (
    <div className="space-y-6">
      {/* Accès direct au paramétrage plateforme avancé — affiché uniquement pour les admins */}
      {currentUserRole === 'admin' && (
        <div className="bg-white rounded-lg shadow-md p-4">
          <button
            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold"
            onClick={() => onNavigate?.('admin-platform-settings')}
          >
            ⚙️ Paramétrage plateforme
          </button>
        </div>
      )}
      {/* Information en temps réel - Cliquable */}
      <div 
        className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
        onClick={() => onNavigate?.('information-globale')}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">📊 Information en temps réel</h3>
          <ArrowRight className="w-5 h-5 text-gray-400" />
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <span className="text-sm text-gray-600">Notifications</span>
            <span className="font-semibold text-blue-600">{messagesCount}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <span className="text-sm text-gray-600">Activité récente</span>
            <span className="font-semibold text-green-600">{activeOffers}</span>
          </div>
        </div>
        <button 
          className="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
          onClick={(e) => {
            e.stopPropagation();
            onNavigate?.('information-globale');
          }}
        >
          Voir toutes les infos
        </button>
      </div>

      {/* Marketplace / Activité - Cliquable */}
      <div 
        className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
        onClick={() => onNavigate?.('marketplace')}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">🛒 Marketplace / Activité</h3>
          <ArrowRight className="w-5 h-5 text-gray-400" />
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
            <span className="text-sm text-gray-600">Posts actifs</span>
            <span className="font-semibold text-purple-600">{professionalsCount}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
            <span className="text-sm text-gray-600">Interactions</span>
            <span className="font-semibold text-orange-600">-</span>
          </div>
        </div>
        <button 
          className="w-full mt-4 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm font-medium"
          onClick={(e) => {
            e.stopPropagation();
            onNavigate?.('marketplace');
          }}
        >
          Voir la Marketplace
        </button>
      </div>

      {/* Événements à Venir avec Notifications intégrées */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="font-semibold flex items-center gap-2 mb-4">
          <Calendar className="text-blue-500 w-5 h-5" />
          Événements à Venir
        </h3>
        <div className="space-y-3">
          {upcomingEvents.length > 0 ? (
            upcomingEvents.slice(0, 3).map((event, index: number) => (
              <div key={index} className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium">{event?.title || 'Événement'}</p>
                <p className="text-xs text-gray-600 mt-1">
                  {event?.date ? new Date(event.date).toLocaleDateString('fr-FR') : 'Date à définir'}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">Aucun événement</p>
          )}
        </div>

        {/* Notifications intégrées */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <MessageSquare className="text-orange-500 w-4 h-4" />
              Messages
            </h4>
            {unreadConversationsCount > 0 && (
              <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                {unreadConversationsCount > 9 ? '9+' : unreadConversationsCount}
              </span>
            )}
          </div>
          {unreadConversationsCount > 0 ? (
            <button
              onClick={() => onNavigate?.('messages')}
              className="w-full px-3 py-2 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-lg text-sm font-medium transition-colors"
            >
              {unreadConversationsCount} {unreadConversationsCount === 1 ? 'conversation' : 'conversations'} non {unreadConversationsCount === 1 ? 'lue' : 'lues'}
            </button>
          ) : (
            <p className="text-sm text-gray-500 text-center py-2">Aucun nouveau message</p>
          )}
        </div>
      </div>

      {/* Annuaire des Partenaires - Accordion */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <button
          onClick={() => setIsPartnersOpen(!isPartnersOpen)}
          className="w-full flex items-center justify-between mb-4 hover:opacity-80 transition-opacity"
        >
          <div className="flex items-center gap-2">
            <Users className="text-purple-500 w-5 h-5" />
            <h3 className="font-semibold">Annuaire des Partenaires</h3>
            <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded-full text-xs font-semibold">
              {partners.length}
            </span>
          </div>
          {isPartnersOpen ? (
            <ChevronUp className="text-gray-500 w-5 h-5" />
          ) : (
            <ChevronDown className="text-gray-500 w-5 h-5" />
          )}
        </button>

        {isPartnersOpen && (
          <div className="space-y-2 mt-2">
            {Object.keys(partnersByCategory).length > 0 ? (
              Object.entries(partnersByCategory).map(([category, categoryPartners]) => {
                const categoryInfo = categoryLabels[category] || { label: category, icon: <Users className="w-4 h-4" /> };
                const isExpanded = expandedCategory === category;

                return (
                  <div key={category} className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setExpandedCategory(isExpanded ? null : category)}
                      className="w-full p-3 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        {categoryInfo.icon}
                        <span className="text-sm font-medium">{categoryInfo.label}</span>
                        <span className="text-xs text-gray-500">({categoryPartners.length})</span>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="p-2 space-y-1 max-h-60 overflow-y-auto">
                        {categoryPartners.slice(0, 10).map((partner) => (
                          <div
                            key={partner.id}
                            className="p-2 hover:bg-blue-50 rounded cursor-pointer transition-colors"
                            onClick={() => onNavigate?.(`partenaires-${category}`)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {partner.name}
                                  {partner.verified && (
                                    <span className="ml-1 text-blue-500">✓</span>
                                  )}
                                </p>
                                {partner.specialty && (
                                  <p className="text-xs text-gray-500 truncate">{partner.specialty}</p>
                                )}
                                {partner.location && (
                                  <p className="text-xs text-gray-400">{partner.location}</p>
                                )}
                              </div>
                              {partner.rating && (
                                <div className="ml-2 text-xs font-medium text-yellow-600">
                                  {partner.rating.toFixed(1)}⭐
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                        {categoryPartners.length > 10 && (
                          <button
                            onClick={() => onNavigate?.(`partenaires-${category}`)}
                            className="w-full p-2 text-xs text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Voir tous les {categoryPartners.length} partenaires
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">Aucun partenaire disponible</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
