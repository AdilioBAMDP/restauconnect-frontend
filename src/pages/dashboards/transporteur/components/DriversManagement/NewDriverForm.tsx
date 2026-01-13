import React, { useState, useEffect } from 'react';
import { X, User, Phone, Mail, CreditCard, Calendar, Car } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface Vehicle {
  _id: string;
  registrationNumber: string;
  type: string;
  status: string;
}

interface NewDriverFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const NewDriverForm: React.FC<NewDriverFormProps> = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: 'driver123', // Mot de passe par défaut
    licenseNumber: '',
    licenseExpiryDate: '',
    vehicleAssigned: ''
  });

  const apiClient = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });

  useEffect(() => {
    loadAvailableVehicles();
  }, []);

  const loadAvailableVehicles = async () => {
    try {
      const response = await apiClient.get('/transporteur-tms/vehicles');
      if (response.data.success) {
        setVehicles(response.data.vehicles.filter((v: Vehicle) => v.status === 'available'));
      }
    } catch (error) {
      console.error('Erreur chargement véhicules:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email || !formData.phone || !formData.licenseNumber) {
      toast.error('⚠️ Veuillez remplir tous les champs obligatoires');
      return;
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('⚠️ Email invalide');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post('/transporteur-tms/drivers', {
        ...formData,
        role: 'driver',
        status: 'active'
      });

      if (response.data.success) {
        toast.success('✅ Chauffeur créé avec succès!');
        onSuccess();
        onClose();
      }
    } catch (error: any) {
      console.error('Erreur création chauffeur:', error);
      toast.error(error.response?.data?.message || '❌ Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 rounded-t-xl flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">👨‍✈️ Nouveau Chauffeur</h2>
            <p className="text-green-100 text-sm mt-1">Ajouter un nouveau chauffeur à la flotte</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Informations personnelles */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <User size={20} /> Informations personnelles
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom complet *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Jean Dupont"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Mail size={16} /> Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="jean.dupont@tms.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Phone size={16} /> Téléphone *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="06 12 34 56 78"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Permis de conduire */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <CreditCard size={20} /> Permis de conduire
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Numéro de permis *
                </label>
                <input
                  type="text"
                  value={formData.licenseNumber}
                  onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="DL123456"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Calendar size={16} /> Date d'expiration
                </label>
                <input
                  type="date"
                  value={formData.licenseExpiryDate}
                  onChange={(e) => setFormData({ ...formData, licenseExpiryDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Véhicule assigné */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Car size={20} /> Véhicule assigné
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sélectionner un véhicule (optionnel)
              </label>
              <select
                value={formData.vehicleAssigned}
                onChange={(e) => setFormData({ ...formData, vehicleAssigned: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Aucun véhicule</option>
                {vehicles.map(vehicle => (
                  <option key={vehicle._id} value={vehicle._id}>
                    {vehicle.registrationNumber} - {vehicle.type}
                  </option>
                ))}
              </select>
              {vehicles.length === 0 && (
                <p className="text-sm text-gray-500 mt-2">
                  ℹ️ Aucun véhicule disponible
                </p>
              )}
            </div>
          </div>

          {/* Mot de passe */}
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              🔒 Mot de passe par défaut: <strong>driver123</strong>
              <br />
              <span className="text-xs">Le chauffeur pourra le modifier après connexion</span>
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '⏳ Création...' : '✅ Créer le chauffeur'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewDriverForm;
