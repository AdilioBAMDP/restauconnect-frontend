import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuthContext';
import Header from '@/components/layout/Header';
import { CompleteSidebar } from '@/components/dashboard/RestModule';
import { useBusinessStore } from '@/stores/businessStore';
import { useAppStore } from '@/stores/appStore';
import { AccountingClient } from '@/services/financialServices';

// Sous-composants optimisés
import StatsCards from '@/components/accountant/StatsCards';
import DashboardTab from '@/components/accountant/DashboardTab';
import ClientsTab from '@/components/accountant/ClientsTab';
import DocumentsTab from '@/components/accountant/DocumentsTab';
import AlertsTab from '@/components/accountant/AlertsTab';
import AnalyticsTab from '@/components/accountant/AnalyticsTab';
import CreateDocumentModal from '@/components/accountant/CreateDocumentModal';
import ClientDetailModal from '@/components/accountant/ClientDetailModal';

// Types
interface MockDocument {
  _id: string;
  clientId: string;
  clientName: string;
  type: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

interface MockAlert {
  _id: string;
  clientId: string;
  clientName: string;
  title: string;
  description: string;
  priority: string;
  dueDate: string;
  isResolved: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AccountantStats {
  activeClients: number;
  totalDocuments: number;
  pendingTasks: number;
  monthlyRevenue: number;
  urgentAlerts: number;
  completedTasks: number;
}

interface NewDocument {
  clientId: string;
  type: 'bilan' | 'compte-resultat' | 'tva-declaration' | 'paie' | 'fiscale' | 'autre';
  title: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
}

const INITIAL_DOCUMENT: NewDocument = {
  clientId: '',
  type: 'bilan',
  title: '',
  description: '',
  dueDate: '',
  priority: 'normal'
};

const AccountantDashboard: React.FC = () => {
  const { user } = useAuth();
  const partners = useBusinessStore((state) => state.partners);
  const { navigateTo } = useAppStore();

  // États principaux
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'clients' | 'documents' | 'alerts' | 'analytics'>('dashboard');
  
  // Données
  const [clients, setClients] = useState<AccountingClient[]>([]);
  const [documents, setDocuments] = useState<MockDocument[]>([]);
  const [alerts, setAlerts] = useState<MockAlert[]>([]);
  
  // Filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [clientFilter, setClientFilter] = useState('all');
  const [documentFilter, setDocumentFilter] = useState('all');
  const [alertFilter, setAlertFilter] = useState('all');
  
  // Modaux
  const [showCreateDocumentModal, setShowCreateDocumentModal] = useState(false);
  const [showClientDetailModal, setShowClientDetailModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<AccountingClient | null>(null);
  const [newDocument, setNewDocument] = useState<NewDocument>(INITIAL_DOCUMENT);

  // Statistiques calculées (mémoïsées)
  const stats = useMemo<AccountantStats>(() => ({
    activeClients: clients.length,
    totalDocuments: documents.length,
    pendingTasks: documents.filter(d => d.status === 'pending').length,
    monthlyRevenue: clients.length * 450,
    urgentAlerts: alerts.filter(a => a.priority === 'urgent' && !a.isResolved).length,
    completedTasks: documents.filter(d => d.status === 'completed').length
  }), [clients, documents, alerts]);

  // Chargement initial
  useEffect(() => {
    setClients([]);
    setDocuments([]);
    setAlerts([]);
    setLoading(false);
  }, []);

  // Callbacks optimisés
  const handleCreateDocument = useCallback(() => {
    console.log('Création de document:', newDocument);
    setShowCreateDocumentModal(false);
    setNewDocument(INITIAL_DOCUMENT);
  }, [newDocument]);

  const handleResolveAlert = useCallback((alertId: string) => {
    console.log('Résolution alerte:', alertId);
    setAlerts(prev => prev.map(alert => 
      alert._id === alertId ? { ...alert, isResolved: true } : alert
    ));
  }, []);

  const handleClientClick = useCallback((client: AccountingClient) => {
    setSelectedClient(client);
    setShowClientDetailModal(true);
  }, []);

  const handleCloseClientModal = useCallback(() => {
    setShowClientDetailModal(false);
    setSelectedClient(null);
  }, []);

  const handleCloseDocumentModal = useCallback(() => {
    setShowCreateDocumentModal(false);
    setNewDocument(INITIAL_DOCUMENT);
  }, []);

  const loadData = useCallback(() => {
    console.log('Rechargement des données...');
  }, []);

  // Fonctions utilitaires (mémoïsées)
  const getStatusColor = useCallback((status: string) => {
    const colors: Record<string, string> = {
      completed: 'text-green-600 bg-green-100',
      pending: 'text-yellow-600 bg-yellow-100',
      'in-progress': 'text-blue-600 bg-blue-100',
      overdue: 'text-red-600 bg-red-100',
      active: 'text-green-600 bg-green-100',
      inactive: 'text-gray-600 bg-gray-100'
    };
    return colors[status] || 'text-gray-600 bg-gray-100';
  }, []);

  const getPriorityColor = useCallback((priority: string) => {
    const colors: Record<string, string> = {
      urgent: 'text-red-600 bg-red-100',
      high: 'text-orange-600 bg-orange-100',
      normal: 'text-blue-600 bg-blue-100',
      low: 'text-gray-600 bg-gray-100'
    };
    return colors[priority] || 'text-gray-600 bg-gray-100';
  }, []);

  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  }, []);

