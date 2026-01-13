import React, { useState } from 'react';
import { 
  MessageSquare,
  Phone,
  Video,
  Calendar,
  FileText,
  Paperclip,
  Send,
  Search,
  Filter,
  Clock,
  CheckCircle,
  AlertCircle,
  Building2,
  ChefHat
} from 'lucide-react';

interface InvestorCommunicationProps {
  onNavigate?: (page: string) => void;
}

const InvestorCommunication: React.FC<InvestorCommunicationProps> = () => {
  const [activeTab, setActiveTab] = useState<'messages' | 'meetings' | 'documents'>('messages');
  const [selectedConversation, setSelectedConversation] = useState<string | null>('1');
  const [newMessage, setNewMessage] = useState('');

  const conversations = [
    {
      id: '1',
      name: 'Marie Dubois',
      company: 'Pizza Corner',
      type: 'restaurant',
      lastMessage: 'Merci pour votre investissement ! Les travaux avancent bien.',
      timestamp: '2h',
      unread: 2,
      status: 'active',
      avatar: null
    },
    {
      id: '2',
      name: 'Pierre Martin',
      company: 'Boulangerie Bio Artisanale',
      type: 'artisan',
      lastMessage: 'Pourrions-nous programmer une réunion cette semaine ?',
      timestamp: '1j',
      unread: 0,
      status: 'responded',
      avatar: null
    },
    {
      id: '3',
      name: 'Sophie Chen',
      company: 'Food Truck Fusion',
      type: 'restaurant',
      lastMessage: 'Voici le rapport mensuel que vous aviez demandé.',
      timestamp: '3j',
      unread: 1,
      status: 'pending',
      avatar: null
    }
  ];

  const messages = [
    {
      id: '1',
      senderId: '1',
      senderName: 'Marie Dubois',
      content: 'Bonjour ! J\'espère que vous allez bien. Je voulais vous donner des nouvelles de l\'avancement du projet.',
      timestamp: '10:30',
      isMe: false,
      attachments: []
    },
    {
      id: '2',
      senderId: 'me',
      senderName: 'Moi',
      content: 'Bonjour Marie ! Oui merci, j\'ai hâte d\'avoir vos nouvelles. Comment se déroulent les travaux ?',
      timestamp: '10:45',
      isMe: true,
      attachments: []
    },
    {
      id: '3',
      senderId: '1',
      senderName: 'Marie Dubois',
      content: 'Les travaux avancent très bien ! Nous sommes dans les temps. L\'aménagement de la cuisine est terminé et nous commençons la salle. Je vous envoie quelques photos.',
      timestamp: '11:20',
      isMe: false,
      attachments: [
        { name: 'cuisine_avancement.jpg', type: 'image' },
        { name: 'salle_travaux.jpg', type: 'image' }
      ]
    },
    {
      id: '4',
      senderId: 'me',
      senderName: 'Moi',
      content: 'Excellentes nouvelles ! Les photos montrent un très beau travail. Avez-vous une estimation pour l\'ouverture ?',
      timestamp: '14:15',
      isMe: true,
      attachments: []
    }
  ];

  const meetings = [
    {
      id: '1',
      title: 'Point mensuel - Pizza Corner',
      participant: 'Marie Dubois',
      company: 'Pizza Corner',
      date: '2024-01-15',
      time: '14:00',
      duration: '1h',
      type: 'video',
      status: 'scheduled',
      agenda: ['Avancement des travaux', 'Budget et dépenses', 'Planning d\'ouverture']
    },
    {
      id: '2',
      title: 'Présentation Q4 - Boulangerie Bio',
      participant: 'Pierre Martin',
      company: 'Boulangerie Bio Artisanale',
      date: '2024-01-18',
      time: '10:30',
      duration: '45min',
      type: 'phone',
      status: 'completed',
      agenda: ['Résultats Q4', 'Projections 2024', 'Nouveaux produits']
    },
    {
      id: '3',
      title: 'Réunion de crise - Food Truck',
      participant: 'Sophie Chen',
      company: 'Food Truck Fusion',
      date: '2024-01-20',
      time: '16:00',
      duration: '1h30',
      type: 'video',
      status: 'urgent',
      agenda: ['Analyse des difficultés', 'Plan de redressement', 'Soutien additionnel']
    }
  ];

  const documents = [
    {
      id: '1',
      name: 'Rapport Mensuel Décembre 2023',
      company: 'Pizza Corner',
      type: 'pdf',
      size: '2.1 MB',
      uploadedBy: 'Marie Dubois',
      uploadDate: '2024-01-05',
      category: 'Financier',
      confidential: false
    },
    {
      id: '2',
      name: 'Business Plan Révisé 2024',
      company: 'Boulangerie Bio Artisanale',
      type: 'pdf',
      size: '4.7 MB',
      uploadedBy: 'Pierre Martin',
      uploadDate: '2024-01-03',
      category: 'Stratégique',
      confidential: true
    },
    {
      id: '3',
      name: 'Photos Avancement Travaux',
      company: 'Pizza Corner',
      type: 'zip',
      size: '15.3 MB',
      uploadedBy: 'Marie Dubois',
      uploadDate: '2024-01-08',
      category: 'Projet',
      confidential: false
    }
  ];

  const renderMessages = () => (
    <div className="flex h-full">
      {/* Conversations List */}
      <div className="w-1/3 border-r border-gray-200 bg-white">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une conversation..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        <div className="overflow-y-auto h-full">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => setSelectedConversation(conversation.id)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                selectedConversation === conversation.id ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    {conversation.type === 'restaurant' ? (
                      <Building2 className="h-6 w-6 text-gray-600" />
                    ) : (
                      <ChefHat className="h-6 w-6 text-gray-600" />
                    )}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {conversation.name}
                    </p>
                    <div className="flex items-center space-x-1">
                      <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                      {conversation.unread > 0 && (
                        <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-blue-600 rounded-full">
                          {conversation.unread}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mb-1">{conversation.company}</p>
                  <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedConversation ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Marie Dubois</h3>
                    <p className="text-sm text-gray-600">Pizza Corner</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Phone className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Video className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Calendar className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.isMe
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                    {message.attachments.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {message.attachments.map((attachment, index) => (
                          <div key={index} className="flex items-center space-x-2 text-xs">
                            <Paperclip className="h-3 w-3" />
                            <span>{attachment.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <p className={`text-xs mt-1 ${
                      message.isMe ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <Paperclip className="h-5 w-5" />
                </button>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Tapez votre message..."
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Sélectionnez une conversation pour commencer</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderMeetings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Réunions</h3>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Programmer une réunion
        </button>
      </div>

      <div className="space-y-4">
        {meetings.map((meeting) => (
          <div key={meeting.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="text-lg font-semibold text-gray-900">{meeting.title}</h4>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    meeting.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                    meeting.status === 'completed' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {meeting.status === 'scheduled' ? 'Programmée' :
                     meeting.status === 'completed' ? 'Terminée' : 'Urgente'}
                  </div>
                </div>
                <p className="text-gray-600 mb-3">{meeting.participant} • {meeting.company}</p>
                
                <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{meeting.date}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{meeting.time} ({meeting.duration})</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {meeting.type === 'video' ? (
                      <Video className="h-4 w-4" />
                    ) : (
                      <Phone className="h-4 w-4" />
                    )}
                    <span>{meeting.type === 'video' ? 'Visioconférence' : 'Téléphone'}</span>
                  </div>
                </div>

                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Ordre du jour :</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {meeting.agenda.map((item, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="flex flex-col space-y-2">
                {meeting.status === 'scheduled' && (
                  <>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                      Rejoindre
                    </button>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                      Modifier
                    </button>
                  </>
                )}
                {meeting.status === 'completed' && (
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                    Voir CR
                  </button>
                )}
                {meeting.status === 'urgent' && (
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm">
                    Rejoindre
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDocuments = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Documents Partagés</h3>
        <div className="flex space-x-2">
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="h-4 w-4" />
            <span>Filtrer</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {documents.map((doc) => (
          <div key={doc.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-gray-900">{doc.name}</h4>
                    {doc.confidential && (
                      <div className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                        Confidentiel
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{doc.company} • {doc.category}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                    <span>Par {doc.uploadedBy}</span>
                    <span>{doc.uploadDate}</span>
                    <span>{doc.size}</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                  Aperçu
                </button>
                <button className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Télécharger
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-gray-900">Centre de Communication</h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                  3
                </span>
                <AlertCircle className="h-6 w-6 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'messages', label: 'Messages', icon: MessageSquare },
              { id: 'meetings', label: 'Réunions', icon: Calendar },
              { id: 'documents', label: 'Documents', icon: FileText }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'messages' | 'meetings' | 'documents')}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-[calc(100vh-8rem)]">
          {activeTab === 'messages' && renderMessages()}
          {activeTab === 'meetings' && (
            <div className="py-8">
              {renderMeetings()}
            </div>
          )}
          {activeTab === 'documents' && (
            <div className="py-8">
              {renderDocuments()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvestorCommunication;
