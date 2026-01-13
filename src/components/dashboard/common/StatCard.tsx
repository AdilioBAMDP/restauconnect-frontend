import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  Icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  trend?: {
    value: string;
    icon: LucideIcon;
    color: string;
  };
  delay?: number;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  Icon,
  iconColor,
  iconBg,
  trend,
  delay = 0
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white p-6 rounded-lg shadow-md border"
    >
      <div className="flex items-center">
        <div className={`p-3 ${iconBg} rounded-full`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        <div className="ml-4">
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-600">{title}</p>
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center">
          <trend.icon className={`w-4 h-4 ${trend.color} mr-1`} />
          <span className={`text-sm ${trend.color}`}>{trend.value}</span>
        </div>
      )}
    </motion.div>
  );
};
