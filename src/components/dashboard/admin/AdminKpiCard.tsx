import React from 'react';

interface AdminKpiCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  description?: string;
  color?: string;
  onClick?: () => void;
}


export const AdminKpiCard: React.FC<AdminKpiCardProps> = ({ title, value, icon, description, color, onClick }) => {
  const Component = onClick ? 'button' : 'div';
  
  return (
    <Component 
      onClick={onClick}
      className={`bg-white rounded-lg shadow p-4 flex flex-col items-start border-l-4 ${color || 'border-blue-500'} ${onClick ? 'hover:shadow-lg cursor-pointer transition-shadow w-full text-left' : ''}`}
    >
      <div className="flex items-center gap-2 mb-2">
        {icon && <span className="text-2xl">{icon}</span>}
        <span className="text-lg font-bold">{value}</span>
      </div>
      <div className="text-sm text-gray-700 font-semibold mb-1">{title}</div>
      {description && <div className="text-xs text-gray-500">{description}</div>}
      {onClick && <div className="text-xs text-blue-600 mt-1">Cliquez pour détails →</div>}
    </Component>
  );
};

export default AdminKpiCard;
