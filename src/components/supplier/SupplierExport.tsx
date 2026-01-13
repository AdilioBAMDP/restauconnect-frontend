import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, 
  FileText, 
  Database, 
  CheckCircle,
  Clock,
  X,
  FileSpreadsheet
} from 'lucide-react';
import { useBusinessStore } from '@/components/stores/businessStore';

interface SupplierExportProps {
  isOpen: boolean;
  onClose: () => void;
}

type ExportFormat = 'csv' | 'excel' | 'json';

export default function SupplierExport({ isOpen, onClose }: SupplierExportProps) {
  const { supplierProducts, supplierStats } = useBusinessStore();
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('csv');
  const [includeStats, setIncludeStats] = useState(true);
  const [includeSpecifications, setIncludeSpecifications] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);

  if (!isOpen) return null;

  // Fonction pour convertir les produits en CSV
  const exportToCSV = () => {
    const headers = [
      'ID',
      'Nom',
      'Catégorie',
      'Sous-catégorie', 
      'Prix',
      'Type de prix',
      'Stock',
      'Commande minimum',
      'Description',
      'Certifications',
      'Disponibilité',
      'Vedette',
      'Vues',
      'Commandes',
      'Note',
      'Date création',
      'Dernière MAJ'
    ];

    if (includeSpecifications) {
      headers.push('Spécifications');
    }

    const csvContent = [
      headers.join(','),
      ...supplierProducts.map(product => {
        const row = [
          product.id,
          `"${product.name}"`,
          `"${product.category}"`,
          `"${product.subcategory}"`,
          product.price,
          product.priceType,
          product.stock,
          product.minOrder,
          `"${product.description.replace(/"/g, '""')}"`,
          `"${product.certifications.join(' | ')}"`,
          product.availability,
          product.featured ? 'Oui' : 'Non',
          product.views,
          product.orders,
          product.rating,
          new Date(product.createdAt).toLocaleDateString('fr-FR'),
          new Date(product.lastUpdated).toLocaleDateString('fr-FR')
        ];

        if (includeSpecifications) {
          const specs = Object.entries(product.specifications)
            .map(([key, value]) => `${key}: ${value}`)
            .join(' | ');
          row.push(`"${specs}"`);
        }

        return row.join(',');
      })
    ].join('\n');

    return csvContent;
  };

  // Fonction pour exporter vers Excel (format CSV enrichi)
  const exportToExcel = () => {
    const csvData = exportToCSV();
    return csvData; // Dans un vrai système, on utiliserait une lib comme xlsx
  };

  // Fonction pour exporter vers JSON
  const exportToJSON = () => {
    const exportData = {
      metadata: {
        exportDate: new Date().toISOString(),
        totalProducts: supplierProducts.length,
        supplierStats: includeStats ? supplierStats : undefined
      },
      products: supplierProducts.map(product => ({
        ...product,
        specifications: includeSpecifications ? product.specifications : undefined
      }))
    };

    return JSON.stringify(exportData, null, 2);
  };

  // Fonction principale d'export
  const handleExport = async () => {
    setIsExporting(true);
    
    // Simulation d'un délai d'export
    await new Promise(resolve => setTimeout(resolve, 2000));

    let content = '';
    let filename = '';
    let mimeType = '';

    switch (selectedFormat) {
      case 'csv':
        content = exportToCSV();
        filename = `catalogue-produits-${new Date().toISOString().split('T')[0]}.csv`;
        mimeType = 'text/csv;charset=utf-8;';
        break;
      case 'excel':
        content = exportToExcel();
        filename = `catalogue-produits-${new Date().toISOString().split('T')[0]}.xlsx`;
        mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        break;
      case 'json':
        content = exportToJSON();
        filename = `catalogue-produits-${new Date().toISOString().split('T')[0]}.json`;
        mimeType = 'application/json;charset=utf-8;';
        break;
    }

    // Télécharger le fichier
    const blob = new Blob([content], { type: mimeType });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setIsExporting(false);
    setExportComplete(true);

    // Auto-fermer après succès
    setTimeout(() => {
      setExportComplete(false);
      onClose();
    }, 2000);
  };

  const formatOptions = [
    {
      id: 'csv' as ExportFormat,
      name: 'CSV',
      description: 'Fichier texte séparé par virgules',
      icon: <FileText className="w-6 h-6" />,
      pros: ['Compatible Excel', 'Léger', 'Facile à modifier'],
      size: `~${Math.round(supplierProducts.length * 0.5)}KB`
    },
    {
      id: 'excel' as ExportFormat,
      name: 'Excel',
      description: 'Fichier Excel (.xlsx)',
      icon: <FileSpreadsheet className="w-6 h-6" />,
      pros: ['Formatage avancé', 'Formules possibles', 'Colonnes ajustables'],
      size: `~${Math.round(supplierProducts.length * 0.8)}KB`
    },
    {
      id: 'json' as ExportFormat,
      name: 'JSON',
      description: 'Format données structurées',
      icon: <Database className="w-6 h-6" />,
      pros: ['Structure complète', 'Import facile', 'Métadonnées'],
      size: `~${Math.round(supplierProducts.length * 1.2)}KB`
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4"
      >
        {!exportComplete ? (
          <>
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Exporter Mon Catalogue 📦
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {supplierProducts.length} produits à exporter
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {/* Statistiques rapides */}
              <div className="grid grid-cols-3 gap-4 mb-8 p-4 bg-blue-50 rounded-lg">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{supplierProducts.length}</p>
                  <p className="text-sm text-gray-600">Produits</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {supplierProducts.reduce((sum, p) => sum + p.views, 0)}
                  </p>
                  <p className="text-sm text-gray-600">Vues Total</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">
                    {supplierProducts.reduce((sum, p) => sum + p.orders, 0)}
                  </p>
                  <p className="text-sm text-gray-600">Commandes</p>
                </div>
              </div>

              {/* Sélection du format */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Choisir le format d'export
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {formatOptions.map((format) => (
                    <motion.div
                      key={format.id}
                      whileHover={{ scale: 1.02 }}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        selectedFormat === format.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedFormat(format.id)}
                    >
                      <div className="flex items-center mb-3">
                        <div className={`p-2 rounded-lg mr-3 ${
                          selectedFormat === format.id ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {format.icon}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{format.name}</h4>
                          <p className="text-xs text-gray-500">{format.size}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{format.description}</p>
                      <div className="space-y-1">
                        {format.pros.map((pro, idx) => (
                          <div key={idx} className="flex items-center text-xs text-gray-500">
                            <span className="w-1 h-1 bg-green-500 rounded-full mr-2"></span>
                            {pro}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Options d'export */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Options d'export
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={includeStats}
                      onChange={(e) => setIncludeStats(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-3 text-sm text-gray-700">
                      Inclure les statistiques (vues, commandes, notes)
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={includeSpecifications}
                      onChange={(e) => setIncludeSpecifications(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-3 text-sm text-gray-700">
                      Inclure les spécifications techniques détaillées
                    </span>
                  </label>
                </div>
              </div>

              {/* Aperçu des données */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Aperçu des données à exporter
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 max-h-40 overflow-y-auto">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    {supplierProducts.slice(0, 4).map((product) => (
                      <div key={product.id} className="bg-white p-3 rounded border">
                        <h4 className="font-medium text-gray-900 truncate">{product.name}</h4>
                        <p className="text-gray-600 text-xs">{product.category}</p>
                        <p className="text-green-600 font-bold text-xs">
                          {product.price}€/{product.priceType}
                        </p>
                      </div>
                    ))}
                  </div>
                  {supplierProducts.length > 4 && (
                    <p className="text-center text-gray-500 text-sm mt-3">
                      ... et {supplierProducts.length - 4} autres produits
                    </p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleExport}
                  disabled={isExporting}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
                >
                  {isExporting ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Export en cours...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Exporter ({selectedFormat.toUpperCase()})
                    </>
                  )}
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Écran de succès */
          <div className="p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle className="w-8 h-8 text-green-600" />
            </motion.div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Export réussi ! 🎉
            </h3>
            <p className="text-gray-600 mb-4">
              Votre catalogue de {supplierProducts.length} produits a été exporté avec succès
            </p>
            <p className="text-sm text-gray-500">
              Fichier téléchargé au format {selectedFormat.toUpperCase()}
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
