import toast from 'react-hot-toast';
import { audioNotificationService } from './AudioNotificationService';

export interface MessageNotificationData {
  conversationId: string;
  senderName: string;
  senderRole: string;
  messagePreview: string;
}

/**
 * Service de notifications visuelles pour les nouveaux messages
 */
export class MessageNotificationService {
  /**
   * Affiche une notification toast pour un nouveau message
   */
  public showNewMessageNotification(data: MessageNotificationData): void {
    const { senderName, messagePreview } = data;

    // Jouer le son de notification
    audioNotificationService.play();

    // Afficher le toast
    toast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
          onClick={() => this.onNotificationClick(data.conversationId)}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              {/* Avatar */}
              <div className="flex-shrink-0 pt-0.5">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                  {senderName.charAt(0).toUpperCase()}
                </div>
              </div>
              
              {/* Contenu */}
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Nouveau message de {senderName}
                </p>
                <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                  {messagePreview}
                </p>
              </div>
            </div>
          </div>

          {/* Bouton fermer */}
          <div className="flex border-l border-gray-200">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toast.dismiss(t.id);
              }}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-600 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              ✕
            </button>
          </div>
        </div>
      ),
      {
        duration: 5000,
        position: 'top-right',
      }
    );
  }

  /**
   * Gère le clic sur une notification
   */
  private onNotificationClick(conversationId: string): void {
    // Fermer le toast
    toast.dismiss();

    // Naviguer vers la conversation
    try {
      // Utiliser le NavigationManager si disponible
      import('@/services/NavigationManager').then(({ NavigationManager }) => {
        NavigationManager.navigateTo('messages', { conversationId });
      }).catch(() => {
        // Fallback: navigation manuelle
        const hash = `#messages?conversation=${conversationId}`;
        if (typeof window !== 'undefined') {
          window.location.hash = hash;
          window.dispatchEvent(new HashChangeEvent('hashchange'));
        }
      });
    } catch (error) {
      console.error('Erreur navigation vers conversation:', error);
    }
  }

  /**
   * Affiche une notification simple (fallback)
   */
  public showSimpleNotification(senderName: string, message: string): void {
    toast.success(`Nouveau message de ${senderName}`, {
      duration: 4000,
      position: 'top-right',
      icon: '💬',
    });
  }

  /**
   * Affiche une notification d'erreur
   */
  public showError(message: string): void {
    toast.error(message, {
      duration: 4000,
      position: 'top-right',
    });
  }

  /**
   * Affiche une notification de succès
   */
  public showSuccess(message: string): void {
    toast.success(message, {
      duration: 3000,
      position: 'top-right',
    });
  }
}

// Instance singleton
export const messageNotificationService = new MessageNotificationService();
