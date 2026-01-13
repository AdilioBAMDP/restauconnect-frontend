import React, { useState } from 'react';
import { useBusinessStore } from '@/stores/businessStore';
import { 
  Calculator, 
  FileText, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  MessageCircle,
  Upload,
  Download,
  Eye,
  Phone,
  Mail,
  MapPin,
  Star,
  Shield
} from 'lucide-react';

const ComptableTab: React.FC = () => {
  const {
    accountantProfile,
    accountingDocuments,
    accountantConversations,
    accountingAlerts,
    createAccountingConversation,
    markAccountingAlertRead
  } = useBusinessStore();

  const [activeSection, setActiveSection] = useState<'overview' | 'documents' | 'conversations' | 'alerts'>('overview');
  const [conversationSubject, setConversationSubject] = useState('');
  const [conversationMessage, setConversationMessage] = useState('');
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'general' | 'declaration' | 'conseil' | 'document' | 'bilan' | 'social'>('general');

  const unreadAlerts = accountingAlerts.filter(alert => !alert.isRead);
  const activeConversations = accountantConversations.filter(conv => conv.status === 'active');

  const handleCreateConversation = () => {
    if (conversationSubject && conversationMessage) {
      createAccountingConversation(conversationSubject, conversationMessage, selectedCategory);
      setConversationSubject('');
      setConversationMessage('');
      setShowMessageModal(false);
      setActiveSection('conversations');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Profil Comptable */}
      {accountantProfile ? (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center">
                <Calculator className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{accountantProfile.name}</h3>
                <p className="text-gray-600">{accountantProfile.firm}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium">{accountantProfile.rating}</span>
                  <span className="text-xs text-gray-500">({accountantProfile.reviewCount} avis)</span>
                  <span className="text-sm text-gray-500">• {accountantProfile.yearsExperience} ans d'expérience</span>
                </div>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              accountantProfile.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {accountantProfile.isActive ? 'Actif' : 'Inactif'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{accountantProfile.location.address}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Phone className="h-4 w-4" />
                <span>{accountantProfile.contact.phone}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Mail className="h-4 w-4" />
                <span>{accountantProfile.contact.email}</span>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Expertises</h4>
              <div className="flex flex-wrap gap-2">
                {accountantProfile.expertise.map((exp, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md"
                  >
                    {exp.toUpperCase()}
                  </span>
                ))}
              </div>
              
              <h4 className="font-medium text-gray-900 mt-4 mb-2">Certifications</h4>
              <ul className="space-y-1">
                {accountantProfile.certifications.map((cert, index) => (
                  <li key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span>{cert}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
          <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun comptable assigné</h3>
          <p className="text-gray-500 mb-4">Contactez votre gestionnaire pour vous assigner un expert-comptable</p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Demander un comptable
          </button>
        </div>
      )}

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Documents en attente</p>
              <p className="text-2xl font-bold text-orange-600">
                {accountingDocuments.filter(doc => doc.status === 'sent').length}
              </p>
            </div>
            <FileText className="h-8 w-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Alertes non lues</p>
              <p className="text-2xl font-bold text-red-600">{unreadAlerts.length}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Conversations actives</p>
              <p className="text-2xl font-bold text-blue-600">{activeConversations.length}</p>
            </div>
            <MessageCircle className="h-8 w-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => setShowMessageModal(true)}
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <MessageCircle className="h-5 w-5 text-blue-600" />
            <span className="font-medium">Contacter mon comptable</span>
          </button>
          
          <button
            onClick={() => setActiveSection('documents')}
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Upload className="h-5 w-5 text-green-600" />
            <span className="font-medium">Envoyer un document</span>
          </button>
          
          <button
            onClick={() => setActiveSection('alerts')}
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <span className="font-medium">Voir les alertes</span>
          </button>
          
          <button
            onClick={() => setActiveSection('conversations')}
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FileText className="h-5 w-5 text-purple-600" />
            <span className="font-medium">Historique</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderDocuments = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Documents Comptables</h3>
        <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center space-x-2">
          <Upload className="h-4 w-4" />
          <span>Nouveau document</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {accountingDocuments.map((document) => (
          <div key={document.id} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="font-semibold text-gray-900">{document.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{document.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                {document.isConfidential && (
                  <Shield className="h-4 w-4 text-red-500" />
                )}
                <span className={`px-2 py-1 text-xs rounded-md ${
                  document.status === 'sent' ? 'bg-orange-100 text-orange-800' :
                  document.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {document.status === 'sent' ? 'En attente' :
                   document.status === 'reviewed' ? 'En cours' : 'Finalisé'}
                </span>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Fichier: {document.fileName}</span>
                <span>{formatFileSize(document.fileSize)}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Envoyé le: {formatDate(document.createdAt)}</span>
                {document.dueDate && (
                  <span className="text-orange-600">
                    Échéance: {formatDate(document.dueDate)}
                  </span>
                )}
              </div>
            </div>

            <div className="mb-4">
              <div className="flex flex-wrap gap-1">
                {document.tags?.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex space-x-2">
              <button className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center justify-center space-x-2">
                <Eye className="h-4 w-4" />
                <span>Voir</span>
              </button>
              <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Télécharger</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {accountingDocuments.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Aucun document comptable</p>
          <p className="text-sm text-gray-400 mt-2">Les documents partagés apparaîtront ici</p>
        </div>
      )}
    </div>
  );

  const renderConversations = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Conversations</h3>
        <button
          onClick={() => setShowMessageModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
        >
          <MessageCircle className="h-4 w-4" />
          <span>Nouvelle conversation</span>
        </button>
      </div>

      {accountantConversations.length === 0 ? (
        <div className="text-center py-12">
          <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Aucune conversation</p>
          <p className="text-sm text-gray-400 mt-2">Contactez votre comptable pour commencer</p>
        </div>
      ) : (
        <div className="space-y-4">
          {accountantConversations.map((conversation) => (
            <div key={conversation.id} className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium text-gray-900">{conversation.subject}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`px-2 py-1 text-xs rounded-md ${
                      conversation.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                      conversation.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                      conversation.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {conversation.priority}
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md">
                      {conversation.category}
                    </span>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs rounded-md ${
                  conversation.status === 'active' ? 'bg-green-100 text-green-800' :
                  conversation.status === 'resolved' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {conversation.status}
                </span>
              </div>
              
              <div className="text-sm text-gray-500 mb-3">
                {conversation.messages.length} message(s) - 
                Dernière activité: {formatDate(conversation.lastActivity)}
              </div>

              {conversation.messages.length > 0 && (
                <div className="border-t pt-3">
                  <div className="text-sm text-gray-600">
                    <strong>{conversation.messages[conversation.messages.length - 1].senderName}:</strong>{' '}
                    {conversation.messages[conversation.messages.length - 1].content.substring(0, 100)}...
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderAlerts = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Alertes Comptables</h3>
      
      {accountingAlerts.length === 0 ? (
        <div className="text-center py-12">
          <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
          <p className="text-gray-500">Aucune alerte</p>
          <p className="text-sm text-gray-400 mt-2">Tout est à jour !</p>
        </div>
      ) : (
        <div className="space-y-4">
          {accountingAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`bg-white rounded-lg border p-4 ${
                !alert.isRead ? 'border-l-4 border-l-orange-500' : 'border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${
                    alert.severity === 'error' ? 'bg-red-100' :
                    alert.severity === 'warning' ? 'bg-orange-100' :
                    'bg-blue-100'
                  }`}>
                    <AlertTriangle className={`h-5 w-5 ${
                      alert.severity === 'error' ? 'text-red-600' :
                      alert.severity === 'warning' ? 'text-orange-600' :
                      'text-blue-600'
                    }`} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{alert.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                    {alert.dueDate && (
                      <div className="flex items-center space-x-1 mt-2 text-sm text-orange-600">
                        <Clock className="h-4 w-4" />
                        <span>Échéance: {formatDate(alert.dueDate)}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {!alert.isRead && (
                  <button
                    onClick={() => markAccountingAlertRead(alert.id)}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Marquer lu
                  </button>
                )}
              </div>
              
              <div className="text-xs text-gray-500 mt-3">
                Créé le {formatDate(alert.createdAt)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Navigation */}
      <div className="mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveSection('overview')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeSection === 'overview'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Vue d'ensemble
          </button>
          <button
            onClick={() => setActiveSection('documents')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeSection === 'documents'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Documents ({accountingDocuments.length})
          </button>
          <button
            onClick={() => setActiveSection('conversations')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeSection === 'conversations'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Messages ({accountantConversations.length})
          </button>
          <button
            onClick={() => setActiveSection('alerts')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeSection === 'alerts'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Alertes ({unreadAlerts.length})
          </button>
        </nav>
      </div>

      {/* Contenu */}
      {activeSection === 'overview' && renderOverview()}
      {activeSection === 'documents' && renderDocuments()}
      {activeSection === 'conversations' && renderConversations()}
      {activeSection === 'alerts' && renderAlerts()}

      {/* Modal de message */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Contacter mon comptable</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Catégorie
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as 'general' | 'declaration' | 'conseil')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="general">Général</option>
                  <option value="declaration">Déclaration</option>
                  <option value="conseil">Conseil</option>
                  <option value="document">Document</option>
                  <option value="bilan">Bilan</option>
                  <option value="social">Social</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sujet
                </label>
                <input
                  type="text"
                  value={conversationSubject}
                  onChange={(e) => setConversationSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Ex: Question sur la TVA"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  value={conversationMessage}
                  onChange={(e) => setConversationMessage(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Décrivez votre question ou problème..."
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowMessageModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleCreateConversation}
                disabled={!conversationSubject || !conversationMessage}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Envoyer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComptableTab;
