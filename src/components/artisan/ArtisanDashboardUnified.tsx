import React from 'react';
import ArtisanDashboardRefactored from '@/pages/dashboards/ArtisanDashboardRefactored';

const ArtisanDashboardUnified: React.FC = () => {
  return <ArtisanDashboardRefactored onNavigate={(view) => console.log('Navigate to:', view)} />;
};

export default ArtisanDashboardUnified;