import React from 'react';
import AdminCreateUserPage from '@/components/admin/AdminCreateUserPage';

interface GlobalStats {
  totalUsers: number;
  usersByRole: Record<string, number>;
  [key: string]: unknown;
}

interface AdminUsersManagementProps {
  globalStats: GlobalStats;
  offers: unknown[];
  applications: unknown[];
  professionals: unknown[];
  messages: unknown[];
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onToggleVerification?: (userId: string) => void;
  onDeleteUser?: (userId: string) => void;
  onViewDetails?: (userId: string) => void;
  onCreateUser?: () => void;
  [key: string]: unknown; // Accept any additional props
}

export const AdminUsersManagement: React.FC<AdminUsersManagementProps> = () => {
  return (
    <div className="space-y-6">
      <AdminCreateUserPage />
    </div>
  );
};
