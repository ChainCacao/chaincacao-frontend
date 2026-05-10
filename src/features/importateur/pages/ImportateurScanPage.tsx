import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, QrCode, Search, MapPin, Calendar,
  ShieldCheck, AlertCircle, CheckCircle2, Eye, Download,
  Package, Users, Hash, Info, X, ChevronRight,
  Globe2, Award, Truck, Factory
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface LotTraceability {
  id: string;
  weight: number;
  origin: string;
  status: string;
  date: string;
  farmer: string;
  cooperative: string;
  transformer: string;
  exporter: string;
  certifier: string;
  quality: string;
  eudrCompliant: boolean;
  blockchainHash: string;
  qrCode: string;
  certifications: string[];
  gpsCoordinates: string;
  documents: {
    farmerCertificate: string;
    cooperativeValidation: string;
    transformationProof: string;
    certificationDocument: string;
    exportDocument: string;
  };
  journey: {
    step: string;
    actor: string;
    date: string;
    status: string;
    hash: string;
  }[];
}

export default function ImportateurScanPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLot, setSelectedLot] = useState<LotTraceability | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Données simulées de traçabilité complète
  const traceabilityData: LotTraceability[] = [
    {
      id: 'LOT-2024-015',
      weight: 500,
      origin: 'Kara, Togo',
      status: 'certified',
      date: '2024-03-28',
      farmer: 'Koffi Amouzou',
      cooperative: 'Coopérative Kara',
      transformer: 'Togo Chocoterie Industrielle',
      exporter: 'Togo Cacao Export International',
      certifier: 'Bureau de Certification Togolais',
      quality: 'Premium',
      eudrCompliant: true,
      blockchainHash: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      qrCode: 'LOT-2024-015-QR',
      certifications: ['Bio', 'Fair Trade', 'Rainforest Alliance'],
      gpsCoordinates: '9.5594°N, 0.7831°E',
      documents: {
        farmerCertificate: 'CERT-FARMER-2024-015.pdf',
        cooperativeValidation: 'VALID-COOP-2024-015.pdf',
        transformationProof: 'PROOF-TRANS-2024-015.pdf',
        certificationDocument: 'CERT-FINAL-2024-015.pdf',
        exportDocument: 'EXPORT-DOC-2024-015.pdf'
      },
      journey: [
        {
          step: 'Récolte',
          actor: 'Koffi Amouzou',
          date: '2024-03-15',
          status: 'completed',
          hash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c'
        },
        {
          step: 'Validation Coopérative',
          actor: 'Coopérative Kara',
          date: '2024-03-20',
          status: 'completed',
          hash: '0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d'
        },
        {
          step: 'Transformation',
          actor: 'Togo Chocoterie Industrielle',
          date: '2024-03-25',
          status: 'completed',
          hash: '0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e'
        },
        {
          step: 'Certification',
          actor: 'Bureau de Certification Togolais',
          date: '2024-03-27',
          status: 'completed',
          hash: '0x4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f'
        },
        {
          step: 'Exportation',
          actor: 'Togo Cacao Export International',
          date: '2024-03-28',
          status: 'completed',
          hash: '0x5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b'
        }
      ]
    }
  ];

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  const handleScan = async () => {
    setScanning(true);
    
    try {
      // Simulation de scan QR code
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simuler la recherche du lot scanné
      const scannedLot = traceabilityData[0]; // Pour la démo
      
      setSelectedLot(scannedLot);
      toast.success('Lot trouvé ! Affichage des détails...');
      
    } catch (error) {
      toast.error('Erreur lors du scan');
    } finally {
      setScanning(false);
    }
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      toast.error('Veuillez entrer un numéro de lot');
      return;
    }

    const foundLot = traceabilityData.find(lot => 
      lot.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lot.qrCode.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (foundLot) {
      setSelectedLot(foundLot);
      toast.success('Lot trouvé !');
    } else {
      toast.error('Lot non trouvé');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-emerald-600 bg-emerald-50';
      case 'pending': return 'text-amber-600 bg-amber-50';
      case 'rejected': return 'text-red-600 bg-red-50';
      case 'certified': return 'text-blue-600 bg-blue-50';
      default: return 'text-cacao/60 bg-cacao/10';
    }
  };

  const getStepIcon = (step: string) => {
    switch (step) {
      case 'Récolte': return <Package size={16} />;
      case 'Validation Coopérative': return <Users size={16} />;
      case 'Transformation': return <Factory size={16} />;
      case 'Certification': return <Award size={16} />;
      case 'Exportation': return <Truck size={16} />;
      default: return <Package size={16} />;
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-cream flex items-center justify-center text-cacao font-bold">
      Chargement de la page de scan...
    </div>
  );

  return (
    <div className="min-h-screen bg-cream/30">
      {/* Header */}
      <nav className="bg-white border-b border-cacao/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/verifier')}
                className="p-2.5 bg-white shadow-sm border border-cacao/10 rounded-xl text-cacao hover:text-gold transition-all"
              >
                <ArrowLeft size={20} />
              </motion.button>
              <div>
                <h1 className="text-xl font-serif font-black text-cacao tracking-tight">Scan QR Code</h1>
                <p className="text-[11px] font-bold text-gold/70 uppercase tracking-[0.2em]">Traçabilité Complète</p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Info Section */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <Info className="text-emerald-600 mt-0.5" size={20} />
            <div>
              <h3 className="text-sm font-bold text-emerald-800 mb-2">
                🌍 Traçabilité Complète pour Importateurs
              </h3>
              <div className="space-y-1 text-xs text-emerald-700">
                <p>• <span className="font-bold">Transparence :</span> Accès complet au parcours du lot</p>
                <p>• <span className="font-bold">Authenticité :</span> Hash blockchain pour chaque étape</p>
                <p>• <span className="font-bold">Conformité :</span> Preuves EUDR et certifications</p>
                <p>• <span className="font-bold">Anti-fraude :</span> QR code unique et immuable</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scan Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Scan QR Code */}
          <div className="bg-white rounded-2xl border border-cacao/10 p-6">
            <h2 className="text-lg font-serif font-black text-cacao mb-6 flex items-center gap-2">
              <QrCode size={20} />
              Scanner un QR Code
            </h2>

            <div className="space-y-6">
              {/* Scan Area */}
              <div className="border-2 border-dashed border-cacao/20 rounded-2xl p-8 text-center">
                <div className="w-32 h-32 bg-cacao/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <QrCode size={48} className="text-cacao/40" />
                </div>
                <p className="text-sm text-cacao/60 mb-4">
                  Positionnez le QR code dans la zone de scan
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleScan}
                  disabled={scanning}
                  className={`
                    px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 mx-auto
                    ${scanning 
                      ? 'bg-cacao/20 text-cacao/60 cursor-not-allowed' 
                      : 'bg-gold text-cacao hover:bg-gold/90 shadow-lg'
                    }
                  `}
                >
                  {scanning ? (
                    <>
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Scan en cours...
                    </>
                  ) : (
                    <>
                      <QrCode size={18} />
                      Scanner le QR Code
                    </>
                  )}
                </motion.button>
              </div>

              {/* Alternative Search */}
              <div className="border-t border-cacao/10 pt-4">
                <p className="text-sm font-medium text-cacao mb-2">
                  Ou rechercher par numéro de lot :
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Ex: LOT-2024-015"
                    className="flex-1 px-4 py-2 border border-cacao/10 rounded-lg text-sm focus:ring-4 focus:ring-gold/10 focus:border-gold outline-none"
                  />
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSearch}
                    className="px-4 py-2 bg-cacao text-white rounded-lg text-sm font-medium hover:bg-cacao/90 transition-all"
                  >
                    <Search size={16} />
                  </motion.button>
                </div>
              </div>
            </div>
          </div>

          {/* Lot Information */}
          <div className="bg-white rounded-2xl border border-cacao/10 p-6">
            <h2 className="text-lg font-serif font-black text-cacao mb-6 flex items-center gap-2">
              <Package size={20} />
              Informations du Lot
            </h2>

            {selectedLot ? (
              <div className="space-y-4">
                {/* Basic Info */}
                <div className="bg-cacao/5 rounded-xl p-4">
                  <h3 className="font-bold text-cacao mb-3">Informations Générales</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-cacao/60">ID Lot:</span>
                      <p className="font-bold text-cacao">{selectedLot.id}</p>
                    </div>
                    <div>
                      <span className="text-cacao/60">Poids:</span>
                      <p className="font-bold text-cacao">{selectedLot.weight} kg</p>
                    </div>
                    <div>
                      <span className="text-cacao/60">Origine:</span>
                      <p className="font-bold text-cacao">{selectedLot.origin}</p>
                    </div>
                    <div>
                      <span className="text-cacao/60">Qualité:</span>
                      <p className="font-bold text-cacao">{selectedLot.quality}</p>
                    </div>
                    <div>
                      <span className="text-cacao/60">Agriculteur:</span>
                      <p className="font-bold text-cacao">{selectedLot.farmer}</p>
                    </div>
                    <div>
                      <span className="text-cacao/60">Coopérative:</span>
                      <p className="font-bold text-cacao">{selectedLot.cooperative}</p>
                    </div>
                  </div>
                </div>

                {/* Supply Chain */}
                <div className="bg-gold/5 rounded-xl p-4">
                  <h3 className="font-bold text-cacao mb-3">Chaîne d'Approvisionnement</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-cacao/40" />
                      <span className="text-cacao/60">Agriculteur:</span>
                      <span className="font-bold text-cacao">{selectedLot.farmer}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-cacao/40" />
                      <span className="text-cacao/60">Coopérative:</span>
                      <span className="font-bold text-cacao">{selectedLot.cooperative}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Factory size={16} className="text-cacao/40" />
                      <span className="text-cacao/60">Transformateur:</span>
                      <span className="font-bold text-cacao">{selectedLot.transformer}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe2 size={16} className="text-cacao/40" />
                      <span className="text-cacao/60">Exportateur:</span>
                      <span className="font-bold text-cacao">{selectedLot.exporter}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award size={16} className="text-cacao/40" />
                      <span className="text-cacao/60">Certificateur:</span>
                      <span className="font-bold text-cacao">{selectedLot.certifier}</span>
                    </div>
                  </div>
                </div>

                {/* Certifications */}
                <div className="bg-emerald-50 rounded-xl p-4">
                  <h3 className="font-bold text-cacao mb-3">Certifications</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedLot.certifications.map((cert, index) => (
                      <span key={index} className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-medium">
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>

                {/* EUDR Compliance */}
                <div className="bg-blue-50 rounded-xl p-4">
                  <h3 className="font-bold text-cacao mb-3">Conformité EUDR</h3>
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={20} className={selectedLot.eudrCompliant ? 'text-emerald-600' : 'text-red-600'} />
                    <span className={`font-bold ${selectedLot.eudrCompliant ? 'text-emerald-600' : 'text-red-600'}`}>
                      {selectedLot.eudrCompliant ? 'Conforme' : 'Non Conforme'}
                    </span>
                  </div>
                  <p className="text-xs text-cacao/60 mt-2">
                    GPS: {selectedLot.gpsCoordinates}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowDetailsModal(true)}
                    className="flex-1 px-4 py-2 bg-gold text-cacao rounded-lg text-sm font-medium hover:bg-gold/90 transition-all"
                  >
                    <Eye size={16} />
                    Voir Détails Complets
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 bg-cacao text-white rounded-lg text-sm font-medium hover:bg-cacao/90 transition-all"
                  >
                    <Download size={16} />
                    Télécharger
                  </motion.button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <QrCode size={48} className="text-cacao/20 mx-auto mb-4" />
                <p className="text-sm text-cacao/60">
                  Scannez un QR code ou recherchez un lot pour voir les détails
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Blockchain Journey */}
        {selectedLot && (
          <div className="mt-8 bg-white rounded-2xl border border-cacao/10 p-6">
            <h2 className="text-lg font-serif font-black text-cacao mb-6 flex items-center gap-2">
              <Hash size={20} />
              Parcours Blockchain
            </h2>

            <div className="space-y-4">
              {selectedLot.journey.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 p-4 border border-cacao/10 rounded-xl"
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gold rounded-xl flex items-center justify-center text-cacao">
                      {getStepIcon(step.step)}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-cacao">{step.step}</h4>
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(step.status)}`}>
                        {step.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-cacao/60">Acteur:</span>
                        <p className="font-bold text-cacao">{step.actor}</p>
                      </div>
                      <div>
                        <span className="text-cacao/60">Date:</span>
                        <p className="font-bold text-cacao">{step.date}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-2 text-xs">
                      <span className="text-cacao/60">Hash:</span>
                      <code className="bg-cacao/10 px-2 py-1 rounded text-cacao font-mono">
                        {step.hash.slice(0, 16)}...
                      </code>
                      <button className="text-gold hover:text-gold/80">
                        <Eye size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Details Modal */}
      {showDetailsModal && selectedLot && (
        <div className="fixed inset-0 bg-cacao/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl border border-cacao/10 p-8 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-serif font-black text-cacao">
                Détails Complets du Lot {selectedLot.id}
              </h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-cacao/40 hover:text-cacao"
              >
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Documents */}
              <div className="space-y-4">
                <h4 className="font-bold text-cacao mb-3">Documents</h4>
                {Object.entries(selectedLot.documents).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-3 border border-cacao/10 rounded-lg">
                    <span className="text-sm text-cacao/60">{key}:</span>
                    <button className="text-gold hover:text-gold/80 flex items-center gap-1">
                      <Download size={14} />
                      <span className="text-xs">{value}</span>
                    </button>
                  </div>
                ))}
              </div>

              {/* Blockchain Info */}
              <div className="space-y-4">
                <h4 className="font-bold text-cacao mb-3">Informations Blockchain</h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-cacao/60">Hash Principal:</span>
                    <code className="block bg-cacao/10 p-3 rounded text-cacao font-mono text-xs break-all">
                      {selectedLot.blockchainHash}
                    </code>
                  </div>
                  <div>
                    <span className="text-sm text-cacao/60">QR Code:</span>
                    <p className="font-bold text-cacao">{selectedLot.qrCode}</p>
                  </div>
                  <div>
                    <span className="text-sm text-cacao/60">Statut:</span>
                    <span className={`px-3 py-1 rounded-lg text-sm font-medium ${getStatusColor(selectedLot.status)}`}>
                      {selectedLot.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowDetailsModal(false)}
                className="px-6 py-3 bg-cacao text-white rounded-xl text-sm font-bold hover:bg-cacao/90 transition-all"
              >
                Fermer
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
