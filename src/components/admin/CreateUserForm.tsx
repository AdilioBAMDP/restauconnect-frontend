import React, { useState } from 'react';
import { User, Mail, Lock, Shield, Phone, MapPin, Building } from 'lucide-react';

interface CreateUserFormProps {
  onCreate: (user: { 
    username: string; 
    email: string; 
    password: string; 
    role: string;
    phone?: string;
    companyName?: string;
    location?: string;
  }) => void;
}

const CreateUserForm: React.FC<CreateUserFormProps> = ({ onCreate }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'restaurant',
    phone: '',
    companyName: '',
    location: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Mapping des rôles français (frontend UX) vers anglais (backend)
  const roleMapping: { [key: string]: string } = {
    'restaurant': 'restaurant',
    'artisan': 'artisan',
    'fournisseur': 'supplier',
    'candidat': 'candidat',
    'community_manager': 'community_manager',
    'banquier': 'banker',
    'livreur': 'driver',
    'investisseur': 'investor',
    'comptable': 'accountant',
    'transporteur': 'carrier',
    'auditeur': 'auditor',
    'admin': 'admin',
    'super_admin': 'super_admin'
  };

  const roles = [
    { value: 'restaurant', label: 'Restaurant', icon: '🍽️', description: 'Propriétaires de restaurants' },
    { value: 'artisan', label: 'Artisan', icon: '🔧', description: 'Artisans et techniciens' },
    { value: 'fournisseur', label: 'Fournisseur', icon: '📦', description: 'Fournisseurs de produits' },
    { value: 'candidat', label: 'Candidat', icon: '👤', description: 'Demandeurs d\'emploi' },
    { value: 'community_manager', label: 'Community Manager', icon: '📢', description: 'Gestionnaires de communauté' },
    { value: 'banquier', label: 'Banquier', icon: '🏦', description: 'Professionnels bancaires' },
    { value: 'investisseur', label: 'Investisseur', icon: '💼', description: 'Investisseurs et financeurs' },
    { value: 'comptable', label: 'Comptable', icon: '📊', description: 'Experts comptables' },
    { value: 'livreur', label: 'Livreur', icon: '🚗', description: 'Chauffeurs livreurs' },
    { value: 'transporteur', label: 'Transporteur', icon: '🚚', description: 'Transporteurs et logistique' },
    { value: 'auditeur', label: 'Auditeur', icon: '📋', description: 'Auditeurs et contrôleurs' },
    { value: 'admin', label: 'Admin', icon: '👨‍💼', description: 'Administrateurs' },
    { value: 'super_admin', label: 'Super Admin', icon: '⚡', description: 'Administrateurs système' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Non authentifié. Veuillez vous reconnecter.');
      }
      
      const API_URL = import.meta.env.VITE_API_URL || 'https://restauconnect-backen-production-70be.up.railway.app';
      
      // Convertir le rôle français en anglais pour le backend
      const backendRole = roleMapping[formData.role] || formData.role;
      
      // ✅ VRAIE REQUÊTE API
      const response = await fetch(`${API_URL}/api/admin/users`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.username,
          role: backendRole,
          phone: formData.phone || undefined,
          companyName: formData.companyName || undefined,
          location: formData.location ? {
            address: formData.location,
            city: '',
            postalCode: ''
          } : undefined
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `Erreur ${response.status}: ${response.statusText}`);
      }
      
      // ✅ SUCCÈS
      setSuccess(`✅ ${data.message || 'Utilisateur créé avec succès !'}`);
      onCreate(data.data);
      
      // Reset form après succès
      setFormData({
        username: '',
        email: '',
        password: '',
        role: 'restaurant',
        phone: '',
        companyName: '',
        location: ''
      });
      
      // Masquer le message de succès après 5 secondes
      setTimeout(() => setSuccess(''), 5000);
      
    } catch (error: any) {
      console.error('Erreur création utilisateur:', error);
      setError(error.message || 'Une erreur est survenue lors de la création');
    } finally {
      setIsLoading(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    updateField('password', password);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-blue-100 p-3 rounded-lg">
            <User className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Créer un nouvel utilisateur</h2>
            <p className="text-gray-600">Ajoutez un nouvel utilisateur à la plateforme RestauConnect</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Messages d'erreur et succès */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center gap-2">
              <span className="text-lg">❌</span>
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center gap-2">
              <span className="text-lg">✅</span>
              <p className="text-sm font-medium">{success}</p>
            </div>
          )}
          
          {/* Informations de base */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-1" />
                Nom d'utilisateur *
              </label>
              <input 
                type="text" 
                value={formData.username} 
                onChange={e => updateField('username', e.target.value)}
                required 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="john.doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-1" />
                Adresse email *
              </label>
              <input 
                type="email" 
                value={formData.email} 
                onChange={e => updateField('email', e.target.value)}
                required 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="john@exemple.com"
              />
            </div>
          </div>

          {/* Mot de passe */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Lock className="w-4 h-4 inline mr-1" />
              Mot de passe *
            </label>
            <div className="flex gap-2">
              <input 
                type="password" 
                autoComplete="new-password"
                value={formData.password} 
                onChange={e => updateField('password', e.target.value)}
                required 
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="••••••••••••"
                minLength={8}
              />
              <button
                type="button"
                onClick={generatePassword}
                className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                title="Générer mot de passe sécurisé"
              >
                🎲
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">Minimum 8 caractères</p>
          </div>

          {/* Rôle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Shield className="w-4 h-4 inline mr-1" />
              Rôle utilisateur *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {roles.map((roleOption) => (
                <label key={roleOption.value} className="relative">
                  <input
                    type="radio"
                    name="role"
                    value={roleOption.value}
                    checked={formData.role === roleOption.value}
                    onChange={e => updateField('role', e.target.value)}
                    className="sr-only"
                  />
                  <div className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.role === roleOption.value 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{roleOption.icon}</span>
                      <span className="font-medium text-gray-900">{roleOption.label}</span>
                    </div>
                    <p className="text-xs text-gray-600">{roleOption.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Informations supplémentaires */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Informations supplémentaires (optionnel)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Téléphone
                </label>
                <input 
                  type="tel" 
                  value={formData.phone} 
                  onChange={e => updateField('phone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="+33 1 23 45 67 89"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Building className="w-4 h-4 inline mr-1" />
                  Nom de l'entreprise
                </label>
                <input 
                  type="text" 
                  value={formData.companyName} 
                  onChange={e => updateField('companyName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Mon Restaurant SARL"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Localisation
              </label>
              <input 
                type="text" 
                value={formData.location} 
                onChange={e => updateField('location', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Paris, France"
              />
            </div>
          </div>

          {/* Boutons */}
          <div className="flex gap-4 pt-6 border-t">
            <button 
              type="submit" 
              disabled={isLoading}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline-block mr-2"></div>
                  Création en cours...
                </>
              ) : (
                'Créer l\'utilisateur'
              )}
            </button>
            
            <button 
              type="button"
              onClick={() => setFormData({
                username: '',
                email: '',
                password: '',
                role: 'restaurant',
                phone: '',
                companyName: '',
                location: ''
              })}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Réinitialiser
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserForm;
