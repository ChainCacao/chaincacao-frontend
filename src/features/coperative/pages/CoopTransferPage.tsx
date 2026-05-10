import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Package, Search, Filter, MapPin, Calendar,
  ShieldCheck, AlertCircle, CheckCircle2, Eye, Download,
  Truck, Users, QrCode, Hash, Info, X, ChevronRight
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Lot {
  id: string;
  weight: number;
  origin: string;
  status: string;
  date: string;
  farmer: string;
  quality: string;
  eudrCompliant: boolean;
  blockchainHash: string;
  qrCode: string;
}

interface Partner {
  id: string;
  name: string;
  type: 'transformateur';
  status: 'active' | 'inactive';
  certifications: string[];
  location: string;
  rating: number;
}

interface TransferRequest {
  id: string;
  lotId: string;
  fromCooperative: string;
  toPartner: string;
  weight: number;
  status: 'pending' | 'confirmed' | 'rejected';
  date: string;
  blockchainHash?: string;
  qrCode?: string;
}

export default function CoopTransferPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [selectedLots, setSelectedLots] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferProgress, setTransferProgress] = useState(0);
  const [isTransferring, setIsTransferring] = useState(false);
  const [currentTransfer, setCurrentTransfer] = useState<TransferRequest | null>(null);

  // Données simulées
  const availableLots: Lot[] = [
    {
      id: 'LOT-2024-015',
      weight: 500,
      origin: 'Kara, Togo',
      status: 'validated',
      date: '2024-03-28',
      farmer: 'Koffi Amouzou',
      quality: 'Premium',
      eudrCompliant: true,
      blockchainHash: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      qrCode: 'LOT-2024-015-QR'
    },
    {
      id: 'LOT-2024-016',
      weight: 750,
      origin: 'Lomé, Togo',
      status: 'validated',
      date: '2024-03-29',
      farmer: 'Mawuli Adet',
      quality: 'Standard',
      eudrCompliant: true,
      blockchainHash: '0x8f3a2b1c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c',
      qrCode: 'LOT-2024-016-QR'
    },
    {
      id: 'LOT-2024-017',
      weight: 320,
      origin: 'Sokodé, Togo',
      status: 'validated',
      date: '2024-03-30',
      farmer: 'Yao Koffi',
      quality: 'Premium',
      eudrCompliant: true,
      blockchainHash: '0x9c4d3e2f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e',
      qrCode: 'LOT-2024-017-QR'
    }
  ];

  const validPartners: Partner[] = [
    {
      id: 'TRANS-001',
      name: 'Togo Chocoterie Industrielle',
      type: 'transformateur',
      status: 'active',
      certifications: ['ISO 22000', 'HACCP', 'Bio'],
      location: 'Lomé, Togo',
      rating: 4.8
    },
    {
      id: 'TRANS-002',
      name: 'Cacao Processing Togo',
      type: 'transformateur',
      status: 'active',
      certifications: ['Fair Trade', 'Rainforest Alliance'],
      location: 'Kara, Togo',
      rating: 4.5
    },
    {
      id: 'TRANS-003',
      name: 'Premium Cacao Transform',
      type: 'transformateur',
      status: 'active',
      certifications: ['Organic USDA', 'GlobalG.A.P'],
      location: 'Sokodé, Togo',
      rating: 4.7
    }
  ];

  const transferHistory: TransferRequest[] = [
    {
      id: 'TRANS-2024-001',
      lotId: 'LOT-2024-012',
      fromCooperative: 'Coopérative Lomé',
      toPartner: 'Togo Chocoterie Industrielle',
      weight: 600,
      status: 'confirmed',
      date: '2024-03-25',
      blockchainHash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c',
      qrCode: 'TRANS-2024-001-QR'
    },
    {
      id: 'TRANS-2024-002',
      lotId: 'LOT-2024-011',
      fromCooperative: 'Coopérative Lomé',
      toPartner: 'Cacao Processing Togo',
      weight: 450,
      status: 'confirmed',
      date: '2024-03-22',
      blockchainHash: '0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d',
      qrCode: 'TRANS-2024-002-QR'
    }
  ];

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  const filteredLots = availableLots.filter(lot => 
    lot.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lot.farmer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lot.origin.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLotSelection = (lotId: string) => {
    if (selectedLots.includes(lotId)) {
      setSelectedLots(selectedLots.filter(id => id !== lotId));
    } else {
      setSelectedLots([...selectedLots, lotId]);
    }
  };

  const handlePartnerSelection = (partner: Partner) => {
    setSelectedPartner(partner);
  };

  const initiateTransfer = () => {
    if (selectedLots.length === 0 || !selectedPartner) {
      toast.error('Veuillez sélectionner au moins un lot et un partenaire');
      return;
    }

    setShowTransferModal(true);
  };

  const confirmTransfer = async () => {
    setIsTransferring(true);
    setTransferProgress(0);

    try {
      // Simulation du processus de transfert
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setTransferProgress(i);
      }

      // Créer la demande de transfert
      const newTransfer: TransferRequest = {
        id: `TRANS-2024-${Date.now()}`,
        lotId: selectedLots[0], // Pour simplifier, on prend le premier lot
        fromCooperative: 'Coopérative Actuelle',
        toPartner: selectedPartner.name,
        weight: availableLots.find(lot => lot.id === selectedLots[0])?.weight || 0,
        status: 'confirmed',
        date: new Date().toISOString().split('T')[0],
        blockchainHash: `0x${Math.random().toString(16).substr(2, 40)}`,
        qrCode: `TRANS-2024-${Date.now()}-QR`
      };

      console.log('Transfert créé:', newTransfer);
      
      toast.success('Transert effectué avec succès !');
      setShowTransferModal(false);
      setSelectedLots([]);
      setSelectedPartner(null);
      setTransferProgress(0);
      
      // Simuler la redirection vers le dashboard du transformateur
      setTimeout(() => {
        navigate('/cooperative/dashboard');
      }, 2000);
      
    } catch (error) {
      toast.error('Erreur lors du transfert');
    } finally {
      setIsTransferring(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'validated': return 'text-emerald-600 bg-emerald-50';
      case 'pending': return 'text-amber-600 bg-amber-50';
      case 'rejected': return 'text-red-600 bg-red-50';
      default: return 'text-cacao/60 bg-cacao/10';
    }
  };

  const getPartnerStatusColor = (status: string) => {
    return status === 'active' ? 'text-emerald-600 bg-emerald-50' : 'text-slate-600 bg-slate-50';
  };

  const getRatingStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <span key={i} className={i < Math.floor(rating) ? 'text-gold' : 'text-cacao/20'}>
        ★
      </span>
    ));
  };

  if (loading) return (
    <div className="min-h-screen bg-cream flex items-center justify-center text-cacao font-bold">
      Chargement de la page de transfert...
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
                onClick={() => navigate('/cooperative/dashboard')}
                className="p-2.5 bg-white shadow-sm border border-cacao/10 rounded-xl text-cacao hover:text-gold transition-all"
              >
                <ArrowLeft size={20} />
              </motion.button>
              <div>
                <h1 className="text-xl font-serif font-black text-cacao tracking-tight">Transfert de Lots</h1>
                <p className="text-[11px] font-bold text-gold/70 uppercase tracking-[0.2em]">Workflow Sécurisé</p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Info Section */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <Info className="text-amber-600 mt-0.5" size={20} />
            <div>
              <h3 className="text-sm font-bold text-amber-800 mb-2">
                🔒 Workflow de Transfert Sécurisé
              </h3>
              <div className="space-y-1 text-xs text-amber-700">
                <p>• <span className="font-bold">Confidentialité :</span> Vous ne voyez que vos partenaires validés</p>
                <p>• <span className="font-bold">Transparence :</span> Chaque transfert est inscrit sur la blockchain</p>
                <p>• <span className="font-bold">Sécurité :</span> QR code unique et hash blockchain pour chaque lot</p>
                <p>• <span className="font-bold">Traçabilité :</span> Historique complet visible par tous les acteurs</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Lots disponibles */}
          <div className="bg-white rounded-2xl border border-cacao/10 p-6">
            <h2 className="text-lg font-serif font-black text-cacao mb-6 flex items-center gap-2">
              <Package size={20} />
              Lots Disponibles
            </h2>

            <div className="mb-4">
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

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredLots.map((lot) => (
                <motion.div
                  key={lot.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`border rounded-xl p-4 cursor-pointer transition-all ${
                    selectedLots.includes(lot.id) 
                      ? 'border-gold bg-gold/5' 
                      : 'border-cacao/10 hover:border-cacao/20'
                  }`}
                  onClick={() => handleLotSelection(lot.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-cacao">{lot.id}</h3>
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(lot.status)}`}>
                          {lot.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-cacao/60">Poids:</span>
                          <p className="font-bold text-cacao">{lot.weight} kg</p>
                        </div>
                        <div>
                          <span className="text-cacao/60">Origine:</span>
                          <p className="font-bold text-cacao">{lot.origin}</p>
                        </div>
                        <div>
                          <span className="text-cacao/60">Agriculteur:</span>
                          <p className="font-bold text-cacao">{lot.farmer}</p>
                        </div>
                        <div>
                          <span className="text-cacao/60">Qualité:</span>
                          <p className="font-bold text-cacao">{lot.quality}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-2 text-xs">
                        <span className="text-cacao/60">Hash:</span>
                        <code className="bg-cacao/10 px-2 py-1 rounded text-cacao font-mono">
                          {lot.blockchainHash.slice(0, 10)}...
                        </code>
                        <button className="text-gold hover:text-gold/80">
                          <Eye size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <QrCode size={20} className="text-cacao/40" />
                      <span className="text-xs text-cacao/60">{lot.qrCode}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Partenaires validés */}
          <div className="bg-white rounded-2xl border border-cacao/10 p-6">
            <h2 className="text-lg font-serif font-black text-cacao mb-6 flex items-center gap-2">
              <Users size={20} />
              Partenaires Validés
            </h2>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {validPartners.map((partner) => (
                <motion.div
                  key={partner.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`border rounded-xl p-4 cursor-pointer transition-all ${
                    selectedPartner?.id === partner.id 
                      ? 'border-gold bg-gold/5' 
                      : 'border-cacao/10 hover:border-cacao/20'
                  }`}
                  onClick={() => handlePartnerSelection(partner)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-cacao">{partner.name}</h3>
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getPartnerStatusColor(partner.status)}`}>
                          {partner.type}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-2 text-sm">
                        <div>
                          <span className="text-cacao/60">Localisation:</span>
                          <p className="font-bold text-cacao">{partner.location}</p>
                        </div>
                        <div>
                          <span className="text-cacao/60">Certifications:</span>
                          <p className="font-bold text-cacao text-xs">{partner.certifications.join(', ')}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-cacao/60">Évaluation:</span>
                        <div className="flex items-center gap-1">
                          {getRatingStars(partner.rating)}
                          <span className="text-xs text-cacao/60">({partner.rating})</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <ShieldCheck size={20} className={partner.status === 'active' ? 'text-emerald-600' : 'text-slate-400'} />
                      <span className="text-xs text-cacao/60">
                        {partner.status === 'active' ? 'Validé' : 'Inactif'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex items-center justify-between">
          <div className="text-sm text-cacao/60">
            {selectedLots.length} lot(s) sélectionné(s) • {selectedPartner ? '1 partenaire sélectionné' : 'Aucun partenaire sélectionné'}
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={initiateTransfer}
            disabled={selectedLots.length === 0 || !selectedPartner}
            className={`
              px-8 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2
              ${selectedLots.length > 0 && selectedPartner
                ? 'bg-gold text-cacao hover:bg-gold/90 shadow-lg' 
                : 'bg-cacao/20 text-cacao/60 cursor-not-allowed'
              }
            `}
          >
            <Truck size={18} />
            Initier le Transfert
            <ChevronRight size={18} />
          </motion.button>
        </div>

        {/* Historique des transferts */}
        <div className="mt-8 bg-white rounded-2xl border border-cacao/10 p-6">
          <h2 className="text-lg font-serif font-black text-cacao mb-6 flex items-center gap-2">
            <Calendar size={20} />
            Historique des Transferts
          </h2>

          <div className="space-y-3">
            {transferHistory.map((transfer) => (
              <motion.div
                key={transfer.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="border border-cacao/10 rounded-xl p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-cacao">{transfer.id}</h3>
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                        transfer.status === 'confirmed' 
                          ? 'text-emerald-600 bg-emerald-50' 
                          : 'text-amber-600 bg-amber-50'
                        }`}>
                        {transfer.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-cacao/60">Lot:</span>
                        <p className="font-bold text-cacao">{transfer.lotId}</p>
                      </div>
                      <div>
                        <span className="text-cacao/60">Destinataire:</span>
                        <p className="font-bold text-cacao">{transfer.toPartner}</p>
                      </div>
                      <div>
                        <span className="text-cacao/60">Poids:</span>
                        <p className="font-bold text-cacao">{transfer.weight} kg</p>
                      </div>
                      <div>
                        <span className="text-cacao/60">Date:</span>
                        <p className="font-bold text-cacao">{transfer.date}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-2 text-xs">
                      <span className="text-cacao/60">Hash:</span>
                      <code className="bg-cacao/10 px-2 py-1 rounded text-cacao font-mono">
                        {transfer.blockchainHash?.slice(0, 10)}...
                      </code>
                      <button className="text-gold hover:text-gold/80">
                        <Eye size={14} />
                      </button>
                      <button className="text-gold hover:text-gold/80">
                        <Download size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <QrCode size={20} className="text-cacao/40" />
                    <span className="text-xs text-cacao/60">{transfer.qrCode}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {/* Modal de confirmation de transfert */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-cacao/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl border border-cacao/10 p-8 max-w-md w-full"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-serif font-black text-cacao">
                Confirmation de Transfert
              </h3>
              <button
                onClick={() => setShowTransferModal(false)}
                className="text-cacao/40 hover:text-cacao"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-cacao/5 rounded-xl p-4">
                <h4 className="font-bold text-cacao mb-2">Récapitulatif du transfert</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Lots:</span> {selectedLots.join(', ')}</p>
                  <p><span className="font-medium">Destinataire:</span> {selectedPartner?.name}</p>
                  <p><span className="font-medium">Poids total:</span> {selectedLots.reduce((total, lotId) => {
                    const lot = availableLots.find(l => l.id === lotId);
                    return total + (lot?.weight || 0);
                  }, 0)} kg</p>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="text-amber-600 mt-0.5" size={16} />
                  <div>
                    <p className="text-sm font-bold text-amber-800 mb-1">
                      ⚠️ Action Irréversible
                    </p>
                    <p className="text-xs text-amber-700">
                      Une fois confirmé, ce transfert sera inscrit sur la blockchain 
                      et ne pourra être annulé.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            {isTransferring && (
              <div className="mb-6">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-cacao">Progression du transfert...</span>
                  <span className="font-bold text-cacao">{transferProgress}%</span>
                </div>
                <div className="w-full bg-cacao/10 rounded-full h-2">
                  <div 
                    className="bg-gold h-2 rounded-full transition-all"
                    style={{ width: `${transferProgress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowTransferModal(false)}
                disabled={isTransferring}
                className="flex-1 px-4 py-3 border border-cacao/10 rounded-xl text-sm font-medium text-cacao hover:bg-cacao/5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Annuler
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={confirmTransfer}
                disabled={isTransferring}
                className="flex-1 px-4 py-3 bg-gold text-cacao rounded-xl text-sm font-bold hover:bg-gold/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isTransferring ? (
                  <>
                    <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Transfert en cours...
                  </>
                ) : (
                  'Confirmer le Transfert'
                )}
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
