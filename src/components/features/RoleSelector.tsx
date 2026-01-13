import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Wrench, 
  Truck, 
  UserCheck, 
  Megaphone,
  Shield,
  ArrowRight
} from 'lucide-react';
import { UserRole } from '@/types';
import { useTranslation } from '@/hooks/useTranslation';

interface RoleSelectorProps {
  onSelectRole: (role: UserRole) => void;
  showSuperAdmin?: boolean;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ onSelectRole, showSuperAdmin = false }) => {
  const { t } = useTranslation();

  const roles = [
    {
      id: 'restaurant' as UserRole,
      title: t('role.restaurant'),
      description: 'Trouvez du personnel, des services et des fournisseurs',
      icon: Users,
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      count: '2,400+'
    },
    {
      id: 'artisan' as UserRole,
      title: t('role.artisan'),
      description: 'Plombiers, électriciens, chauffagistes, nettoyeurs...',
      icon: Wrench,
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
      count: '850+'
    },
    {
      id: 'fournisseur' as UserRole,
      title: t('role.fournisseur'),
      description: 'Matériel, équipement, matières premières',
      icon: Truck,
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600',
      count: '1,200+'
    },
    {
      id: 'candidat' as UserRole,
      title: t('role.candidat'),
      description: 'Personnel temporaire ou permanent',
      icon: UserCheck,
      color: 'bg-orange-500',
      hoverColor: 'hover:bg-orange-600',
      count: '5,600+'
    },
    {
      id: 'community_manager' as UserRole,
      title: t('role.community_manager'),
      description: 'Experts digitaux, réseaux sociaux, SEO',
      icon: Megaphone,
      color: 'bg-pink-500',
      hoverColor: 'hover:bg-pink-600',
      count: '320+'
    }
  ];

  if (showSuperAdmin) {
    roles.push({
      id: 'super_admin' as UserRole,
      title: t('role.super_admin'),
      description: 'Administration et supervision de la plateforme',
      icon: Shield,
      color: 'bg-gray-800',
      hoverColor: 'hover:bg-gray-900',
      count: 'Admin'
    });
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {roles.map((role, index) => {
        const Icon = role.icon;
        return (
          <motion.div
            key={role.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="group bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-orange-200"
            onClick={() => onSelectRole(role.id)}
          >
            <div className={`${role.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
              <Icon className="h-8 w-8 text-white" />
            </div>
            
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-gray-900">{role.title}</h3>
              <span className="text-sm font-semibold text-gray-500">{role.count}</span>
            </div>
            
            <p className="text-gray-600 mb-6 leading-relaxed">{role.description}</p>
            
            <div className="flex items-center text-orange-500 font-medium group-hover:text-orange-600">
              <span className="text-sm">Choisir ce rôle</span>
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default RoleSelector;
