import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Package, Search, Filter, MapPin, Calendar,
  ShieldCheck, AlertCircle, CheckCircle2, Eye, Download,
  Truck, Users, QrCode, Hash, Info, X, ChevronRight,
  Award, Globe2, FileText, Star
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface TransformedLot {
  id: string;
  weight: number;
  origin: string;
  status: string;
  date: string;
  fromTransformer: string;
  quality: string;
  eudrCompliant: boolean;
  blockchainHash: string;
  qrCode: string;
  processed: boolean;
}

interface Partner {
  id: string;
  name: string;
  type: 'certificateur';
  status: 'active' | 'inactive';
  certifications: string[];
  location: string;
  rating: number;
  standards: string[];
}

interface CertificationRequest {
  id: string;
  lotId: string;
  fromExporter: string;
  toPartner: string;
  weight: number;
  status: 'pending' | 'confirmed' | 'rejected';
  date: string;
  blockchainHash?: string;
  qrCode?: string;
}

export default function ExporterTransferPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [selectedLots, setSelectedLots] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [showCertificationModal, setShowCertificationModal] = useState(false);
  const [certificationProgress, setCertificationProgress] = useState(0);
  const [isCertifying, setIsCertifying] = useState(false);

  // Données simulées
  const transformedLots: TransformedLot[] = [
    {
      id: 'LOT-2024-015',
      weight: 500,
      origin: 'Kara, Togo',
      status: 'transformed',
      date: '2024-03-28',
      fromTransformer: 'Togo Chocoterie Industrielle',
      quality: 'Premium',
      eudrCompliant: true,
      blockchainHash: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      qrCode: 'LOT-2024-015-QR',
      processed: false
    },
    {
      id: 'LOT-2024-016',
      weight: 750,
      origin: 'Lomé, Togo',
      status: 'transformed',
      date: '2024-03-29',
      fromTransformer: 'Cacao Processing Togo',
      quality: 'Standard',
      eudrCompliant: true,
      blockchainHash: '0x8f3a2b1c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c',
      qrCode: 'LOT-2024-016-QR',
      processed: false
    },
    {
      id: 'LOT-2024-017',
      weight: 320,
      origin: 'Sokodé, Togo',
      status: 'transformed',
      date: '2024-03-30',
      fromTransformer: 'Premium Cacao Transform',
      quality: 'Premium',
      eudrCompliant: true,
      blockchainHash: '0x9c4d3e2f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e',
      qrCode: 'LOT-2024-017-QR',
      processed: true
    }
  ];

  const validPartners: Partner[] = [
    {
      id: 'CERT-001',
      name: 'Bureau de Certification Togolais',
      type: 'certificateur',
      status: 'active',
      certifications: ['ISO 17065', 'Accréditation Internationale'],
      location: 'Lomé, Togo',
      rating: 4.9,
      standards: ['Bio', 'Fair Trade', 'Rainforest Alliance', 'UTZ']
    },
    {
      id: 'CERT-002',
      name: 'Togo Organic Certification',
      type: 'certificateur',
      status: 'active',
      certifications: ['USDA Organic', 'EU Organic'],
      location: 'Kara, Togo',
      rating: 4.8,
      standards: ['Organic USDA', 'Bio UE', 'GlobalG.A.P']
    },
    {
      id: 'CERT-003',
      name: 'West Africa Quality Assurance',
      type: 'certificateur',
      status: 'active',
      certifications: ['Fair Trade International', 'ISO 9001'],
      location: 'Sokodé, Togo',
      rating: 4.7,
      standards: ['Fair Trade', 'ISO 22000', 'HACCP']
    }
  ];

  const certificationHistory: CertificationRequest[] = [
    {
      id: 'CERT-2024-003',
      lotId: 'LOT-2024-012',
      fromExporter: 'Togo Cacao Export International',
      toPartner: 'Bureau de Certification Togolais',
      weight: 600,
      status: 'confirmed',
      date: '2024-03-25',
      blockchainHash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c',
      qrCode: 'CERT-2024-003-QR'
    },
    {
      id: 'CERT-2024-004',
      lotId: 'LOT-2024-011',
      fromExporter: 'Togo Cacao Export International',
      toPartner: 'Togo Organic Certification',
      weight: 450,
      status: 'confirmed',
      date: '2024-03-22',
      blockchainHash: '0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d',
      qrCode: 'CERT-2024-004-QR'
    }
  ];

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  const filteredLots = transformedLots.filter(lot => 
    lot.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lot.fromTransformer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lot.origin.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLotSelection = (lotId: string) => {
    const lot = transformedLots.find(l => l.id === lotId);
    if (!lot || lot.processed) return;
    
    if (selectedLots.includes(lotId)) {
      setSelectedLots(selectedLots.filter(id => id !== lotId));
    } else {
      setSelectedLots([...selectedLots, lotId]);
    }
  };

  const handlePartnerSelection = (partner: Partner) => {
    setSelectedPartner(partner);
  };

  const initiateCertification = () => {
    if (selectedLots.length === 0 || !selectedPartner) {
      toast.error('Veuillez sélectionner au moins un lot et un certificateur');
      return;
    }

    setShowCertificationModal(true);
  };

  const confirmCertification = async () => {
    setIsCertifying(true);
    setCertificationProgress(0);

    try {
      // Simulation du processus de certification
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setCertificationProgress(i);
      }

      // Créer la demande de certification
      const totalWeight = selectedLots.reduce((total, lotId) => {
        const lot = transformedLots.find(l => l.id === lotId);
        return total + (lot?.weight || 0);
      }, 0);

      const newCertification: CertificationRequest = {
        id: `CERT-2024-${Date.now()}`,
        lotId: selectedLots.join(', '), // Multiple lots possible
        fromExporter: 'Togo Cacao Export International',
        toPartner: selectedPartner?.name || 'Certificateur sélectionné',
        weight: totalWeight,
        status: 'confirmed',
        date: new Date().toISOString().split('T')[0],
        blockchainHash: `0x${Math.random().toString(16).substr(2, 40)}`,
        qrCode: `CERT-2024-${Date.now()}-QR`
      };

      console.log('Certification créée:', newCertification);
      
      toast.success('Demande de certification envoyée avec succès !');
      setShowCertificationModal(false);
      setSelectedLots([]);
      setSelectedPartner(null);
      setCertificationProgress(0);
      
      // Simuler la redirection vers le dashboard
      setTimeout(() => {
        navigate('/exportateur/dashboard');
      }, 2000);
      
    } catch (error) {
      toast.error('Erreur lors de la demande de certification');
    } finally {
      setIsCertifying(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'transformed': return 'text-emerald-600 bg-emerald-50';
      case 'processed': return 'text-blue-600 bg-blue-50';
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
      Chargement de la page de certification...
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
                onClick={() => navigate('/exportateur/dashboard')}
                className="p-2.5 bg-white shadow-sm border border-cacao/10 rounded-xl text-cacao hover:text-gold transition-all"
              >
                <ArrowLeft size={20} />
              </motion.button>
              <div>
                <h1 className="text-xl font-serif font-black text-cacao tracking-tight">Demande de Certification</h1>
                <p className="text-[11px] font-bold text-gold/70 uppercase tracking-[0.2em]">Workflow Sécurisé</p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Info Section */}
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <Info className="text-green-600 mt-0.5" size={20} />
            <div>
              <h3 className="text-sm font-bold text-green-800 mb-2">
                🏭 Workflow Exportateur → Certificateur
              </h3>
              <div className="space-y-1 text-xs text-green-700">
                <p>• <span className="font-bold">Regroupement :</span> Regroupez les lots transformés avec documents logistiques</p>
                <p>• <span className="font-bold">Sélection :</span> Choisissez uniquement les certificateurs validés par le Ministère</p>
                <p>• <span className="font-bold">Certification :</span> Soumettez pour validation finale avant exportation</p>
                <p>• <span className="font-bold">Transparence :</span> Historique complet visible par les importateurs via QR code</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Lots transformés */}
          <div className="bg-white rounded-2xl border border-cacao/10 p-6">
            <h2 className="text-lg font-serif font-black text-cacao mb-6 flex items-center gap-2">
              <Package size={20} />
              Lots Transformés à Certifier
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
                    lot.processed
                      ? 'border-slate-200 bg-slate-50 cursor-not-allowed'
                      : selectedLots.includes(lot.id) 
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
                          {lot.processed ? 'CERTIFIÉ' : lot.status}
                        </span>
                        {lot.processed && (
                          <Award className="text-blue-600" size={16} />
                        )}
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
                          <span className="text-cacao/60">Transformateur:</span>
                          <p className="font-bold text-cacao">{lot.fromTransformer}</p>
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

          {/* Certificateurs validés */}
          <div className="bg-white rounded-2xl border border-cacao/10 p-6">
            <h2 className="text-lg font-serif font-black text-cacao mb-6 flex items-center gap-2">
              <Award size={20} />
              Certificateurs Validés
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
                        <div>
                          <span className="text-cacao/60">Standards:</span>
                          <p className="font-bold text-cacao text-xs">{partner.standards.join(', ')}</p>
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
            {selectedLots.length} lot(s) sélectionné(s) • {selectedPartner ? '1 certificateur sélectionné' : 'Aucun certificateur sélectionné'}
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={initiateCertification}
            disabled={selectedLots.length === 0 || !selectedPartner}
            className={`
              px-8 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2
              ${selectedLots.length > 0 && selectedPartner
                ? 'bg-gold text-cacao hover:bg-gold/90 shadow-lg' 
                : 'bg-cacao/20 text-cacao/60 cursor-not-allowed'
              }
            `}
          >
            <Award size={18} />
            Soumettre à Certification
            <ChevronRight size={18} />
          </motion.button>
        </div>

        {/* Historique des certifications */}
        <div className="mt-8 bg-white rounded-2xl border border-cacao/10 p-6">
          <h2 className="text-lg font-serif font-black text-cacao mb-6 flex items-center gap-2">
            <Calendar size={20} />
            Historique des Certifications
          </h2>

          <div className="space-y-3">
            {certificationHistory.map((certification) => (
              <motion.div
                key={certification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="border border-cacao/10 rounded-xl p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-cacao">{certification.id}</h3>
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                        certification.status === 'confirmed' 
                          ? 'text-emerald-600 bg-emerald-50' 
                          : 'text-amber-600 bg-amber-50'
                        }`}>
                        {certification.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-cacao/60">Lots:</span>
                        <p className="font-bold text-cacao">{certification.lotId}</p>
                      </div>
                      <div>
                        <span className="text-cacao/60">Certificateur:</span>
                        <p className="font-bold text-cacao">{certification.toPartner}</p>
                      </div>
                      <div>
                        <span className="text-cacao/60">Poids:</span>
                        <p className="font-bold text-cacao">{certification.weight} kg</p>
                      </div>
                      <div>
                        <span className="text-cacao/60">Date:</span>
                        <p className="font-bold text-cacao">{certification.date}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-2 text-xs">
                      <span className="text-cacao/60">Hash:</span>
                      <code className="bg-cacao/10 px-2 py-1 rounded text-cacao font-mono">
                        {certification.blockchainHash?.slice(0, 10)}...
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
                    <span className="text-xs text-cacao/60">{certification.qrCode}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {/* Modal de confirmation de certification */}
      {showCertificationModal && (
        <div className="fixed inset-0 bg-cacao/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl border border-cacao/10 p-8 max-w-md w-full"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-serif font-black text-cacao">
                Demande de Certification
              </h3>
              <button
                onClick={() => setShowCertificationModal(false)}
                className="text-cacao/40 hover:text-cacao"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-cacao/5 rounded-xl p-4">
                <h4 className="font-bold text-cacao mb-2">Récapitulatif de la demande</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Lots:</span> {selectedLots.join(', ')}</p>
                  <p><span className="font-medium">Certificateur:</span> {selectedPartner?.name}</p>
                  <p><span className="font-medium">Poids total:</span> {selectedLots.reduce((total, lotId) => {
                    const lot = transformedLots.find(l => l.id === lotId);
                    return total + (lot?.weight || 0);
                  }, 0)} kg</p>
                  <p><span className="font-medium">Standards:</span> {selectedPartner?.standards.join(', ')}</p>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="text-green-600 mt-0.5" size={16} />
                  <div>
                    <p className="text-sm font-bold text-green-800 mb-1">
                      🏭 Certification finale avant exportation
                    </p>
                    <p className="text-xs text-green-700">
                      Une fois soumise, la demande sera traitée par le certificateur.
                      La certification sera inscrite sur la blockchain et visible par les importateurs.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            {isCertifying && (
              <div className="mb-6">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-cacao">Progression de la certification...</span>
                  <span className="font-bold text-cacao">{certificationProgress}%</span>
                </div>
                <div className="w-full bg-cacao/10 rounded-full h-2">
                  <div 
                    className="bg-gold h-2 rounded-full transition-all"
                    style={{ width: `${certificationProgress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowCertificationModal(false)}
                disabled={isCertifying}
                className="flex-1 px-4 py-3 border border-cacao/10 rounded-xl text-sm font-medium text-cacao hover:bg-cacao/5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Annuler
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={confirmCertification}
                disabled={isCertifying}
                className="flex-1 px-4 py-3 bg-gold text-cacao rounded-xl text-sm font-bold hover:bg-gold/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCertifying ? (
                  <>
                    <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Certification en cours...
                  </>
                ) : (
                  'Confirmer la Demande'
                )}
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
