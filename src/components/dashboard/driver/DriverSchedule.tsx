import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, MapPin, CheckCircle, Plus } from 'lucide-react';

interface Shift {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  zone: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  estimatedEarnings: number;
}

interface DriverScheduleProps {
  shifts: Shift[];
  onAddShift: () => void;
}

export function DriverSchedule({ shifts, onAddShift }: DriverScheduleProps) {
  const [view, setView] = useState<'week' | 'month'>('week');

  const upcomingShifts = shifts.filter(s => 
    new Date(s.date) >= new Date() && s.status === 'scheduled'
  );

  const getStatusBadge = (status: string) => {
    const styles = {
      scheduled: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    const labels = {
      scheduled: 'Programmé',
      completed: 'Terminé',
      cancelled: 'Annulé'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const groupShiftsByWeek = () => {
    const weeks: { [key: string]: Shift[] } = {};
    shifts.forEach(shift => {
      const date = new Date(shift.date);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const weekKey = weekStart.toISOString().split('T')[0];
      
      if (!weeks[weekKey]) weeks[weekKey] = [];
      weeks[weekKey].push(shift);
    });
    return weeks;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Mon Planning</h2>
        <div className="flex items-center space-x-4">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setView('week')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                view === 'week' ? 'bg-white text-blue-600 shadow' : 'text-gray-600'
              }`}
            >
              Semaine
            </button>
            <button
              onClick={() => setView('month')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                view === 'month' ? 'bg-white text-blue-600 shadow' : 'text-gray-600'
              }`}
            >
              Mois
            </button>
          </div>
          <button
            onClick={onAddShift}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter shift</span>
          </button>
        </div>
      </div>

      {/* Upcoming Shifts Summary */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 rounded-lg shadow-lg text-white">
        <h3 className="text-lg font-semibold mb-4">Prochains shifts</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
            <CalendarIcon className="w-6 h-6 mb-2" />
            <div className="text-2xl font-bold">{upcomingShifts.length}</div>
            <p className="text-sm opacity-90">Shifts programmés</p>
          </div>
          <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
            <Clock className="w-6 h-6 mb-2" />
            <div className="text-2xl font-bold">
              {upcomingShifts.reduce((sum, s) => {
                const start = new Date(`2000-01-01T${s.startTime}`);
                const end = new Date(`2000-01-01T${s.endTime}`);
                return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
              }, 0).toFixed(0)}h
            </div>
            <p className="text-sm opacity-90">Total heures</p>
          </div>
          <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
            <CheckCircle className="w-6 h-6 mb-2" />
            <div className="text-2xl font-bold">
              {upcomingShifts.reduce((sum, s) => sum + s.estimatedEarnings, 0).toFixed(0)} €
            </div>
            <p className="text-sm opacity-90">Gains estimés</p>
          </div>
        </div>
      </div>

      {/* Shifts Calendar */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {view === 'week' ? 'Planning de la semaine' : 'Planning du mois'}
        </h3>
        
        {view === 'week' ? (
          <div className="space-y-4">
            {Object.entries(groupShiftsByWeek()).slice(0, 2).map(([weekStart, weekShifts]) => (
              <div key={weekStart} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-700 mb-3">
                  Semaine du {new Date(weekStart).toLocaleDateString('fr-FR', { 
                    day: 'numeric', 
                    month: 'long' 
                  })}
                </h4>
                <div className="space-y-2">
                  {weekShifts.map((shift, index) => (
                    <motion.div
                      key={shift.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900">
                            {new Date(shift.date).getDate()}
                          </div>
                          <div className="text-xs text-gray-600">
                            {new Date(shift.date).toLocaleDateString('fr-FR', { weekday: 'short' })}
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="font-medium text-gray-900">
                              {shift.startTime} - {shift.endTime}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span>{shift.zone}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-sm text-gray-500">Gains estimés</div>
                          <div className="text-lg font-bold text-green-600">
                            {shift.estimatedEarnings.toFixed(2)} €
                          </div>
                        </div>
                        {getStatusBadge(shift.status)}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-96 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">Vue calendrier mensuel - À intégrer</p>
          </div>
        )}
      </div>
    </div>
  );
}
