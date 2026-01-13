import React, { useState, useEffect } from 'react';
import { Users, Search, TrendingUp, ShoppingBag, Calendar, Mail, Phone, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

interface Order {
  _id?: string;
  restaurantId?: string | {
    _id?: string;
    name?: string;
    businessName?: string;
    email?: string;
    phone?: string;
  };
  restaurantName?: string;
  restaurantEmail?: string;
  deliveryAddress?: string | {
    street?: string;
    city?: string;
    postalCode?: string;
    country?: string;
    _id?: string;
  };
  total?: number;
  createdAt?: string;
}

interface Client {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  status: 'active' | 'inactive';
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ClientsManagementProps {
  // Props pour compatibilité future
  clients?: any[];
}

export const ClientsManagement: React.FC<ClientsManagementProps> = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      
      if (!token) {
        toast.error('Session expirée. Veuillez vous reconnecter.');
        setIsLoading(false);
        return;
      }
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true'
        }
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const responseData = await response.json();
      
      // Gérer différents formats de réponse API
      let orders = responseData;
      if (!Array.isArray(responseData)) {
        orders = responseData.data || responseData.orders || [];
      }

      // Vérifier que orders est bien un tableau
      if (!Array.isArray(orders)) {
        console.error('Format de réponse invalide:', responseData);
        setClients([]);
        setIsLoading(false);
        return;
      }
      
      // Agréger les données par client (restaurantId)
      const clientsMap = new Map<string, Client>();

      orders.forEach((order: Order) => {
        // Protection: skip les commandes sans données valides
        if (!order || !order.restaurantId) return;
        
        // Normaliser restaurantId (peut être string ou objet)
        let restaurantId: string;
        let restaurantName: string;
        let restaurantEmail: string;
        let restaurantPhone: string;
        
        if (typeof order.restaurantId === 'string') {
          restaurantId = order.restaurantId;
          restaurantName = order.restaurantName || 'Client inconnu';
          restaurantEmail = order.restaurantEmail || '';
          restaurantPhone = '';
        } else {
          restaurantId = order.restaurantId._id || '';
          restaurantName = order.restaurantId.name || order.restaurantId.businessName || 'Client inconnu';
          restaurantEmail = order.restaurantId.email || '';
          restaurantPhone = order.restaurantId.phone || '';
        }
        
        // Skip si pas d'ID valide
        if (!restaurantId) return;
        
        // Gérer l'adresse (peut être un objet ou une chaîne)
        let addressString = '';
        try {
          if (order.deliveryAddress) {
            if (typeof order.deliveryAddress === 'string') {
              addressString = order.deliveryAddress;
            } else if (typeof order.deliveryAddress === 'object' && order.deliveryAddress !== null) {
              const addr = order.deliveryAddress;
              addressString = [addr.street, addr.postalCode, addr.city, addr.country]
                .filter(Boolean)
                .join(', ');
            }
          }
        } catch (err) {
          console.warn('Erreur traitement adresse:', err);
          addressString = '';
        }
        
        if (!clientsMap.has(restaurantId)) {
          clientsMap.set(restaurantId, {
            _id: restaurantId,
            name: restaurantName,
            email: restaurantEmail,
            phone: restaurantPhone,
            address: addressString,
            totalOrders: 0,
            totalSpent: 0,
            lastOrderDate: order.createdAt || new Date().toISOString(),
            status: 'active'
          });
        }

        const client = clientsMap.get(restaurantId)!;
        client.totalOrders += 1;
        client.totalSpent += Number(order.total) || 0;
        
        // Protection sur les dates
        try {
          const orderDate = order.createdAt ? new Date(order.createdAt) : null;
          const clientDate = client.lastOrderDate ? new Date(client.lastOrderDate) : null;
          
          if (orderDate && clientDate && orderDate > clientDate) {
            client.lastOrderDate = order.createdAt;
          } else if (orderDate && !clientDate) {
            client.lastOrderDate = order.createdAt;
          }
        } catch (err) {
          console.warn('Erreur comparaison dates:', err);
        }
      });

      const clientsArray = Array.from(clientsMap.values());
      
      // Marquer comme inactif si pas de commande depuis 30 jours
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      clientsArray.forEach(client => {
        if (new Date(client.lastOrderDate) < thirtyDaysAgo) {
          client.status = 'inactive';
        }
      });

      setClients(clientsArray);
    } catch (error) {
      console.error('Erreur lors du chargement des clients:', error);
      toast.error('Erreur lors du chargement des clients');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredClients = clients.filter(client => {
    if (!client || !searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    const name = (client.name || '').toLowerCase();
    const email = (client.email || '').toLowerCase();
    
    return name.includes(query) || email.includes(query);
  });

  // Suggestions pour l'autocomplétion (limité à 5 résultats)
  const suggestions = searchQuery.length > 0 
    ? filteredClients.slice(0, 5)
    : [];

  const handleSelectSuggestion = (client: Client) => {
    setSearchQuery(client.name);
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      handleSelectSuggestion(suggestions[selectedIndex]);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  const stats = {
    totalClients: clients.length,
    activeClients: clients.filter(c => c.status === 'active').length,
    totalRevenue: clients.reduce((sum, c) => sum + c.totalSpent, 0),
    topClient: clients.sort((a, b) => b.totalSpent - a.totalSpent)[0]
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // Si un client est sélectionné, afficher ses détails
  if (selectedClientId) {
    const selectedClient = clients.find(c => c._id === selectedClientId);
    
    if (!selectedClient) {
      return (
        <div className="text-center py-12">
          <p className="text-red-600">Client introuvable</p>
          <button
            onClick={() => setSelectedClientId(null)}
            className="mt-4 text-purple-600 hover:text-purple-800"
          >
            ← Retour aux clients
          </button>
        </div>
      );
    }
    
    return (
      <div className="space-y-6">
        <button
          onClick={() => setSelectedClientId(null)}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-800 font-medium"
        >
          ← Retour aux clients
        </button>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedClient.name || 'Client inconnu'}</h2>
                <p className="text-gray-500">{selectedClient.email || 'Email non renseigné'}</p>
                {selectedClient.phone && (
                  <p className="text-gray-500">{selectedClient.phone}</p>
                )}
              </div>
            </div>
            <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${
              selectedClient.status === 'active' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {selectedClient.status === 'active' ? '✓ Actif' : 'Inactif'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-600 font-medium">Total Commandes</p>
              <p className="text-3xl font-bold text-blue-900">{selectedClient.totalOrders || 0}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-green-600 font-medium">Montant Total</p>
              <p className="text-3xl font-bold text-green-900">{(selectedClient.totalSpent || 0).toFixed(2)}€</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-sm text-purple-600 font-medium">Panier Moyen</p>
              <p className="text-3xl font-bold text-purple-900">
                {selectedClient.totalOrders > 0 
                  ? ((selectedClient.totalSpent || 0) / selectedClient.totalOrders).toFixed(2)
                  : '0.00'}€
              </p>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-700">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span className="font-medium">Dernière commande:</span>
                <span>
                  {selectedClient.lastOrderDate 
                    ? new Date(selectedClient.lastOrderDate).toLocaleDateString('fr-FR')
                    : 'Aucune commande'}
                </span>
              </div>
              {selectedClient.address && (
                <div className="flex items-center gap-2 text-gray-700">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <span className="font-medium">Adresse:</span>
                  <span>{selectedClient.address}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Clients</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalClients}</p>
            </div>
            <Users className="w-10 h-10 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Clients Actifs</p>
              <p className="text-2xl font-bold text-green-600">{stats.activeClients}</p>
            </div>
            <TrendingUp className="w-10 h-10 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Revenu Total</p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalRevenue.toFixed(2)}€</p>
            </div>
            <ShoppingBag className="w-10 h-10 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Client VIP</p>
              <p className="text-sm font-bold text-yellow-600 truncate">{stats.topClient?.name || 'N/A'}</p>
              <p className="text-xs text-gray-500">{stats.topClient?.totalSpent.toFixed(2)}€</p>
            </div>
            <div className="text-2xl">👑</div>
          </div>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher par nom ou email..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(e.target.value.length > 0);
                setSelectedIndex(-1);
              }}
              onKeyDown={handleKeyDown}
              onFocus={() => searchQuery.length > 0 && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            
            {/* Dropdown d'autocomplétion */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {suggestions.map((client, index) => (
                  <div
                    key={client._id}
                    onClick={() => handleSelectSuggestion(client)}
                    className={`px-4 py-3 cursor-pointer hover:bg-purple-50 border-b border-gray-100 last:border-b-0 ${
                      index === selectedIndex ? 'bg-purple-50' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <Users className="h-4 w-4 text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{client.name}</p>
                        <p className="text-xs text-gray-500 truncate">{client.email}</p>
                      </div>
                      <div className="text-xs text-gray-400">
                        {client.totalOrders} cmd
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={fetchClients}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Rafraîchir
          </button>
        </div>
      </div>

      {/* Tableau des clients */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Commandes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Montant Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dernière Commande
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    {searchQuery ? 'Aucun client trouvé' : 'Aucun client pour le moment'}
                  </td>
                </tr>
              ) : (
                filteredClients.map((client) => (
                  <tr 
                    key={client._id} 
                    onClick={() => setSelectedClientId(client._id)}
                    className="hover:bg-purple-50 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-purple-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{client.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 flex items-center gap-1">
                        <Mail className="w-4 h-4 text-gray-400" />
                        {client.email}
                      </div>
                      {client.phone && (
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Phone className="w-4 h-4 text-gray-400" />
                          {client.phone}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-semibold">{client.totalOrders}</div>
                      <div className="text-xs text-gray-500">commande{client.totalOrders > 1 ? 's' : ''}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-green-600">{client.totalSpent.toFixed(2)}€</div>
                      <div className="text-xs text-gray-500">
                        {(client.totalSpent / client.totalOrders).toFixed(2)}€/commande
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-sm text-gray-900">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {new Date(client.lastOrderDate).toLocaleDateString('fr-FR')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        client.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {client.status === 'active' ? '✓ Actif' : 'Inactif'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Résumé */}
      {filteredClients.length > 0 && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">📊 Résumé</h3>
          <p className="text-sm text-gray-700">
            Vous avez <strong>{filteredClients.length}</strong> client{filteredClients.length > 1 ? 's' : ''} 
            {searchQuery && ' correspondant à votre recherche'}.
            {' '}Le montant moyen par client est de <strong>{(stats.totalRevenue / clients.length).toFixed(2)}€</strong>.
          </p>
        </div>
      )}
    </div>
  );
};
