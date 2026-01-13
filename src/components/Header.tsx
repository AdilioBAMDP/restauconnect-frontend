import React from 'react';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  currentPage?: string;
  onNavigate?: (page: string) => void;
  children?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle, currentPage, onNavigate, children }) => {
  return (
    <header className="bg-white shadow-sm p-4 mb-4">
      {title && <h1 className="text-2xl font-bold text-gray-900">{title}</h1>}
      {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
      {children}
    </header>
  );
};

export default Header;
