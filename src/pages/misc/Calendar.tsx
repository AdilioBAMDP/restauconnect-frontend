import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { ChevronLeft, ChevronRight, Clock, MapPin, User } from 'lucide-react';
import { useBusinessStore } from '@/stores/businessStore';
import { useAppStore } from '@/stores/appStore';
import { apiService } from '@/services/api';
import Header from '@/components/layout/Header';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  type: string;
  client: string;
  location: string;
  status: string;
  description: string;
}

interface CalendarPageProps {
  onNavigate: (page: string) => void;
}

const CalendarPage: React.FC<CalendarPageProps> = () => {
  const { navigateTo } = useAppStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarEvents, setCalendarEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Utilisation des vraies données du businessStore
  const { professionals, messages } = useBusinessStore();

  // Charger les événements depuis MongoDB
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setIsLoading(true);
        const events = await apiService.calendar.getEvents() as Event[];
        setCalendarEvents(events);
      } catch (error) {
        console.error('Erreur chargement calendrier:', error);
        // Fallback sur les événements générés
        setCalendarEvents(generateRealEvents());
      } finally {
        setIsLoading(false);
      }
    };
    loadEvents();
  }, []);

  // Générer des événements basés sur les vraies données (fallback)
  const generateRealEvents = (): Event[] => {
    const events: Event[] = [];
    
    // Ajouter des événements basés sur les messages récents (rendez-vous)
    const recentMessages = messages.slice(-5);
    recentMessages.forEach((msg, index) => {
      const professional = professionals.find(p => p.id === msg.fromId || p.id === msg.toId);
      if (professional) {
        const eventDate = new Date();
        eventDate.setDate(eventDate.getDate() + index + 1);
        
        events.push({
          id: `event-msg-${msg.id}`,
          title: `Rendez-vous - ${professional.name}`,
          date: eventDate.toISOString().split('T')[0],
          time: '14:00',
          duration: '1h',
          type: professional.role === 'artisan' ? 'intervention' : 'meeting',
          client: professional.name,
          location: professional.location,
          status: 'confirmed',
          description: `Rendez-vous avec ${professional.name} - ${professional.specialty}`
        });
      }
    });

    // Ajouter des événements récurrents pour le restaurant  
    const recurringEvents = [
      {
        id: 'event-rec-1',
        title: 'Réunion équipe hebdomadaire',
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        time: '09:00',
        duration: '1h',
        type: 'meeting',
        client: 'Équipe interne',
        location: 'Salle de réunion',
        status: 'confirmed',
        description: 'Réunion hebdomadaire de coordination équipe'
      },
      {
        id: 'event-rec-2',
        title: 'Livraison fournisseurs',
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        time: '08:00',
        duration: '2h',
        type: 'delivery',
        client: 'Fournisseurs',
        location: 'Zone de livraison',
        status: 'confirmed',
        description: 'Réception des livraisons quotidiennes'
      }
    ];

    return [...events, ...recurringEvents];
  };

  // Utiliser les événements MongoDB ou fallback
  const allEvents = calendarEvents.length > 0 ? calendarEvents : generateRealEvents();

  const getMonthName = (date: Date): string => {
    return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  };

  const getDaysInMonth = (date: Date): Date[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay() + 1); // Start from Monday

    const days: Date[] = [];
    for (let i = 0; i < 42; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const getEventsForDate = (date: Date): Event[] => {
    const dateStr = date.toISOString().split('T')[0];
    return allEvents.filter((event: Event) => event.date === dateStr);
  };

  const getEventColor = (type: string): string => {
    const colors: { [key: string]: string } = {
      intervention: 'bg-orange-100 text-orange-800 border-orange-200',
      meeting: 'bg-blue-100 text-blue-800 border-blue-200',
      training: 'bg-green-100 text-green-800 border-green-200',
      maintenance: 'bg-purple-100 text-purple-800 border-purple-200',
      delivery: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };
    return colors[type] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusColor = (status: string): string => {
    const colors: { [key: string]: string } = {
      confirmed: 'text-green-600',
      pending: 'text-orange-600',
      cancelled: 'text-red-600'
    };
    return colors[status] || 'text-gray-600';
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date): boolean => {
    return date.getMonth() === currentDate.getMonth();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      <Header currentPage="calendar" onNavigate={(page) => navigateTo(page as any)} />

{/* Header de navigation */}

      
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Planning & Calendrier</h1>
          <p className="text-gray-600">Gérez vos rendez-vous et interventions</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Calendar Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 capitalize">
                  {getMonthName(currentDate)}
                </h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => navigateMonth('prev')}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setCurrentDate(new Date())}
                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Aujourd'hui
                  </button>
                  <button
                    onClick={() => navigateMonth('next')}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Days of Week */}
              <div className="grid grid-cols-7 border-b border-gray-200">
                {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day) => (
                  <div key={day} className="p-4 text-center text-sm font-medium text-gray-600 bg-gray-50">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7">
                {getDaysInMonth(currentDate).map((date, index) => {
                  const dayEvents = getEventsForDate(date);
                  return (
                    <div
                      key={index}
                      className={`min-h-[120px] p-2 border-b border-r border-gray-100 ${
                        !isCurrentMonth(date) ? 'bg-gray-50' : ''
                      } ${isToday(date) ? 'bg-orange-50' : ''}`}
                    ><div
                        className={`text-sm font-medium mb-2 ${
                          isToday(date)
                            ? 'text-orange-600'
                            : !isCurrentMonth(date)
                            ? 'text-gray-400'
                            : 'text-gray-900'
                        }`}
                      >
                        {date.getDate()}
                      </div>
                      <div className="space-y-1">
                        {dayEvents.map((event) => (
                          <div
                            key={event.id}
                            className={`text-xs p-1 rounded border ${getEventColor(event.type)} truncate cursor-pointer hover:shadow-sm transition-shadow`}
                          >
                            <div className="font-medium">{event.time}</div>
                            <div className="truncate">{event.title}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Actions rapides</h3>
              <div className="space-y-3">
                <button 
                  className="w-full text-left px-4 py-3 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors"
                  onClick={() => toast.success('Créneau bloqué (démo) !')}
                >
                  <div className="font-medium">Bloquer des créneaux</div>
                  <div className="text-sm text-orange-600">Définir vos indisponibilités</div>
                </button>
                <button 
                  className="w-full text-left px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                  onClick={() => toast.success('Créneau d\'urgence ajouté (démo) !')}
                >
                  <div className="font-medium">Créneaux d'urgence</div>
                  <div className="text-sm text-blue-600">Interventions prioritaires</div>
                </button>
                <button 
                  className="w-full text-left px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                  onClick={() => toast.success('Créneau récurrent ajouté (démo) !')}
                >
                  <div className="font-medium">Répéter un créneau</div>
                  <div className="text-sm text-green-600">Rendez-vous récurrents</div>
                </button>
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Prochains RDV</h3>
              <div className="space-y-4">
                {allEvents.slice(0, 3).map((event: Event) => (
                  <div key={event.id} className="border border-gray-100 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs font-medium ${getStatusColor(event.status)}`}>
                        {event.status === 'confirmed' ? 'Confirmé' : event.status === 'pending' ? 'En attente' : 'Annulé'}
                      </span>
                      <span className="text-xs text-gray-500">{event.date}</span>
                    </div>
                    <h4 className="font-medium text-gray-900 mb-2 text-sm">{event.title}</h4>
                    <div className="space-y-1 text-xs text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-3 w-3" />
                        <span>{event.time} ({event.duration})</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <User className="h-3 w-3" />
                        <span>{event.client}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-3 w-3" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Cette semaine</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">RDV confirmés</span>
                  <span className="font-semibold">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Heures prévues</span>
                  <span className="font-semibold">28h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Taux d'occupation</span>
                  <span className="font-semibold text-green-600">78%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
