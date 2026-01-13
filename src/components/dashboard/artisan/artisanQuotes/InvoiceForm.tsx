import React from 'react';

export interface ProfessionalInvoiceFormData {
  invoiceType: 'standard' | 'situation' | 'deposit' | 'final' | 'credit';
  situationNumber?: number;
  progressPercentage?: number;
  depositPercentage?: number;
  previouslyInvoiced?: number;
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
  paymentTerms: 'immediate' | '15days' | '30days' | '45days';
  paymentMethods?: string;
  bankDetails?: string;
  notes?: string;
}

export interface InvoiceFormProps {
  invoiceFormData: ProfessionalInvoiceFormData;
  setInvoiceFormData: (data: Partial<ProfessionalInvoiceFormData>) => void;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({
  invoiceFormData,
  setInvoiceFormData
}) => {
  // ... structure du formulaire à compléter lors de l'intégration ...
  return (
    <div>
      {/* Exemple: champs client, email, etc. */}
      <input type="text" value={invoiceFormData.client} onChange={e => setInvoiceFormData({...invoiceFormData, client: e.target.value})} />
      {/* ... autres champs ... */}
    </div>
  );
};

export default InvoiceForm;
