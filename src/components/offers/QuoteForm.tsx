import React, { useState } from 'react';
import { Plus, Trash2, Calculator } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

interface QuoteLine {
  description: string;
  quantity: number;
  unitPrice: number;
  vatRate: number;
}

interface QuoteFormProps {
  clientId: string;
  clientName: string;
  offerId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const QuoteForm: React.FC<QuoteFormProps> = ({ 
  clientId, 
  clientName,
  offerId,
  onSuccess,
  onCancel
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lines, setLines] = useState<QuoteLine[]>([
    { description: '', quantity: 1, unitPrice: 0, vatRate: 20 }
  ]);
  const [validityDays, setValidityDays] = useState(30);
  const [notes, setNotes] = useState('');

  const addLine = () => {
    setLines([...lines, { description: '', quantity: 1, unitPrice: 0, vatRate: 20 }]);
  };

  const removeLine = (index: number) => {
    if (lines.length > 1) {
      setLines(lines.filter((_, i) => i !== index));
    }
  };

  const updateLine = (index: number, field: keyof QuoteLine, value: string | number) => {
    const newLines = [...lines];
    newLines[index] = { ...newLines[index], [field]: value };
    setLines(newLines);
  };

  const calculateLineTotal = (line: QuoteLine) => {
    const subtotal = line.quantity * line.unitPrice;
    const vat = subtotal * (line.vatRate / 100);
    return subtotal + vat;
  };

  const calculateTotals = () => {
    let subtotalHT = 0;
    let totalVAT = 0;

    lines.forEach(line => {
      const lineSubtotal = line.quantity * line.unitPrice;
      const lineVAT = lineSubtotal * (line.vatRate / 100);
      subtotalHT += lineSubtotal;
      totalVAT += lineVAT;
    });

    return {
      subtotalHT,
      totalVAT,
      totalTTC: subtotalHT + totalVAT
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (lines.some(line => !line.description.trim())) {
      toast.error('Toutes les lignes doivent avoir une description');
      return;
    }

    if (lines.some(line => line.quantity <= 0 || line.unitPrice < 0)) {
      toast.error('Quantités et prix doivent être positifs');
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const validUntil = new Date();
      validUntil.setDate(validUntil.getDate() + validityDays);

      const quoteData = {
        clientId,
        offerId: offerId || undefined,
        lines: lines.map(line => ({
          description: line.description.trim(),
          quantity: Number(line.quantity),
          unitPrice: Number(line.unitPrice),
          vatRate: Number(line.vatRate)
        })),
        validUntil: validUntil.toISOString(),
        notes: notes.trim() || undefined
      };

      await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/quotes`,
        quoteData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Devis créé avec succès');
      onSuccess?.();
    } catch (error) {
      toast.error('Erreur lors de la création du devis');
      console.error('Quote creation error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totals = calculateTotals();

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Créer un devis</h2>
        <p className="text-sm text-gray-600">
          Pour: <span className="font-semibold">{clientName}</span>
        </p>
      </div>

      {/* Lignes du devis */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700">
            Lignes du devis
          </label>
          <button
            type="button"
            onClick={addLine}
            className="flex items-center gap-1 px-3 py-1 text-sm bg-orange-100 text-orange-700 rounded hover:bg-orange-200 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Ajouter une ligne
          </button>
        </div>

        <div className="space-y-3">
          {lines.map((line, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                {/* Description */}
                <div className="md:col-span-5">
                  <label className="block text-xs text-gray-600 mb-1">
                    Description *
                  </label>
                  <input
                    type="text"
                    value={line.description}
                    onChange={(e) => updateLine(index, 'description', e.target.value)}
                    required
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Ex: Installation cuisine professionnelle"
                  />
                </div>

                {/* Quantité */}
                <div className="md:col-span-2">
                  <label className="block text-xs text-gray-600 mb-1">
                    Quantité *
                  </label>
                  <input
                    type="number"
                    value={line.quantity}
                    onChange={(e) => updateLine(index, 'quantity', Number(e.target.value))}
                    required
                    min="1"
                    step="1"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                {/* Prix unitaire */}
                <div className="md:col-span-2">
                  <label className="block text-xs text-gray-600 mb-1">
                    Prix HT (€) *
                  </label>
                  <input
                    type="number"
                    value={line.unitPrice}
                    onChange={(e) => updateLine(index, 'unitPrice', Number(e.target.value))}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                {/* TVA */}
                <div className="md:col-span-2">
                  <label className="block text-xs text-gray-600 mb-1">
                    TVA (%)
                  </label>
                  <select
                    value={line.vatRate}
                    onChange={(e) => updateLine(index, 'vatRate', Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value={0}>0%</option>
                    <option value={5.5}>5.5%</option>
                    <option value={10}>10%</option>
                    <option value={20}>20%</option>
                  </select>
                </div>

                {/* Bouton supprimer */}
                <div className="md:col-span-1 flex items-end">
                  <button
                    type="button"
                    onClick={() => removeLine(index)}
                    disabled={lines.length === 1}
                    className="w-full px-2 py-2 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Supprimer la ligne"
                  >
                    <Trash2 className="w-4 h-4 mx-auto" />
                  </button>
                </div>
              </div>

              {/* Total ligne */}
              <div className="mt-2 text-right">
                <span className="text-sm text-gray-600">
                  Total TTC: <span className="font-semibold text-gray-900">
                    {calculateLineTotal(line).toFixed(2)} €
                  </span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Validité */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Validité du devis (jours)
        </label>
        <input
          type="number"
          value={validityDays}
          onChange={(e) => setValidityDays(Number(e.target.value))}
          min="1"
          max="365"
          className="w-full md:w-48 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <p className="text-xs text-gray-500 mt-1">
          Le devis sera valide jusqu'au {new Date(Date.now() + validityDays * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR')}
        </p>
      </div>

      {/* Notes */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notes additionnelles (optionnel)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="Conditions particulières, délais de livraison, etc."
        />
      </div>

      {/* Totaux */}
      <div className="mb-6 bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <Calculator className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Récapitulatif</h3>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Total HT:</span>
            <span className="font-medium text-gray-900">{totals.subtotalHT.toFixed(2)} €</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Total TVA:</span>
            <span className="font-medium text-gray-900">{totals.totalVAT.toFixed(2)} €</span>
          </div>
          <div className="flex justify-between text-lg pt-2 border-t border-gray-300">
            <span className="font-bold text-gray-900">Total TTC:</span>
            <span className="font-bold text-orange-600">{totals.totalTTC.toFixed(2)} €</span>
          </div>
        </div>
      </div>

      {/* Boutons */}
      <div className="flex items-center justify-end gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Annuler
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Création...
            </>
          ) : (
            'Créer le devis'
          )}
        </button>
      </div>
    </form>
  );
};

export default QuoteForm;
