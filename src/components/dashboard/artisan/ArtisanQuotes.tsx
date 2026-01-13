import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import CreateQuoteModal from './artisanQuotes/CreateQuoteModal';
import CreateInvoiceModal from './artisanQuotes/CreateInvoiceModal';
import QuotePreviewModal from './artisanQuotes/QuotePreviewModal';
import InvoicePreviewModal from './artisanQuotes/InvoicePreviewModal';
import QuoteList from './artisanQuotes/QuoteList';
import InvoiceList from './artisanQuotes/InvoiceList';

export interface Quote {
  id: string;
  title: string;
  client: string;
  clientEmail: string;
  amount: number;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  createdAt: string;
  validUntil: string;
  description: string;
  location: string;
  details: {
    laborCost: number;
    materialCost: number;
    travelCost: number;
    vat: number;
  };
}

export interface Invoice {
  id: string;
  quoteId: string;
  invoiceNumber: string;
  title: string;
  client: string;
  clientEmail: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue';
  createdAt: string;
  dueDate: string;
  paidAt?: string;
  description: string;
  location: string;
  details: {
    laborCost: number;
    materialCost: number;
    travelCost: number;
    vat: number;
  };
}

// Interface ultra-professionnelle pour les devis
interface ProfessionalQuoteFormData {
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
  materials?: Array<{name: string, quantity: number, unitPrice: number}>;
  tasks?: Array<{description: string, duration: number, hourlyRate: number}>;
}

// Interface ultra-professionnelle pour les factures
interface ProfessionalInvoiceFormData {
  // Type et configuration
  invoiceType: 'standard' | 'situation' | 'deposit' | 'final' | 'credit';
  situationNumber?: string;
  progressPercentage?: string;
  depositPercentage?: string;
  previouslyInvoiced?: string;

  // Informations client enrichies
  client: string;
  clientSiret?: string;
  clientVat?: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  billingContact?: string;
  location: string;

  // Détails prestation
  title: string;
  quoteReference?: string;
  workDate?: string;
  description: string;
  technicalNotes?: string;

  // Calculs financiers
  laborCost: number;
  materialCost: number;
  travelCost: number;
  urgencyFee?: number;
  adminFees?: number;
  discount?: string;
  discountType?: 'amount' | 'percentage';
  vatRate: number;

  // Paiement et légal
  paymentTerms: 'immediate' | '15days' | '30days' | '45days';
  paymentMethods?: string;
  bankDetails?: string;
  notes?: string;
  materials?: Array<{name: string, quantity: number, unitPrice: number}>;
  tasks?: Array<{description: string, duration: number, hourlyRate: number}>;
}

