import React from 'react';
import { FileText, MapPin } from 'lucide-react';

// Props à compléter lors de l'intégration
export interface CreateQuoteModalProps {
  show: boolean;
  onClose: () => void;
  formData: {
    client: string;
    clientSiret?: string;
    clientVat?: string;
    clientEmail: string;
    clientPhone: string;
    clientAddress: string;
    billingContact?: string;
    location: string;
    title?: string;
    workDate?: string;
    description?: string;
    technicalNotes?: string;
    laborCost?: number;
    materialCost?: number;
    travelCost?: number;
    urgencyFee?: number;
    adminFees?: number;
    discount?: string;
    discountType?: string;
    vatRate?: number;
    depositPercentage?: string;
    validityDays?: number;
    paymentTerms?: string;
    paymentMethods?: string;
    notes?: string;
    // Add other fields as needed
  };
  setFormData: (data: {
    client: string;
    clientSiret?: string;
    clientVat?: string;
    clientEmail: string;
    clientPhone: string;
    clientAddress: string;
    billingContact?: string;
    location: string;
    title?: string;
    workDate?: string;
    description?: string;
    technicalNotes?: string;
    laborCost?: number;
    materialCost?: number;
    travelCost?: number;
    urgencyFee?: number;
    adminFees?: number;
    discount?: string;
    discountType?: string;
    vatRate?: number;
    depositPercentage?: string;
    validityDays?: number;
    paymentTerms?: string;
    paymentMethods?: string;
    notes?: string;
    // Add other fields as needed
  }) => void;
  handleCreateQuote: () => void;
  addMaterial: () => void;
  removeMaterial: (index: number) => void;
  updateMaterial: (index: number, field: string, value: string | number) => void;
  addTask: () => void;
  removeTask: (index: number) => void;
  updateTask: (index: number, field: string, value: string | number) => void;
}

const CreateQuoteModal: React.FC<CreateQuoteModalProps> = ({
  show,
  onClose,
  formData,
  setFormData,
  handleCreateQuote,
  // Removed unused props
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-6xl mx-4 max-h-[95vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <FileText className="w-6 h-6 mr-2 text-blue-600" />
            Nouveau Devis Professionnel
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            X
          </button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); handleCreateQuote(); }}>
          {/* Informations Client & Entreprise */}
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h4 className="font-semibold text-blue-900 mb-4 flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              Informations Client & Entreprise
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom/Raison sociale *</label>
                <input type="text" value={formData.client} onChange={e => setFormData({...formData, client: e.target.value})} required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SIRET</label>
                <input type="text" value={formData.clientSiret || ''} onChange={e => setFormData({...formData, clientSiret: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">TVA Intracom</label>
                <input type="text" value={formData.clientVat || ''} onChange={e => setFormData({...formData, clientVat: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email professionnel *</label>
                <input type="email" value={formData.clientEmail} onChange={e => setFormData({...formData, clientEmail: e.target.value})} required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                <input type="tel" value={formData.clientPhone} onChange={e => setFormData({...formData, clientPhone: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Adresse complète</label>
                <input type="text" value={formData.clientAddress} onChange={e => setFormData({...formData, clientAddress: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact facturation</label>
                <input type="text" value={formData.billingContact || ''} onChange={e => setFormData({...formData, billingContact: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lieu d'intervention</label>
                <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
            </div>
          </div>
          {/* Détails du chantier & prestations */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h4 className="font-semibold text-gray-900 mb-4">Détails du chantier & prestations</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre du devis *</label>
                <input type="text" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date prévue des travaux</label>
                <input type="date" value={formData.workDate || ''} onChange={e => setFormData({...formData, workDate: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description technique *</label>
                <textarea value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} required className="w-full px-3 py-2 border border-gray-300 rounded-lg" rows={3} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes techniques / précisions</label>
                <textarea value={formData.technicalNotes || ''} onChange={e => setFormData({...formData, technicalNotes: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" rows={2} />
              </div>
            </div>
          </div>
          {/* Matériaux, tâches, main d’œuvre, calculs */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h4 className="font-semibold text-gray-900 mb-4">Matériaux, tâches, main d’œuvre</h4>
            {/* Ici, tu peux ajouter des composants dynamiques pour la liste des matériaux et tâches */}
            {/* ...existant: addMaterial, removeMaterial, updateMaterial, addTask, removeTask, updateTask... */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Coût main d’œuvre (€ HT)</label>
                <input type="number" value={formData.laborCost || 0} onChange={e => setFormData({...formData, laborCost: Number(e.target.value)})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Coût matériaux (€ HT)</label>
                <input type="number" value={formData.materialCost || 0} onChange={e => setFormData({...formData, materialCost: Number(e.target.value)})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Frais de déplacement (€ HT)</label>
                <input type="number" value={formData.travelCost || 0} onChange={e => setFormData({...formData, travelCost: Number(e.target.value)})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Frais d’urgence (€ HT)</label>
                <input type="number" value={formData.urgencyFee || 0} onChange={e => setFormData({...formData, urgencyFee: Number(e.target.value)})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Frais administratifs (€ HT)</label>
                <input type="number" value={formData.adminFees || 0} onChange={e => setFormData({...formData, adminFees: Number(e.target.value)})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Remise (€ ou %)</label>
                <input type="text" value={formData.discount || ''} onChange={e => setFormData({...formData, discount: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                <select value={formData.discountType || 'amount'} onChange={e => setFormData({...formData, discountType: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg mt-2">
                  <option value="amount">Montant (€)</option>
                  <option value="percentage">Pourcentage (%)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">TVA (%)</label>
                <input type="number" value={formData.vatRate || 20} onChange={e => setFormData({...formData, vatRate: Number(e.target.value)})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
            </div>
          </div>
          {/* Modalités de paiement, acompte, validité */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h4 className="font-semibold text-gray-900 mb-4">Modalités de paiement, acompte, validité</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Acompte demandé (€ ou %)</label>
                <input type="text" value={formData.depositPercentage || ''} onChange={e => setFormData({...formData, depositPercentage: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Validité du devis (jours)</label>
                <input type="number" value={formData.validityDays || 30} onChange={e => setFormData({...formData, validityDays: Number(e.target.value)})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Modalités de paiement</label>
                <select value={formData.paymentTerms || 'immediate'} onChange={e => setFormData({...formData, paymentTerms: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option value="immediate">Immédiat</option>
                  <option value="15days">15 jours</option>
                  <option value="30days">30 jours</option>
                  <option value="45days">45 jours</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Méthodes de paiement</label>
                <input type="text" value={formData.paymentMethods || ''} onChange={e => setFormData({...formData, paymentMethods: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Virement, chèque, espèces..." />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes / mentions particulières</label>
                <textarea value={formData.notes || ''} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" rows={2} />
              </div>
            </div>
          </div>
          {/* Mentions légales et bâtiment */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h4 className="font-semibold text-gray-900 mb-4">Mentions légales & secteur bâtiment</h4>
            <div className="space-y-2 text-sm text-gray-700">
              <div>Garantie décennale, assurance RC Pro, pénalités de retard, conditions générales de vente, etc.</div>
              <div>Respect des normes DTU, conformité aux réglementations françaises.</div>
              <div>Mentions obligatoires : TVA, SIRET, RCS, capital social, etc.</div>
              <div>Indiquer les modalités d’exécution, réception, litiges, etc.</div>
            </div>
          </div>
          <div className="flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">Annuler</button>
            <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Créer le devis professionnel</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateQuoteModal;
