import React from 'react';
import { User } from 'lucide-react';
import { Message } from '@/stores/conversationStore';
import MessageAttachments from '@/components/messaging/MessageAttachments';

interface MessageBubbleProps {
  message: Message;
  isMyMessage: boolean;
  senderName?: string;
  senderRole?: string;
  showAvatar?: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  message, 
  isMyMessage, 
  senderName,
  senderRole,
  showAvatar = true 
}) => {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex ${isMyMessage ? 'flex-row-reverse' : 'flex-row'} items-end gap-2 max-w-[70%]`}>
        {/* Avatar */}
        {showAvatar && (
          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
            isMyMessage ? 'bg-orange-500' : 'bg-gray-400'
          }`}>
            <User className="w-5 h-5 text-white" />
          </div>
        )}

        {/* Message bubble */}
        <div className="flex flex-col">
          {/* Nom de l'expéditeur (si ce n'est pas mon message) */}
          {!isMyMessage && senderName && (
            <div className="text-xs text-gray-500 mb-1 px-1">
              {senderName}
              {senderRole && <span className="ml-1 text-gray-400">({senderRole})</span>}
            </div>
          )}

          {/* Contenu du message */}
          <div className={`rounded-lg px-4 py-2 ${
            isMyMessage 
              ? 'bg-orange-500 text-white rounded-br-none' 
              : 'bg-gray-200 text-gray-900 rounded-bl-none'
          }`}>
            <p className="text-sm whitespace-pre-wrap break-words">
              {message.content}
            </p>
            
            {/* Fichiers attachés */}
            {message.attachments && message.attachments.length > 0 && (
              <MessageAttachments attachments={message.attachments} />
            )}
            
            {/* Heure */}
            <div className={`text-xs mt-1 ${
              isMyMessage ? 'text-orange-100' : 'text-gray-500'
            }`}>
              {formatTime(message.createdAt)}
            </div>
          </div>
        </div>

        {/* Espace invisible pour l'alignement si pas d'avatar */}
        {!showAvatar && <div className="w-8" />}
      </div>
    </div>
  );
};

export default MessageBubble;
