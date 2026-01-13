import React, { useState, useEffect } from 'react';
import { Smartphone, Download, Globe, CheckCircle, AlertCircle, Info, Share, Apple, Cpu } from 'lucide-react';
import { logger } from '@/utils/logger';

interface MobileAppInfo {
  android: {
    available: boolean;
    path: string;
    downloadUrl: string;
    size: string;
    lastModified: string | null;
  };
  ios: {
    available: boolean;
    path: string;
    downloadUrl: string;
    type: string;
    url: string;
    lastModified: string | null;
  };
  permissions: {
    required: string[];
    current: string;
  };
}

interface MobileDownloadManagerProps {
  userRole: string;
}

const MobileDownloadManager: React.FC<MobileDownloadManagerProps> = ({ userRole }) => {
  const [mobileInfo, setMobileInfo] = useState<MobileAppInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<'android' | 'ios' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);

  // Vérifier si l'utilisateur a les permissions
  const hasPermission = ['super_admin', 'community_manager'].includes(userRole);

  useEffect(() => {
    if (hasPermission) {
      fetchMobileInfo();
    } else {
      setLoading(false);
    }
  }, [hasPermission]);

  const fetchMobileInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/mobile/info', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setMobileInfo(data.data);
      } else {
        setError('Erreur lors de la récupération des informations mobiles');
      }
    } catch (error) {
      logger.error('Erreur lors de la récupération des informations mobile', error);
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const downloadAndroid = async () => {
    try {
      setDownloading('android');
      setError(null);
      
      const token = localStorage.getItem('token');
      const response = await fetch('/api/mobile/download/android', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        // Créer un lien de téléchargement
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'RestauConnect-Driver.apk';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        // Notification de succès
        alert('✅ APK téléchargé avec succès!');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Erreur lors du téléchargement');
      }
    } catch (error) {
      logger.error('Erreur lors du téléchargement Android', error);
      setError('Erreur de téléchargement');
    } finally {
      setDownloading(null);
    }
  };

  const downloadIOS = async () => {
    try {
      setDownloading('ios');
      setError(null);
      
      const token = localStorage.getItem('token');
      const response = await fetch('/api/mobile/download/ios', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        await response.json(); // Instructions PWA disponibles
        setShowInstructions(true);
        setError(null);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Erreur lors de la génération PWA');
      }
    } catch (error) {
      logger.error('Erreur lors du téléchargement iOS/PWA', error);
      setError('Erreur de connexion');
    } finally {
      setDownloading(null);
    }
  };

  if (!hasPermission) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <AlertCircle className="w-6 h-6 text-red-600 mr-3" />
          <div>
            <h3 className="text-lg font-medium text-red-900">Accès Restreint</h3>
            <p className="text-red-700 mt-1">
              Les téléchargements d'applications mobiles sont réservés aux Super Administrateurs et Community Managers.
            </p>
            <p className="text-sm text-red-600 mt-2">
              Rôle actuel: <span className="font-medium">{userRole}</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Chargement des informations mobiles...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-lg text-white">
        <div className="flex items-center">
          <Smartphone className="w-8 h-8 mr-3" />
          <div>
            <h2 className="text-2xl font-bold">Applications Mobiles Driver</h2>
            <p className="text-blue-100 mt-1">Téléchargement et distribution pour les livreurs</p>
          </div>
        </div>
      </div>

      {/* Erreur globale */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      )}

      {/* Applications disponibles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Android APK */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-green-100 rounded-lg mr-3">
              <Cpu className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Android APK</h3>
              <p className="text-sm text-gray-600">Application native Android</p>
            </div>
          </div>

          {mobileInfo?.android.available ? (
            <div className="space-y-3">
              <div className="flex items-center text-green-600">
                <CheckCircle className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">Disponible</span>
              </div>
              
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Taille:</strong> {mobileInfo.android.size}</p>
                {mobileInfo.android.lastModified && (
                  <p><strong>Dernière modification:</strong> {new Date(mobileInfo.android.lastModified).toLocaleDateString('fr-FR')}</p>
                )}
              </div>

              <button
                onClick={downloadAndroid}
                disabled={downloading === 'android'}
                className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {downloading === 'android' ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Téléchargement...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger APK
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center text-orange-600">
                <AlertCircle className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">Non compilé</span>
              </div>
              <p className="text-sm text-gray-600">
                L'APK doit être compilé depuis le projet React Native avant le téléchargement.
              </p>
              <button
                disabled
                className="w-full bg-gray-300 text-gray-500 px-4 py-2 rounded-lg cursor-not-allowed"
              >
                APK non disponible
              </button>
            </div>
          )}
        </div>

        {/* iOS PWA */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <Apple className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">iOS PWA</h3>
              <p className="text-sm text-gray-600">Progressive Web App</p>
            </div>
          </div>

          {mobileInfo?.ios.available ? (
            <div className="space-y-3">
              <div className="flex items-center text-blue-600">
                <CheckCircle className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">Disponible</span>
              </div>
              
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Type:</strong> {mobileInfo.ios.type}</p>
                <p><strong>Installation:</strong> Via Safari</p>
                {mobileInfo.ios.lastModified && (
                  <p><strong>Dernière modification:</strong> {new Date(mobileInfo.ios.lastModified).toLocaleDateString('fr-FR')}</p>
                )}
              </div>

              <button
                onClick={downloadIOS}
                disabled={downloading === 'ios'}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {downloading === 'ios' ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Génération...
                  </>
                ) : (
                  <>
                    <Globe className="w-4 h-4 mr-2" />
                    Instructions PWA
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center text-orange-600">
                <AlertCircle className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">Non disponible</span>
              </div>
              <p className="text-sm text-gray-600">
                La PWA n'est pas configurée ou les fichiers sont manquants.
              </p>
              <button
                disabled
                className="w-full bg-gray-300 text-gray-500 px-4 py-2 rounded-lg cursor-not-allowed"
              >
                PWA non disponible
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Instructions PWA iOS */}
      {showInstructions && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start">
            <Info className="w-6 h-6 text-blue-600 mr-3 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">
                Installation PWA sur iOS
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-blue-800">
                <li>Ouvrir Safari sur l'appareil iOS</li>
                <li>Aller sur l'URL : <code className="bg-blue-100 px-2 py-1 rounded text-sm">{window.location.origin}/pwa</code></li>
                <li>Appuyer sur le bouton Partager (carré avec flèche vers le haut)</li>
                <li>Sélectionner "Ajouter à l'écran d'accueil"</li>
                <li>L'application sera installée comme une app native</li>
              </ol>
              
              <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Fonctionnalités PWA :</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Installation sans App Store</li>
                  <li>• Fonctionnement hors ligne</li>
                  <li>• Notifications push</li>
                  <li>• Interface native iOS</li>
                </ul>
              </div>

              <div className="mt-4 flex space-x-3">
                <button
                  onClick={() => {
                    const url = `${window.location.origin}/pwa`;
                    navigator.clipboard.writeText(url);
                    alert('URL copiée dans le presse-papiers !');
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center text-sm"
                >
                  <Share className="w-4 h-4 mr-2" />
                  Copier URL
                </button>
                <button
                  onClick={() => setShowInstructions(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 text-sm"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Informations complémentaires */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Informations importantes
        </h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p>• <strong>Android :</strong> Les utilisateurs devront autoriser l'installation depuis des sources inconnues</p>
          <p>• <strong>iOS :</strong> La PWA offre une expérience quasi-native sans passage par l'App Store</p>
          <p>• <strong>Sécurité :</strong> Seuls les Super Admins et Community Managers peuvent télécharger ces applications</p>
          <p>• <strong>Distribution :</strong> Partager ces liens uniquement avec les livreurs autorisés</p>
        </div>
      </div>
    </div>
  );
};

export default MobileDownloadManager;
