import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, MapPin } from 'lucide-react';
import axios from 'axios';
import VehicleCard from './VehicleCard.tsx';
import VehicleForm from './VehicleForm.tsx';

interface Vehicle {
  _id: string;
  registrationNumber: string;
  brand: string;
  model: string;
  type: 'van' | 'truck' | 'refrigerated' | 'motorcycle' | 'Camion' | 'Camionnette' | 'Fourgon' | 'Semi-remorque';
  capacity: { weight: number; volume: number };
  year: number;
  fuelType?: 'Diesel' | 'Essence' | 'Électrique' | 'Hybride';
  mileage?: number;
  insuranceExpiry: string;
  technicalControlExpiry: string;
  status: 'available' | 'in_use' | 'maintenance' | 'out_of_service';
  currentLocation?: { lat: number; lng: number; address: string };
  lastMaintenance?: string;
  nextMaintenance?: string;
  currentDriver?: { name: string; _id: string };
}

const FleetOverview: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token') || localStorage.getItem('authToken') || localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/transporteur-tms/vehicles', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVehicles(response.data.vehicles || []);
    } catch (error) {
      console.error('Erreur chargement flotte:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setShowForm(true);
  };

  const handleSave = () => {
    setShowForm(false);
    setEditingVehicle(null);
    loadVehicles();
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingVehicle(null);
  };

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          vehicle.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || vehicle.status === filterStatus;
    const matchesType = filterType === 'all' || vehicle.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const stats = {
    total: vehicles.length,
    available: vehicles.filter(v => v.status === 'available').length,
    inUse: vehicles.filter(v => v.status === 'in_use').length,
    maintenance: vehicles.filter(v => v.status === 'maintenance').length
  };

  return (
    <div className="space-y-6">
      {/* Header avec stats */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion de la Flotte</h2>
          <p className="text-gray-600 mt-1">Gérez tous vos véhicules</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Ajouter un véhicule
        </button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-sm text-gray-600">Total véhicules</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
        </div>
        <div className="bg-green-50 rounded-lg shadow-md p-4">
          <p className="text-sm text-green-700">Disponibles</p>
          <p className="text-3xl font-bold text-green-600 mt-1">{stats.available}</p>
        </div>
        <div className="bg-blue-50 rounded-lg shadow-md p-4">
          <p className="text-sm text-blue-700">En service</p>
          <p className="text-3xl font-bold text-blue-600 mt-1">{stats.inUse}</p>
        </div>
        <div className="bg-orange-50 rounded-lg shadow-md p-4">
          <p className="text-sm text-orange-700">Maintenance</p>
          <p className="text-3xl font-bold text-orange-600 mt-1">{stats.maintenance}</p>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher (immatriculation, marque, modèle)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tous les statuts</option>
            <option value="available">Disponible</option>
            <option value="in_use">En service</option>
            <option value="maintenance">Maintenance</option>
            <option value="out_of_service">Hors service</option>
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tous les types</option>
            <option value="van">Camionnette</option>
            <option value="truck">Camion</option>
            <option value="refrigerated">Frigorifique</option>
            <option value="motorcycle">Moto</option>
          </select>
        </div>
      </div>

      {/* Liste des véhicules */}
      {loading ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Chargement...</p>
        </div>
      ) : filteredVehicles.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-600">Aucun véhicule trouvé</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle._id}
              vehicle={vehicle}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}

      {/* Modal formulaire */}
      {showForm && (
        <VehicleForm
          vehicle={editingVehicle}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default FleetOverview;
