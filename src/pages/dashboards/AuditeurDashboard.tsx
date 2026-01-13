import React, { useState, useEffect } from 'react';
import { Search, FileText, TrendingUp, Eye, CheckCircle, AlertTriangle, Calendar } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { CompleteSidebar } from '@/components/dashboard/RestModule';
import { useBusinessStore } from '@/stores/businessStore';

interface AuditReport {
  id: number;
  title: string;
  type: string;
  status: string;
  date: string;
  client: string;
  priority: string;
  completion: number;
}

interface AuditStats {
  totalAudits: number;
  activeAudits: number;
  completedAudits: number;
  pendingReviews: number;
  totalClients: number;
  averageScore: number;
}

const AuditeurDashboard: React.FC = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState<AuditReport[]>([]);
  const [stats, setStats] = useState<AuditStats>({
    totalAudits: 0,
    activeAudits: 0,
    completedAudits: 0,
    pendingReviews: 0,
    totalClients: 0,
    averageScore: 0
  });

  useEffect(() => {
    // Simuler des données pour l'instant
    setStats({
      totalAudits: 78,
      activeAudits: 12,
      completedAudits: 66,
      pendingReviews: 8,
      totalClients: 45,
      averageScore: 8.3
    });
    
    setReports([
      {
        id: 1,
        title: 'Audit Hygiène Restaurant Le Gourmet',
        type: 'Hygiène',
        status: 'in_progress',
        date: '2025-01-15',
        client: 'Restaurant Le Gourmet',
        priority: 'high',
        completion: 65
      },
      {
        id: 2,
        title: 'Audit Financier Boulangerie Martin',
        type: 'Financier',
        status: 'pending_review',
        date: '2025-01-10',
        client: 'Boulangerie Martin',
        priority: 'medium',
        completion: 90
      },
      {
        id: 3,
        title: 'Audit Conformité Traiteur Excellence',
        type: 'Conformité',
        status: 'completed',
        date: '2025-01-05',
        client: 'Traiteur Excellence',
        priority: 'low',
        completion: 100
      }
    ]);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_progress': return 'text-blue-600 bg-blue-100';
      case 'pending_review': return 'text-yellow-600 bg-yellow-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'in_progress': return 'En cours';
      case 'pending_review': return 'En révision';
      case 'completed': return 'Terminé';
      case 'cancelled': return 'Annulé';
      default: return 'Inconnu';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Haute';
      case 'medium': return 'Moyenne';
      case 'low': return 'Basse';
      default: return 'Non définie';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar à gauche - 1 colonne */}
          <div className="lg:col-span-1">
            <CompleteSidebar
              upcomingEvents={[]}
              messagesCount={0}
              professionalsCount={stats.totalClients}
              avgRating={stats.averageScore}
              activeOffers={stats.activeAudits}
              currentUserRole="auditeur"
              partners={useBusinessStore.getState().partners}
              onNavigate={(path) => {}}
            />
          </div>

          {/* Contenu principal - 3 colonnes */}
          <div className="lg:col-span-3">
            <div className="space-y-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Tableau de Bord Auditeur
          </h1>
          <p className="text-gray-600">
            Bienvenue {user?.name}, gérez vos audits et rapports de conformité.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Audits</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalAudits}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Search className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">En Cours</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.activeAudits}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Terminés</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.completedAudits}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Eye className="h-8 w-8 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">En Révision</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.pendingReviews}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Clients</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalClients}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-emerald-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Score Moyen</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.averageScore}/10</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Rapports d'audit */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Rapports d'Audit</h3>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  Nouveau Rapport
                </button>
              </div>
              <div className="p-6">
                {reports.length > 0 ? (
                  <div className="space-y-4">
                    {reports.map((report) => (
                      <div key={report.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="text-lg font-medium text-gray-900">{report.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{report.client}</p>
                            <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                              <span className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                {new Date(report.date).toLocaleDateString('fr-FR')}
                              </span>
                              <span className="flex items-center">
                                <FileText className="h-4 w-4 mr-1" />
                                {report.type}
                              </span>
                              <span className={`font-medium ${getPriorityColor(report.priority)}`}>
                                Priorité {getPriorityLabel(report.priority)}
                              </span>
                            </div>
                            {/* Barre de progression */}
                            <div className="mt-3">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Progression</span>
                                <span className="font-medium">{report.completion}%</span>
                              </div>
                              <div className="mt-1 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{ width: `${report.completion}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                          <div className="ml-4 flex flex-col items-end space-y-2">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(report.status)}`}>
                              {getStatusLabel(report.status)}
                            </span>
                            {report.priority === 'high' && (
                              <AlertTriangle className="h-4 w-4 text-red-600" />
                            )}
                          </div>
                        </div>
                        <div className="mt-4 flex space-x-2">
                          <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                            Continuer
                          </button>
                          <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-300">
                            Détails
                          </button>
                          {report.status === 'completed' && (
                            <button className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">
                              Télécharger
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Aucun rapport d'audit</p>
                  </div>
                )}
              </div>
            </div>

            {/* Actions rapides */}
            <div className="bg-white rounded-lg shadow mt-6">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Actions Rapides</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50">
                    <div className="text-center">
                      <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <span className="text-sm font-medium text-gray-600">Créer un Audit</span>
                    </div>
                  </button>
                  <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 hover:bg-green-50">
                    <div className="text-center">
                      <CheckCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <span className="text-sm font-medium text-gray-600">Finaliser Rapport</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
          </div>
        </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditeurDashboard;
