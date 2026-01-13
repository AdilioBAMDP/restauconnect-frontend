import React from 'react';

export interface ProfessionalQuoteFormData {
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

export interface QuoteFormProps {
  formData: ProfessionalQuoteFormData;
  setFormData: (data: Partial<ProfessionalQuoteFormData>) => void;
  addMaterial: () => void;
  removeMaterial: (index: number) => void;
  updateMaterial: (index: number, field: string, value: string | number) => void;
  addTask: () => void;
  removeTask: (index: number) => void;
  updateTask: (index: number, field: string, value: string | number) => void;
}

const QuoteForm: React.FC<QuoteFormProps> = ({
  formData,
  setFormData
}) => {
  // ... structure du formulaire à compléter lors de l'intégration ...
  return (
    <div>
      {/* Exemple: champs client, email, etc. */}
      <input type="text" value={formData.client} onChange={e => setFormData({...formData, client: e.target.value})} />
      {/* ... autres champs ... */}
    </div>
  );
};

export default QuoteForm;
