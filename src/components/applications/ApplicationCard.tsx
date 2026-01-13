import React, { useState } from 'react';
import { User, Mail, Phone, Building, FileText, Calendar, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import type { Application } from '../../types/application';
import { roleLabels, statusLabels } from '../../types/application';

interface ApplicationCardProps {
  application: Application;
  onApprove: (id: string, notes?: string) => void;
  onReject: (id: string, notes?: string) => void;
  onDelete: (id: string) => void;
}

export const ApplicationCard: React.FC<ApplicationCardProps> = ({
  application,
  onApprove,
  onReject,
  onDelete
}) => {
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState('');
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  
  const handleAction = () => {
    if (actionType === 'approve') {
      onApprove(application._id, notes || undefined);
    } else if (actionType === 'reject') {
      onReject(application._id, notes || undefined);
    }
    setShowNotes(false);
    setNotes('');
    setActionType(null);
  };
  
  const openNotesModal = (type: 'approve' | 'reject') => {
    setActionType(type);
    setShowNotes(true);
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {application.firstName} {application.lastName}
                </h3>
                <p className="text-sm text-gray-500">{roleLabels[application.role]}</p>
              </div>
            </div>
            
            <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(application.status)}`}>
              {statusLabels[application.status]}
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center space-x-2 text-sm">
              <Mail className="h-4 w-4 text-gray-400" />
              <span className="text-gray-700">{application.email}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Phone className="h-4 w-4 text-gray-400" />
              <span className="text-gray-700">{application.phone}</span>
            </div>
          </div>
          
          {/* Company & Experience */}
          {(application.company || application.experience) && (
            <div className="space-y-2">
              {application.company && (
                <div className="flex items-center space-x-2 text-sm">
                  <Building className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-700">{application.company}</span>
                </div>
              )}
              {application.experience && (
                <div className="flex items-center space-x-2 text-sm">
                  <FileText className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-700">{application.experience}</span>
                </div>
              )}
            </div>
          )}
          
          {/* Message */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-900 mb-2">Message de motivation :</p>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{application.message}</p>
          </div>
          
          {/* Date */}
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <Calendar className="h-3 w-3" />
            <span>Reçue le {formatDate(application.createdAt)}</span>
          </div>
          
          {/* Review Info */}
          {application.reviewedAt && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-800">
                Traitée le {formatDate(application.reviewedAt)}
              </p>
              {application.reviewNotes && (
                <p className="text-sm text-blue-900 mt-2">{application.reviewNotes}</p>
              )}
            </div>
          )}
        </div>
        
        {/* Actions */}
        {application.status === 'pending' && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end space-x-2">
            <button
              onClick={() => onDelete(application._id)}
              className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Supprimer
            </button>
            <button
              onClick={() => openNotesModal('reject')}
              className="px-4 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors flex items-center"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Rejeter
            </button>
            <button
              onClick={() => openNotesModal('approve')}
              className="px-4 py-2 text-sm text-white bg-green-500 hover:bg-green-600 rounded-lg transition-colors flex items-center"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approuver
            </button>
          </div>
        )}
      </div>
      
      {/* Notes Modal */}
      {showNotes && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {actionType === 'approve' ? 'Approuver' : 'Rejeter'} la candidature
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Vous pouvez ajouter une note (optionnel) :
            </p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              placeholder="Notes internes..."
            />
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => {
                  setShowNotes(false);
                  setNotes('');
                  setActionType(null);
                }}
                className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleAction}
                className={`px-4 py-2 text-sm text-white rounded-lg transition-colors ${
                  actionType === 'approve' 
                    ? 'bg-green-500 hover:bg-green-600' 
                    : 'bg-red-500 hover:bg-red-600'
                }`}
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
