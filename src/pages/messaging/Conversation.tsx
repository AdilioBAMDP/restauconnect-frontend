/**
 * CONVERSATION PAGE - Chat privé entre 2 participants
 * 
 * Cette page affiche une conversation privée avec :
 * - Liste des messages
 * - Formulaire d'envoi
 * - Auto-scroll vers le bas
 * - Indicateur de lecture
 * - Intégration Socket.io pour temps réel
 */

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { ArrowLeft, Send, User, Clock } from 'lucide-react';
import Header from '@/components/layout/Header';
import { useConversationStore } from '@/stores/conversationStore';
import { useAuthStore } from '@/stores/authStore';
import { useAppStore } from '@/stores/appStore';
import { useNavigation } from '@/hooks/useNavigation';
import toast from 'react-hot-toast';
import { PageName } from '@/services/NavigationManager';

const ConversationPage: React.FC = () => {
  const { user } = useAuthStore();
  const { 
    currentConversation, 
    isLoading, 
    isSending,
    fetchConversationById, 
    sendMessage
  } = useConversationStore();
  const { navigateTo } = useAppStore();
  const navigateToString = useCallback((page: string) => {
    navigateTo(page as PageName);
  }, [navigateTo]);
  
  const [messageContent, setMessageContent] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Récupérer le conversationId depuis URL
  const urlParams = new URLSearchParams(window.location.search);
  const conversationId = urlParams.get('conversationId') || undefined;

  useEffect(() => {
    if (conversationId) {
      fetchConversationById(conversationId);
    }
  }, [conversationId, fetchConversationById]);

  // Auto-scroll vers le bas quand de nouveaux messages arrivent
  useEffect(() => {
    scrollToBottom();
  }, [currentConversation?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!messageContent.trim() || !currentConversation) return;

    const success = await sendMessage(currentConversation._id, messageContent, 'text');

    if (success) {
      setMessageContent('');
      scrollToBottom();
    } else {
      toast.error('Erreur lors de l\'envoi du message');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleBack = () => {
    navigateToString('messages');
  };

  if (isLoading || !currentConversation) {
    return (
      <div className="min-h-screen bg-gray-50">
  
        
      <Header currentPage="conversation" onNavigate={navigateToString} />

<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            <p className="mt-4 text-gray-600">Chargement de la conversation...</p>
          </div>
        </div>
      </div>
    );
  }

  // Trouver l'autre participant
  const otherParticipant = currentConversation.participants.find(
    p => p.userId !== user?.id
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col"><div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête de la conversation */}
        <div className="bg-white rounded-t-lg shadow-sm border border-gray-200 border-b-0 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">
                  {otherParticipant?.userName || 'Utilisateur'}
                </h2>
                <p className="text-sm text-gray-500">{otherParticipant?.userRole}</p>
              </div>
            </div>
          </div>

          {currentConversation.offerTitle && (
            <div className="text-sm text-gray-500">
              <p className="text-xs">Offre liée :</p>
              <p className="font-medium">{currentConversation.offerTitle}</p>
            </div>
          )}
        </div>

        {/* Zone des messages */}
        <div className="flex-1 bg-white border-l border-r border-gray-200 overflow-y-auto p-6 space-y-4" style={{ maxHeight: 'calc(100vh - 350px)' }}>
          {currentConversation.messages.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Aucun message pour le moment</p>
              <p className="text-sm text-gray-400 mt-2">Envoyez le premier message pour démarrer la conversation</p>
            </div>
          ) : (
            currentConversation.messages.map((message, index) => {
              const isMyMessage = message.senderId === user?.id;
              const showAvatar = index === 0 || currentConversation.messages[index - 1].senderId !== message.senderId;

              return (
                <div
                  key={message._id || index}
                  className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'} gap-2`}
                >{!isMyMessage && showAvatar && (
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-gray-600" />
                    </div>
                  )}
                  {!isMyMessage && !showAvatar && <div className="w-8" />}

                  <div className={`max-w-md ${isMyMessage ? 'order-1' : 'order-2'}`}>
                    <div
                      className={`px-4 py-2 rounded-lg ${
                        isMyMessage
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      {!isMyMessage && showAvatar && (
                        <p className="text-xs font-semibold mb-1 opacity-75">
                          {message.senderName}
                        </p>
                      )}
                      <p className="whitespace-pre-wrap break-words">{message.content}</p>
                    </div>
                    <div className={`flex items-center gap-1 mt-1 text-xs text-gray-500 ${isMyMessage ? 'justify-end' : 'justify-start'}`}>
                      <Clock className="w-3 h-3" />
                      <span>
                        {new Date(message.createdAt).toLocaleTimeString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>

                  {isMyMessage && showAvatar && (
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-orange-600" />
                    </div>
                  )}
                  {isMyMessage && !showAvatar && <div className="w-8" />}
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Formulaire d'envoi */}
        <div className="bg-white rounded-b-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-end gap-2">
            <textarea
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Saisissez votre message... (Entrée pour envoyer, Shift+Entrée pour nouvelle ligne)"
              rows={2}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
            />
            <button
              onClick={handleSendMessage}
              disabled={isSending || !messageContent.trim()}
              className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2 h-[72px]"
            >
              {isSending ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span className="hidden sm:inline">Envoyer</span>
                </>
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Appuyez sur Entrée pour envoyer, Shift+Entrée pour une nouvelle ligne
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConversationPage;
