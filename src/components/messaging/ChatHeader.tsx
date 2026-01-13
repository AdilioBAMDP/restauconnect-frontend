/**
 * CHAT HEADER - En-tête de conversation
 * 
 * Composant réutilisable pour l'en-tête d'une conversation
 */

import React from 'react';
import { User, ArrowLeft, Trash2 } from 'lucide-react';
import { Participant } from '@/stores/conversationStore';

interface ChatHeaderProps {
  participant: Participant | undefined;
  offerTitle?: string;
  onBack?: () => void;
  onDelete?: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  participant,
  offerTitle,
  onBack,
  onDelete
}) => {
  
  if (!participant) {
    return (
      <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-gray-500" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Chargement...</h3>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-gray-50">
      {onBack && (
        <button
          onClick={onBack}
          className="text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      )}

      <div className="flex items-center gap-3 flex-1">
        <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold">
          {(participant.userName || 'Utilisateur')
            .split(' ')
            .map((n: string) => n[0])
            .join('')
            .toUpperCase()}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">
            {participant.userName}
          </h3>
          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-500">{participant.userRole}</p>
            {offerTitle && (
              <>
                <span className="text-gray-300">•</span>
                <p className="text-sm text-gray-500">{offerTitle}</p>
              </>
            )}
          </div>
        </div>
      </div>

      {onDelete && (
        <button
          onClick={onDelete}
          className="text-gray-400 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50"
          title="Supprimer la conversation"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default ChatHeader;