  // Rendu du contenu principal basé sur l'onglet actif
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardTab
            documents={documents}
            alerts={alerts}
            onCreateDocument={() => setShowCreateDocumentModal(true)}
            onResolveAlert={handleResolveAlert}
            onViewAllDocuments={() => setActiveTab('documents')}
            onViewAllAlerts={() => setActiveTab('alerts')}
            getStatusColor={getStatusColor}
            formatDate={formatDate}
          />
        );
      
      case 'clients':
        return (
          <ClientsTab
            clients={clients}
            searchTerm={searchTerm}
            clientFilter={clientFilter}
            onSearchChange={setSearchTerm}
            onFilterChange={setClientFilter}
            onClientClick={handleClientClick}
            onRefresh={loadData}
            getStatusColor={getStatusColor}
            formatDate={formatDate}
          />
        );
      
      case 'documents':
        return (
          <DocumentsTab
            documents={documents}
            searchTerm={searchTerm}
            documentFilter={documentFilter}
            onSearchChange={setSearchTerm}
            onFilterChange={setDocumentFilter}
            onCreateDocument={() => setShowCreateDocumentModal(true)}
            onRefresh={loadData}
            getStatusColor={getStatusColor}
            getPriorityColor={getPriorityColor}
            formatDate={formatDate}
          />
        );
      
      case 'alerts':
        return (
          <AlertsTab
            alerts={alerts}
            searchTerm={searchTerm}
            alertFilter={alertFilter}
            onSearchChange={setSearchTerm}
            onFilterChange={setAlertFilter}
            onResolveAlert={handleResolveAlert}
            onRefresh={loadData}
            getPriorityColor={getPriorityColor}
            formatDate={formatDate}
          />
        );
      
      case 'analytics':
        return (
          <AnalyticsTab
            stats={stats}
            documents={documents}
          />
        );
      
      default:
        return null;
    }
  };
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header moderne avec navigation */}
      <Header currentPage="accountant-dashboard" onNavigate={navigateTo} />

      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <CompleteSidebar
              upcomingEvents={[]}
              messagesCount={0}
              professionalsCount={clients.length}
              avgRating={4.5}
              activeOffers={documents.length}
              currentUserRole="comptable"
              partners={partners}
              onNavigate={() => {}}
            />
          </div>

          {/* Main content */}
          <div className="lg:col-span-3">
            <div className="space-y-8">
              {loading && (
                <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded">
                  Chargement des données...
                </div>
              )}

              {/* Statistiques */}
              <StatsCards stats={stats} />

              {/* Navigation par onglets */}
              <div className="border-b border-gray-200 mb-8">
                <nav className="-mb-px flex space-x-8">
                  {[
                    { id: 'dashboard', label: 'Vue d\'ensemble' },
                    { id: 'clients', label: 'Mes clients', count: clients.length },
                    { id: 'documents', label: 'Documents', count: documents.length },
                    { id: 'alerts', label: 'Alertes fiscales', count: stats.urgentAlerts },
                    { id: 'analytics', label: 'Analytics' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as typeof activeTab)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab.label}
                      {tab.count !== undefined && (
                        <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                          tab.id === 'alerts' 
                            ? 'bg-red-100 text-red-600'
                            : tab.id === 'documents'
                            ? 'bg-green-100 text-green-600'
                            : 'bg-blue-100 text-blue-600'
                        }`}>
                          {tab.count}
                        </span>
                      )}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Contenu de l'onglet actif */}
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>

      {/* Modaux */}
      <CreateDocumentModal
        isOpen={showCreateDocumentModal}
        clients={clients}
        newDocument={newDocument}
        onClose={handleCloseDocumentModal}
        onChange={setNewDocument}
        onSubmit={handleCreateDocument}
      />

      <ClientDetailModal
        isOpen={showClientDetailModal}
        client={selectedClient}
        documents={documents}
        onClose={handleCloseClientModal}
        getStatusColor={getStatusColor}
        formatDate={formatDate}
      />
    </div>
  );
};

export default AccountantDashboard;
