import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { logger } from '@/components/utils/logger';
import { 
  Upload, 
  FileText, 
  AlertCircle, 
  CheckCircle,
  X,
  Download,
  FileSpreadsheet,
  Database,

  Plus
} from 'lucide-react';
import { useBusinessStore, SupplierProduct } from '@/components/stores/businessStore';

interface SupplierImportProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ImportPreview {
  valid: SupplierProduct[];
  errors: { row: number; message: string; data: Record<string, string> }[];
  total: number;
}

export default function SupplierImport({ isOpen, onClose }: SupplierImportProps) {
  const { createProduct } = useBusinessStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [importPreview, setImportPreview] = useState<ImportPreview | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importComplete, setImportComplete] = useState(false);
  const [importedCount, setImportedCount] = useState(0);

  if (!isOpen) return null;

  // Génération du template CSV
  const generateTemplate = () => {
    const headers = [
      'nom',
      'categorie', 
      'sous_categorie',
      'prix',
      'type_prix',
      'stock',
      'commande_minimum',
      'description',
      'certifications',
      'disponibilite',
      'vedette',
      'specifications'
    ];

    const exampleRows = [
      [
        'Légumes Bio Premium',
        'Produits Frais',
        'Légumes Bio',
        '25',
        'kg',
        '150',
        '5',
        'Assortiment de légumes bio de saison cultivés localement',
        'Bio|Local|Éco-responsable',
        'available',
        'true',
        'Origine: Local|Conservation: 2-5°C'
      ],
      [
        'Fourneau Professionnel',
        'Équipement Cuisine',
        'Appareils de Cuisson',
        '2500',
        'unit',
        '3',
        '1',
        'Fourneau 6 feux gaz avec four professionnel',
        'CE|Garantie Pro 2 ans',
        'limited',
        'true',
        'Puissance: 6x3.5kW|Dimensions: 120x80x85cm'
      ]
    ];

    const csvContent = [
      headers.join(','),
      ...exampleRows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `template-import-catalogue-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Parser CSV
  const parseCSV = (text: string): Record<string, string>[] => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
    const rows: Record<string, string>[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values: string[] = [];
      let current = '';
      let inQuotes = false;
      
      for (let j = 0; j < lines[i].length; j++) {
        const char = lines[i][j];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      values.push(current.trim());

      if (values.length === headers.length) {
        const row: Record<string, string> = {};
        headers.forEach((header, idx) => {
          row[header] = values[idx];
        });
        rows.push(row);
      }
    }

    return rows;
  };

  // Validation et conversion des données
  const validateAndConvert = (data: Record<string, string>[]): ImportPreview => {
    const valid: SupplierProduct[] = [];
    const errors: { row: number; message: string; data: Record<string, string> }[] = [];

    data.forEach((row, index) => {
      try {
        // Validation des champs obligatoires
        if (!row.nom || !row.categorie || !row.prix) {
          errors.push({
            row: index + 2, // +2 car ligne 1 = headers, index commence à 0
            message: 'Champs obligatoires manquants (nom, catégorie, prix)',
            data: row
          });
          return;
        }

        // Conversion et validation du prix
        const price = parseFloat(row.prix);
        if (isNaN(price) || price <= 0) {
          errors.push({
            row: index + 2,
            message: 'Prix invalide',
            data: row
          });
          return;
        }

        // Validation du stock
        const stock = parseInt(row.stock) || 0;
        if (stock < 0) {
          errors.push({
            row: index + 2,
            message: 'Stock ne peut pas être négatif',
            data: row
          });
          return;
        }

        // Conversion des certifications
        const certifications = row.certifications 
          ? row.certifications.split('|').map((c: string) => c.trim())
          : [];

        // Conversion des spécifications
        const specifications: Record<string, string> = {};
        if (row.specifications) {
          row.specifications.split('|').forEach((spec: string) => {
            const [key, value] = spec.split(':').map((s: string) => s.trim());
            if (key && value) {
              specifications[key] = value;
            }
          });
        }

        // Création du produit valide
        const product: SupplierProduct = {
          _id: `import-${Date.now()}-${index}`,
          id: `import-${Date.now()}-${index}`,
          name: row.nom,
          category: row.categorie,
          subcategory: row.sous_categorie || row.categorie,
          price: price,
          priceType: (row.type_prix as 'unit' | 'kg' | 'lot' | 'service') || 'unit',
          unit: (row.type_prix as 'unit' | 'kg' | 'lot' | 'service') || 'unit',
          stock: stock,
          minOrder: parseInt(row.commande_minimum) || 1,
          description: row.description || '',
          specifications: specifications,
          certifications: certifications,
          availability: row.disponibilite === 'available' || row.disponibilite === '1',
          featured: (row.vedette === 'true' || row.vedette === '1') ? true : false,
          views: 0,
          orders: 0,
          rating: 0,
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        };

        valid.push(product);
      } catch (error) {
        errors.push({
          row: index + 2,
          message: `Erreur de traitement: ${error}`,
          data: row
        });
      }
    });

    return {
      valid,
      errors,
      total: data.length
    };
  };

  // Gestion du fichier uploadé
  const handleFileUpload = async (file: File) => {
    if (!file) return;

    setUploadedFile(file);
    setIsProcessing(true);

    try {
      const text = await file.text();
      let data: Record<string, string>[] = [];

      if (file.name.endsWith('.csv')) {
        data = parseCSV(text);
      } else if (file.name.endsWith('.json')) {
        const jsonData = JSON.parse(text);
        data = Array.isArray(jsonData) ? jsonData : jsonData.products || [];
      } else {
        throw new Error('Format de fichier non supporté');
      }

      const preview = validateAndConvert(data);
      setImportPreview(preview);
    } catch (error) {
      logger.error('Erreur lors du traitement du fichier d\'import', error);
      alert('Erreur lors du traitement du fichier. Vérifiez le format.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Import final des produits
  const handleImportConfirm = async () => {
    if (!importPreview) return;

    setIsProcessing(true);

    // Simulation d'un délai d'import
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Ajout des produits au store
    importPreview.valid.forEach(product => {
      createProduct(product);
    });

    setImportedCount(importPreview.valid.length);
    setImportComplete(true);
    setIsProcessing(false);

    // Auto-fermer après succès
    setTimeout(() => {
      setImportComplete(false);
      setImportPreview(null);
      setUploadedFile(null);
      onClose();
    }, 3000);
  };

  // Gestion drag & drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4"
      >
        {!importComplete ? (
          <>
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Importer des Produits 📥
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Ajoutez plusieurs produits à votre catalogue en une fois
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
              {!importPreview ? (
                <>
                  {/* Zone de téléchargement du template */}
                  <div className="mb-8 p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2">
                      📋 Besoin d'un modèle ?
                    </h3>
                    <p className="text-sm text-blue-700 mb-3">
                      Téléchargez notre template avec des exemples pour faciliter votre import
                    </p>
                    <button
                      onClick={generateTemplate}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger Template CSV
                    </button>
                  </div>

                  {/* Zone d'upload */}
                  <div
                    className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv,.json"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                      className="hidden"
                    />
                    
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Glissez votre fichier ici
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Ou cliquez pour sélectionner un fichier CSV ou JSON
                    </p>
                    
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Sélectionner un fichier
                    </button>

                    <div className="mt-6 flex justify-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 mr-1" />
                        CSV
                      </div>
                      <div className="flex items-center">
                        <Database className="w-4 h-4 mr-1" />
                        JSON
                      </div>
                    </div>
                  </div>

                  {/* Formats supportés */}
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center mb-2">
                        <FileSpreadsheet className="w-5 h-5 text-green-600 mr-2" />
                        <h4 className="font-semibold text-gray-900">Format CSV</h4>
                      </div>
                      <p className="text-sm text-gray-600">
                        Colonnes: nom, catégorie, prix, stock, description, etc.
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center mb-2">
                        <Database className="w-5 h-5 text-blue-600 mr-2" />
                        <h4 className="font-semibold text-gray-900">Format JSON</h4>
                      </div>
                      <p className="text-sm text-gray-600">
                        Structure complète avec métadonnées et spécifications
                      </p>
                    </div>
                  </div>

                  {isProcessing && (
                    <div className="mt-6 text-center">
                      <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-lg">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                        Traitement du fichier en cours...
                      </div>
                    </div>
                  )}
                </>
              ) : (
                /* Aperçu des données à importer */
                <>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Aperçu de l'import - {uploadedFile?.name}
                    </h3>
                    
                    {/* Statistiques */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="bg-green-50 p-4 rounded-lg text-center">
                        <p className="text-2xl font-bold text-green-600">{importPreview.valid.length}</p>
                        <p className="text-sm text-green-700">Produits valides</p>
                      </div>
                      <div className="bg-red-50 p-4 rounded-lg text-center">
                        <p className="text-2xl font-bold text-red-600">{importPreview.errors.length}</p>
                        <p className="text-sm text-red-700">Erreurs détectées</p>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg text-center">
                        <p className="text-2xl font-bold text-blue-600">{importPreview.total}</p>
                        <p className="text-sm text-blue-700">Total lignes</p>
                      </div>
                    </div>

                    {/* Erreurs */}
                    {importPreview.errors.length > 0 && (
                      <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center mb-2">
                          <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                          <h4 className="font-semibold text-red-800">Erreurs détectées</h4>
                        </div>
                        <div className="max-h-32 overflow-y-auto">
                          {importPreview.errors.slice(0, 5).map((error, idx) => (
                            <p key={idx} className="text-sm text-red-700">
                              Ligne {error.row}: {error.message}
                            </p>
                          ))}
                          {importPreview.errors.length > 5 && (
                            <p className="text-sm text-red-600 mt-2">
                              ... et {importPreview.errors.length - 5} autres erreurs
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Aperçu des produits valides */}
                    {importPreview.valid.length > 0 && (
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-3">
                          Produits à importer ({importPreview.valid.length})
                        </h4>
                        <div className="bg-gray-50 rounded-lg p-4 max-h-48 overflow-y-auto">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {importPreview.valid.slice(0, 6).map((product, idx) => (
                              <div key={idx} className="bg-white p-3 rounded border text-sm">
                                <h5 className="font-medium text-gray-900 truncate">{product.name}</h5>
                                <p className="text-gray-600">{product.category}</p>
                                <p className="text-green-600 font-bold">
                                  {product.price}€/{product.priceType}
                                </p>
                                <p className="text-xs text-gray-500">Stock: {product.stock}</p>
                              </div>
                            ))}
                          </div>
                          {importPreview.valid.length > 6 && (
                            <p className="text-center text-gray-500 text-sm mt-3">
                              ... et {importPreview.valid.length - 6} autres produits
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex justify-between">
                    <button
                      onClick={() => {
                        setImportPreview(null);
                        setUploadedFile(null);
                      }}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Choisir autre fichier
                    </button>
                    
                    <div className="flex space-x-3">
                      <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                      >
                        Annuler
                      </button>
                      {importPreview.valid.length > 0 && (
                        <button
                          onClick={handleImportConfirm}
                          disabled={isProcessing}
                          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center"
                        >
                          {isProcessing ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Import en cours...
                            </>
                          ) : (
                            <>
                              <Plus className="w-4 h-4 mr-2" />
                              Importer {importPreview.valid.length} produits
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </>
              )}
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
              Import réussi ! 🎉
            </h3>
            <p className="text-gray-600 mb-4">
              {importedCount} nouveaux produits ont été ajoutés à votre catalogue
            </p>
            <p className="text-sm text-gray-500">
              Vous pouvez maintenant les voir dans votre catalogue
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
