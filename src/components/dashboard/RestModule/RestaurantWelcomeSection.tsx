import React from 'react';
import { User, Zap } from 'lucide-react';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  onClick: () => void;
}

interface CurrentUser {
  name?: string;
  role?: string;
  [key: string]: unknown;
}

interface CompleteWelcomeSectionProps {
  currentUser?: CurrentUser;
  quickActions?: QuickAction[];
  onNavigate?: (path: string) => void;
  [key: string]: unknown;
}

export const CompleteWelcomeSection: React.FC<CompleteWelcomeSectionProps> = ({
  currentUser,
  quickActions = []
}) => {
  // Protection contre currentUser null/undefined
  const user = currentUser || {};
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  return (
    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg shadow-lg p-6 text-white">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {getGreeting()}, {user.name || 'Utilisateur'} !
          </h1>
          <p className="text-emerald-100 flex items-center gap-2">
            <User className="w-4 h-4" />
            {user.role || 'Restaurateur'}
          </p>
        </div>
        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
          <p className="text-sm text-emerald-100">Aujourd'hui</p>
          <p className="text-2xl font-bold">{new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</p>
        </div>
      </div>

      {/* Quick Actions */}
      {quickActions.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5" />
            <h3 className="font-semibold">Actions Rapides</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {quickActions.slice(0, 4).map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={action.onClick}
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors rounded-lg p-3 text-left"
                >
                  <Icon className="w-5 h-5 mb-2" />
                  <p className="text-sm font-medium">{action.label}</p>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
