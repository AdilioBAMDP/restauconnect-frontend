/**
 * MESSAGES PAGE - Page de messagerie unifiée
 * 
 * Utilise conversationStore pour toutes les conversations
 * Compatible avec ChatWindow et temps réel Socket.io
 */

import React, { useState, useEffect, useRef } from 'react';
import Header from '@/components/layout/Header';
import { logger } from '@/utils/logger';
import { MessageSquare, UserPlus } from 'lucide-react';
import { getUserDashboard } from '@/utils/navigationUtils';
import { useAuth } from '@/hooks/useAuthContext';
import { useConversationStore } from '@/stores/conversationStore';
import ConversationList from '@/components/messaging/ConversationList';
import ChatHeader from '@/components/messaging/ChatHeader';
import MessageInput from '@/components/messaging/MessageInput';
import MessageBubble from '@/components/offers/MessageBubble';
import UserDirectory from '@/components/messaging/UserDirectory';

interface MessagesPageProps {
  navigateTo: (page: string) => void;
}

export default function MessagesPage({ navigateTo }: MessagesPageProps) {
  const { user } = useAuth();
  const { 
    conversations, 
    currentConversation,
    isLoading,
    isSending,
    fetchConversations,
    fetchConversationById,
    sendMessage,
    sendMessageWithFiles,
    createConversation
  } = useConversationStore();
  
  const [activeTab, setActiveTab] = useState<'history' | 'directory'>('history'); // NOUVEAU - Onglets
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  
  // Fonction wrapper pour ajouter des logs
  const handleSelectConversation = (conversationId: string) => {
    console.log('🚀🚀 MessagesPage: handleSelectConversation APPELÉE !!! ID:', conversationId);
    console.log('🚀 MessagesPage: Chargement de la conversation...');
    setSelectedConversationId(conversationId);
    // IMPORTANT: Charger immédiatement la conversation avec ses messages
    console.log('🚀 MessagesPage: Appel fetchConversationById...');
    fetchConversationById(conversationId);
    console.log('🚀 MessagesPage: fetchConversationById appelé avec succès');
    console.log('🚀 MessagesPage: Fonction terminée avec succès');
  };
  
  // Supprimé: mockConversation - On utilise maintenant les vraies API
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // 🔒 FIX 3.2 - Protection anti-boucle pour query params
  const hasLoadedFromUrl = useRef(false);

  // 🔒 FIX 3.2 - Gérer query param ?conversation=xxx au montage
  useEffect(() => {
    // ⚠️ FIX CRITIQUE: Attendre que conversations soit chargé ET isLoading=false
    // pour éviter race condition créant doublons
    if (!hasLoadedFromUrl.current && !isLoading) {
      const params = new URLSearchParams(window.location.search);
      const conversationId = params.get('conversation');
      const partnerId = params.get('partnerId');
      const partnerName = params.get('partnerName');
      
      if (conversationId === 'start' && partnerId && partnerName) {
        // Démarrer une conversation avec un partenaire spécifique
        logger.info('MessagesPage: Démarrage conversation avec partenaire:', partnerName);
        
        // Vérifier si conversation existe déjà avec ce partenaire
        const existing = conversations.find(c => 
          c && c.participants && c.participants.some(p => p.userId === partnerId)
        );
        
        logger.info('MessagesPage: Recherche conversation existante pour partnerId:', partnerId, 'trouvée:', !!existing);
        
        if (existing) {
          // Conversation existe → Ouvrir
          logger.info('MessagesPage: Conversation existante trouvée, ouverture...', existing._id);
          setActiveTab('history');
          setSelectedConversationId(existing._id);
          // Forcer le rechargement de la conversation
          fetchConversationById(existing._id);
        } else {
          // Créer conversation via API pour tous les partenaires (fictifs ou réels)
          logger.info('MessagesPage: Création conversation avec', decodeURIComponent(partnerName), 'partnerId:', partnerId);
          // ✅ FIX: Passer le partnerName en 3ème paramètre
          createConversation(partnerId, undefined, partnerName).then(newConv => {
            if (newConv && newConv._id) {
              logger.info('MessagesPage: Conversation créée avec succès, ID:', newConv._id);
              setActiveTab('history');
              setSelectedConversationId(newConv._id);
              // Recharger la liste des conversations pour inclure la nouvelle
              fetchConversations();
              // Forcer le rechargement de la nouvelle conversation
              fetchConversationById(newConv._id);
            } else {
              logger.error('MessagesPage: Échec création conversation');
            }
          }).catch(error => {
            logger.error('MessagesPage: Erreur création conversation', error);
          });
        }
        
        // Nettoyer l'URL après chargement
        window.history.replaceState({}, '', window.location.pathname);
      } else if (conversationId && conversationId !== 'start') {
        logger.info('MessagesPage: Chargement conversation depuis URL:', conversationId);
        setSelectedConversationId(conversationId);
        fetchConversationById(conversationId);
        // Nettoyer l'URL après chargement
        window.history.replaceState({}, '', window.location.pathname);
      }
      
      hasLoadedFromUrl.current = true;
    }
  }, [fetchConversationById, fetchConversations, conversations, createConversation, isLoading]); // Ajout dépendance isLoading

  // Charger les conversations au montage
  useEffect(() => {
    logger.info('MessagesPage: Chargement des conversations...');
    fetchConversations();
  }, [fetchConversations]);

  // Charger la conversation sélectionnée
  useEffect(() => {
    if (selectedConversationId) {
      logger.info('MessagesPage: Chargement conversation:', selectedConversationId);
      fetchConversationById(selectedConversationId);
    }
  }, [selectedConversationId, fetchConversationById]);

  // Utiliser directement la conversation courante du store
  const activeConversation = currentConversation;
  
  // DEBUG CONVERSATION ACTIVE
  console.log('🔧 DEBUG currentConversation (du store):', currentConversation);
  console.log('🔧 DEBUG activeConversation:', activeConversation);

  // Auto-scroll vers le bas des messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages]);

  // Sélectionner automatiquement la première conversation
  useEffect(() => {
    if (conversations.length > 0 && !selectedConversationId && conversations[0]) {
      console.log('🔥 AUTO-SÉLECTION de la première conversation:', conversations[0]._id);
      setSelectedConversationId(conversations[0]._id);
      // FORCER le chargement de la conversation
      console.log('🔥 FORCER fetchConversationById pour:', conversations[0]._id);
      fetchConversationById(conversations[0]._id);
      logger.info('MessagesPage: Première conversation sélectionnée AUTO');
    }
  }, [conversations, selectedConversationId, fetchConversationById]);

  // Plus besoin de variable séparée, on utilise directement conversations

  // Fonction pour gérer le retour au dashboard
  const handleReturnToDashboard = () => {
    if (user) {
      const userDashboard = getUserDashboard(user.role);
      // Utiliser la prop navigateTo au lieu de useNavigation
      navigateTo(userDashboard);
    }
  };

  // Obtenir l'utilisateur courant
  const currentUserId = (user as { _id?: string, id?: string })?._id || 
                       (user as { _id?: string, id?: string })?.id || 
                       localStorage.getItem('userId') || 
                       '';
  
  // DEBUG USER ID
  console.log('🔧 DEBUG USER:', user);
  console.log('🔧 DEBUG user._id:', (user as { _id?: string })?._id);
  console.log('🔧 DEBUG user.id:', (user as { id?: string })?.id);
  console.log('🔧 DEBUG localStorage userId:', localStorage.getItem('userId'));
  console.log('🔧 DEBUG currentUserId final:', currentUserId);

  // Filtrer les conversations selon la recherche
  const filteredConversations = conversations.filter(conversation => {
    // 🔒 PROTECTION: Vérifier que conversation et participants existent
    if (!conversation || !conversation.participants || !Array.isArray(conversation.participants)) {
      console.warn('⚠️ Conversation invalide détectée:', conversation);
      return false;
    }
    
    const otherParticipant = conversation.participants.find(
      p => p.userId !== currentUserId
    );
    
    if (!otherParticipant) return false;
    
    return (
      otherParticipant.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      otherParticipant.userRole.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });
  
  // Log pour débogage
  console.log('🔥 MessagesPage RENDER: conversations brutes:', conversations.length);
  console.log('🔥 MessagesPage RENDER: filteredConversations:', filteredConversations.length);
  console.log('🔥 MessagesPage RENDER: selectedConversationId:', selectedConversationId);
  console.log('🔥 MessagesPage RENDER: handleSelectConversation type:', typeof handleSelectConversation);
  console.log('🔥 MessagesPage RENDER: user:', user);
  console.log('🔥 MessagesPage RENDER: currentUserId:', currentUserId);
  console.log('🔥 MessagesPage RENDER: isLoading:', isLoading);
  
  // Afficher la première conversation pour debug
  if (conversations.length > 0) {
    console.log('🔥 MessagesPage RENDER: Première conversation:', conversations[0]);
  }

  // Envoyer un message (avec ou sans fichiers)
  const handleSendMessage = async (attachedFiles?: File[]) => {
    if (!newMessage.trim() && (!attachedFiles || attachedFiles.length === 0)) return;
    if (!selectedConversationId) return;

    try {
      logger.info('MessagesPage: Envoi message...', { 
        hasText: !!newMessage.trim(), 
        filesCount: attachedFiles?.length || 0 
      });
      
      // Toutes les conversations passent maintenant par l'API
      let success = false;
      
      // Si fichiers attachés, utiliser sendMessageWithFiles
      if (attachedFiles && attachedFiles.length > 0) {
        success = await sendMessageWithFiles(
          selectedConversationId, 
          newMessage.trim(), 
          attachedFiles
        );
      } else {
        // Sinon, envoi message texte classique
        success = await sendMessage(selectedConversationId, newMessage.trim());
      }
      
      if (success) {
        setNewMessage('');
        // Recharger la conversation pour afficher le nouveau message
        await fetchConversationById(selectedConversationId);
        logger.info('MessagesPage: Message envoyé avec succès');
      } else {
        logger.error('MessagesPage: Échec envoi message');
      }
    } catch (error) {
      logger.error('MessagesPage: Erreur envoi message', error);
    }
  };

  // NOUVEAU - Démarrer conversation depuis répertoire
  const handleStartConversation = async (userId: string, userName: string) => {
    // Vérifier si conversation existe déjà
    const existing = conversations.find(c => 
      c && c.participants && c.participants.some(p => p.userId === userId)
    );
    
    if (existing) {
      // Conversation existe → Basculer sur historique
      logger.info('MessagesPage: Conversation existante trouvée, ouverture...');
      setActiveTab('history');
      setSelectedConversationId(existing._id);
    } else {
      // Nouvelle conversation → Créer
      logger.info('MessagesPage: Création nouvelle conversation avec', userName);
      const newConv = await createConversation(userId);
      if (newConv) {
        setActiveTab('history');
        setSelectedConversationId(newConv._id);
        logger.info('MessagesPage: Conversation créée avec succès');
      }
    }
  };

  // Obtenir l'autre participant de la conversation actuelle
  const otherParticipant = activeConversation?.participants.find(
    p => p.userId !== currentUserId
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="messages" onNavigate={navigateTo} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
            <p className="text-gray-600 mt-2">
              Toutes vos conversations centralisées
            </p>
          </div>
          <button
            onClick={handleReturnToDashboard}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            ← Retour dashboard
          </button>
        </div>

        {/* NOUVEAU - Onglets */}
        <div className="mb-6 border-b">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('history')}
              className={`pb-3 px-4 font-medium transition-colors relative ${
                activeTab === 'history'
                  ? 'text-orange-600 border-b-2 border-orange-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                <span>Historique</span>
                {conversations.length > 0 && (
                  <span className="ml-1 px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
                    {conversations.length}
                  </span>
                )}
              </div>
            </button>

            <button
              onClick={() => setActiveTab('directory')}
              className={`pb-3 px-4 font-medium transition-colors relative ${
                activeTab === 'directory'
                  ? 'text-orange-600 border-b-2 border-orange-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5" />
                <span>Nouveau message</span>
              </div>
            </button>
          </div>
        </div>

        {/* Zone de chat */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden" style={{ height: 'calc(100vh - 280px)' }}>
          
          {/* ONGLET HISTORIQUE - Code actuel préservé */}
          {activeTab === 'history' && (
            <>
              {isLoading && conversations.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-500">Chargement des conversations...</p>
                  </div>
                </div>
              ) : (
                <div className="flex h-full">
                  
                  {/* Liste des conversations */}
                  <ConversationList
                    conversations={filteredConversations}
                    selectedConversationId={selectedConversationId}
                    onSelectConversation={handleSelectConversation}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    currentUserId={currentUserId}
                  />

                  {/* Zone de chat */}
                  <div className="flex-1 flex flex-col">
                    {selectedConversationId && activeConversation ? (
                      <>
                        {/* Header */}
                        <ChatHeader
                          participant={otherParticipant}
                          offerTitle={activeConversation.offerTitle}
                        />

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                          {!activeConversation.messages || activeConversation.messages.length === 0 ? (
                            <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                              Aucun message. Commencez la conversation !
                            </div>
                          ) : (
                            <>
                              {activeConversation.messages.map((message, index) => {
                                const isMyMessage = message.senderId === currentUserId;
                                const prevMessage = index > 0 ? activeConversation.messages[index - 1] : null;
                                const showAvatar = !prevMessage || prevMessage.senderId !== message.senderId;

                                return (
                                  <MessageBubble
                                    key={message._id}
                                    message={message}
                                    isMyMessage={isMyMessage}
                                    senderName={!isMyMessage ? otherParticipant?.userName : undefined}
                                    senderRole={!isMyMessage ? otherParticipant?.userRole : undefined}
                                    showAvatar={showAvatar}
                                  />
                                );
                              })}
                              <div ref={messagesEndRef} />
                            </>
                          )}
                        </div>

                        {/* Input */}
                        <MessageInput
                          value={newMessage}
                          onChange={setNewMessage}
                          onSend={handleSendMessage}
                          isSending={isSending}
                          disabled={false}
                          placeholder={`Écrivez votre message à ${otherParticipant?.userName || 'ce partenaire'}...`}
                        />
                      </>
                    ) : (
                      <div className="flex-1 flex items-center justify-center text-gray-500">
                        <div className="text-center">
                          <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                          <p className="text-lg">Sélectionnez une conversation</p>
                          <p className="text-sm mt-2">
                            Choisissez une conversation dans la liste pour commencer
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {/* ONGLET NOUVEAU MESSAGE - Répertoire */}
          {activeTab === 'directory' && (
            <UserDirectory
              onSelectUser={handleStartConversation}
            />
          )}
        </div>
      </div>
    </div>
  );
}
