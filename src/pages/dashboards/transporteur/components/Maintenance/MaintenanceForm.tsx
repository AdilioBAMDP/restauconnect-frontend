import React, { useState } from 'react';
import { Wrench, Calendar, Clock, CheckCircle, AlertTriangle, Plus } from 'lucide-react';

interface MaintenanceSchedule {
  _id: string;
  vehicleId: string;
  vehicleRegistration: string;
  maintenanceType: 'preventive' | 'corrective' | 'emergency';
  scheduledDate: string;
  description: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'overdue';
  estimatedDuration: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  technicianName?: string;
}

const MaintenanceForm: React.FC = () => {
  const [schedules, setSchedules] = useState<MaintenanceSchedule[]>([
    {
      _id: '1',
      vehicleId: 'v1',
      vehicleRegistration: 'AB-123-CD',
      maintenanceType: 'preventive',
      scheduledDate: new Date(Date.now() + 86400000 * 3).toISOString(),
      description: 'Vidange + filtre à huile',
      status: 'scheduled',
      estimatedDuration: 120,
      priority: 'medium',
      technicianName: 'Garage Central'
    },
    {
      _id: '2',
      vehicleId: 'v2',
      vehicleRegistration: 'EF-456-GH',
      maintenanceType: 'emergency',
      scheduledDate: new Date().toISOString(),
      description: 'Problème moteur - perte de puissance',
      status: 'in_progress',
      estimatedDuration: 240,
      priority: 'critical',
      technicianName: 'Dépannage Express'
    }
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    vehicleRegistration: '',
    maintenanceType: 'preventive' as 'preventive' | 'corrective' | 'emergency',
    scheduledDate: '',
    description: '',
    estimatedDuration: 60,
    priority: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    technicianName: ''
  });

  const getTypeBadge = (type: string) => {
    const badges: Record<string, { color: string; label: string; icon: string }> = {
      preventive: { color: 'bg-green-100 text-green-700', label: 'Préventif', icon: '🛡️' },
      corrective: { color: 'bg-orange-100 text-orange-700', label: 'Correctif', icon: '🔧' },
      emergency: { color: 'bg-red-100 text-red-700', label: 'Urgence', icon: '🚨' }
    };
    return badges[type] || badges.preventive;
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { color: string; label: string; icon: string }> = {
      scheduled: { color: 'bg-blue-100 text-blue-700', label: 'Planifiée', icon: '📅' },
      in_progress: { color: 'bg-yellow-100 text-yellow-700', label: 'En cours', icon: '⚙️' },
      completed: { color: 'bg-green-100 text-green-700', label: 'Terminée', icon: '✅' },
      overdue: { color: 'bg-red-100 text-red-700', label: 'En retard', icon: '⏰' }
    };
    return badges[status] || badges.scheduled;
  };

  const getPriorityBadge = (priority: string) => {
    const badges: Record<string, { color: string; label: string }> = {
      low: { color: 'bg-gray-100 text-gray-700', label: 'Basse' },
      medium: { color: 'bg-blue-100 text-blue-700', label: 'Moyenne' },
      high: { color: 'bg-orange-100 text-orange-700', label: 'Haute' },
      critical: { color: 'bg-red-100 text-red-700 font-bold', label: 'CRITIQUE' }
    };
    return badges[priority] || badges.medium;
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h${mins > 0 ? mins : ''}` : `${mins}min`;
  };

  const handleSubmit = () => {
    const mockSchedule: MaintenanceSchedule = {
      _id: Date.now().toString(),
      vehicleId: 'v' + Date.now(),
      vehicleRegistration: newSchedule.vehicleRegistration,
      maintenanceType: newSchedule.maintenanceType,
      scheduledDate: newSchedule.scheduledDate,
      description: newSchedule.description,
      status: 'scheduled',
      estimatedDuration: newSchedule.estimatedDuration,
      priority: newSchedule.priority,
      technicianName: newSchedule.technicianName
    };

    setSchedules([mockSchedule, ...schedules]);
    setNewSchedule({
      vehicleRegistration: '',
      maintenanceType: 'preventive',
      scheduledDate: '',
      description: '',
      estimatedDuration: 60,
      priority: 'medium',
      technicianName: ''
    });
    setShowCreateForm(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wrench className="h-6 w-6 text-orange-600" />
          <h3 className="text-xl font-bold text-gray-900">Planning de maintenance</h3>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Planifier maintenance
        </button>
      </div>

      {/* Formulaire de création */}
      {showCreateForm && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Nouvelle maintenance</h4>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Véhicule (immatriculation)
                </label>
                <input
                  type="text"
                  value={newSchedule.vehicleRegistration}
                  onChange={(e) => setNewSchedule({ ...newSchedule, vehicleRegistration: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  placeholder="AB-123-CD"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={newSchedule.maintenanceType}
                  onChange={(e) => setNewSchedule({ ...newSchedule, maintenanceType: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  <option value="preventive">Préventif</option>
                  <option value="corrective">Correctif</option>
                  <option value="emergency">Urgence</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={newSchedule.description}
                onChange={(e) => setNewSchedule({ ...newSchedule, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                rows={3}
                placeholder="Détails de la maintenance..."
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date planifiée</label>
                <input
                  type="datetime-local"
                  value={newSchedule.scheduledDate}
                  onChange={(e) => setNewSchedule({ ...newSchedule, scheduledDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Durée (minutes)</label>
                <input
                  type="number"
                  value={newSchedule.estimatedDuration}
                  onChange={(e) => setNewSchedule({ ...newSchedule, estimatedDuration: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priorité</label>
                <select
                  value={newSchedule.priority}
                  onChange={(e) => setNewSchedule({ ...newSchedule, priority: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  <option value="low">Basse</option>
                  <option value="medium">Moyenne</option>
                  <option value="high">Haute</option>
                  <option value="critical">Critique</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Technicien / Garage</label>
              <input
                type="text"
                value={newSchedule.technicianName}
                onChange={(e) => setNewSchedule({ ...newSchedule, technicianName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="Nom du technicien ou garage"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
              >
                Planifier
              </button>
              <button
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Liste des maintenances planifiées */}
      {schedules.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Wrench className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <p className="text-gray-500">Aucune maintenance planifiée</p>
        </div>
      ) : (
        <div className="space-y-3">
          {schedules.map((schedule) => {
            const typeBadge = getTypeBadge(schedule.maintenanceType);
            const statusBadge = getStatusBadge(schedule.status);
            const priorityBadge = getPriorityBadge(schedule.priority);

            return (
              <div key={schedule._id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <Wrench className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{schedule.vehicleRegistration}</h4>
                        <p className="text-sm text-gray-600">{schedule.description}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${typeBadge.color}`}>
                        {typeBadge.icon} {typeBadge.label}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${statusBadge.color}`}>
                        {statusBadge.icon} {statusBadge.label}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${priorityBadge.color}`}>
                        {priorityBadge.label}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500">Date</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {new Date(schedule.scheduledDate).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500">Durée estimée</p>
                        <p className="text-sm font-semibold text-gray-900">{formatDuration(schedule.estimatedDuration)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500">Technicien</p>
                        <p className="text-sm font-semibold text-gray-900">{schedule.technicianName || 'Non assigné'}</p>
                      </div>
                    </div>
                  </div>

                  {schedule.status === 'overdue' && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      <p className="text-sm text-red-800 font-medium">Maintenance en retard - action requise</p>
                    </div>
                  )}
                </div>

                <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
                  {schedule.status === 'scheduled' && (
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                      Démarrer
                    </button>
                  )}
                  {schedule.status === 'in_progress' && (
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
                      Terminer
                    </button>
                  )}
                  <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm">
                    Modifier
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MaintenanceForm;
