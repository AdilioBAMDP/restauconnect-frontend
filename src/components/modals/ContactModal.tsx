import React, { memo } from 'react';
import { X, MessageCircle, CheckCircle } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName: string;
  userRole: string;
}

const ContactModal: React.FC<ContactModalProps> = memo(({
  isOpen,
  onClose,
  onConfirm,
  userName,
  userRole
}) => {
  // 🔧 Debug optimisé: Log seulement quand le modal s'ouvre vraiment
  if (isOpen && userName) {
    console.log('🚀 ContactModal ouvert pour:', { userName, userRole });
  }
  
  // Early return pour éviter les re-renders inutiles
  if (!isOpen) return null;

  // Générer les initiales pour l'avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Couleurs selon le rôle
  const getRoleColor = (role: string) => {
    const roleColors: { [key: string]: string } = {
      restaurant: 'from-orange-500 to-red-500',
      fournisseur: 'from-blue-500 to-indigo-500',
      artisan: 'from-purple-500 to-pink-500',
      livreur: 'from-green-500 to-teal-500',
      banquier: 'from-yellow-500 to-orange-500',
      investisseur: 'from-emerald-500 to-cyan-500',
      comptable: 'from-gray-500 to-slate-500',
    };
    return roleColors[role.toLowerCase()] || 'from-gray-500 to-gray-600';
  };

  // Traduction des rôles
  const getRoleLabel = (role: string) => {
    const roleLabels: { [key: string]: string } = {
      restaurant: 'Restaurant',
      fournisseur: 'Fournisseur',
      artisan: 'Artisan',
      livreur: 'Livreur',
      banquier: 'Banquier',
      investisseur: 'Investisseur',
      comptable: 'Comptable',
    };
    return roleLabels[role.toLowerCase()] || role;
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header avec dégradé */}
        <div className="bg-gradient-to-r from-orange-500 to-pink-500 p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
            aria-label="Fermer"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="flex items-center space-x-3">
            <MessageCircle className="w-8 h-8 text-white" />
            <h2 className="text-2xl font-bold text-white">
              Contacter un utilisateur
            </h2>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="p-8 space-y-6">
          {/* Avatar et infos utilisateur */}
          <div className="flex flex-col items-center space-y-4">
            {/* Avatar avec initiales */}
            <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${getRoleColor(userRole)} flex items-center justify-center shadow-lg`}>
              <span className="text-3xl font-bold text-white">
                {getInitials(userName)}
              </span>
            </div>

            {/* Nom utilisateur */}
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-gray-800">
                {userName}
              </h3>
              
              {/* Badge rôle */}
              <div className="flex items-center justify-center space-x-2">
                <span className={`px-4 py-1.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r ${getRoleColor(userRole)} shadow-md`}>
                  {getRoleLabel(userRole)}
                </span>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
            </div>
          </div>

          {/* Message de confirmation */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
            <p className="text-center text-gray-700 text-lg leading-relaxed">
              Voulez-vous envoyer un message à{' '}
              <span className="font-bold text-gray-900">{userName}</span> ?
            </p>
            <p className="text-center text-gray-500 text-sm mt-2">
              Une conversation sera créée dans votre messagerie
            </p>
          </div>

          {/* Boutons d'action */}
          <div className="flex space-x-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200 hover:shadow-md"
            >
              Annuler
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                console.log('✉️ Bouton Envoyer message cliqué pour:', userName);
                onConfirm();
              }}
              type="button"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-pink-600 transition-all duration-200 hover:shadow-lg hover:scale-105 flex items-center justify-center space-x-2 cursor-pointer"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Envoyer un message</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

ContactModal.displayName = 'ContactModal';

export default ContactModal;
