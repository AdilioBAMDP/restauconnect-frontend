import React from 'react';
import { Receipt, X } from 'lucide-react';

// Props à compléter lors de l'intégration
export interface InvoiceFormData {
  invoiceType: string;
  situationNumber?: string;
  progressPercentage?: string;
  depositPercentage?: string;
  previouslyInvoiced?: string;
  client: string;
  clientSiret?: string;
  clientVat?: string;
  clientEmail: string;
  clientPhone?: string;
  clientAddress: string;
  billingContact?: string;
  location: string;
  title: string;
  quoteReference?: string;
  workDate?: string;
  description: string;
  technicalNotes?: string;
  laborCost: number;
  materialCost: number;
  travelCost: number;
  urgencyFee?: number;
  adminFees?: number;
  discount?: string;
  discountType?: string;
  vatRate: number;
  dueDays?: number;
  paymentTerms: string;
  paymentMethods?: string;
  bankDetails?: string;
  notes?: string;
}

export interface CreateInvoiceModalProps {
  show: boolean;
  onClose: () => void;
  invoiceFormData: InvoiceFormData;
  setInvoiceFormData: (data: Partial<InvoiceFormData>) => void;
  handleCreateDirectInvoice: () => void;
}

const CreateInvoiceModal: React.FC<CreateInvoiceModalProps> = ({
  show,
  onClose,
  invoiceFormData,
  setInvoiceFormData,
  handleCreateDirectInvoice
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-7xl mx-4 max-h-[95vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 flex items-center">
            <Receipt className="w-8 h-8 mr-3 text-green-600" />
            💼 Système de Facturation Professionnel
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); handleCreateDirectInvoice(); }}>
          {/* Type de facture */}
          <div className="bg-green-50 p-4 rounded-lg mb-6">
            <h4 className="font-semibold text-green-900 mb-4">Type de facture</h4>
            <select value={invoiceFormData.invoiceType || 'standard'} onChange={e => setInvoiceFormData({...invoiceFormData, invoiceType: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
              <option value="standard">Standard</option>
              <option value="deposit">Acompte</option>
              <option value="situation">Situation</option>
              <option value="final">Solde</option>
              <option value="credit">Avoir</option>
            </select>
            {invoiceFormData.invoiceType === 'situation' && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">N° de situation</label>
                <input type="number" value={invoiceFormData.situationNumber || ''} onChange={e => setInvoiceFormData({...invoiceFormData, situationNumber: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                <label className="block text-sm font-medium text-gray-700 mb-1 mt-2">% d’avancement</label>
                <input type="number" value={invoiceFormData.progressPercentage || ''} onChange={e => setInvoiceFormData({...invoiceFormData, progressPercentage: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                <label className="block text-sm font-medium text-gray-700 mb-1 mt-2">Déjà facturé (€)</label>
                <input type="number" value={invoiceFormData.previouslyInvoiced || ''} onChange={e => setInvoiceFormData({...invoiceFormData, previouslyInvoiced: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
            )}
            {invoiceFormData.invoiceType === 'deposit' && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">% d’acompte</label>
                <input type="number" value={invoiceFormData.depositPercentage || ''} onChange={e => setInvoiceFormData({...invoiceFormData, depositPercentage: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
            )}
          </div>
          {/* Informations client & chantier */}
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h4 className="font-semibold text-blue-900 mb-4">Informations Client & Chantier</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom/Raison sociale *</label>
                <input type="text" value={invoiceFormData.client || ''} onChange={e => setInvoiceFormData({...invoiceFormData, client: e.target.value})} required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SIRET</label>
                <input type="text" value={invoiceFormData.clientSiret || ''} onChange={e => setInvoiceFormData({...invoiceFormData, clientSiret: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">TVA Intracom</label>
                <input type="text" value={invoiceFormData.clientVat || ''} onChange={e => setInvoiceFormData({...invoiceFormData, clientVat: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email professionnel *</label>
                <input type="email" value={invoiceFormData.clientEmail || ''} onChange={e => setInvoiceFormData({...invoiceFormData, clientEmail: e.target.value})} required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                <input type="tel" value={invoiceFormData.clientPhone || ''} onChange={e => setInvoiceFormData({...invoiceFormData, clientPhone: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Adresse complète</label>
                <input type="text" value={invoiceFormData.clientAddress || ''} onChange={e => setInvoiceFormData({...invoiceFormData, clientAddress: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact facturation</label>
                <input type="text" value={invoiceFormData.billingContact || ''} onChange={e => setInvoiceFormData({...invoiceFormData, billingContact: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lieu d'intervention</label>
                <input type="text" value={invoiceFormData.location || ''} onChange={e => setInvoiceFormData({...invoiceFormData, location: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
            </div>
          </div>
          {/* Détails prestation & technique */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h4 className="font-semibold text-gray-900 mb-4">Détails prestation & technique</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre de la facture *</label>
                <input type="text" value={invoiceFormData.title || ''} onChange={e => setInvoiceFormData({...invoiceFormData, title: e.target.value})} required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Référence devis</label>
                <input type="text" value={invoiceFormData.quoteReference || ''} onChange={e => setInvoiceFormData({...invoiceFormData, quoteReference: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description technique *</label>
                <textarea value={invoiceFormData.description || ''} onChange={e => setInvoiceFormData({...invoiceFormData, description: e.target.value})} required className="w-full px-3 py-2 border border-gray-300 rounded-lg" rows={3} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes techniques / précisions</label>
                <textarea value={invoiceFormData.technicalNotes || ''} onChange={e => setInvoiceFormData({...invoiceFormData, technicalNotes: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" rows={2} />
              </div>
            </div>
          </div>
          {/* Calculs financiers */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h4 className="font-semibold text-gray-900 mb-4">Calculs financiers</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Coût main d’œuvre (€ HT)</label>
                <input type="number" value={invoiceFormData.laborCost || 0} onChange={e => setInvoiceFormData({...invoiceFormData, laborCost: Number(e.target.value)})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Coût matériaux (€ HT)</label>
                <input type="number" value={invoiceFormData.materialCost || 0} onChange={e => setInvoiceFormData({...invoiceFormData, materialCost: Number(e.target.value)})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Frais de déplacement (€ HT)</label>
                <input type="number" value={invoiceFormData.travelCost || 0} onChange={e => setInvoiceFormData({...invoiceFormData, travelCost: Number(e.target.value)})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Frais d’urgence (€ HT)</label>
                <input type="number" value={invoiceFormData.urgencyFee || 0} onChange={e => setInvoiceFormData({...invoiceFormData, urgencyFee: Number(e.target.value)})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Frais administratifs (€ HT)</label>
                <input type="number" value={invoiceFormData.adminFees || 0} onChange={e => setInvoiceFormData({...invoiceFormData, adminFees: Number(e.target.value)})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Remise (€ ou %)</label>
                <input type="text" value={invoiceFormData.discount || ''} onChange={e => setInvoiceFormData({...invoiceFormData, discount: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                <select value={invoiceFormData.discountType || 'amount'} onChange={e => setInvoiceFormData({...invoiceFormData, discountType: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg mt-2">
                  <option value="amount">Montant (€)</option>
                  <option value="percentage">Pourcentage (%)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">TVA (%)</label>
                <input type="number" value={invoiceFormData.vatRate || 20} onChange={e => setInvoiceFormData({...invoiceFormData, vatRate: Number(e.target.value)})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
            </div>
          </div>
          {/* Modalités de paiement, échéance, méthodes */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h4 className="font-semibold text-gray-900 mb-4">Modalités de paiement, échéance, méthodes</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Échéance (jours)</label>
                <input type="number" value={invoiceFormData.dueDays || 30} onChange={e => setInvoiceFormData({...invoiceFormData, dueDays: Number(e.target.value)})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Modalités de paiement</label>
                <select value={invoiceFormData.paymentTerms || 'immediate'} onChange={e => setInvoiceFormData({...invoiceFormData, paymentTerms: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option value="immediate">Immédiat</option>
                  <option value="15days">15 jours</option>
                  <option value="30days">30 jours</option>
                  <option value="45days">45 jours</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Méthodes de paiement</label>
                <input type="text" value={invoiceFormData.paymentMethods || ''} onChange={e => setInvoiceFormData({...invoiceFormData, paymentMethods: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Virement, chèque, espèces..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Coordonnées bancaires</label>
                <input type="text" value={invoiceFormData.bankDetails || ''} onChange={e => setInvoiceFormData({...invoiceFormData, bankDetails: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes / mentions particulières</label>
                <textarea value={invoiceFormData.notes || ''} onChange={e => setInvoiceFormData({...invoiceFormData, notes: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" rows={2} />
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
            <button type="submit" className="px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-200 flex items-center space-x-2 text-lg font-bold shadow-lg">
              <Receipt className="w-6 h-6" />
              <span>Créer la Facture Professionnelle</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateInvoiceModal;
