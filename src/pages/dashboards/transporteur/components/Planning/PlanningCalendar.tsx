import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer, Event as BigCalendarEvent, View } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/fr';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { 
  CalendarIcon, 
  TruckIcon, 
  UserIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/solid';

moment.locale('fr');
const localizer = momentLocalizer(moment);

interface DeliveryEvent extends BigCalendarEvent {
  id: string;
  deliveryId: string;
  status: string;
  priority: string;
  distance: number;
  clientName: string;
  pickupAddress: string;
  deliveryAddress: string;
  assignedVehicle?: string;
  assignedDriver?: string;
}

interface Route {
  _id: string;
  name: string;
  vehicleId: string;
  driverId?: string;
  deliveries: string[];
  status: string;
}

interface PlanningData {
  _id: string;
  date: Date;
  availableVehicles: Array<{
    vehicleId: string;
    registrationNumber: string;
    type: string;
    capacity: number;
    status: string;
    assignedDeliveries: string[];
  }>;
  availableDrivers: Array<{
    driverId: string;
    name: string;
    status: string;
    maxHours: number;
    assignedHours: number;
    assignedRoute?: string;
  }>;
  pendingDeliveries: Array<{
    deliveryId: string;
    priority: string;
    location: { lat: number; lng: number };
    status: string;
  }>;
  routes: Route[];
  stats: {
    totalDeliveries: number;
    assignedDeliveries: number;
    unassignedDeliveries: number;
    vehicleUtilization: number;
    driverUtilization: number;
  };
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercepteur pour ajouter le token dynamiquement
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token') || 
                localStorage.getItem('authToken') || 
                localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const PlanningCalendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState<View>('day');
  const [events, setEvents] = useState<DeliveryEvent[]>([]);
  const [planning, setPlanning] = useState<PlanningData | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<DeliveryEvent | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);

  // Charger le planning pour la date sélectionnée
  useEffect(() => {
    loadPlanning(selectedDate);
  }, [selectedDate]);

  const loadPlanning = async (date: Date) => {
    setLoading(true);
    try {
      const dateStr = moment(date).format('YYYY-MM-DD');
      const response = await api.get(`/transporteur-tms/planning/${dateStr}`);
      
      if (response.data.success) {
        setPlanning(response.data.planning);
        
        // Convertir les livraisons en événements calendrier
        const deliveryEvents: DeliveryEvent[] = response.data.planning.pendingDeliveries.map((delivery: PlanningData['pendingDeliveries'][number]) => {
          // Trouver le véhicule assigné
          const assignedVehicle = response.data.planning.availableVehicles.find(
            (v: PlanningData['availableVehicles'][number]) => v.assignedDeliveries.includes(delivery.deliveryId)
          );

          return {
            id: delivery.deliveryId,
            deliveryId: delivery.deliveryId,
            title: `Livraison ${delivery.priority === 'urgent' ? '🔥 ' : ''}`,
            start: new Date(date),
            end: new Date(date.getTime() + 2 * 60 * 60 * 1000), // +2h par défaut
            status: delivery.status,
            priority: delivery.priority,
            distance: 0,
            clientName: 'Client',
            pickupAddress: '',
            deliveryAddress: '',
            assignedVehicle: assignedVehicle?.registrationNumber
          };
        });

        setEvents(deliveryEvents);
      }
    } catch {
      toast.error('Erreur chargement planning');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSlot = () => {
    // TODO: Implémenter la création de livraison
  };

  const handleSelectEvent = (event: DeliveryEvent) => {
    setSelectedEvent(event);
    setShowAssignModal(true);
  };

  const handleAssignDelivery = async (vehicleId: string) => {
    if (!selectedEvent || !planning) return;

    try {
      const response = await api.put(`/transporteur-tms/planning/${planning._id}/assign`, {
        deliveryId: selectedEvent.deliveryId,
        vehicleId
      });

      if (response.data.success) {
        toast.success('Livraison assignée');
        loadPlanning(selectedDate);
        setShowAssignModal(false);
      }
    } catch {
      toast.error('Erreur assignation livraison');
    }
  };

  const eventStyleGetter = (event: DeliveryEvent) => {
    let backgroundColor = '#3b82f6'; // blue-500
    
    switch (event.priority) {
      case 'urgent':
        backgroundColor = '#ef4444'; // red-500
        break;
      case 'high':
        backgroundColor = '#f59e0b'; // amber-500
        break;
      case 'normal':
        backgroundColor = '#3b82f6'; // blue-500
        break;
      case 'low':
        backgroundColor = '#6b7280'; // gray-500
        break;
    }

    if (event.assignedVehicle) {
      backgroundColor = '#10b981'; // green-500
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '6px',
        opacity: 0.9,
        color: 'white',
        border: '0px',
        display: 'block',
        fontSize: '13px',
        padding: '4px 8px'
      }
    };
  };

  const handleNavigate = (newDate: Date, newView: View) => {
    setSelectedDate(newDate);
    setView(newView);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-6">
        {/* Header avec stats */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <CalendarIcon className="h-8 w-8 text-blue-600" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Planning Dispatch</h2>
                <p className="text-sm text-gray-500">
                  {moment(selectedDate).format('dddd D MMMM YYYY')}
                </p>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={() => loadPlanning(selectedDate)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                disabled={loading}
              >
                {loading ? 'Chargement...' : 'Actualiser'}
              </button>
            </div>
          </div>

          {/* Stats rapides */}
          {planning && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <TruckIcon className="h-6 w-6 text-blue-600" />
                  <span className="text-2xl font-bold text-blue-600">
                    {planning.stats.totalDeliveries}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">Total livraisons</p>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <CheckCircleIcon className="h-6 w-6 text-green-600" />
                  <span className="text-2xl font-bold text-green-600">
                    {planning.stats.assignedDeliveries}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">Assignées</p>
              </div>

              <div className="bg-amber-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <XCircleIcon className="h-6 w-6 text-amber-600" />
                  <span className="text-2xl font-bold text-amber-600">
                    {planning.stats.unassignedDeliveries}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">Non assignées</p>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <TruckIcon className="h-6 w-6 text-purple-600" />
                  <span className="text-2xl font-bold text-purple-600">
                    {planning.stats.vehicleUtilization.toFixed(0)}%
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">Véhicules</p>
              </div>

              <div className="bg-indigo-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <UserIcon className="h-6 w-6 text-indigo-600" />
                  <span className="text-2xl font-bold text-indigo-600">
                    {planning.stats.driverUtilization.toFixed(0)}%
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">Chauffeurs</p>
              </div>
            </div>
          )}
        </div>

        {/* Calendrier */}
        <div className="bg-white rounded-xl shadow-sm p-6" style={{ height: '700px' }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            view={view}
            onView={setView}
            date={selectedDate}
            onNavigate={handleNavigate}
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            selectable
            eventPropGetter={eventStyleGetter}
            messages={{
              next: 'Suivant',
              previous: 'Précédent',
              today: "Aujourd'hui",
              month: 'Mois',
              week: 'Semaine',
              day: 'Jour',
              agenda: 'Agenda',
              date: 'Date',
              time: 'Heure',
              event: 'Livraison',
              noEventsInRange: 'Aucune livraison sur cette période'
            }}
            formats={{
              timeGutterFormat: 'HH:mm',
              eventTimeRangeFormat: ({ start, end }, culture, localizer) =>
                `${localizer?.format(start, 'HH:mm', culture)} - ${localizer?.format(end, 'HH:mm', culture)}`,
              agendaTimeRangeFormat: ({ start, end }, culture, localizer) =>
                `${localizer?.format(start, 'HH:mm', culture)} - ${localizer?.format(end, 'HH:mm', culture)}`,
              dayHeaderFormat: 'dddd D MMMM',
              dayRangeHeaderFormat: ({ start, end }, culture, localizer) =>
                `${localizer?.format(start, 'D MMM', culture)} - ${localizer?.format(end, 'D MMM', culture)}`
            }}
          />
        </div>

        {/* Ressources disponibles */}
        {planning && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Véhicules */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <TruckIcon className="h-5 w-5 mr-2 text-blue-600" />
                Véhicules disponibles
              </h3>
              <div className="space-y-3">
                {planning.availableVehicles.map((vehicle) => (
                  <div
                    key={vehicle.vehicleId}
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">{vehicle.registrationNumber}</p>
                        <p className="text-sm text-gray-500">{vehicle.type} - {vehicle.capacity}kg</p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          vehicle.status === 'free' 
                            ? 'bg-green-100 text-green-800'
                            : vehicle.status === 'partially-assigned'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {vehicle.status === 'free' ? 'Libre' : 
                           vehicle.status === 'partially-assigned' ? 'Partiel' : 'Complet'}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                          {vehicle.assignedDeliveries.length} livraison(s)
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chauffeurs */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <UserIcon className="h-5 w-5 mr-2 text-indigo-600" />
                Chauffeurs disponibles
              </h3>
              <div className="space-y-3">
                {planning.availableDrivers.map((driver) => (
                  <div
                    key={driver.driverId}
                    className="border border-gray-200 rounded-lg p-4 hover:border-indigo-500 transition"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">{driver.name}</p>
                        <p className="text-sm text-gray-500">
                          {driver.assignedHours}h / {driver.maxHours}h
                        </p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          driver.status === 'available' 
                            ? 'bg-green-100 text-green-800'
                            : driver.status === 'assigned'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {driver.status === 'available' ? 'Disponible' : 
                           driver.status === 'assigned' ? 'Assigné' : 'Indispo'}
                        </span>
                        <div className="w-24 bg-gray-200 rounded-full h-2 mt-2">
                          <div
                            className="bg-indigo-600 h-2 rounded-full"
                            style={{ width: `${(driver.assignedHours / driver.maxHours) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Modal d'assignation */}
        {showAssignModal && selectedEvent && planning && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Assigner la livraison
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Véhicule
                  </label>
                  <select
                    id="vehicle-select"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  >
                    <option value="">Sélectionner un véhicule</option>
                    {planning.availableVehicles
                      .filter(v => v.status !== 'fully-assigned')
                      .map(vehicle => (
                        <option key={vehicle.vehicleId} value={vehicle.vehicleId}>
                          {vehicle.registrationNumber} - {vehicle.type}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chauffeur
                  </label>
                  <select
                    id="driver-select"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  >
                    <option value="">Sélectionner un chauffeur</option>
                    {planning.availableDrivers
                      .filter(d => d.status === 'available')
                      .map(driver => (
                        <option key={driver.driverId} value={driver.driverId}>
                          {driver.name} ({driver.assignedHours}h/{driver.maxHours}h)
                        </option>
                      ))}
                  </select>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowAssignModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => {
                      const vehicleSelect = document.getElementById('vehicle-select') as HTMLSelectElement;
                      const vehicleId = vehicleSelect?.value;
                      if (vehicleId) {
                        handleAssignDelivery(vehicleId);
                      } else {
                        toast.error('Veuillez sélectionner un véhicule');
                      }
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Assigner
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DndProvider>
  );
};

export default PlanningCalendar;
