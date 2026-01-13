import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar as CalendarIcon, Clock, CheckCircle, XCircle, Coffee, Sun, Moon } from 'lucide-react';

interface TimeSlot {
  day: string;
  date: string;
  morning: 'available' | 'working' | 'unavailable';
  afternoon: 'available' | 'working' | 'unavailable';
  evening: 'available' | 'working' | 'unavailable';
  totalHours: number;
}

const DriverSchedulePage: React.FC = () => {
  const [weekView, setWeekView] = useState<'current' | 'next'>('current');

  const [schedule] = useState<TimeSlot[]>([
    {
      day: 'Lundi',
      date: '2024-10-07',
      morning: 'working',
      afternoon: 'working',
      evening: 'unavailable',
      totalHours: 8
    },
    {
      day: 'Mardi',
      date: '2024-10-08',
      morning: 'working',
      afternoon: 'working',
      evening: 'working',
      totalHours: 10
    },
    {
      day: 'Mercredi',
      date: '2024-10-09',
      morning: 'working',
      afternoon: 'available',
      evening: 'unavailable',
      totalHours: 4
    },
    {
      day: 'Jeudi',
      date: '2024-10-10',
      morning: 'working',
      afternoon: 'working',
      evening: 'unavailable',
      totalHours: 8
    },
    {
      day: 'Vendredi',
      date: '2024-10-11',
      morning: 'working',
      afternoon: 'working',
      evening: 'working',
      totalHours: 10
    },
    {
      day: 'Samedi',
      date: '2024-10-12',
      morning: 'available',
      afternoon: 'available',
      evening: 'unavailable',
      totalHours: 0
    },
    {
      day: 'Dimanche',
      date: '2024-10-13',
      morning: 'unavailable',
      afternoon: 'unavailable',
      evening: 'unavailable',
      totalHours: 0
    }
  ]);

  const totalWeekHours = schedule.reduce((sum, slot) => sum + slot.totalHours, 0);
  const workingDays = schedule.filter(s => s.totalHours > 0).length;

  const getSlotColor = (status: string) => {
    switch (status) {
      case 'working': return 'bg-green-100 text-green-700 border-green-300';
      case 'available': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'unavailable': return 'bg-gray-100 text-gray-500 border-gray-300';
      default: return 'bg-gray-100 text-gray-500 border-gray-300';
    }
  };

  const getSlotIcon = (status: string) => {
    switch (status) {
      case 'working': return <CheckCircle className="w-4 h-4" />;
      case 'available': return <Clock className="w-4 h-4" />;
      case 'unavailable': return <XCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  const getSlotLabel = (status: string) => {
    switch (status) {
      case 'working': return 'En service';
      case 'available': return 'Disponible';
      case 'unavailable': return 'Indisponible';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <button onClick={() => window.history.back()} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="w-5 h-5" />
            <span>Retour</span>
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <CalendarIcon className="w-8 h-8 text-blue-600" />
                Mon Planning
              </h1>
              <p className="text-gray-600 mt-2">Gérez vos disponibilités et horaires de travail</p>
            </div>
            <select value={weekView} onChange={(e) => setWeekView(e.target.value as 'current' | 'next')} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="current">Semaine actuelle</option>
              <option value="next">Semaine prochaine</option>
            </select>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Heures Semaine</p>
                <p className="text-3xl font-bold text-blue-600">{totalWeekHours}h</p>
              </div>
              <Clock className="w-10 h-10 text-blue-600" />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Jours Travaillés</p>
                <p className="text-3xl font-bold text-green-600">{workingDays}/7</p>
              </div>
              <CalendarIcon className="w-10 h-10 text-green-600" />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Moyenne/Jour</p>
                <p className="text-3xl font-bold text-purple-600">{Math.round(totalWeekHours / workingDays)}h</p>
              </div>
              <Coffee className="w-10 h-10 text-purple-600" />
            </div>
          </motion.div>
        </div>

        {/* Planning hebdomadaire */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Planning Hebdomadaire</h2>
            <p className="text-sm text-gray-600 mt-1">07 Oct - 13 Oct 2024</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Jour</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    <div className="flex items-center gap-2">
                      <Sun className="w-4 h-4 text-yellow-600" />
                      Matin (6h-12h)
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    <div className="flex items-center gap-2">
                      <Sun className="w-4 h-4 text-orange-600" />
                      Après-midi (12h-18h)
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    <div className="flex items-center gap-2">
                      <Moon className="w-4 h-4 text-blue-600" />
                      Soir (18h-23h)
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {schedule.map((slot, index) => (
                  <motion.tr key={slot.date} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900">{slot.day}</p>
                        <p className="text-sm text-gray-500">{new Date(slot.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium ${getSlotColor(slot.morning)}`}>
                        {getSlotIcon(slot.morning)}
                        {getSlotLabel(slot.morning)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium ${getSlotColor(slot.afternoon)}`}>
                        {getSlotIcon(slot.afternoon)}
                        {getSlotLabel(slot.afternoon)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium ${getSlotColor(slot.evening)}`}>
                        {getSlotIcon(slot.evening)}
                        {getSlotLabel(slot.evening)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-lg font-bold text-purple-600">{slot.totalHours}h</span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 border-t-2 border-gray-300">
                <tr>
                  <td className="px-6 py-4 font-bold text-gray-900">TOTAL SEMAINE</td>
                  <td colSpan={3} className="px-6 py-4 text-sm text-gray-600">{workingDays} jours travaillés</td>
                  <td className="px-6 py-4">
                    <span className="text-2xl font-bold text-purple-600">{totalWeekHours}h</span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </motion.div>

        {/* Légende */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-6 bg-white rounded-xl shadow-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Légende</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium ${getSlotColor('working')}`}>
                <CheckCircle className="w-4 h-4" />
                En service
              </span>
              <p className="text-sm text-gray-600">Vous travaillez durant ce créneau</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium ${getSlotColor('available')}`}>
                <Clock className="w-4 h-4" />
                Disponible
              </span>
              <p className="text-sm text-gray-600">Vous pouvez accepter des courses</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium ${getSlotColor('unavailable')}`}>
                <XCircle className="w-4 h-4" />
                Indisponible
              </span>
              <p className="text-sm text-gray-600">Vous êtes en repos</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DriverSchedulePage;
