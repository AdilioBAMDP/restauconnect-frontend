/**
 * CONVERSATION LIST - Liste des conversations
 * 
 * Composant réutilisable pour afficher la liste des conversations
 * avec recherche, tri et badges non lus
 */

import React from 'react';
import { Search } from 'lucide-react';
import { Conversation } from '@/stores/conversationStore';

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversationId: string | null;
  onSelectConversation: (conversationId: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  currentUserId: string;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedConversationId,
  onSelectConversation,
  searchQuery,
  onSearchChange,
  currentUserId
}) => {
  
  // Formater l'heure
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'À l\'instant';
    } else if (diffInHours < 24) {
      return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Hier';
    } else {
      return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    }
  };

  // Couleurs des badges selon le rôle
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'artisan': return 'bg-blue-100 text-blue-800';
      case 'candidat': return 'bg-green-100 text-green-800';
      case 'fournisseur': return 'bg-purple-100 text-purple-800';
      case 'community_manager': return 'bg-pink-100 text-pink-800';
      case 'restaurant': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'artisan': return '🔧';
      case 'candidat': return '👤';
      case 'fournisseur': return '📦';
      case 'community_manager': return '📱';
      case 'restaurant': return '🍽️';
      default: return '👥';
    }
  };

  return (
    <div className="w-1/3 border-r border-gray-200 flex flex-col">
      {/* Barre de recherche */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Rechercher une conversation..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Liste des conversations */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length > 0 ? (
          conversations.map((conversation) => {
            // Trouver l'autre participant
            const otherParticipant = conversation.participants.find(
              p => p.userId !== currentUserId
            );

            if (!otherParticipant) return null;

            return (
              <div
                key={conversation._id}
                onClick={() => {
                  console.log('🔥 🔥 🔥 CLIC DÉTECTÉ sur conversation:', conversation._id);
                  console.log('🔥 Nom:', otherParticipant?.userName);
                  onSelectConversation(conversation._id);
                }}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedConversationId === conversation._id 
                    ? 'bg-orange-50 border-orange-200' 
                    : ''
                }`}
                style={{ cursor: 'pointer' }}
              >
                <div className="flex items-start space-x-3">
                  {/* Avatar */}
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    {otherParticipant.userName
                      .split(' ')
                      .map(n => n[0])
                      .join('')
                      .toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {otherParticipant.userName}
                        </h3>
                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${getRoleBadgeColor(otherParticipant.userRole)}`}>
                          {getRoleLabel(otherParticipant.userRole)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {(conversation.myUnreadCount || 0) > 0 && (
                          <span className="inline-flex items-center justify-center w-5 h-5 bg-orange-500 text-white text-xs rounded-full">
                            {conversation.myUnreadCount}
                          </span>
                        )}
                        {conversation.lastMessage && (
                          <span className="text-xs text-gray-500">
                            {formatTime(conversation.lastMessage.createdAt)}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-500 mb-1">
                      {otherParticipant.userRole}
                    </p>
                    
                    {conversation.lastMessage && (
                      <p className="text-sm text-gray-600 truncate">
                        {conversation.lastMessage.senderId === currentUserId ? 'Vous: ' : ''}
                        {conversation.lastMessage.content}
                      </p>
                    )}
                    
                    {/* BOUTON TEST CONVERSATION */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('🔧 BOUTON CONVERSATION CLIQUÉ !', conversation._id);
                        onSelectConversation(conversation._id);
                      }}
                      className="mt-2 bg-green-500 text-white px-2 py-1 rounded text-xs"
                    >
                      🔧 OUVRIR
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 text-sm">
            Aucune conversation
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationList;
