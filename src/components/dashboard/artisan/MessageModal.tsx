import React from 'react';
import { Send } from 'lucide-react';

interface MessageModalProps {
  show: boolean;
  messageContent: string;
  onMessageChange: (content: string) => void;
  onSend: (subject: string, content: string) => void;
  onClose: () => void;
}

export const MessageModal: React.FC<MessageModalProps> = ({
  show,
  messageContent,
  onMessageChange,
  onSend,
  onClose
}) => {
  if (!show) return null;

  const handleSend = () => {
    const subjectInput = document.getElementById('messageSubject') as HTMLInputElement;
    const subject = subjectInput?.value || '';
    
    if (subject && messageContent) {
      onSend(subject, messageContent);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Envoyer un message</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sujet</label>
            <input
              type="text"
              placeholder="Sujet du message"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              id="messageSubject"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea
              value={messageContent}
              onChange={(e) => onMessageChange(e.target.value)}
              rows={4}
              placeholder="Tapez votre message..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Annuler
          </button>
          <button
            onClick={handleSend}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Send className="w-4 h-4 inline mr-2" />
            Envoyer
          </button>
        </div>
      </div>
    </div>
  );
};
