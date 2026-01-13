import React from 'react';
import { Users, MessageSquare } from 'lucide-react';

interface Message {
  id: string;
  fromId: string;
  toId: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

interface Professional {
  id: string;
  name: string;
}

interface BankerMessagesProps {
  messages: Message[];
  professionals: Professional[];
  onMarkAsRead: (messageId: string) => void;
}

const BankerMessages: React.FC<BankerMessagesProps> = ({ messages, professionals, onMarkAsRead }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">Messages</h2>
      </div>
      <div className="p-6">
        {messages.length > 0 ? (
          <div className="space-y-4">
            {messages.slice(0, 10).map((message) => {
              const sender = professionals.find(p => p.id === message.fromId);
              return (
                <div key={message.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-gray-900">{sender?.name || 'Client'}</h4>
                      <span className="text-sm text-gray-500">
                        {new Date(message.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{message.content}</p>
                    {!message.read && (
                      <button
                        onClick={() => onMarkAsRead(message.id)}
                        className="text-xs text-blue-600 hover:text-blue-800 mt-2"
                      >
                        Marquer comme lu
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Aucun message</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BankerMessages;
