import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { 
  User, 
  Building, 
  FileText, 
  Users,
  Wrench,
  Truck,
  UserCheck,
  Megaphone,
  DollarSign,
  X,
  Upload,
  Check,
  Search,
  ChevronDown,
  Camera,
  Image,
  Star,
  Award,
  Trash2,
  Plus,
  Euro,
  Shield
} from 'lucide-react';
import toast from 'react-hot-toast';

interface ProfessionalRegistrationFormProps {
  onClose: () => void;
}

const ProfessionalRegistrationForm: React.FC<ProfessionalRegistrationFormProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    // Informations personnelles
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',
    siret: '',
    address: '',
    city: '',
    postalCode: '',
    professionalType: '',
    specializations: [] as string[],
    description: '',
    experience: '',
    hasInsurance: false,
    hasKbis: false,
    profilePhoto: null as File | null,
    workPhotos: [] as File[],
    portfolioImages: [] as File[],
    portfolioDescriptions: [] as string[],
    references: [
      { clientName: '', clientPhone: '', clientEmail: '', projectDescription: '', testimonial: '' }
    ],
    certifications: [] as Array<{
      name: string;
      issuer: string;
      date: string;
      document: File | null;
    }>,
    workingHours: {
      monday: { start: '', end: '', available: true },
      tuesday: { start: '', end: '', available: true },
      wednesday: { start: '', end: '', available: true },
      thursday: { start: '', end: '', available: true },
      friday: { start: '', end: '', available: true },
      saturday: { start: '', end: '', available: false },
      sunday: { start: '', end: '', available: false }
    },
    baseRate: '',
    urgencyRate: '',
    travelRate: '',
    website: '',
    socialMedia: {
      linkedin: '',
      facebook: '',
      instagram: ''
    },
    companySize: '',
    foundedYear: '',
    languages: [] as string[],
    acceptTerms: false,
    acceptNewsletter: false
    ,interventionZone: ''
  });
  // ...existing code...

  // États pour la recherche et sélection des métiers
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredSpecializations, setFilteredSpecializations] = useState<string[]>([]);

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
    'comptable': 'accountant'
  };

  const professionalTypes = [
    { id: 'restaurant', title: 'Restaurant', icon: Users, description: 'Propriétaire ou gérant de restaurant' },
    { id: 'artisan', title: 'Artisan & Services', icon: Wrench, description: 'Plombier, électricien, chauffagiste, nettoyeur...' },
    { id: 'fournisseur', title: 'Fournisseur', icon: Truck, description: 'Matériel, équipement, matières premières' },
    { id: 'candidat', title: 'Candidat', icon: UserCheck, description: 'Personnel temporaire ou permanent' },
    { id: 'community_manager', title: 'Community Manager', icon: Megaphone, description: 'Animation et gestion de communautés' },
    { id: 'banquier', title: 'Banquier', icon: DollarSign, description: 'Offres de financement et solutions bancaires' },
    { id: 'livreur', title: 'Livreur / Driver', icon: Truck, description: 'Livraison et transport de marchandises' },
    { id: 'investisseur', title: 'Investisseur', icon: Euro, description: 'Financement et investissement dans la restauration' },
    { id: 'comptable', title: 'Comptable', icon: FileText, description: 'Services comptables et fiscaux pour restaurants' }
  ];

  const artisanSpecializationsGrouped = {
    'Gros œuvre & Structure': [
      'Maçon',
      'Charpentier',
      'Couvreur',
      'Terrassier',
      'Démolisseur'
    ],
    'Second œuvre': [
      'Plombier',
      'Électricien',
      'Chauffagiste',
      'Climaticien / Frigoriste',
      'Carreleur',
      'Peintre en bâtiment',
      'Plâtrier',
      'Cloisons sèches',
      'Menuisier',
      'Parqueteur',
      'Miroitier / Vitrier',
      'Ravalement de façade'
    ],
    'Équipements cuisine pro': [
      'Installateur cuisine professionnelle',
      'Frigoriste cuisine pro',
      'Ventilation cuisine',
      'Hotte professionnelle',
      'Piano de cuisson',
      'Four professionnel',
      'Lave-vaisselle industriel',
      'Matériel inox',
      'Chambre froide',
      'Cuiseur vapeur',
      'Friteuse professionnelle',
      'Salamandre',
      'Plonge inox',
      'Plan de travail inox',
      'Étagères inox'
    ],
    'Maintenance & Réparation': [
      'Réparation matériel cuisine',
      'Maintenance préventive',
      'Dépannage urgent',
      'Remise aux normes',
      'Modernisation équipements'
    ],
    'Normes & Sécurité': [
      'Mise aux normes HACCP',
      'Contrôle technique',
      'Désinfection',
      'Nettoyage professionnel',
      'Dégraissage hotte',
      'Contrôle incendie',
      'Mise aux normes gaz',
      'Contrôle électrique'
    ],
    'Aménagement & Design': [
      'Agencement restaurant',
      'Design cuisine pro',
      'Optimisation espace',
      'Ergonomie de travail'
    ],
    'Technologies & Automatisation': [
      'Étanchéité',
      'Isolation',
      'Insonorisation',
      'Automatisation',
      'Domotique restaurant',
      'Système de caisse',
      'Éclairage LED',
      'Signalétique'
    ],
    'Services & Conseil': [
      'Formation utilisation',
      'Conseil technique',
      'Étude de faisabilité',
      'Expertise technique',
      'Audit énergétique'
    ]
  };

  const artisanSpecializations = Object.values(artisanSpecializationsGrouped).flat();

  const fournisseurSpecializationsGrouped = {
    'Matériel et Équipement de Cuisine': [
      'Équipement de cuisson professionnel',
      'Réfrigération et congélation',
      'Lave-vaisselle industriel', 
      'Matériel de préparation',
      'Ustensiles et petits matériels',
      'Matériel inox sur mesure',
      'Systèmes de ventilation',
      'Équipement de bar',
      'Machines à café professionnelles',
      'Matériel de boulangerie-pâtisserie'
    ],
    'Mobilier et Aménagement': [
      'Mobilier de salle',
      'Mobilier de cuisine',
      'Éclairage professionnel',
      'Agencement sur mesure',
      'Décoration et ambiance',
      'Signalétique',
      'Stores et rideaux',
      'Revêtements sols et murs'
    ],
    'Technologie et Digital': [
      'Systèmes de caisse',
      'Logiciels de gestion',
      'Solutions de paiement',
      'Équipement audio-visuel',
      'Systèmes de sécurité',
      'Wifi et télécommunications',
      'Applications mobiles',
      'Marketing digital'
    ],
    'Matières Premières - Viandes': [
      'Bœuf et veau',
      'Porc',
      'Agneau et mouton',
      'Volaille',
      'Gibier',
      'Charcuterie artisanale',
      'Viandes halal',
      'Viandes bio'
    ],
    'Matières Premières - Poissons et Fruits de Mer': [
      'Poissons frais',
      'Fruits de mer',
      'Poissons fumés',
      'Conserves de poisson',
      'Surgelés de la mer'
    ],
    'Matières Premières - Produits Laitiers': [
      'Fromages',
      'Beurre et crème',
      'Lait et yaourts',
      'Produits laitiers bio',
      'Spécialités fromagères'
    ],
    'Matières Premières - Fruits et Légumes': [
      'Fruits frais',
      'Légumes frais',
      'Produits bio',
      'Surgelés végétaux',
      'Conserves végétales',
      'Produits exotiques',
      'Herbes aromatiques'
    ],
    'Matières Premières - Épicerie': [
      'Épices et condiments',
      'Huiles et vinaigres',
      'Farines et céréales',
      'Pâtes et riz',
      'Conserves',
      'Produits secs',
      'Produits du terroir'
    ],
    'Boissons': [
      'Vins',
      'Spiritueux',
      'Bières',
      'Boissons sans alcool',
      'Cafés et thés',
      'Jus de fruits',
      'Eaux minérales'
    ],
    'Emballage et Conditionnement': [
      'Emballages alimentaires',
      'Sacs et sachets',
      'Barquettes et plateaux',
      'Étiquetage',
      'Emballages écologiques',
      'Film alimentaire',
      'Boîtes de conservation'
    ],
    'Hygiène et Entretien': [
      'Produits de nettoyage',
      'Désinfectants',
      'Matériel de nettoyage',
      'Équipements de protection',
      'Produits d\'hygiène',
      'Vêtements professionnels'
    ]
  };

  const fournisseurSpecializations = Object.values(fournisseurSpecializationsGrouped).flat();

  const candidatSpecializations = [
    'Service en salle', 'Cuisine', 'Bar', 'Réception', 'Management', 
    'Nettoyage', 'Livraison', 'Événementiel'
  ];

  const livreurSpecializations = [
    'Livraison à vélo',
    'Livraison en scooter',
    'Livraison en voiture',
    'Livraison urgente',
    'Livraisons programmées',
    'Transport frigorifique',
    'Livraison longue distance',
    'Livraison de gros volumes'
  ];

  const investisseurSpecializations = [
    'Capital-risque restauration',
    'Franchise et développement',
    'Acquisition de restaurants',
    'Financement équipement',
    'Investissement immobilier',
    'Private equity',
    'Business angels',
    'Crowdfunding'
  ];

  const comptableSpecializations = [
    'Comptabilité générale',
    'Fiscalité restauration',
    'Paie et social',
    'Gestion financière',
    'Audit et conseil',
    'Déclarations TVA',
    'Bilan et compte de résultat',
    'Optimisation fiscale'
  ];

  const getSpecializationsForType = (type: string) => {
    switch (type) {
      case 'artisan': return artisanSpecializations;
      case 'fournisseur': return fournisseurSpecializations;
      case 'candidat': return candidatSpecializations;
      case 'livreur': return livreurSpecializations;
      case 'investisseur': return investisseurSpecializations;
      case 'comptable': return comptableSpecializations;
      default: return [];
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Fonction pour filtrer les spécialisations selon la recherche
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    const specs = getSpecializationsForType(formData.professionalType);
    const filtered = specs.filter(spec => 
      spec.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredSpecializations(filtered);
  };

  // Fonction pour ajouter une spécialisation depuis la recherche
  const handleSelectSpecialization = (specialization: string) => {
    if (!formData.specializations.includes(specialization)) {
      setFormData(prev => ({
        ...prev,
        specializations: [...prev.specializations, specialization]
      }));
    }
    setSearchTerm('');
    setFilteredSpecializations([]);
    setIsDropdownOpen(false);
  };

  // Fonction pour supprimer une spécialisation
  const handleRemoveSpecialization = (specialization: string) => {
    setFormData(prev => ({
      ...prev,
      specializations: prev.specializations.filter(s => s !== specialization)
    }));
  };

  // Fonctions pour gérer les nouveaux champs
  const handleFileUpload = (field: string, files: FileList | null, multiple = false) => {
    if (!files) return;
    
    if (multiple) {
      const fileArray = Array.from(files);
      setFormData(prev => ({
        ...prev,
        [field]: [...(prev[field as keyof typeof prev] as File[]), ...fileArray]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: files[0]
      }));
    }
  };

  const removeFile = (field: string, index?: number) => {
    if (index !== undefined) {
      setFormData(prev => ({
        ...prev,
        [field]: (prev[field as keyof typeof prev] as File[]).filter((_, i) => i !== index)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const addReference = () => {
    setFormData(prev => ({
      ...prev,
      references: [...prev.references, { clientName: '', clientPhone: '', clientEmail: '', projectDescription: '', testimonial: '' }]
    }));
  };

  const removeReference = (index: number) => {
    setFormData(prev => ({
      ...prev,
      references: prev.references.filter((_, i) => i !== index)
    }));
  };

  const updateReference = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      references: prev.references.map((ref, i) => i === index ? { ...ref, [field]: value } : ref)
    }));
  };

  const addCertification = () => {
    setFormData(prev => ({
      ...prev,
      certifications: [...prev.certifications, { name: '', issuer: '', date: '', document: null }]
    }));
  };

  const removeCertification = (index: number) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }));
  };

  const updateCertification = (index: number, field: string, value: string | File | null) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.map((cert, i) => i === index ? { ...cert, [field]: value } : cert)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation basique
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    if (!formData.professionalType) {
      toast.error('Veuillez sélectionner votre type de professionnel');
      return;
    }

    if (!formData.profilePhoto) {
      toast.error('Veuillez ajouter une photo de profil');
      return;
    }
    
    if (!formData.acceptTerms) {
      toast.error('Veuillez accepter les conditions générales');
      return;
    }

    // Validation des références avec contacts
    const incompleteRefs = formData.references.filter(ref => 
      ref.clientName && (!ref.clientPhone && !ref.clientEmail)
    );
    if (incompleteRefs.length > 0) {
      toast.error('Veuillez compléter les informations de contact des références clients');
      return;
    }

    try {
      // Envoyer la demande d'inscription au backend
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      
      // Générer un mot de passe temporaire (l'utilisateur devra le changer après validation)
      const tempPassword = `Temp${Date.now()}!`;
      
      // Convertir le rôle français en anglais pour le backend
      const backendRole = roleMapping[formData.professionalType] || formData.professionalType;
      
      const response = await axios.post(`${API_URL}/auth/register`, {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: tempPassword,
        role: backendRole,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        companyName: formData.companyName,
        siret: formData.siret,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        description: formData.description,
        specializations: formData.specializations,
        // Le status sera automatiquement 'pending'
      });

      if (response.data.success) {
        // Afficher un message de succès détaillé
        let successMessage = 'Demande d\'inscription envoyée avec succès ! ';
        const addedElements: string[] = [];
        
        if (formData.workPhotos.length > 0) addedElements.push(`${formData.workPhotos.length} photo(s) de travaux`);
        if (formData.references.filter(ref => ref.clientName).length > 0) addedElements.push(`${formData.references.filter(ref => ref.clientName).length} référence(s) client`);
        if (formData.certifications.filter(cert => cert.name).length > 0) addedElements.push(`${formData.certifications.filter(cert => cert.name).length} certification(s)`);
        
        if (addedElements.length > 0) {
          successMessage += `Votre profil est enrichi avec ${addedElements.join(', ')}. `;
        }
        
        successMessage += 'Nous vous contacterons sous 48h.';

        toast.success(successMessage);
        onClose();
      }
    } catch (error: any) {
      console.error('Erreur lors de l\'inscription:', error);
      const errorMessage = error.response?.data?.error || 'Erreur lors de l\'envoi de la demande';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 rounded-t-xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Demande d'inscription professionnelle</h2>
              <p className="text-orange-100 mt-1">Rejoignez la communauté RestauConnect</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          {/* Indicateur de profil complété */}
          <div className="mt-4 bg-white bg-opacity-20 rounded-lg p-3">
            <div className="flex items-center justify-between text-sm">
              <span>Profil complété :</span>
              <span className="font-bold">
                {Math.round(
                  ((formData.firstName ? 1 : 0) +
                  (formData.lastName ? 1 : 0) +
                  (formData.email ? 1 : 0) +
                  (formData.phone ? 1 : 0) +
                  (formData.professionalType ? 1 : 0) +
                  (formData.profilePhoto ? 1 : 0) +
                  (formData.specializations.length > 0 ? 1 : 0) +
                  (formData.description ? 1 : 0)) / 8 * 100
                )}%
              </span>
            </div>
            <div className="mt-2 bg-white bg-opacity-30 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.round(
                    ((formData.firstName ? 1 : 0) +
                    (formData.lastName ? 1 : 0) +
                    (formData.email ? 1 : 0) +
                    (formData.phone ? 1 : 0) +
                    (formData.professionalType ? 1 : 0) +
                    (formData.profilePhoto ? 1 : 0) +
                    (formData.specializations.length > 0 ? 1 : 0) +
                    (formData.description ? 1 : 0)) / 8 * 100
                  )}%`
                }}
              />
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Type de professionnel */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Building className="h-5 w-5 mr-2 text-orange-600" />
              Type de professionnel *
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {professionalTypes.map((type) => (
                <label
                  key={type.id}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all hover:border-orange-300 ${
                    formData.professionalType === type.id
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="professionalType"
                    value={type.id}
                    checked={formData.professionalType === type.id}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  <div className="flex items-center mb-2">
                    <type.icon className="h-5 w-5 text-orange-600 mr-2" />
                    <span className="font-medium text-gray-900">{type.title}</span>
                  </div>
                  <p className="text-sm text-gray-600">{type.description}</p>
                </label>
              ))}
            </div>
          </div>

          {/* Informations personnelles */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="h-5 w-5 mr-2 text-orange-600" />
              Informations personnelles *
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prénom *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Votre prénom"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Votre nom"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="votre@email.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="01 23 45 67 89"
                  required
                />
              </div>
            </div>
          </div>

          {/* Informations entreprise */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Building className="h-5 w-5 mr-2 text-orange-600" />
              Informations entreprise
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de l'entreprise
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Nom de votre entreprise"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SIRET
                </label>
                <input
                  type="text"
                  name="siret"
                  value={formData.siret}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="12345678901234"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="123 rue de la République"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ville
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Paris"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Code postal
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="75001"
                />
              </div>
            </div>
          </div>

          {/* Spécialisations */}
          {formData.professionalType && getSpecializationsForType(formData.professionalType).length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Wrench className="h-5 w-5 mr-2 text-orange-600" />
                Spécialisations et métiers
              </h3>
              
              {/* Barre de recherche avec autocomplétion */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rechercher et ajouter des métiers
                </label>
                <div className="relative">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => {
                        handleSearchChange(e.target.value);
                        setIsDropdownOpen(e.target.value.length > 0);
                      }}
                      onFocus={() => {
                        if (searchTerm.length > 0) setIsDropdownOpen(true);
                      }}
                      className="w-full px-4 py-3 pl-10 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Tapez pour rechercher un métier (ex: plombier, électricien...)"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    {searchTerm && (
                      <button
                        onClick={() => {
                          setSearchTerm('');
                          setFilteredSpecializations([]);
                          setIsDropdownOpen(false);
                        }}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                  
                  {/* Liste déroulante avec autocomplétion */}
                  {isDropdownOpen && filteredSpecializations.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {filteredSpecializations.slice(0, 10).map((spec) => (
                        <button
                          key={spec}
                          onClick={() => handleSelectSpecialization(spec)}
                          className={`w-full text-left px-4 py-3 hover:bg-orange-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                            formData.specializations.includes(spec) 
                              ? 'bg-orange-50 text-orange-700 font-medium' 
                              : 'text-gray-700'
                          }`}
                          disabled={formData.specializations.includes(spec)}
                        >
                          <div className="flex items-center justify-between">
                            <span>{spec}</span>
                            {formData.specializations.includes(spec) && (
                              <Check className="h-4 w-4 text-orange-600" />
                            )}
                          </div>
                        </button>
                      ))}
                      {filteredSpecializations.length > 10 && (
                        <div className="px-4 py-2 text-sm text-gray-500 bg-gray-50">
                          ... et {filteredSpecializations.length - 10} autres résultats
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Métiers sélectionnés - Tags */}
              {formData.specializations.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Métiers sélectionnés ({formData.specializations.length})
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {formData.specializations.map((spec) => (
                      <span
                        key={spec}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800"
                      >
                        {spec}
                        <button
                          onClick={() => handleRemoveSpecialization(spec)}
                          className="ml-2 hover:text-orange-600 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Menu déroulant par catégories pour les artisans */}
              {formData.professionalType === 'artisan' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Ou parcourir par catégories
                  </label>
                  <div className="space-y-4">
                    {Object.entries(artisanSpecializationsGrouped).map(([category, specs]) => (
                      <details key={category} className="group">
                        <summary className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                          <h4 className="text-md font-medium text-gray-800 flex items-center">
                            <Wrench className="h-4 w-4 mr-2 text-orange-600" />
                            {category}
                          </h4>
                          <ChevronDown className="h-5 w-5 text-gray-500 group-open:rotate-180 transition-transform" />
                        </summary>
                        <div className="mt-3 ml-4 grid grid-cols-2 md:grid-cols-3 gap-2">
                          {specs.map((spec) => (
                            <button
                              key={spec}
                              onClick={() => handleSelectSpecialization(spec)}
                              className={`p-2 text-sm text-left rounded-lg transition-all ${
                                formData.specializations.includes(spec)
                                  ? 'bg-orange-100 text-orange-800 font-medium'
                                  : 'bg-white border border-gray-200 hover:border-orange-300 hover:bg-orange-50'
                              }`}
                              disabled={formData.specializations.includes(spec)}
                            >
                              <div className="flex items-center justify-between">
                                <span className="truncate mr-2">{spec}</span>
                                {formData.specializations.includes(spec) && (
                                  <Check className="h-3 w-3 text-orange-600 flex-shrink-0" />
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-orange-600" />
              Description de votre activité
            </h3>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Décrivez votre activité, vos services, votre expérience..."
            />
          </div>

          {/* Section Photos Professionnelles */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Camera className="h-5 w-5 mr-2 text-orange-600" />
              Photos professionnelles
            </h3>
            
            {/* Photo de profil */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Photo de profil *
              </label>
              <div className="flex items-center space-x-4">
                {formData.profilePhoto ? (
                  <div className="relative">
                    <img
                      src={URL.createObjectURL(formData.profilePhoto)}
                      alt="Photo de profil"
                      className="w-20 h-20 rounded-full object-cover border-2 border-gray-300"
                    />
                    <button
                      onClick={() => removeFile('profilePhoto')}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center border-2 border-dashed border-gray-300">
                    <User className="h-8 w-8 text-gray-400" />
                  </div>
                )}
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload('profilePhoto', e.target.files, false)}
                    className="hidden"
                    id="profile-photo"
                  />
                  <label
                    htmlFor="profile-photo"
                    className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    {formData.profilePhoto ? 'Changer' : 'Ajouter'} une photo
                  </label>
                  <p className="text-xs text-gray-500 mt-1">JPG, PNG max 5MB</p>
                </div>
              </div>
            </div>

            {/* Photos de travaux */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Photos de vos réalisations
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleFileUpload('workPhotos', e.target.files, true)}
                  className="hidden"
                  id="work-photos"
                />
                <label htmlFor="work-photos" className="cursor-pointer">
                  <Image className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-gray-600 mb-2">
                    Cliquez pour ajouter des photos de vos réalisations
                  </p>
                  <p className="text-xs text-gray-500">
                    Plusieurs fichiers acceptés • JPG, PNG max 5MB chacun
                  </p>
                </label>
              </div>
              
              {/* Prévisualisation des photos de travaux */}
              {formData.workPhotos.length > 0 && (
                <div className="mt-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.workPhotos.map((photo, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(photo)}
                          alt={`Réalisation ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border"
                        />
                        <button
                          onClick={() => removeFile('workPhotos', index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {formData.workPhotos.length} photo(s) ajoutée(s)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Expérience et disponibilités */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Années d'expérience
              </label>
              <select
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Sélectionnez</option>
                <option value="0-1">Moins d'1 an</option>
                <option value="1-3">1 à 3 ans</option>
                <option value="3-5">3 à 5 ans</option>
                <option value="5-10">5 à 10 ans</option>
                <option value="10+">Plus de 10 ans</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Zone d'intervention
              </label>
              <input
                type="text"
                name="interventionZone"
                value={formData.interventionZone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Paris, Île-de-France, France..."
              />
            </div>
          </div>

          {/* Section Références Clients */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Star className="h-5 w-5 mr-2 text-orange-600" />
              Références clients
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Ajoutez des références de clients précédents pour renforcer votre crédibilité
            </p>
            
            {formData.references.map((reference, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-md font-medium text-gray-800">
                    Référence client #{index + 1}
                  </h4>
                  {formData.references.length > 1 && (
                    <button
                      onClick={() => removeReference(index)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom du client
                    </label>
                    <input
                      type="text"
                      value={reference.clientName}
                      onChange={(e) => updateReference(index, 'clientName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Nom de l'entreprise ou du particulier"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      value={reference.clientPhone}
                      onChange={(e) => updateReference(index, 'clientPhone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Numéro de téléphone"
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email de contact
                  </label>
                  <input
                    type="email"
                    value={reference.clientEmail}
                    onChange={(e) => updateReference(index, 'clientEmail', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Email du client"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description du projet
                  </label>
                  <textarea
                    value={reference.projectDescription}
                    onChange={(e) => updateReference(index, 'projectDescription', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Décrivez brièvement le projet réalisé"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Témoignage (optionnel)
                  </label>
                  <textarea
                    value={reference.testimonial}
                    onChange={(e) => updateReference(index, 'testimonial', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Témoignage ou avis du client sur votre travail"
                  />
                </div>
              </div>
            ))}
            
            <button
              type="button"
              onClick={addReference}
              className="flex items-center px-4 py-2 border border-orange-300 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une référence
            </button>
          </div>

          {/* Section Certifications Professionnelles */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Award className="h-5 w-5 mr-2 text-orange-600" />
              Certifications professionnelles
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Ajoutez vos certifications, diplômes et qualifications professionnelles
            </p>
            
            {formData.certifications.map((certification, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-md font-medium text-gray-800">
                    Certification #{index + 1}
                  </h4>
                  <button
                    onClick={() => removeCertification(index)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom de la certification
                    </label>
                    <input
                      type="text"
                      value={certification.name}
                      onChange={(e) => updateCertification(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Ex: Certification Qualibat, CAP Plomberie..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Organisme délivrant
                    </label>
                    <input
                      type="text"
                      value={certification.issuer}
                      onChange={(e) => updateCertification(index, 'issuer', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Nom de l'organisme"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date d'obtention
                    </label>
                    <input
                      type="date"
                      value={certification.date}
                      onChange={(e) => updateCertification(index, 'date', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Document justificatif
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => updateCertification(index, 'document', e.target.files?.[0] || null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    {certification.document && (
                      <p className="text-xs text-green-600 mt-1">
                        ✓ {certification.document.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            <button
              type="button"
              onClick={addCertification}
              className="flex items-center px-4 py-2 border border-orange-300 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une certification
            </button>
          </div>

          {/* Section Informations Complémentaires */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Building className="h-5 w-5 mr-2 text-orange-600" />
              Informations complémentaires
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Site web
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="https://votre-site.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Taille de l'entreprise
                </label>
                <select
                  name="companySize"
                  value={formData.companySize}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Sélectionnez</option>
                  <option value="solo">Travailleur indépendant</option>
                  <option value="2-5">2 à 5 employés</option>
                  <option value="6-10">6 à 10 employés</option>
                  <option value="11-50">11 à 50 employés</option>
                  <option value="50+">Plus de 50 employés</option>
                </select>
              </div>
            </div>

            {/* Tarification indicative */}
            <div className="mb-6">
              <h4 className="text-md font-medium text-gray-800 mb-3 flex items-center">
                <Euro className="h-4 w-4 mr-2 text-orange-600" />
                Tarification indicative (optionnel)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tarif de base (€/h)
                  </label>
                  <input
                    type="number"
                    name="baseRate"
                    value={formData.baseRate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tarif urgence (€/h)
                  </label>
                  <input
                    type="number"
                    name="urgencyRate"
                    value={formData.urgencyRate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="75"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Frais déplacement (€/km)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="travelRate"
                    value={formData.travelRate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="0.5"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Upload className="h-5 w-5 mr-2 text-orange-600" />
              Documents
            </h3>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="hasInsurance"
                  checked={formData.hasInsurance}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Je possède une assurance responsabilité civile professionnelle
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="hasKbis"
                  checked={formData.hasKbis}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Je possède un extrait K-bis (pour les entreprises)
                </span>
              </label>
            </div>
          </div>

          {/* Résumé avant envoi */}
          {formData.firstName && formData.lastName && formData.professionalType && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h4 className="text-md font-medium text-orange-900 mb-3 flex items-center">
                <Check className="h-4 w-4 mr-2" />
                Résumé de votre inscription
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><span className="font-medium">Nom :</span> {formData.firstName} {formData.lastName}</p>
                  <p><span className="font-medium">Type :</span> {professionalTypes.find(type => type.id === formData.professionalType)?.title}</p>
                  {formData.specializations.length > 0 && (
                    <p><span className="font-medium">Spécialisations :</span> {formData.specializations.length} métier(s)</p>
                  )}
                </div>
                <div>
                  {formData.profilePhoto && <p className="text-green-700">✓ Photo de profil ajoutée</p>}
                  {formData.workPhotos.length > 0 && <p className="text-green-700">✓ {formData.workPhotos.length} photo(s) de travaux</p>}
                  {formData.references.filter(ref => ref.clientName).length > 0 && (
                    <p className="text-green-700">✓ {formData.references.filter(ref => ref.clientName).length} référence(s) client</p>
                  )}
                  {formData.certifications.filter(cert => cert.name).length > 0 && (
                    <p className="text-green-700">✓ {formData.certifications.filter(cert => cert.name).length} certification(s)</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Conditions */}
          <div className="border-t pt-6">
            <div className="space-y-3">
              <label className="flex items-start">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500 mt-1"
                  required
                />
                <span className="ml-2 text-sm text-gray-700">
                  <span className="text-red-500">*</span> J'accepte les{' '}
                  <button 
                    onClick={() => window.open('/terms-conditions', '_blank')} 
                    className="text-orange-600 hover:underline bg-transparent border-none cursor-pointer"
                  >
                    conditions générales d'utilisation
                  </button>{' '}
                  et la{' '}
                  <button 
                    onClick={() => window.open('/privacy-policy', '_blank')} 
                    className="text-orange-600 hover:underline bg-transparent border-none cursor-pointer"
                  >
                    politique de confidentialité
                  </button>
                </span>
              </label>
              <label className="flex items-start">
                <input
                  type="checkbox"
                  name="acceptNewsletter"
                  checked={formData.acceptNewsletter}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500 mt-1"
                />
                <span className="ml-2 text-sm text-gray-700">
                  J'accepte de recevoir des informations sur les nouveautés et offres de Web Spider
                </span>
              </label>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                <p className="text-xs text-blue-800">
                  <Shield className="h-4 w-4 inline mr-1" />
                  Vos données sont protégées et ne seront utilisées que pour traiter votre demande d'inscription.
                  Notre équipe examinera votre dossier sous 48h et vous contactera par email.
                </p>
              </div>
            </div>
          </div>

          {/* Boutons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={!formData.acceptTerms || !formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.professionalType}
              className={`px-6 py-3 font-medium rounded-lg transition-all flex items-center justify-center ${
                formData.acceptTerms && formData.firstName && formData.lastName && formData.email && formData.phone && formData.professionalType
                  ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white hover:from-orange-600 hover:to-red-700 hover:shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Upload className="h-4 w-4 mr-2" />
              Envoyer ma demande d'inscription
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ProfessionalRegistrationForm;
