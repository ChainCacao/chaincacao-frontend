import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Package, Search, Filter, Calendar, CheckCircle2,
  AlertCircle, Clock, Eye, Download, Plus, QrCode,
  Hash, Users, MapPin, Thermometer, Droplets,
  FileText, Camera, ShieldCheck, X
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ReceivedLot {
  id: string;
  originalLotId: string;
  weight: number;
  origin: string;
  quality: string;
  cooperative: string;
  farmer: string;
  receivedDate: string;
  status: 'pending' | 'validated' | 'rejected';
  eudrCompliant: boolean;
  blockchainHash: string;
  qrCode: string;
  gpsCoordinates: string;
  photos: string[];
  documents: {
    farmerCertificate: string;
    cooperativeValidation: string;
    transportDocument: string;
    qualityCertificate: string;
  };
  measurements: {
    temperature: number;
    humidity: number;
    moisture: number;
  };
  storageLocation: string;
  batchNumber: string;
  expiryDate: string;
}

export default function TransformerReceptionPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedLots, setSelectedLots] = useState<string[]>([]);
  const [showReceptionModal, setShowReceptionModal] = useState(false);
  const [selectedLot, setSelectedLot] = useState<ReceivedLot | null>(null);

  // Données simulées de lots reçus
  const receivedLots: ReceivedLot[] = [
    {
      id: 'RECEIVED-2024-001',
      originalLotId: 'LOT-2024-015',
      weight: 500,
      origin: 'Kara, Togo',
      quality: 'Premium',
      cooperative: 'Coopérative Kara',
      farmer: 'Koffi Amouzou',
      receivedDate: '2024-03-28',
      status: 'pending',
      eudrCompliant: true,
      blockchainHash: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      qrCode: 'RECEIVED-2024-001-QR',
      gpsCoordinates: '9.5594°N, 0.7831°E',
      photos: ['RECEPTION-PHOTO-001.jpg', 'RECEPTION-PHOTO-002.jpg'],
      documents: {
        farmerCertificate: 'CERT-FARMER-015.pdf',
        cooperativeValidation: 'VALID-COOP-015.pdf',
        transportDocument: 'TRANSPORT-015.pdf',
        qualityCertificate: 'QUALITY-015.pdf'
      },
      measurements: {
        temperature: 25,
        humidity: 65,
        moisture: 12
      },
      storageLocation: 'Entrepôt A - Zone 1',
      batchNumber: 'BATCH-RECEIVED-001',
      expiryDate: '2024-09-28'
    },
    {
      id: 'RECEIVED-2024-002',
      originalLotId: 'LOT-2024-016',
      weight: 750,
      origin: 'Lomé, Togo',
      quality: 'Standard',
      cooperative: 'Coopérative Lomé',
      farmer: 'Mawuli Adet',
      receivedDate: '2024-03-27',
      status: 'validated',
      eudrCompliant: true,
      blockchainHash: '0x8f3a2b1c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c',
      qrCode: 'RECEIVED-2024-002-QR',
      gpsCoordinates: '6.1319°N, 1.2225°E',
      photos: ['RECEPTION-PHOTO-003.jpg'],
      documents: {
        farmerCertificate: 'CERT-FARMER-016.pdf',
        cooperativeValidation: 'VALID-COOP-016.pdf',
        transportDocument: 'TRANSPORT-016.pdf',
        qualityCertificate: 'QUALITY-016.pdf'
      },
      measurements: {
        temperature: 26,
        humidity: 68,
        moisture: 14
      },
      storageLocation: 'Entrepôt A - Zone 2',
      batchNumber: 'BATCH-RECEIVED-002',
      expiryDate: '2024-09-27'
    }
  ];

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  const filteredLots = receivedLots.filter(lot => {
    const matchesSearch = lot.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        lot.originalLotId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        lot.cooperative.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        lot.farmer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || lot.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleLotSelection = (lotId: string) => {
    if (selectedLots.includes(lotId)) {
      setSelectedLots(selectedLots.filter(id => id !== lotId));
    } else {
      setSelectedLots([...selectedLots, lotId]);
    }
  };

  const validateLot = async (lot: ReceivedLot) => {
    setSelectedLot(lot);
    setShowReceptionModal(true);
  };

  const confirmReception = async () => {
    if (!selectedLot) return;

    try {
      // Simulation de validation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Lot validé:', selectedLot);
      
      toast.success('Lot réceptionné et validé avec succès !');
      setShowReceptionModal(false);
      setSelectedLot(null);
      
      // Rediriger vers la page de production
      setTimeout(() => {
        navigate('/transformateur/production');
      }, 1500);
      
    } catch (error) {
      toast.error('Erreur lors de la validation du lot');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-amber-600 bg-amber-50';
      case 'validated': return 'text-emerald-600 bg-emerald-50';
      case 'rejected': return 'text-red-600 bg-red-50';
      default: return 'text-cacao/60 bg-cacao/10';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock size={16} />;
      case 'validated': return <CheckCircle2 size={16} />;
      case 'rejected': return <AlertCircle size={16} />;
      default: return <Package size={16} />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'validated': return 'Validé';
      case 'rejected': return 'Rejeté';
      default: return status;
    }
  };

  const receptionStats = {
    total: receivedLots.length,
    pending: receivedLots.filter(l => l.status === 'pending').length,
    validated: receivedLots.filter(l => l.status === 'validated').length,
    rejected: receivedLots.filter(l => l.status === 'rejected').length,
    totalWeight: receivedLots.reduce((sum, lot) => sum + lot.weight, 0)
  };

  if (loading) return (
    <div className="min-h-screen bg-cream flex items-center justify-center text-cacao font-bold">
      Chargement de la réception des lots...
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
                onClick={() => navigate('/transformateur/dashboard')}
                className="p-2.5 bg-white shadow-sm border border-cacao/10 rounded-xl text-cacao hover:text-gold transition-all"
              >
                <ArrowLeft size={20} />
              </motion.button>
              <div>
                <h1 className="text-xl font-serif font-black text-cacao tracking-tight">Réception des Lots</h1>
                <p className="text-[11px] font-bold text-gold/70 uppercase tracking-[0.2em]">Validation des Réceptions</p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-cacao/10 p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-cacao/60">Total Reçus</p>
                <p className="text-2xl font-bold text-cacao">{receptionStats.total}</p>
              </div>
              <Package className="text-cacao/40" size={24} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl border border-cacao/10 p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-cacao/60">En Attente</p>
                <p className="text-2xl font-bold text-amber-600">{receptionStats.pending}</p>
              </div>
              <Clock className="text-amber-600" size={24} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl border border-cacao/10 p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-cacao/60">Validés</p>
                <p className="text-2xl font-bold text-emerald-600">{receptionStats.validated}</p>
              </div>
              <CheckCircle2 className="text-emerald-600" size={24} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl border border-cacao/10 p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-cacao/60">Rejetés</p>
                <p className="text-2xl font-bold text-red-600">{receptionStats.rejected}</p>
              </div>
              <AlertCircle className="text-red-600" size={24} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl border border-cacao/10 p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-cacao/60">Poids Total</p>
                <p className="text-2xl font-bold text-cacao">{receptionStats.totalWeight} kg</p>
              </div>
              <Package className="text-cacao/40" size={24} />
            </div>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-cacao/10 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-cacao/40" size={16} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Rechercher un lot..."
                  className="w-full pl-10 pr-4 py-2 border border-cacao/10 rounded-lg text-sm focus:ring-4 focus:ring-gold/10 focus:border-gold outline-none"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-cacao/10 rounded-lg text-sm focus:ring-4 focus:ring-gold/10 focus:border-gold outline-none"
              >
                <option value="all">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="validated">Validés</option>
                <option value="rejected">Rejetés</option>
              </select>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 bg-gold text-cacao rounded-lg text-sm font-bold hover:bg-gold/90 transition-all flex items-center gap-2"
              >
                <Plus size={16} />
                Nouvelle Réception
              </motion.button>
            </div>
          </div>
        </div>

        {/* Lots List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredLots.map((lot, index) => (
            <motion.div
              key={lot.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl border border-cacao/10 p-6"
            >
              {/* Lot Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center">
                    <Package className="text-gold" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-cacao text-lg">{lot.id}</h3>
                    <p className="text-sm text-cacao/60">Lot original: {lot.originalLotId}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1 ${getStatusColor(lot.status)}`}>
                    {getStatusIcon(lot.status)}
                    {getStatusText(lot.status)}
                  </span>
                </div>
              </div>

              {/* Lot Info */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <span className="text-cacao/60 text-xs">Poids:</span>
                  <p className="font-bold text-cacao">{lot.weight} kg</p>
                </div>
                <div>
                  <span className="text-cacao/60 text-xs">Qualité:</span>
                  <p className="font-bold text-cacao">{lot.quality}</p>
                </div>
                <div>
                  <span className="text-cacao/60 text-xs">Origine:</span>
                  <p className="font-bold text-cacao">{lot.origin}</p>
                </div>
                <div>
                  <span className="text-cacao/60 text-xs">Agriculteur:</span>
                  <p className="font-bold text-cacao">{lot.farmer}</p>
                </div>
                <div>
                  <span className="text-cacao/60 text-xs">Coopérative:</span>
                  <p className="font-bold text-cacao">{lot.cooperative}</p>
                </div>
                <div>
                  <span className="text-cacao/60 text-xs">Date réception:</span>
                  <p className="font-bold text-cacao">{lot.receivedDate}</p>
                </div>
                <div>
                  <span className="text-cacao/60 text-xs">Stockage:</span>
                  <p className="font-bold text-cacao">{lot.storageLocation}</p>
                </div>
              </div>

              {/* Compliance */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="text-emerald-600" size={16} />
                    <span className="text-sm font-bold text-emerald-800">Conformité EUDR</span>
                  </div>
                  <span className="text-sm text-emerald-700">
                    {lot.eudrCompliant ? 'Conforme' : 'Non conforme'}
                  </span>
                </div>
                <p className="text-xs text-emerald-700 mt-1">
                  GPS: {lot.gpsCoordinates}
                </p>
              </div>

              {/* Measurements */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-red-50 rounded-lg p-2">
                  <div className="flex items-center gap-1">
                    <Thermometer size={14} className="text-red-600" />
                    <span className="text-xs text-red-600">Temp</span>
                  </div>
                  <p className="font-bold text-red-700">{lot.measurements.temperature}°C</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-2">
                  <div className="flex items-center gap-1">
                    <Droplets size={14} className="text-blue-600" />
                    <span className="text-xs text-blue-600">Humidité</span>
                  </div>
                  <p className="font-bold text-blue-700">{lot.measurements.humidity}%</p>
                </div>
                <div className="bg-amber-50 rounded-lg p-2">
                  <div className="flex items-center gap-1">
                    <Package size={14} className="text-amber-600" />
                    <span className="text-xs text-amber-600">Humidité</span>
                  </div>
                  <p className="font-bold text-amber-700">{lot.measurements.moisture}%</p>
                </div>
              </div>

              {/* Documents */}
              <div className="mb-4">
                <h4 className="text-sm font-bold text-cacao mb-2">Documents</h4>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(lot.documents).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2 p-2 bg-cacao/5 rounded-lg">
                      <FileText size={14} className="text-cacao/40" />
                      <span className="text-xs text-cacao">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Photos */}
              <div className="mb-4">
                <h4 className="text-sm font-bold text-cacao mb-2">Photos de réception</h4>
                <div className="flex gap-2">
                  {lot.photos.map((photo, index) => (
                    <div key={index} className="w-16 h-16 bg-cacao/10 rounded-lg flex items-center justify-center">
                      <Camera size={20} className="text-cacao/40" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Blockchain Info */}
              <div className="bg-cacao/5 rounded-lg p-3 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-cacao">Hash Blockchain</p>
                    <code className="text-xs text-cacao font-mono">
                      {lot.blockchainHash.slice(0, 20)}...
                    </code>
                  </div>
                  <QrCode size={20} className="text-cacao/40" />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {lot.status === 'pending' && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => validateLot(lot)}
                    className="flex-1 px-4 py-2 bg-gold text-cacao rounded-lg text-sm font-bold hover:bg-gold/90 transition-all"
                  >
                    Valider la Réception
                  </motion.button>
                )}
                {lot.status === 'validated' && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/transformateur/production')}
                    className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-700 transition-all"
                  >
                    Démarrer Production
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2 border border-cacao/10 rounded-lg text-sm font-medium text-cacao hover:bg-cacao/5 transition-all"
                >
                  <Eye size={16} />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredLots.length === 0 && (
          <div className="bg-white rounded-xl border border-cacao/10 p-12 text-center">
            <Package size={48} className="text-cacao/20 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-cacao mb-2">Aucun lot trouvé</h3>
            <p className="text-sm text-cacao/60">
              Aucun lot ne correspond à vos critères de recherche.
            </p>
          </div>
        )}
      </main>

      {/* Reception Modal */}
      {showReceptionModal && selectedLot && (
        <div className="fixed inset-0 bg-cacao/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl border border-cacao/10 p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-serif font-black text-cacao">
                Validation du Lot {selectedLot.id}
              </h3>
              <button
                onClick={() => setShowReceptionModal(false)}
                className="text-cacao/40 hover:text-cacao"
              >
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-bold text-cacao mb-3">Informations Générales</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">ID Lot:</span> {selectedLot.id}</p>
                  <p><span className="font-medium">Lot Original:</span> {selectedLot.originalLotId}</p>
                  <p><span className="font-medium">Poids:</span> {selectedLot.weight} kg</p>
                  <p><span className="font-medium">Qualité:</span> {selectedLot.quality}</p>
                  <p><span className="font-medium">Origine:</span> {selectedLot.origin}</p>
                  <p><span className="font-medium">Agriculteur:</span> {selectedLot.farmer}</p>
                  <p><span className="font-medium">Coopérative:</span> {selectedLot.cooperative}</p>
                  <p><span className="font-medium">Date réception:</span> {selectedLot.receivedDate}</p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-cacao mb-3">Mesures et Conformité</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Température:</span> {selectedLot.measurements.temperature}°C</p>
                  <p><span className="font-medium">Humidité:</span> {selectedLot.measurements.humidity}%</p>
                  <p><span className="font-medium">Taux d'humidité:</span> {selectedLot.measurements.moisture}%</p>
                  <p><span className="font-medium">GPS:</span> {selectedLot.gpsCoordinates}</p>
                  <p><span className="font-medium">EUDR:</span> 
                    <span className={selectedLot.eudrCompliant ? 'text-emerald-600' : 'text-red-600'}>
                      {selectedLot.eudrCompliant ? 'Conforme' : 'Non conforme'}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-bold text-cacao mb-3">Documents de Réception</h4>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(selectedLot.documents).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2 p-3 bg-cacao/5 rounded-lg">
                    <FileText size={16} className="text-cacao/40" />
                    <span className="text-sm text-cacao">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-bold text-cacao mb-3">Photos de Réception</h4>
              <div className="flex gap-3">
                {selectedLot.photos.map((photo, index) => (
                  <div key={index} className="w-20 h-20 bg-cacao/10 rounded-lg flex items-center justify-center">
                    <Camera size={24} className="text-cacao/40" />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-blue-600 mt-0.5" size={20} />
                <div>
                  <p className="text-sm font-bold text-blue-800 mb-2">
                    Confirmation de Réception
                  </p>
                  <p className="text-xs text-blue-700">
                    En validant cette réception, vous confirmez avoir reçu le lot 
                    et vérifié tous les documents. Cette action sera enregistrée sur la blockchain.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowReceptionModal(false)}
                className="flex-1 px-4 py-3 border border-cacao/10 rounded-lg text-sm font-medium text-cacao hover:bg-cacao/5"
              >
                Annuler
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={confirmReception}
                className="flex-1 px-4 py-3 bg-gold text-cacao rounded-lg text-sm font-bold hover:bg-gold/90"
              >
                Confirmer la Réception
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
