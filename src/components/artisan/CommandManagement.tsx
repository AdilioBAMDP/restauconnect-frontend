import React from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Plus, 
  RefreshCw,
  Eye,
  Edit,
  CheckCircle,
  PrinterIcon
} from 'lucide-react';
import { Command } from '@/types/artisan';

interface CommandManagementProps {
  commands: Command[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onShowNewCommandModal: () => void;
  onSelectCommand: (command: Command) => void;
  onModifyCommand: (command: Command) => void;
  onValidateCommand: (command: Command) => void;
  onPrintCommand: (command: Command) => void;
}

const CommandManagement: React.FC<CommandManagementProps> = ({
  commands,
  searchTerm,
  onSearchChange,
  onShowNewCommandModal,
  onSelectCommand,
  onModifyCommand,
  onValidateCommand,
  onPrintCommand
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Gestion des Commandes</h2>
        <div className="flex space-x-2">
          <button 
            onClick={onShowNewCommandModal}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle commande
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </button>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher commande, client..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select className="border border-gray-300 rounded-lg px-3 py-2">
            <option>Tous les statuts</option>
            <option>Devis</option>
            <option>Confirmé</option>
            <option>En cours</option>
            <option>Terminé</option>
          </select>
          <select className="border border-gray-300 rounded-lg px-3 py-2">
            <option>Toutes urgences</option>
            <option>Critique</option>
            <option>Urgent</option>
            <option>Normal</option>
          </select>
          <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="h-4 w-4 mr-2" />
            Filtres avancés
          </button>
        </div>
      </div>

      {/* Liste des commandes avec statuts */}
      <div className="space-y-4">
        {commands.map((command) => (
          <motion.div
            key={command.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{command.numero}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    command.status === 'devis' ? 'bg-yellow-100 text-yellow-800' :
                    command.status === 'confirme' ? 'bg-blue-100 text-blue-800' :
                    command.status === 'en_cours' ? 'bg-green-100 text-green-800' :
                    command.status === 'termine' ? 'bg-gray-100 text-gray-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {command.status.replace('_', ' ').toUpperCase()}
                  </span>
                  {command.urgence !== 'normale' && (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      command.urgence === 'critique' ? 'bg-red-600 text-white' : 'bg-orange-600 text-white'
                    }`}>
                      {command.urgence.toUpperCase()}
                    </span>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Client</p>
                    <p className="font-medium text-gray-900">{command.clientName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Montant TTC</p>
                    <p className="font-medium text-gray-900">{command.totalTTC.toLocaleString()}€</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date intervention</p>
                    <p className="font-medium text-gray-900">
                      {command.dateIntervention?.toLocaleDateString('fr-FR') || 'À planifier'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Progression</p>
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className={`h-2 rounded-full ${
                            command.status === 'devis' ? 'bg-yellow-400 w-1/4' :
                            command.status === 'confirme' ? 'bg-blue-400 w-1/2' :
                            command.status === 'en_cours' ? 'bg-green-400 w-3/4' :
                            'bg-gray-400 w-full'
                          }`}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600">
                        {command.status === 'devis' ? '25%' :
                         command.status === 'confirme' ? '50%' :
                         command.status === 'en_cours' ? '75%' : '100%'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Détails intervention</h4>
                  <div className="space-y-1">
                    {command.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">{item.description} (x{item.quantite})</span>
                        <span className="font-medium text-gray-900">{item.totalHT.toLocaleString()}€ HT</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-2 ml-6">
                <button
                  onClick={() => onSelectCommand(command)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Voir détails
                </button>
                
                <button 
                  onClick={() => onModifyCommand(command)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </button>
                
                <button 
                  onClick={() => onValidateCommand(command)}
                  className="px-4 py-2 border border-green-300 text-green-700 rounded-lg hover:bg-green-50 flex items-center"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Valider
                </button>
                
                <button 
                  onClick={() => onPrintCommand(command)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center"
                >
                  <PrinterIcon className="h-4 w-4 mr-2" />
                  Imprimer
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CommandManagement;