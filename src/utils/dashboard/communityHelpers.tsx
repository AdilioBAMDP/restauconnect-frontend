import { MessageSquare, Target, Camera, Activity, Settings } from 'lucide-react';

// ✅ LOGIQUE MÉTIER PRÉSERVÉE - getStatusColor
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-800';
    case 'paused': return 'bg-yellow-100 text-yellow-800';
    case 'completed': return 'bg-blue-100 text-blue-800';
    case 'planning': return 'bg-purple-100 text-purple-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

// ✅ LOGIQUE MÉTIER PRÉSERVÉE - getCategoryIcon
export const getCategoryIcon = (category: string): JSX.Element => {
  switch (category) {
    case 'social-media': return <MessageSquare className="w-5 h-5" />;
    case 'advertising': return <Target className="w-5 h-5" />;
    case 'photography': return <Camera className="w-5 h-5" />;
    case 'content-creation': return <Activity className="w-5 h-5" />;
    default: return <Settings className="w-5 h-5" />;
  }
};
