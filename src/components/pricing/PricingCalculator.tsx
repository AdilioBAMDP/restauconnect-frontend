/**
 * CALCULATEUR DE TARIFICATION TRANSPORT
 * Interface professionnelle pour calcul de prix de transport
 * 
 * Conforme aux normes : cubage, zones, suppléments, TVA
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

// Types correspondant au backend
enum VehicleType {
  VUL_SMALL = 'vul_small',
  VUL_MEDIUM = 'vul_medium',
  VUL_LARGE = 'vul_large',
  TRUCK_35T = 'truck_35t',
  TRUCK_75T = 'truck_75t',
  TRUCK_19T = 'truck_19t',
  SEMI_TRAILER = 'semi_trailer',
  REFRIGERATED = 'refrigerated',
  TAUTLINER = 'tautliner',
  FLATBED = 'flatbed',
  TANKER = 'tanker'
}

enum PricingZone {
  URBAN = 'urban',
  SUBURBAN = 'suburban',
  REGIONAL = 'regional',
  NATIONAL = 'national',
  LONG_DISTANCE = 'long_distance',
  INTERNATIONAL = 'international',
  MOUNTAIN = 'mountain',
  ISLAND = 'island',
  RURAL_REMOTE = 'rural_remote'
}

enum ServiceType {
  STANDARD = 'standard',
  EXPRESS = 'express',
  APPOINTMENT = 'appointment',
  FLOOR_DELIVERY = 'floor',
  TAILGATE = 'tailgate',
  TWO_PEOPLE = 'two_people',
  NIGHT = 'night',
  WEEKEND = 'weekend',
  ADR = 'adr',
  FRAGILE = 'fragile',
  HIGH_VALUE = 'high_value',
  ASSEMBLY = 'assembly'
}

interface PricingResult {
  basePrice: number;
  weightCharge: number;
  distanceCharge: number;
  paletteCharge: number;
  zoneSuplement: number;
  vehicleSupplement: number;
  serviceSupplement: number;
  seasonSupplement: number;
  tolls: number;
  fuelSurcharge: number;
  subtotalHT: number;
  vatRate: number;
  vatAmount: number;
  totalTTC: number;
  breakdown: Array<{
    label: string;
    amount: number;
    type: 'base' | 'supplement' | 'tax' | 'fee';
  }>;
  calculatedAt: Date;
  validUntil: Date;
  currency: string;
}

const PricingCalculator: React.FC = () => {
  // État du formulaire
  const [weight, setWeight] = useState<number>(1000);
  const [volume, setVolume] = useState<number>(3);
  const [palletCount, setPalletCount] = useState<number>(0);
  const [distance, setDistance] = useState<number>(100);
  const [vehicleType, setVehicleType] = useState<VehicleType>(VehicleType.VUL_MEDIUM);
  const [zone, setZone] = useState<PricingZone>(PricingZone.REGIONAL);
  const [services, setServices] = useState<ServiceType[]>([]);
  const [floors, setFloors] = useState<number>(0);

  // État du résultat
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PricingResult | null>(null);

  // Poids taxable calculé (règle des 3 pour 1)
  const [taxableWeight, setTaxableWeight] = useState<number>(1000);

  useEffect(() => {
    // Calculer poids taxable
    const volumeWeight = (volume / 3) * 1000;
    setTaxableWeight(Math.max(weight, volumeWeight));
  }, [weight, volume]);

  const handleServiceToggle = (service: ServiceType) => {
    if (services.includes(service)) {
      setServices(services.filter(s => s !== service));
    } else {
      setServices([...services, service]);
    }
  };

  const calculatePrice = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token') || 
                    localStorage.getItem('authToken') || 
                    localStorage.getItem('token');

      const response = await axios.post(
        'http://localhost:5000/api/pricing/calculate',
        {
          weight,
          volume,
          palletCount: palletCount > 0 ? palletCount : undefined,
          distance,
          vehicleType,
          zone,
          services,
          floors: floors > 0 ? floors : undefined
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setResult(response.data.data);
        toast.success('Prix calculé avec succès !');
      } else {
        toast.error(response.data.error || 'Erreur calcul');
      }
    } catch (error: unknown) {
      console.error('Erreur calcul tarif:', error);
      if (typeof error === 'object' && error !== null && 'response' in error) {
        const err = error as { response?: { data?: { error?: string } } };
        toast.error(err.response?.data?.error || 'Erreur serveur');
      } else {
        toast.error('Erreur serveur');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        💰 Calculateur de Tarification Transport
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* FORMULAIRE */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">📦 Marchandise</h3>

          {/* Poids */}
          <div>
            <label className="block text-sm font-medium mb-1">Poids (kg)</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              min="1"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Volume */}
          <div>
            <label className="block text-sm font-medium mb-1">Volume (m³)</label>
            <input
              type="number"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              min="0.1"
              step="0.1"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Poids taxable: <span className="font-semibold">{taxableWeight.toFixed(0)} kg</span> (règle 3 pour 1)
            </p>
          </div>

          {/* Palettes */}
          <div>
            <label className="block text-sm font-medium mb-1">Nombre de palettes (optionnel)</label>
            <input
              type="number"
              value={palletCount}
              onChange={(e) => setPalletCount(Number(e.target.value))}
              min="0"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <h3 className="text-lg font-semibold border-b pb-2 mt-6">🚚 Transport</h3>

          {/* Distance */}
          <div>
            <label className="block text-sm font-medium mb-1">Distance (km)</label>
            <input
              type="number"
              value={distance}
              onChange={(e) => setDistance(Number(e.target.value))}
              min="1"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Type véhicule */}
          <div>
            <label className="block text-sm font-medium mb-1">Type de véhicule</label>
            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value as VehicleType)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value={VehicleType.VUL_SMALL}>VUL Petit (3-6m³)</option>
              <option value={VehicleType.VUL_MEDIUM}>VUL Moyen (6-12m³)</option>
              <option value={VehicleType.VUL_LARGE}>VUL Grand (12-20m³)</option>
              <option value={VehicleType.TRUCK_35T}>Porteur 3.5T</option>
              <option value={VehicleType.TRUCK_75T}>Porteur 7.5T</option>
              <option value={VehicleType.TRUCK_19T}>Porteur 19T</option>
              <option value={VehicleType.SEMI_TRAILER}>Semi-remorque</option>
              <option value={VehicleType.REFRIGERATED}>Frigorifique (+40%)</option>
              <option value={VehicleType.TAUTLINER}>Bâché (+10%)</option>
              <option value={VehicleType.FLATBED}>Plateau (+15%)</option>
              <option value={VehicleType.TANKER}>Citerne (+50%)</option>
            </select>
          </div>

          {/* Zone */}
          <div>
            <label className="block text-sm font-medium mb-1">Zone géographique</label>
            <select
              value={zone}
              onChange={(e) => setZone(e.target.value as PricingZone)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value={PricingZone.URBAN}>Urbain (centre-ville)</option>
              <option value={PricingZone.SUBURBAN}>Périurbain</option>
              <option value={PricingZone.REGIONAL}>Régional (50-200km)</option>
              <option value={PricingZone.NATIONAL}>National (200-500km)</option>
              <option value={PricingZone.LONG_DISTANCE}>Longue distance (&gt;500km)</option>
              <option value={PricingZone.INTERNATIONAL}>International/UE</option>
              <option value={PricingZone.MOUNTAIN}>Montagne (+30%)</option>
              <option value={PricingZone.ISLAND}>Île (+50%)</option>
              <option value={PricingZone.RURAL_REMOTE}>Rural isolé (+20%)</option>
            </select>
          </div>

          <h3 className="text-lg font-semibold border-b pb-2 mt-6">⚙️ Services additionnels</h3>

          {/* Services */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: ServiceType.EXPRESS, label: 'Express (+100%)', emoji: '⚡' },
              { value: ServiceType.APPOINTMENT, label: 'Rendez-vous (+20%)', emoji: '📅' },
              { value: ServiceType.NIGHT, label: 'Nocturne (+50%)', emoji: '🌙' },
              { value: ServiceType.WEEKEND, label: 'Week-end (+100%)', emoji: '📆' },
              { value: ServiceType.ADR, label: 'Dangereux (+60%)', emoji: '⚠️' },
              { value: ServiceType.FRAGILE, label: 'Fragile (+25%)', emoji: '🔸' },
              { value: ServiceType.TAILGATE, label: 'Hayon (+15%)', emoji: '🔧' },
              { value: ServiceType.TWO_PEOPLE, label: '2 personnes (+40%)', emoji: '👥' },
            ].map(({ value, label, emoji }) => (
              <button
                key={value}
                onClick={() => handleServiceToggle(value)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  services.includes(value)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {emoji} {label}
              </button>
            ))}
          </div>

          {/* Étages */}
          <div>
            <label className="block text-sm font-medium mb-1">Livraison étage (15€/étage)</label>
            <input
              type="number"
              value={floors}
              onChange={(e) => setFloors(Number(e.target.value))}
              min="0"
              max="10"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Bouton calcul */}
          <button
            onClick={calculatePrice}
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 transition-all"
          >
            {loading ? 'Calcul en cours...' : '💰 Calculer le prix'}
          </button>
        </div>

        {/* RÉSULTAT */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">📊 Résultat</h3>

          {result ? (
            <div className="space-y-4">
              {/* Prix total */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border-2 border-green-200">
                <div className="text-sm text-gray-600 mb-1">Total TTC</div>
                <div className="text-4xl font-bold text-green-700">
                  {result.totalTTC.toFixed(2)} {result.currency}
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  HT: {result.subtotalHT.toFixed(2)} € | TVA ({(result.vatRate * 100).toFixed(0)}%): {result.vatAmount.toFixed(2)} €
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Devis valide jusqu'au {new Date(result.validUntil).toLocaleDateString('fr-FR')}
                </div>
              </div>

              {/* Détails */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <h4 className="font-semibold text-sm mb-3">📋 Détails de facturation</h4>
                {result.breakdown.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-1 border-b border-gray-200 last:border-0">
                    <span className={`text-sm ${
                      item.type === 'base' ? 'text-gray-700' :
                      item.type === 'supplement' ? 'text-blue-600' :
                      item.type === 'tax' ? 'text-purple-600' :
                      'text-orange-600'
                    }`}>
                      {item.label}
                    </span>
                    <span className="font-medium">
                      {item.amount.toFixed(2)} €
                    </span>
                  </div>
                ))}
              </div>

              {/* Statistiques */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="text-xs text-gray-600">Prix base</div>
                  <div className="text-lg font-bold text-blue-700">
                    {result.basePrice.toFixed(2)} €
                  </div>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <div className="text-xs text-gray-600">Suppléments</div>
                  <div className="text-lg font-bold text-purple-700">
                    {(result.vehicleSupplement + result.zoneSuplement + result.serviceSupplement + result.seasonSupplement).toFixed(2)} €
                  </div>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg">
                  <div className="text-xs text-gray-600">Péages</div>
                  <div className="text-lg font-bold text-orange-700">
                    {result.tolls.toFixed(2)} €
                  </div>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <div className="text-xs text-gray-600">Carburant</div>
                  <div className="text-lg font-bold text-yellow-700">
                    {result.fuelSurcharge.toFixed(2)} €
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  📄 Générer devis PDF
                </button>
                <button className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  📧 Envoyer par email
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400">
              <div className="text-center">
                <div className="text-6xl mb-4">💰</div>
                <div className="text-sm">Remplissez le formulaire et cliquez sur "Calculer"</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PricingCalculator;
