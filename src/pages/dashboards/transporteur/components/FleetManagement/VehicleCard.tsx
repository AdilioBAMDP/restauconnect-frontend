import React from 'react';
import { Truck, MapPin, Wrench, Calendar, Edit, Trash2, CheckCircle, AlertCircle } from 'lucide-react';

interface Vehicle {
  _id: string;
  registrationNumber: string;
  type: 'Camion' | 'Camionnette' | 'Fourgon' | 'Semi-remorque' | 'van' | 'truck' | 'refrigerated' | 'motorcycle';
  brand: string;
  model: string;
  year: number;
  status: 'available' | 'in_use' | 'maintenance' | 'out_of_service';
  capacity: {
    weight: number;
    volume: number;
  };
  fuelType?: 'Diesel' | 'Essence' | 'Électrique' | 'Hybride';
  mileage?: number;
  insuranceExpiry?: string;
  technicalControlExpiry?: string;
  lastMaintenance?: string;
  nextMaintenance?: string;
  currentDriver?: {
    name: string;
    _id: string;
  };
  currentLocation?: {
    lat: number;
    lng: number;
    address: string;
  };
}

interface VehicleCardProps {
  vehicle: Vehicle;
  onEdit?: (vehicle: Vehicle) => void;
  onDelete?: (vehicleId: string) => void;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onEdit, onDelete }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'in_use': return 'bg-blue-100 text-blue-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'out_of_service': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available': return 'Disponible';
      case 'in_use': return 'En service';
      case 'maintenance': return 'Maintenance';
      case 'out_of_service': return 'Hors service';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return <CheckCircle size={16} className="text-green-600" />;
      case 'in_use': return <Truck size={16} className="text-blue-600" />;
      case 'maintenance': return <Wrench size={16} className="text-yellow-600" />;
      case 'out_of_service': return <AlertCircle size={16} className="text-red-600" />;
      default: return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Truck className="text-blue-600" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold">{vehicle.registrationNumber}</h3>
            <p className="text-sm text-gray-600">{vehicle.brand} {vehicle.model}</p>
            <p className="text-xs text-gray-500">{vehicle.type} • {vehicle.year}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getStatusIcon(vehicle.status)}
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(vehicle.status)}`}>
            {getStatusLabel(vehicle.status)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <div>
            <p className="text-xs text-gray-500">Carburant</p>
            <p className="text-sm font-medium">{vehicle.fuelType}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Kilométrage</p>
            <p className="text-sm font-medium">{vehicle.mileage.toLocaleString()} km</p>
          </div>
        </div>
        <div className="space-y-2">
          <div>
            <p className="text-xs text-gray-500">Capacité</p>
            <p className="text-sm font-medium">{vehicle.capacity.weight} kg • {vehicle.capacity.volume} m³</p>
          </div>
          {vehicle.currentDriver && (
            <div>
              <p className="text-xs text-gray-500">Chauffeur</p>
              <p className="text-sm font-medium">{vehicle.currentDriver.name}</p>
            </div>
          )}
        </div>
      </div>

      {vehicle.currentLocation && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-start gap-2">
            <MapPin size={16} className="text-gray-600 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500 mb-1">Position actuelle</p>
              <p className="text-sm">{vehicle.currentLocation.address}</p>
            </div>
          </div>
        </div>
      )}

      {(vehicle.lastMaintenance || vehicle.nextMaintenance) && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={16} className="text-blue-600" />
            <p className="text-xs font-medium text-blue-900">Maintenance</p>
          </div>
          <div className="space-y-1 text-xs text-gray-700">
            {vehicle.lastMaintenance && (
              <p>Dernière: {new Date(vehicle.lastMaintenance).toLocaleDateString('fr-FR')}</p>
            )}
            {vehicle.nextMaintenance && (
              <p>Prochaine: {new Date(vehicle.nextMaintenance).toLocaleDateString('fr-FR')}</p>
            )}
          </div>
        </div>
      )}

      <div className="flex gap-2 pt-4 border-t">
        <button
          onClick={() => onEdit?.(vehicle)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          <Edit size={16} />
          Modifier
        </button>
        <button
          onClick={() => onDelete?.(vehicle._id)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default VehicleCard;
