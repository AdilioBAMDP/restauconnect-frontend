import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Send, User } from 'lucide-react';
import { useConversationStore } from '@/stores/conversationStore';
import MessageBubble from './MessageBubble';
import toast from 'react-hot-toast';

interface ChatWindowProps {
  conversationId: string;
  height?: string;
  onClose?: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ 
  conversationId, 
  height = 'calc(100vh - 350px)',
  onClose 
}) => {
  const { currentConversation, fetchConversationById, sendMessage, isSending } = useConversationStore();
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (conversationId) {
      fetchConversationById(conversationId);
    }
  }, [conversationId, fetchConversationById]);

  useEffect(() => {
    scrollToBottom();
  }, [currentConversation?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || isSending) return;

    try {
      await sendMessage(conversationId, messageText.trim());
      setMessageText('');
      scrollToBottom();
    } catch (err) {
      console.error('Erreur envoi message:', err);
      toast.error('Erreur lors de l\'envoi du message');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!currentConversation) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const currentUserId = localStorage.getItem('userId') || '';
  const otherParticipant = currentConversation.participants.find(p => p.userId !== currentUserId);

  return (
    <div className="flex flex-col bg-white rounded-lg shadow-lg border border-gray-200" style={{ height }}>
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-gray-50">
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}

        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {otherParticipant?.userName || 'Utilisateur'}
            </h3>
            {otherParticipant?.userRole && (
              <p className="text-sm text-gray-500">{otherParticipant.userRole}</p>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {currentConversation.messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500 text-sm">
            Aucun message. Commencez la conversation !
          </div>
        ) : (
          <>
            {currentConversation.messages.map((message, index) => {
              const isMyMessage = message.senderId === currentUserId;
              const prevMessage = index > 0 ? currentConversation.messages[index - 1] : null;
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
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex gap-2">
          <textarea
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Écrivez votre message..."
            rows={2}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
          />
          <button
            onClick={handleSendMessage}
            disabled={!messageText.trim() || isSending}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            style={{ height: '72px' }}
          >
            {isSending ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Appuyez sur Entrée pour envoyer, Shift+Entrée pour une nouvelle ligne
        </p>
      </div>
    </div>
  );
};

export default ChatWindow;
