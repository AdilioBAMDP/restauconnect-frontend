import React from 'react';
import { BarChart3, Globe, Shield, Briefcase } from 'lucide-react';
import { ActiveTab } from '@/types/investor.types';

interface TabNavigationProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'dashboard' as const, name: 'Vue d\'ensemble', icon: BarChart3 },
    { id: 'marketplace' as const, name: 'Marketplace', icon: Globe },
    { id: 'analysis' as const, name: 'Analyse Risques', icon: Shield },
    { id: 'portfolio' as const, name: 'Portfolio', icon: Briefcase }
  ];

  return (
    <div className="mb-8">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="mr-2 h-5 w-5" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default TabNavigation;