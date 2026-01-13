import React from 'react';
import Header from '@/components/layout/Header';
import { useAppStore } from '@/stores/appStore';
import BanquesTab from '@/components/features/BanquesTab';
import { useUserDashboardNavigation } from '@/utils/navigationUtils';

interface BanquesPageProps {
  onNavigate: (page: string) => void;
}

const BanquesPage: React.FC<BanquesPageProps> = () => {
  const { navigateTo } = useAppStore();
  const { navigateToUserDashboard } = useUserDashboardNavigation();
  return (
    <div className="min-h-screen bg-gray-50">

      
      
      <Header currentPage="banques" onNavigate={(page) => navigateTo(page as any)} />

<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-bold text-gray-900">Services Bancaires</h1>
            <p className="mt-2 text-lg text-gray-600">
              Gérez vos finances et accédez aux offres bancaires
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button
              onClick={() => navigateTo('banker-dashboard' as any)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              ← Retour Dashboard
            </button>
          </div>
        </div>

        {/* Banques Tab Component */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <BanquesTab />
        </div>
      </div>
    </div>
  );
};

export default BanquesPage;
