import React from 'react';
import { MessageSquare, User } from 'lucide-react';

interface Message {
  id: string;
  fromId: string;
  toId: string;
  fromName: string;
  toName: string;
  subject: string;
  content: string;
  createdAt: string;
  read: boolean;
  relatedOfferId?: string;
}

interface ArtisanMessagesProps {
  messages: Message[];
  currentArtisanId: string;
  onShowMessageModal: () => void;
  onSetSelectedRestaurant: (restaurantId: string) => void;
  onMarkAsRead: (messageId: string) => void;
  getTimeAgo: (dateString: string) => string;
}

export const ArtisanMessages: React.FC<ArtisanMessagesProps> = ({
  messages,
  currentArtisanId,
  onShowMessageModal,
  onSetSelectedRestaurant,
  onMarkAsRead,
  getTimeAgo
}) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Mes messages</h2>
        <button
          onClick={onShowMessageModal}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <MessageSquare className="w-4 h-4 inline mr-2" />
          Nouveau message
        </button>
      </div>
      
      <div className="space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`bg-white rounded-lg shadow-sm border p-6 ${!message.read && message.toId === currentArtisanId ? 'border-blue-200 bg-blue-50' : 'border-gray-200'}`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {message.fromId === currentArtisanId ? `À: ${message.toName}` : `De: ${message.fromName}`}
                  </h3>
                  <p className="text-sm text-gray-600">Restaurant Le Comptoir</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">{getTimeAgo(message.createdAt)}</p>
                {!message.read && message.toId === currentArtisanId && (
                  <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-1"></span>
                )}
              </div>
            </div>
            
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">{message.subject}</h4>
              <p className="text-gray-700">{message.content}</p>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {message.relatedOfferId && (
                  <span className="text-sm text-blue-600">
                    🔗 Lié à une offre
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    onSetSelectedRestaurant(message.fromId === currentArtisanId ? message.toId : message.fromId);
                    onShowMessageModal();
                  }}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                >
                  Répondre
                </button>
                {!message.read && message.toId === currentArtisanId && (
                  <button
                    onClick={() => onMarkAsRead(message.id)}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Marquer lu
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {messages.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun message</h3>
            <p className="text-gray-600">Vos conversations avec les restaurants apparaîtront ici</p>
          </div>
        )}
      </div>
    </div>
  );
};
