import React from 'react';

interface AdminNavButtonProps {
  onNavigate: (page: string) => void;
}

const AdminNavButton: React.FC<AdminNavButtonProps> = ({ onNavigate }) => {
  return (
    <button
      className="w-full text-left px-4 py-2 hover:bg-blue-100 rounded transition-colors text-blue-700 font-semibold"
      onClick={() => onNavigate('admin-create-user')}
    >
      👤 Créer un utilisateur (admin)
    </button>
  );
};

export default AdminNavButton;
