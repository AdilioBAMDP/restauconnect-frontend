import React, { useEffect, useState } from 'react';
import { Filter, RefreshCw } from 'lucide-react';
import { useApplicationStore } from '../../stores/applicationStore';
import { ApplicationCard } from '../../components/applications/ApplicationCard';
import { ApplicationStatsComponent } from '../../components/applications/ApplicationStats';
import type { ApplicationStatus, ApplicationRole } from '../../types/application';
import { roleLabels, statusLabels } from '../../types/application';

export const ApplicationsManagement: React.FC = () => {
  const { 
    applications, 
    stats, 
    loading, 
    error,
    fetchApplications, 
    fetchStats,
    approveApplication,
    rejectApplication,
    deleteApplication,
    clearError
  } = useApplicationStore();
  
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | ''>('');
  const [roleFilter, setRoleFilter] = useState<ApplicationRole | ''>('');
  
  const loadData = React.useCallback(() => {
    const filters: Record<string, ApplicationStatus | ApplicationRole> = {};
    if (statusFilter) filters.status = statusFilter;
    if (roleFilter) filters.role = roleFilter;
    
    fetchApplications(filters);
    fetchStats();
  }, [statusFilter, roleFilter, fetchApplications, fetchStats]);

  useEffect(() => {
    loadData();
  }, [loadData]);
  
  const handleApprove = async (id: string, notes?: string) => {
    try {
      await approveApplication(id, notes);
      // Success handled in store
    } catch (err) {
      console.error('Erreur approbation:', err);
    }
  };
  
  const handleReject = async (id: string, notes?: string) => {
    try {
      await rejectApplication(id, notes);
      // Success handled in store
    } catch (err) {
      console.error('Erreur rejet:', err);
    }
  };
  
  const handleDelete = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette candidature ?')) {
      return;
    }
    
    try {
      await deleteApplication(id);
      // Success handled in store
    } catch (err) {
      console.error('Erreur suppression:', err);
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des candidatures</h1>
          <p className="text-gray-600 mt-2">
            Gérez les demandes d'adhésion à Web Spider
          </p>
        </div>
        
        <button
          onClick={loadData}
          disabled={loading}
          className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Actualiser
        </button>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between">
          <span>{error}</span>
          <button onClick={clearError} className="text-red-700 hover:text-red-900">
            ×
          </button>
        </div>
      )}
      
      {/* Stats */}
      <ApplicationStatsComponent stats={stats} loading={loading} />
      
      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="h-5 w-5 text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-900">Filtres</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Statut
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ApplicationStatus | '')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">Tous les statuts</option>
              {Object.entries(statusLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rôle
            </label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as ApplicationRole | '')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">Tous les rôles</option>
              {Object.entries(roleLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Applications List */}
      {loading && applications.length === 0 ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-500 text-lg">Aucune candidature trouvée</p>
          <p className="text-gray-400 text-sm mt-2">
            {statusFilter || roleFilter 
              ? 'Essayez de modifier les filtres' 
              : 'Les nouvelles candidatures apparaîtront ici'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {applications.map((application) => (
            <ApplicationCard
              key={application._id}
              application={application}
              onApprove={handleApprove}
              onReject={handleReject}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};
