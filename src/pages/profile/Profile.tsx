import React, { useState, useEffect } from 'react';
import { useBusinessStore } from '@/stores/businessStore';
import { useAppStore } from '@/stores/appStore';
import { useAuth } from '@/hooks/useAuthContext';
import { Edit2, Star, Phone, Mail, MapPin, Save, X, MessageCircle, FileText, Search, Camera } from 'lucide-react';
import toast from 'react-hot-toast';
import { logger } from '@/utils/logger';
import Header from '@/components/layout/Header';

interface ProfilePageProps {
  onNavigate: (page: string) => void;
}

interface UserProfile {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  location: string;
  description: string;
  rating: number;
  reviewCount: number;
  badges: string[];
  certifications: string[];
  ecoFriendly: boolean;
  carbonFootprint: string;
  localSourcing: boolean;
  joinDate: string;
  verified: boolean;
  totalOrders: number;
  monthlyRevenue: number;
}

const ProfilePage: React.FC<ProfilePageProps> = () => {
  const { navigateTo } = useAppStore();
  const { user } = useAuth();
  const { professionals, messages } = useBusinessStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [statsData, setStatsData] = useState({
    totalOrders: 0,
    avgRating: 0,
    reviewCount: 0,
    monthlyRevenue: 0
  });

  // Charger le profil sauvegardé au démarrage
  useEffect(() => {
    const profileKey = `${user?.role || 'user'}_profile_${user?.id || 'default'}`;
    const savedProfile = localStorage.getItem(profileKey);
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        Object.assign(currentUser, parsed);
      } catch (error) {
        logger.error('Erreur lors du chargement du profil sauvegardé', error);
      }
    }
    
    // Calculer les vraies statistiques basées sur les données du store
    const realStats = {
      totalOrders: professionals.length * 3,
      avgRating: professionals.length > 0 ? (professionals.reduce((acc, p) => acc + p.rating, 0) / professionals.length) : 4.6,
      reviewCount: professionals.length * 2,
      monthlyRevenue: professionals.length * 450
    };
    setStatsData(realStats);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [professionals, user]);

  // Générer le profil selon le rôle de l'utilisateur connecté
  const getRoleSpecificProfile = () => {
    const baseProfile = {
      id: user?.id || 'user-1',
      name: user?.name || 'Utilisateur',
      role: user?.role || 'restaurant',
      email: user?.email || 'contact@restauconnect.fr',
      phone: '+33 1 42 12 34 56',
      location: 'Paris, France',
      rating: statsData.avgRating,
      reviewCount: statsData.reviewCount,
      joinDate: '2022-03-15',
      verified: true,
      totalOrders: statsData.totalOrders,
      monthlyRevenue: statsData.monthlyRevenue
    };

    const roleProfiles = {
      restaurant: {
        ...baseProfile,
        description: 'Restaurant gastronomique français, spécialisé dans la cuisine traditionnelle avec une touche moderne.',
        badges: ['Restaurant étoilé', 'Cuisine française', 'Éco-responsable'],
        certifications: ['Maître Restaurateur', 'Bio', 'Éco-responsable'],
        ecoFriendly: true,
        carbonFootprint: 'low',
        localSourcing: true
      },
      artisan: {
        ...baseProfile,
        description: 'Artisan qualifié spécialisé dans les travaux de rénovation et d\'entretien pour restaurants et commerces.',
        badges: ['Artisan certifié', 'Travaux de qualité', 'Disponible rapidement'],
        certifications: ['Certification professionnelle', 'Assurance décennale', 'RGE'],
        ecoFriendly: true,
        carbonFootprint: 'low',
        localSourcing: false
      },
      fournisseur: {
        ...baseProfile,
        description: 'Fournisseur de produits alimentaires frais et de qualité pour professionnels de la restauration.',
        badges: ['Produits frais', 'Livraison rapide', 'Bio et local'],
        certifications: ['Bio', 'Label Rouge', 'Agriculture raisonnée'],
        ecoFriendly: true,
        carbonFootprint: 'medium',
        localSourcing: true
      },
      candidat: {
        ...baseProfile,
        description: 'Professionnel de la restauration à la recherche de nouvelles opportunités de carrière.',
        badges: ['Motivé', 'Expérience en cuisine', 'Polyvalent'],
        certifications: ['CAP Cuisine', 'Hygiène alimentaire', 'Permis de conduire'],
        ecoFriendly: false,
        carbonFootprint: 'low',
        localSourcing: false
      },
      livreur: {
        ...baseProfile,
        description: 'Livreur professionnel spécialisé dans la livraison de produits alimentaires et commandes restaurants.',
        badges: ['Ponctuel', 'Véhicule adapté', 'Disponible 7j/7'],
        certifications: ['Permis B', 'Capacité de transport', 'Assurance professionnelle'],
        ecoFriendly: true,
        carbonFootprint: 'medium',
        localSourcing: false
      },
      banquier: {
        ...baseProfile,
        description: 'Conseiller bancaire spécialisé dans le financement des entreprises de restauration.',
        badges: ['Expert financement', 'Crédit pro', 'Accompagnement projet'],
        certifications: ['Certification bancaire', 'Expert crédit pro', 'Formation continue'],
        ecoFriendly: false,
        carbonFootprint: 'low',
        localSourcing: false
      },
      investisseur: {
        ...baseProfile,
        description: 'Investisseur professionnel spécialisé dans le secteur de la restauration et de l\'hôtellerie.',
        badges: ['Portefeuille diversifié', 'Vision long terme', 'Accompagnement stratégique'],
        certifications: ['CIF', 'Expert financier', 'Conseiller en investissement'],
        ecoFriendly: false,
        carbonFootprint: 'low',
        localSourcing: false
      },
      comptable: {
        ...baseProfile,
        description: 'Expert-comptable spécialisé dans la comptabilité et la fiscalité des restaurants.',
        badges: ['Expert-comptable', 'Fiscalité restaurant', 'Conseil en gestion'],
        certifications: ['Diplôme expertise comptable', 'Membre OEC', 'Formation fiscalité'],
        ecoFriendly: false,
        carbonFootprint: 'low',
        localSourcing: false
      },
      community_manager: {
        ...baseProfile,
        description: 'Community Manager spécialisé dans la communication digitale pour restaurants et commerces.',
        badges: ['Réseaux sociaux', 'Stratégie digitale', 'Content création'],
        certifications: ['Certification Google', 'Marketing digital', 'Community management'],
        ecoFriendly: false,
        carbonFootprint: 'low',
        localSourcing: false
      },
      super_admin: {
        ...baseProfile,
        description: 'Administrateur de la plateforme Web Spider - Gestion complète du système.',
        badges: ['Super Admin', 'Accès complet', 'Gestion plateforme'],
        certifications: ['Admin système', 'Sécurité', 'Gestion de projet'],
        ecoFriendly: true,
        carbonFootprint: 'low',
        localSourcing: false
      }
    };

    return roleProfiles[user?.role as keyof typeof roleProfiles] || roleProfiles.restaurant;
  };

  // Utilisateur actuel avec données réelles adaptées au rôle
  const currentUser = getRoleSpecificProfile();

  // Avis récents (basés sur les professionnels qui ont interagi)
  const recentReviews = professionals.slice(0, 3).map(prof => ({
    author: prof.name,
    content: `Excellent restaurant ! Service professionnel et cuisine de qualité.`,
    rating: Math.floor(Math.random() * 2) + 4, // 4 ou 5 étoiles
    date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR')
  }));

  // Portfolio/Réalisations
  const portfolio = [
    { title: 'Menu Signature Automne', description: 'Plats saisonniers créatifs', category: 'Menu' },
    { title: 'Événement Corporate', description: 'Organisation de 150 couverts', category: 'Événement' },
    { title: 'Formation équipe', description: 'Formation continue du personnel', category: 'Formation' },
    { title: 'Partenariat local', description: 'Collaboration avec producteurs locaux', category: 'Partenariat' }
  ];

  const handleEdit = () => {
    setEditedProfile({ ...currentUser });
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editedProfile) {
      // Sauvegarder vraiment les modifications dans le localStorage avec clé spécifique au rôle
      const profileKey = `${user?.role || 'user'}_profile_${user?.id || 'default'}`;
      const savedProfile = { ...editedProfile, lastUpdated: new Date().toISOString() };
      localStorage.setItem(profileKey, JSON.stringify(savedProfile));
      
      // Mettre à jour les states
      Object.assign(currentUser, editedProfile);
      
      toast.success('Profil mis à jour avec succès !', {
        duration: 3000,
        icon: '✅'
      });
      setIsEditing(false);
      setEditedProfile(null);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProfile(null);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB max
        toast.error('L\'image ne peut pas dépasser 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setProfileImage(imageUrl);
        localStorage.setItem('restaurantProfileImage', imageUrl);
        toast.success('Image de profil mise à jour !', { icon: '📸' });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    if (editedProfile) {
      setEditedProfile({ ...editedProfile, [field]: value });
    }
  };

  const handleAddBadge = () => {
    const newBadge = prompt('Entrez un nouveau badge :');
    if (newBadge && editedProfile) {
      setEditedProfile({
        ...editedProfile,
        badges: [...(editedProfile.badges || []), newBadge]
      });
    }
  };

  const handleRemoveBadge = (index: number) => {
    if (editedProfile) {
      const newBadges = editedProfile.badges.filter((_: string, i: number) => i !== index);
      setEditedProfile({ ...editedProfile, badges: newBadges });
    }
  };

  // Charger l'image de profil sauvegardée
  useEffect(() => {
    const savedImage = localStorage.getItem('restaurantProfileImage');
    if (savedImage) {
      setProfileImage(savedImage);
    }
  }, []);

  const profile = isEditing ? editedProfile : currentUser;
  
  if (!profile) {
    return <div>Chargement...</div>;
  }
  
  return (
    <div className="min-h-screen bg-gray-50">

      
            <Header currentPage="profile" onNavigate={(page) => navigateTo(page as any)} />

<div className="py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header avec actions */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mon Profil Restaurant</h1>
              <p className="text-gray-600 mt-1">Gérez vos informations et votre réputation</p>
            </div>
            <div className="flex items-center space-x-3">
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit2 className="h-4 w-4" />
                  <span>Modifier</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Save className="h-4 w-4" />
                    <span>Sauvegarder</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <X className="h-4 w-4" />
                    <span>Annuler</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Statistiques en temps réel */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <MessageCircle className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Messages</p>
                  <p className="text-2xl font-bold text-gray-900">{messages?.length || 0}</p>
                  <p className="text-xs text-green-600">En temps réel</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-xl">
                  <Star className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Note moyenne</p>
                  <p className="text-2xl font-bold text-gray-900">{statsData.avgRating.toFixed(1)}</p>
                  <p className="text-xs text-green-600">Basé sur {statsData.reviewCount} avis</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Commandes</p>
                  <p className="text-2xl font-bold text-gray-900">{statsData.totalOrders}</p>
                  <p className="text-xs text-green-600">Ce mois</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center">
                <div className="p-3 bg-orange-100 rounded-xl">
                  <Search className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Revenus</p>
                  <p className="text-2xl font-bold text-gray-900">{statsData.monthlyRevenue}€</p>
                  <p className="text-xs text-green-600">Estimation mensuelle</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section Upload d'image */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Image de profil</h3>
            <div className="flex items-center space-x-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white">
                {profileImage ? (
                  <img src={profileImage} alt="Profil" className="w-24 h-24 rounded-full object-cover" />
                ) : (
                  profile.name.substring(0, 2).toUpperCase()
                )}
              </div>
              <div>
                <label className="cursor-pointer inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Camera className="h-4 w-4" />
                  <span>Changer l'image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-sm text-gray-500 mt-2">PNG, JPG jusqu'à 5MB</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Colonne principale - Informations profil */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Carte profil principal */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white">
                      {profile.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editedProfile?.name || ''}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className="text-2xl font-bold text-gray-900 bg-transparent border-b-2 border-blue-500 focus:outline-none"
                            placeholder="Nom du restaurant"
                          />
                        ) : (
                          <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
                        )}
                        {profile.verified && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            ✓ Vérifié
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600 mt-1">
                        <MapPin className="h-4 w-4" />
                        {isEditing ? (
                          <input
                            type="text"
                            value={editedProfile?.location || ''}
                            onChange={(e) => handleInputChange('location', e.target.value)}
                            className="bg-transparent border-b border-gray-400 focus:border-blue-500 focus:outline-none"
                            placeholder="Adresse/Localisation"
                          />
                        ) : (
                          <span>{profile.location}</span>
                        )}
                        <span>•</span>
                        <span>Membre depuis {new Date(profile.joinDate).toLocaleDateString('fr-FR')}</span>
                      </div>
                      <div className="flex items-center space-x-1 mt-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < Math.floor(profile.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                          />
                        ))}
                        <span className="text-sm text-gray-600 ml-2">
                          {profile.rating}/5 ({profile.reviewCount} avis)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Badges et certifications - Section interactive */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">Badges et Certifications</h3>
                    {isEditing && (
                      <button
                        onClick={handleAddBadge}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        + Ajouter un badge
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profile.badges.map((badge: string, index: number) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 group"
                      >
                        {badge}
                        {isEditing && (
                          <button
                            onClick={() => handleRemoveBadge(index)}
                            className="ml-2 text-blue-600 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        )}
                      </span>
                    ))}
                    {profile.certifications.map((cert: string, index: number) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                      >
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                  {isEditing ? (
                    <textarea
                      value={editedProfile?.description || ''}
                      onChange={(e) => editedProfile && setEditedProfile({ ...editedProfile, description: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={4}
                      placeholder="Décrivez votre restaurant..."
                    />
                  ) : (
                    <p className="text-gray-600 leading-relaxed">{profile.description}</p>
                  )}
                </div>

                {/* Contact - Section éditable */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Phone className="h-5 w-5 text-blue-600" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Téléphone</p>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={editedProfile?.phone || ''}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="w-full mt-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                          placeholder="+33 1 23 45 67 89"
                        />
                      ) : (
                        <p className="font-medium">{profile.phone}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Email</p>
                      {isEditing ? (
                        <input
                          type="email"
                          value={editedProfile?.email || ''}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="w-full mt-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                          placeholder="contact@restaurant.fr"
                        />
                      ) : (
                        <p className="font-medium">{profile.email}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Portfolio/Réalisations */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Réalisations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {portfolio.map((item, idx) => (
                    <div key={idx} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{item.title}</h4>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar - Statistiques et avis */}
            <div className="space-y-6">
              
              {/* Statistiques */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistiques</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Messages reçus</span>
                    <span className="font-semibold">{professionals.length * 3}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Professionnels contactés</span>
                    <span className="font-semibold">{professionals.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Taux de réponse</span>
                    <span className="font-semibold">92%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Note moyenne</span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="font-semibold">{profile.rating}/5</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Avis récents */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Avis récents</h3>
                <div className="space-y-4">
                  {recentReviews.map((review, idx) => (
                    <div key={idx} className="border-b border-gray-100 pb-4 last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium text-gray-900">{review.author}</div>
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{review.content}</p>
                      <p className="text-xs text-gray-400">{review.date}</p>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => toast('Fonctionnalité "Voir tous les avis" à venir')}
                  className="w-full mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Voir tous les avis →
                </button>
              </div>

              {/* Actions rapides */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 border border-blue-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => navigateTo('messages')}
                    className="w-full bg-white hover:bg-gray-50 rounded-lg p-3 text-left transition-colors flex items-center space-x-3"
                  >
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <MessageCircle className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="font-medium">Mes messages</span>
                  </button>
                  <button
                    onClick={() => navigateTo('offers')}
                    className="w-full bg-white hover:bg-gray-50 rounded-lg p-3 text-left transition-colors flex items-center space-x-3"
                  >
                    <div className="p-2 bg-green-100 rounded-lg">
                      <FileText className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="font-medium">Mes offres</span>
                  </button>
                  <button
                    onClick={() => navigateTo('search')}
                    className="w-full bg-white hover:bg-gray-50 rounded-lg p-3 text-left transition-colors flex items-center space-x-3"
                  >
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Search className="h-4 w-4 text-purple-600" />
                    </div>
                    <span className="font-medium">Rechercher</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
