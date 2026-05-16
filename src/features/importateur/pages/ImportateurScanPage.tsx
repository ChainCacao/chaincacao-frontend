import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, QrCode, Search, MapPin, Calendar,
  ShieldCheck, AlertCircle, CheckCircle2, Eye, Download,
  Package, Users, Hash, Info, X, ChevronRight,
  Globe2, Award, Truck, Factory, Link2, Unlink
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { lotService } from '../../../services/lot.service';
import { blockchainService } from '../../../services/blockchain.service';
import type { LotRecolte } from '../../../types/prisma';
import type { JourneyStep, OnChainVerification } from '../../../services/blockchain.service';

export default function ImportateurScanPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Real data from API
  const [lot, setLot] = useState<LotRecolte | null>(null);
  const [onChainData, setOnChainData] = useState<OnChainVerification | null>(null);
  const [journey, setJourney] = useState<JourneyStep[] | null>(null);
  const [blockchainConfigured, setBlockchainConfigured] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  const searchLot = useCallback(async (codeLot: string) => {
    setScanning(true);
    try {
      // 1. Get off-chain data via public verify endpoint
      const offChainLot = await lotService.verify(codeLot);
      setLot(offChainLot);

      // 2. Get on-chain verification in parallel
      try {
        const bcResult = await blockchainService.verify(codeLot);
        setOnChainData(bcResult.onChain);
        setBlockchainConfigured(bcResult.blockchainConfigured);

        // 3. Get journey from blockchain
        if (bcResult.blockchainConfigured) {
          const journeyResult = await blockchainService.getJourney(codeLot);
          setJourney(journeyResult.journey);
        }
      } catch {
        // Blockchain not configured — that's OK, we still have off-chain data
        setBlockchainConfigured(false);
      }

      toast.success('Lot trouvé !');
    } catch {
      setLot(null);
      setOnChainData(null);
      setJourney(null);
      toast.error('Lot non trouvé');
    } finally {
      setScanning(false);
    }
  }, []);

  const handleScan = async () => {
    setScanning(true);
    try {
      // In a real app, this would invoke a QR scanner library
      // For now, simulate scanning a demo lot code
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.error('Scan QR non disponible en démo. Utilisez la recherche par numéro de lot.');
    } finally {
      setScanning(false);
    }
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      toast.error('Veuillez entrer un numéro de lot');
      return;
    }
    searchLot(searchTerm.trim());
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-emerald-600 bg-emerald-50';
      case 'CONFORME': return 'text-emerald-600 bg-emerald-50';
      case 'ALERTE': return 'text-amber-600 bg-amber-50';
      case 'NON_CONFORME': return 'text-red-600 bg-red-50';
      case 'EN_ATTENTE': return 'text-amber-600 bg-amber-50';
      default: return 'text-cacao/60 bg-cacao/10';
    }
  };

  const getEtapeLabel = (etape: string) => {
    const labels: Record<string, string> = {
      COLLECTE_FERME: 'Récolte',
      STOCKAGE_COOPERATIVE: 'Stockage Coopérative',
      FUSION_LOTS: 'Fusion de Lots',
      EN_COURS_DE_TRANSIT: 'En Transit',
      LIVRE_TRANSFORMATEUR: 'Livré Transformateur',
      LIVRE_EXPORTATEUR: 'Livré Exportateur',
    };
    return labels[etape] || etape;
  };

  const getEtapeIcon = (etape: string) => {
    switch (etape) {
      case 'COLLECTE_FERME': return <Package size={16} />;
      case 'STOCKAGE_COOPERATIVE': return <Users size={16} />;
      case 'FUSION_LOTS': return <Link2 size={16} />;
      case 'EN_COURS_DE_TRANSIT': return <Truck size={16} />;
      case 'LIVRE_TRANSFORMATEUR': return <Factory size={16} />;
      case 'LIVRE_EXPORTATEUR': return <Globe2 size={16} />;
      default: return <Package size={16} />;
    }
  };

  const getActionTypeIcon = (type: string) => {
    switch (type) {
      case 'PESEE': return <Package size={16} />;
      case 'STOCKAGE': return <Users size={16} />;
      case 'TRANSIT': return <Truck size={16} />;
      case 'LIVRAISON': return <CheckCircle2 size={16} />;
      case 'CERTIFICATION': return <Award size={16} />;
      case 'EXPORT': return <Globe2 size={16} />;
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
            {/* Blockchain status indicator */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold ${
              blockchainConfigured
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-amber-50 text-amber-700'
            }`}>
              {blockchainConfigured ? <Link2 size={14} /> : <Unlink size={14} />}
              {blockchainConfigured ? 'Blockchain Connectée' : 'Blockchain Non Configurée'}
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
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Ex: CAC-2025-A1B2C3"
                    className="flex-1 px-4 py-2 border border-cacao/10 rounded-lg text-sm focus:ring-4 focus:ring-gold/10 focus:border-gold outline-none"
                  />
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSearch}
                    disabled={scanning}
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

            {lot ? (
              <div className="space-y-4">
                {/* Basic Info */}
                <div className="bg-cacao/5 rounded-xl p-4">
                  <h3 className="font-bold text-cacao mb-3">Informations Générales</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-cacao/60">Code Lot:</span>
                      <p className="font-bold text-cacao">{lot.codeLot}</p>
                    </div>
                    <div>
                      <span className="text-cacao/60">Filière:</span>
                      <p className="font-bold text-cacao">{lot.filiere}</p>
                    </div>
                    <div>
                      <span className="text-cacao/60">Poids Net:</span>
                      <p className="font-bold text-cacao">{lot.poidsNetKg} kg</p>
                    </div>
                    <div>
                      <span className="text-cacao/60">Espèce:</span>
                      <p className="font-bold text-cacao">{lot.especeVariete}</p>
                    </div>
                    {lot.agriculteur && (
                      <div>
                        <span className="text-cacao/60">Agriculteur:</span>
                        <p className="font-bold text-cacao">{lot.agriculteur.nom} {lot.agriculteur.prenom}</p>
                      </div>
                    )}
                    {lot.cooperative && (
                      <div>
                        <span className="text-cacao/60">Coopérative:</span>
                        <p className="font-bold text-cacao">{lot.cooperative.nomCoop}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Supply Chain */}
                <div className="bg-gold/5 rounded-xl p-4">
                  <h3 className="font-bold text-cacao mb-3">Chaîne d'Approvisionnement</h3>
                  <div className="space-y-2 text-sm">
                    {lot.agriculteur && (
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-cacao/40" />
                        <span className="text-cacao/60">Agriculteur:</span>
                        <span className="font-bold text-cacao">{lot.agriculteur.nom} {lot.agriculteur.prenom}</span>
                      </div>
                    )}
                    {lot.cooperative && (
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-cacao/40" />
                        <span className="text-cacao/60">Coopérative:</span>
                        <span className="font-bold text-cacao">{lot.cooperative.nomCoop}</span>
                      </div>
                    )}
                    {lot.transformateur && (
                      <div className="flex items-center gap-2">
                        <Factory size={16} className="text-cacao/40" />
                        <span className="text-cacao/60">Transformateur:</span>
                        <span className="font-bold text-cacao">{lot.transformateur.raisonSociale}</span>
                      </div>
                    )}
                    {lot.exportateur && (
                      <div className="flex items-center gap-2">
                        <Globe2 size={16} className="text-cacao/40" />
                        <span className="text-cacao/60">Exportateur:</span>
                        <span className="font-bold text-cacao">{lot.exportateur.raisonSociale}</span>
                      </div>
                    )}
                    {lot.certifieur && (
                      <div className="flex items-center gap-2">
                        <Award size={16} className="text-cacao/40" />
                        <span className="text-cacao/60">Certificateur:</span>
                        <span className="font-bold text-cacao">{lot.certifieur.nomOrganisme}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* EUDR Compliance */}
                <div className={`rounded-xl p-4 ${
                  lot.statutConformiteEUDR === 'CONFORME' ? 'bg-emerald-50' :
                  lot.statutConformiteEUDR === 'ALERTE' ? 'bg-amber-50' :
                  lot.statutConformiteEUDR === 'NON_CONFORME' ? 'bg-red-50' :
                  'bg-blue-50'
                }`}>
                  <h3 className="font-bold text-cacao mb-3">Conformité EUDR</h3>
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={20} className={
                      lot.statutConformiteEUDR === 'CONFORME' ? 'text-emerald-600' :
                      lot.statutConformiteEUDR === 'NON_CONFORME' ? 'text-red-600' :
                      'text-amber-600'
                    } />
                    <span className={`font-bold ${
                      lot.statutConformiteEUDR === 'CONFORME' ? 'text-emerald-600' :
                      lot.statutConformiteEUDR === 'NON_CONFORME' ? 'text-red-600' :
                      'text-amber-600'
                    }`}>
                      {lot.statutConformiteEUDR === 'CONFORME' ? 'Conforme' :
                       lot.statutConformiteEUDR === 'NON_CONFORME' ? 'Non Conforme' :
                       lot.statutConformiteEUDR === 'ALERTE' ? 'Alerte' :
                       'En Attente'}
                    </span>
                  </div>
                  <p className="text-xs text-cacao/60 mt-2">
                    <MapPin size={12} className="inline" /> GPS: {lot.agentGpsLatitude}, {lot.agentGpsLongitude}
                  </p>
                </div>

                {/* Blockchain verification */}
                {blockchainConfigured && onChainData && (
                  <div className="bg-purple-50 rounded-xl p-4">
                    <h3 className="font-bold text-cacao mb-3 flex items-center gap-2">
                      <Hash size={16} />
                      Vérification On-Chain
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-cacao/60">Existe on-chain:</span>
                        <span className={`font-bold ${onChainData.exists ? 'text-emerald-600' : 'text-red-600'}`}>
                          {onChainData.exists ? 'Oui' : 'Non'}
                        </span>
                      </div>
                      {onChainData.exists && (
                        <>
                          <div className="flex items-center gap-2">
                            <span className="text-cacao/60">Conformité on-chain:</span>
                            <span className={`font-bold ${getStatusColor(onChainData.statutConformiteEUDR)} px-2 py-0.5 rounded`}>
                              {onChainData.statutConformiteEUDR}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-cacao/60">Étape on-chain:</span>
                            <span className="font-bold text-cacao">{getEtapeLabel(onChainData.statutTrajet)}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Blockchain Tx Hash */}
                {lot.blockchainTxHash && (
                  <div className="bg-cacao/5 rounded-xl p-4">
                    <h3 className="font-bold text-cacao mb-2 flex items-center gap-2">
                      <Hash size={16} />
                      Hash Blockchain
                    </h3>
                    <code className="block bg-cacao/10 p-2 rounded text-cacao font-mono text-xs break-all">
                      {lot.blockchainTxHash}
                    </code>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowDetailsModal(true)}
                    className="flex-1 px-4 py-2 bg-gold text-cacao rounded-lg text-sm font-medium hover:bg-gold/90 transition-all"
                  >
                    <Eye size={16} className="inline mr-1" />
                    Voir Détails Complets
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

        {/* Off-chain Journey (from DB historique) */}
        {lot && lot.lothistorique && lot.lothistorique.length > 0 && (
          <div className="mt-8 bg-white rounded-2xl border border-cacao/10 p-6">
            <h2 className="text-lg font-serif font-black text-cacao mb-6 flex items-center gap-2">
              <Calendar size={20} />
              Historique du Lot (Base de données)
            </h2>
            <div className="space-y-4">
              {lot.lothistorique.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-4 p-4 border border-cacao/10 rounded-xl"
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gold rounded-xl flex items-center justify-center text-cacao">
                      {getEtapeIcon(entry.etape)}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-cacao">{getEtapeLabel(entry.etape)}</h4>
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                        entry.blockchainStatus === 'ANCRE_SUR_LA_CHAINE'
                          ? 'bg-emerald-50 text-emerald-600'
                          : entry.blockchainStatus === 'ECHEC_ANCRAGE'
                            ? 'bg-red-50 text-red-600'
                            : 'bg-amber-50 text-amber-600'
                      }`}>
                        {entry.blockchainStatus === 'ANCRE_SUR_LA_CHAINE' ? 'Ancré' :
                         entry.blockchainStatus === 'ECHEC_ANCRAGE' ? 'Échec' : 'En attente'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-cacao/60">Action:</span>
                        <p className="font-bold text-cacao">{entry.action}</p>
                      </div>
                      <div>
                        <span className="text-cacao/60">Acteur:</span>
                        <p className="font-bold text-cacao">{entry.acteurNom} ({entry.acteurRole})</p>
                      </div>
                    </div>
                    {entry.blockchainTxHash && (
                      <div className="flex items-center gap-2 mt-2 text-xs">
                        <Hash size={12} className="text-cacao/40" />
                        <code className="bg-cacao/10 px-2 py-0.5 rounded text-cacao font-mono">
                          {entry.blockchainTxHash.slice(0, 18)}...
                        </code>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* On-chain Journey (from Blockchain) */}
        {blockchainConfigured && journey && journey.length > 0 && (
          <div className="mt-8 bg-white rounded-2xl border border-purple-200 p-6">
            <h2 className="text-lg font-serif font-black text-cacao mb-6 flex items-center gap-2">
              <Hash size={20} className="text-purple-600" />
              Parcours Blockchain (On-Chain)
            </h2>
            <div className="space-y-4">
              {journey.map((step, index) => (
                <motion.div
                  key={step.historiqueIndex}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-4 p-4 border border-purple-200 rounded-xl"
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
                      {getActionTypeIcon(step.actionType)}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-cacao">{getEtapeLabel(step.etape)}</h4>
                      <span className="px-2 py-1 rounded-lg text-xs font-medium bg-purple-50 text-purple-600">
                        {step.actionType}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-cacao/60">Action:</span>
                        <p className="font-bold text-cacao">{step.action}</p>
                      </div>
                      <div>
                        <span className="text-cacao/60">Acteur:</span>
                        <p className="font-bold text-cacao">{step.acteurNom || '—'}</p>
                      </div>
                      {step.timestamp && (
                        <div className="col-span-2">
                          <span className="text-cacao/60">Timestamp:</span>
                          <p className="font-bold text-cacao text-xs">{new Date(step.timestamp).toLocaleString()}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Details Modal */}
      {showDetailsModal && lot && (
        <div className="fixed inset-0 bg-cacao/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl border border-cacao/10 p-8 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-serif font-black text-cacao">
                Détails Complets du Lot {lot.codeLot}
              </h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-cacao/40 hover:text-cacao"
              >
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Physical characteristics */}
              <div className="space-y-4">
                <h4 className="font-bold text-cacao mb-3">Caractéristiques Physiques</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-cacao/60">Poids Brut:</span><span className="font-bold">{lot.poidsBrutKg} kg</span></div>
                  <div className="flex justify-between"><span className="text-cacao/60">Poids Net:</span><span className="font-bold">{lot.poidsNetKg} kg</span></div>
                  <div className="flex justify-between"><span className="text-cacao/60">Sacs Jute:</span><span className="font-bold">{lot.nbSacsJute}</span></div>
                  <div className="flex justify-between"><span className="text-cacao/60">Taux Humidité:</span><span className="font-bold">{lot.tauxHumidite}%</span></div>
                  <div className="flex justify-between"><span className="text-cacao/60">Filière:</span><span className="font-bold">{lot.filiere}</span></div>
                  <div className="flex justify-between"><span className="text-cacao/60">Espèce/Variété:</span><span className="font-bold">{lot.especeVariete}</span></div>
                </div>
              </div>

              {/* Blockchain Info */}
              <div className="space-y-4">
                <h4 className="font-bold text-cacao mb-3">Informations Blockchain</h4>
                <div className="space-y-3">
                  {lot.blockchainTxHash && (
                    <div>
                      <span className="text-sm text-cacao/60">Hash Transaction:</span>
                      <code className="block bg-cacao/10 p-3 rounded text-cacao font-mono text-xs break-all">
                        {lot.blockchainTxHash}
                      </code>
                    </div>
                  )}
                  {lot.tokenId && (
                    <div>
                      <span className="text-sm text-cacao/60">Token ID:</span>
                      <p className="font-bold text-cacao">{lot.tokenId}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-sm text-cacao/60">Statut Étape:</span>
                    <span className={`ml-2 px-3 py-1 rounded-lg text-sm font-medium ${getStatusColor(lot.statutTrajet)}`}>
                      {getEtapeLabel(lot.statutTrajet)}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-cacao/60">Conformité EUDR:</span>
                    <span className={`ml-2 px-3 py-1 rounded-lg text-sm font-medium ${getStatusColor(lot.statutConformiteEUDR)}`}>
                      {lot.statutConformiteEUDR}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-cacao/60">Coordonnées GPS:</span>
                    <p className="font-bold text-cacao text-xs">{lot.agentGpsLatitude}, {lot.agentGpsLongitude}</p>
                  </div>
                  {lot.sousLots && lot.sousLots.length > 0 && (
                    <div>
                      <span className="text-sm text-cacao/60">Sous-lots (fusion):</span>
                      <div className="mt-1 space-y-1">
                        {lot.sousLots.map(sub => (
                          <div key={sub.id} className="text-xs bg-cacao/5 p-2 rounded flex items-center gap-2">
                            <Link2 size={12} />
                            <span className="font-bold">{sub.codeLot || sub.id}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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
