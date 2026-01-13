import React from 'react';
import { ChevronDown, ChevronUp, Info, Phone, Mail, Eye } from 'lucide-react';

interface InfoItem {
  id: string;
  title: string;
  description: string;
  category: string;
  contact?: string;
  [key: string]: unknown;
}

interface CompleteInfoGlobaleAccordionProps {
  isOpen?: boolean;
  onToggle?: () => void;
  onContact?: (infoId: string) => void;
  onViewDetails?: (infoId: string) => void;
  [key: string]: unknown;
}

export const CompleteInfoGlobaleAccordion: React.FC<CompleteInfoGlobaleAccordionProps> = ({
  isOpen = false,
  onToggle,
  onContact,
  onViewDetails
}) => {
  const infoItems: InfoItem[] = [
    {
      id: '1',
      title: 'Nouvelle réglementation sanitaire',
      description: 'Mise à jour des normes HACCP pour les établissements de restauration',
      category: 'Réglementation',
      contact: 'info@sante.gouv.fr'
    },
    {
      id: '2',
      title: 'Salon de la Restauration 2025',
      description: 'Événement professionnel du 15 au 18 mars à Paris',
      category: 'Événement',
      contact: '+33 1 23 45 67 89'
    },
    {
      id: '3',
      title: 'Aide financière pour la transition écologique',
      description: 'Subventions disponibles pour les restaurants s\'engageant dans le bio',
      category: 'Financement',
      contact: 'aide@ademe.fr'
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Réglementation':
        return 'bg-red-100 text-red-700';
      case 'Événement':
        return 'bg-blue-100 text-blue-700';
      case 'Financement':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Info className="text-blue-600 w-5 h-5" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-lg">Informations en temps réel</h3>
            <p className="text-sm text-gray-600">{infoItems.length} informations importantes</p>
          </div>
        </div>
        {isOpen ? (
          <ChevronUp className="text-gray-400 w-5 h-5" />
        ) : (
          <ChevronDown className="text-gray-400 w-5 h-5" />
        )}
      </button>

      {isOpen && (
        <div className="border-t border-gray-200 p-6 space-y-4">
          {infoItems.map((item) => (
            <div key={item.id} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-gray-900">{item.title}</h4>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getCategoryColor(item.category)}`}>
                      {item.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                  {item.contact && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      {item.contact.includes('@') ? (
                        <Mail className="w-4 h-4" />
                      ) : (
                        <Phone className="w-4 h-4" />
                      )}
                      <span>{item.contact}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100">
                <button
                  onClick={() => onContact?.(item.id)}
                  className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Contacter
                </button>
                <button
                  onClick={() => onViewDetails?.(item.id)}
                  className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-700"
                >
                  <Eye className="w-4 h-4" />
                  <span>Plus d'infos</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