export const ArtisanQuotes: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCreateInvoiceModal, setShowCreateInvoiceModal] = useState(false);
  const [showQuotePreview, setShowQuotePreview] = useState(false);
  const [showInvoicePreview, setShowInvoicePreview] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const [formData, setFormData] = useState<ProfessionalQuoteFormData>({
    client: '',
    clientSiret: '',
    clientVat: '',
    clientEmail: '',
    clientPhone: '',
    clientAddress: '',
    billingContact: '',
    location: '',
    title: '',
    workDate: '',
    description: '',
    technicalNotes: '',
    laborCost: 0,
    materialCost: 0,
    travelCost: 0,
    urgencyFee: 0,
    adminFees: 0,
    discount: '',
    discountType: 'amount',
    vatRate: 20,
    depositPercentage: '',
    validityDays: 30,
    paymentTerms: 'immediate',
    paymentMethods: '',
    notes: '',
    materials: [],
    tasks: []
  });

  const [invoiceFormData, setInvoiceFormData] = useState<ProfessionalInvoiceFormData>({
    invoiceType: 'standard',
    situationNumber: '',
    progressPercentage: '',
    depositPercentage: '',
    previouslyInvoiced: '',
    client: '',
    clientSiret: '',
    clientVat: '',
    clientEmail: '',
    clientPhone: '',
    clientAddress: '',
    billingContact: '',
    location: '',
    title: '',
    quoteReference: '',
    workDate: '',
    description: '',
    technicalNotes: '',
    laborCost: 0,
    materialCost: 0,
    travelCost: 0,
    urgencyFee: 0,
    adminFees: 0,
    discount: undefined,
    discountType: 'amount',
    vatRate: 20,
    paymentTerms: 'immediate',
    paymentMethods: '',
    bankDetails: '',
    notes: '',
    materials: [],
    tasks: []
  });

  const mockQuotes: Quote[] = [
    {
      id: 'quote-1',
      title: 'Réparation évier restaurant Le Comptoir',
      client: 'Restaurant Le Comptoir',
      clientEmail: 'contact@lecomptoir.fr',
      amount: 285,
      status: 'sent',
      createdAt: '2025-10-20',
      validUntil: '2025-11-20',
      description: 'Réparation système de plomberie principal + remplacement robinetterie',
      location: 'Paris 11e',
      details: {
        laborCost: 170,
        materialCost: 85,
        travelCost: 30,
        vat: 57
      }
    },
    {
      id: 'quote-2', 
      title: 'Installation lave-vaisselle industriel',
      client: 'Bistrot Central',
      clientEmail: 'info@bistrotcentral.fr',
      amount: 450,
      status: 'accepted',
      createdAt: '2025-10-18',
      validUntil: '2025-11-18',
      description: 'Installation complète lave-vaisselle + raccordements',
      location: 'Paris 9e',
      details: {
        laborCost: 270,
        materialCost: 135,
        travelCost: 45,
        vat: 90
      }
    },
    {
      id: 'quote-3',
      title: 'Maintenance préventive cuisine',
      client: 'Brasserie du Marché',
      clientEmail: 'gestion@brasseriedumarche.fr',
      amount: 180,
      status: 'draft',
      createdAt: '2025-10-25',
      validUntil: '2025-11-25',
      description: 'Maintenance trimestrielle équipements plomberie',
      location: 'Paris 12e',
      details: {
        laborCost: 108,
        materialCost: 54,
        travelCost: 18,
        vat: 36
      }
    }
  ];

  const mockInvoices: Invoice[] = [
    {
      id: 'invoice-1',
      quoteId: 'quote-2',
      invoiceNumber: 'FACT-2025-001',
      title: 'Installation lave-vaisselle industriel',
      client: 'Bistrot Central',
      clientEmail: 'info@bistrotcentral.fr',
      amount: 450,
      status: 'paid',
      createdAt: '2025-10-20',
      dueDate: '2025-11-20',
      paidAt: '2025-10-22',
      description: 'Installation complète lave-vaisselle + raccordements',
      location: 'Paris 9e',
      details: {
        laborCost: 270,
        materialCost: 135,
        travelCost: 45,
        vat: 90
      }
    },
    {
      id: 'invoice-2',
      quoteId: 'quote-1',
      invoiceNumber: 'FACT-2025-002',
      title: 'Réparation évier restaurant Le Comptoir',
      client: 'Restaurant Le Comptoir',
      clientEmail: 'contact@lecomptoir.fr',
      amount: 285,
      status: 'pending',
      createdAt: '2025-10-23',
      dueDate: '2025-11-23',
      description: 'Réparation système de plomberie principal + remplacement robinetterie',
      location: 'Paris 11e',
      details: {
        laborCost: 170,
        materialCost: 85,
        travelCost: 30,
        vat: 57
      }
    }
  ];

  const handleCreateQuote = () => {
    // ... logique inchangée ...
    // (déplacée dans le composant CreateQuoteModal si besoin)
  };

  const handleCreateDirectInvoice = () => {
    if (!invoiceFormData.title || !invoiceFormData.client || !invoiceFormData.clientEmail) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }
  // Calculs financiers simulés, pas de stockage local
    // La création de la facture est simulée, pas de stockage local
  // Removed setInvoices, as invoices state is not used
    setShowCreateInvoiceModal(false);
    resetInvoiceFormData();
    toast.success('Facture créée directement avec succès !');
  };

  // resetFormData n'est plus utilisé, suppression

  // Handlers pour les devis
  const handleEditQuote = (quote: Quote) => {
    toast.success(`Édition du devis: ${quote.title}`);
    setFormData({
      client: quote.client,
      clientEmail: quote.clientEmail,
      clientPhone: (quote as any).clientPhone || '',
      clientAddress: (quote as any).clientAddress || '',
      title: quote.title,
      description: quote.description,
      location: quote.location,
      laborCost: quote.details.laborCost,
      materialCost: quote.details.materialCost,
      travelCost: quote.details.travelCost,
      urgencyFee: 0,
      adminFees: 0,
      discount: undefined,
      discountType: 'amount',
      vatRate: 20,
      paymentTerms: '30days',
      paymentMethods: 'transfer',
      notes: '',
      materials: [],
      tasks: []
    });
    setShowCreateModal(true);
  };

  const handlePreviewQuote = (quote: Quote) => {
    setSelectedQuote(quote);
    setShowQuotePreview(true);
  };

  const handleDownloadQuote = (quote: Quote) => {
    toast.success(`Téléchargement du PDF: ${quote.title}`);
    const link = document.createElement('a');
    link.href = `/api/artisan/quotes/${quote.id}/pdf`;
    link.download = `devis-${quote.id}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSendQuote = (quoteId: string) => {
    toast.success('Devis envoyé au client par email !');
  };

  const handleDeleteQuote = (quoteId: string) => {
    if (confirm('Voulez-vous vraiment supprimer ce devis ?')) {
      toast.success('Devis supprimé');
    }
  };

  const handleCreateInvoiceFromQuote = (quote: Quote) => {
    toast.success(`Génération de facture à partir du devis: ${quote.title}`);
    setInvoiceFormData({
      invoiceType: 'standard',
      client: quote.client,
      clientEmail: quote.clientEmail,
      clientPhone: '',
      clientAddress: quote.location,
      title: quote.title,
      description: quote.description,
      location: quote.location,
      laborCost: quote.details.laborCost,
      materialCost: quote.details.materialCost,
      travelCost: quote.details.travelCost,
      urgencyFee: 0,
      adminFees: 0,
      discount: undefined,
      discountType: 'amount',
      vatRate: 20,
      paymentTerms: '30days',
      paymentMethods: 'transfer',
      bankDetails: '',
      situationNumber: '',
      progressPercentage: '',
      depositPercentage: '',
      notes: ''
    });
    setShowCreateInvoiceModal(true);
  };

  const handlePreviewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowInvoicePreview(true);
  };

  const handleDownloadInvoice = (invoice: Invoice) => {
    toast.success(`Téléchargement du PDF: ${invoice.invoiceNumber}`);
    const link = document.createElement('a');
    link.href = `/api/artisan/invoices/${invoice.id}/pdf`;
    link.download = `facture-${invoice.invoiceNumber}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetInvoiceFormData = () => {
    setInvoiceFormData({
      invoiceType: 'standard',
      situationNumber: '',
      progressPercentage: '',
      depositPercentage: '',
      previouslyInvoiced: '',
      client: '',
      clientSiret: '',
      clientVat: '',
      clientEmail: '',
      clientPhone: '',
      clientAddress: '',
      billingContact: '',
      location: '',
      title: '',
      quoteReference: '',
      workDate: '',
      description: '',
      technicalNotes: '',
      laborCost: 0,
      materialCost: 0,
      travelCost: 0,
      urgencyFee: 0,
      adminFees: 0,
      discount: undefined,
      discountType: 'amount',
      vatRate: 20,
      paymentTerms: '30days',
      paymentMethods: 'transfer',
      bankDetails: '',
      notes: '',
      materials: [],
      tasks: []
    });
  };

  return (
    <>
      <div className="flex justify-end space-x-4 mb-6">
        <button
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          onClick={() => setShowCreateModal(true)}
        >
          + Nouveau Devis
        </button>
        <button
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
          onClick={() => setShowCreateInvoiceModal(true)}
        >
          + Nouvelle Facture
        </button>
      </div>
      {/* Tab Content & Modals handled by subcomponents */}
      <CreateQuoteModal
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        formData={formData}
        setFormData={setFormData}
        handleCreateQuote={handleCreateQuote}
        addMaterial={() => {}}
        removeMaterial={() => {}}
        updateMaterial={() => {}}
        addTask={() => {}}
        removeTask={() => {}}
        updateTask={() => {}}
      />
      <CreateInvoiceModal
        show={showCreateInvoiceModal}
        onClose={() => setShowCreateInvoiceModal(false)}
        invoiceFormData={invoiceFormData}
        setInvoiceFormData={(data) => setInvoiceFormData(prev => ({
          ...prev,
          ...data,
          invoiceType: (data.invoiceType ?? prev.invoiceType) as ProfessionalInvoiceFormData['invoiceType'],
          discountType: (data.discountType === 'amount' || data.discountType === 'percentage') ? data.discountType : prev.discountType,
          paymentTerms: (data.paymentTerms === 'immediate' || data.paymentTerms === '15days' || data.paymentTerms === '30days' || data.paymentTerms === '45days') ? data.paymentTerms : prev.paymentTerms,
        }))}
        handleCreateDirectInvoice={handleCreateDirectInvoice}
      />
      <QuoteList
        quotes={mockQuotes}
        onEdit={handleEditQuote}
        onPreview={handlePreviewQuote}
        onDownload={handleDownloadQuote}
        onSend={handleSendQuote}
        onDelete={handleDeleteQuote}
        onCreateInvoice={handleCreateInvoiceFromQuote}
      />
      <InvoiceList
        invoices={mockInvoices}
        onPreview={handlePreviewInvoice}
        onDownload={handleDownloadInvoice}
        onRemind={(id) => toast.success('Rappel envoyé au client')}
        onMarkPaid={(id) => toast.success('Facture marquée comme payée')}
      />

      {/* Modales de prévisualisation */}
      <AnimatePresence>
        {showQuotePreview && selectedQuote && (
          <QuotePreviewModal
            quote={selectedQuote}
            onClose={() => setShowQuotePreview(false)}
            onDownload={() => {
              handleDownloadQuote(selectedQuote);
              setShowQuotePreview(false);
            }}
            onSend={selectedQuote.status === 'draft' ? () => {
              handleSendQuote(selectedQuote.id);
              setShowQuotePreview(false);
            } : undefined}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showInvoicePreview && selectedInvoice && (
          <InvoicePreviewModal
            invoice={selectedInvoice}
            onClose={() => setShowInvoicePreview(false)}
            onDownload={() => {
              handleDownloadInvoice(selectedInvoice);
              setShowInvoicePreview(false);
            }}
            onRemind={selectedInvoice.status === 'pending' ? () => {
              toast.success('Rappel envoyé au client');
              setShowInvoicePreview(false);
            } : undefined}
          />
        )}
      </AnimatePresence>
    </>
  );
};
