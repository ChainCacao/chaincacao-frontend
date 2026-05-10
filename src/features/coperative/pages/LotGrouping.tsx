import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Layers, CheckCircle2, Weight, 
  Package, ChevronRight, Search, 
  Scale, ShieldCheck, Activity, AlertTriangle, 
  Users, MapPin, Calendar, Bell, Send, Eye, 
  Clock, TrendingUp, FileText, AlertCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';

// --- Types ---
interface FarmerLot {
  id: string;
  weight: number;
  origin: string;
  status: string;
  date: string;
  producer: string;
  producerId: string;
  quality: string;
  eudrCompliant: boolean;
  gpsCoordinates?: string;
  blockchainHash?: string;
  lastVerification?: string;
  riskScore?: number;
}

interface FraudDetection {
  riskLevel: 'low' | 'medium' | 'high';
  inconsistencies: string[];
  recommendations: string[];
  canProceed: boolean;
}

interface GroupedLot {
  id: string;
  originalLots: FarmerLot[];
  totalWeight: number;
  groupingDate: string;
  blockchainHash: string;
  status: 'pending_validation' | 'validated' | 'exported' | 'flagged';
  fraudDetection: FraudDetection;
  destination?: string;
  exportDate?: string;
  notificationsSent: string[];
}

interface Props {
  availableLots: FarmerLot[];
  onBack: () => void;
  onConfirmGrouping: (selectedIds: string[], totalWeight: number) => void;
  onSendToExporter?: (groupedLotId: string) => void;
}

export default function LotGrouping({ availableLots, onBack, onConfirmGrouping, onSendToExporter }: Props) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFraudDetection, setShowFraudDetection] = useState(false);
  const [fraudAnalysis, setFraudAnalysis] = useState<FraudDetection | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Données de démonstration pour la coopérative - lots multi-agriculteurs avec différents niveaux de risque
  const demoLots: FarmerLot[] = [
    {
      id: 'LOT-2024-001',
      weight: 250,
      origin: 'Kara Sud',
      status: 'Disponible',
      date: '12/03/2024',
      producer: 'Koffi Mensah',
      producerId: 'AGR-001',
      quality: 'Premium A',
      eudrCompliant: true,
      gpsCoordinates: '9.5345°N, 1.0123°E',
      blockchainHash: '0x7f9a...3d2e',
      lastVerification: '10/03/2024',
      riskScore: 15
    },
    {
      id: 'LOT-2024-002',
      weight: 180,
      origin: 'Pya',
      status: 'Disponible',
      date: '15/03/2024',
      producer: 'Awa Diallo',
      producerId: 'AGR-002',
      quality: 'Premium A',
      eudrCompliant: true,
      gpsCoordinates: '9.5234°N, 1.0456°E',
      blockchainHash: '0x8b2c...4f5g',
      lastVerification: '14/03/2024',
      riskScore: 22
    },
    {
      id: 'LOT-2024-003',
      weight: 320,
      origin: 'Niamtougou',
      status: 'Disponible',
      date: '18/03/2024',
      producer: 'Samuel Eto',
      producerId: 'AGR-003',
      quality: 'Premium A+',
      eudrCompliant: true,
      gpsCoordinates: '9.5678°N, 1.0678°E',
      blockchainHash: '0x9c3d...5h6i',
      lastVerification: '17/03/2024',
      riskScore: 18
    },
    {
      id: 'LOT-2024-004',
      weight: 450,
      origin: 'Lomé',
      status: 'Disponible',
      date: '20/03/2024',
      producer: 'Kodjo Afan',
      producerId: 'AGR-004',
      quality: 'Premium B',
      eudrCompliant: false,
      gpsCoordinates: '6.1319°N, 1.2228°E',
      blockchainHash: '0x1d4e...6j7k',
      lastVerification: '19/03/2024',
      riskScore: 85
    },
    {
      id: 'LOT-2024-005',
      weight: 290,
      origin: 'Sokodé',
      status: 'Disponible',
      date: '22/03/2024',
      producer: 'Mariam Traoré',
      producerId: 'AGR-005',
      quality: 'Premium A',
      eudrCompliant: true,
      gpsCoordinates: '8.9833°N, 1.1333°E',
      blockchainHash: '0x2e5f...7l8m',
      lastVerification: '21/03/2024',
      riskScore: 35
    },
    {
      id: 'LOT-2024-006',
      weight: 380,
      origin: 'Atakpamé',
      status: 'Disponible',
      date: '25/03/2024',
      producer: 'Jean-Baptiste Koffi',
      producerId: 'AGR-006',
      quality: 'Premium A+',
      eudrCompliant: true,
      gpsCoordinates: '7.5333°N, 1.1667°E',
      blockchainHash: '0x3f6g...8m9n',
      lastVerification: '24/03/2024',
      riskScore: 28
    },
    {
      id: 'LOT-2024-007',
      weight: 220,
      origin: 'Kpalimé',
      status: 'Disponible',
      date: '27/03/2024',
      producer: 'Fatoumata Bamba',
      producerId: 'AGR-007',
      quality: 'Premium A',
      eudrCompliant: true,
      gpsCoordinates: '6.9167°N, 0.8333°E',
      blockchainHash: '0x4g7h...9n0o',
      lastVerification: '26/03/2024',
      riskScore: 42
    },
    {
      id: 'LOT-2024-008',
      weight: 510,
      origin: 'Bafilo',
      status: 'Disponible',
      date: '30/03/2024',
      producer: 'Mohamed Konaté',
      producerId: 'AGR-008',
      quality: 'Premium B',
      eudrCompliant: false,
      gpsCoordinates: '9.7333°N, 0.4167°E',
      blockchainHash: '0x5h8i...0o1p',
      lastVerification: '29/03/2024',
      riskScore: 92
    }
  ];

  // Utiliser les données de démonstration si aucune donnée n'est fournie
  const lotsToUse = availableLots.length > 0 ? availableLots : demoLots;

  const filteredLots = useMemo(() => {
    return lotsToUse.filter(lot => 
      lot.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      lot.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lot.producer.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [lotsToUse, searchTerm]);

  const summary = useMemo(() => {
    const selectedLots = lotsToUse.filter(lot => selectedIds.has(lot.id));
    const totalWeight = selectedLots.reduce((sum, lot) => sum + lot.weight, 0);
    const uniqueFarmers = new Set(selectedLots.map(lot => lot.producerId));
    return { 
      count: selectedLots.length, 
      weight: totalWeight,
      farmers: uniqueFarmers.size,
      farmersList: Array.from(uniqueFarmers)
    };
  }, [selectedIds, lotsToUse]);

  // Système de détection de fraude
  const analyzeForFraud = useMemo(() => {
    if (selectedIds.size < 2) return null;
    
    const selectedLots = lotsToUse.filter(lot => selectedIds.has(lot.id));
    const inconsistencies: string[] = [];
    const recommendations: string[] = [];
    let riskLevel: 'low' | 'medium' | 'high' = 'low';

    // Vérifier les incohérences de localisation
    const origins = selectedLots.map(lot => lot.origin);
    const uniqueOrigins = new Set(origins);
    if (uniqueOrigins.size > 3) {
      inconsistencies.push("Origines géographiques trop dispersées");
      riskLevel = 'medium';
    }

    // Vérifier les écarts de poids
    const weights = selectedLots.map(lot => lot.weight);
    const avgWeight = weights.reduce((sum, w) => sum + w, 0) / weights.length;
    const outlierLots = selectedLots.filter(lot => Math.abs(lot.weight - avgWeight) > avgWeight * 0.5);
    if (outlierLots.length > 0) {
      inconsistencies.push("Écarts de poids anormaux détectés");
      riskLevel = 'high';
    }

    // Vérifier la conformité EUDR
    const nonCompliantLots = selectedLots.filter(lot => !lot.eudrCompliant);
    if (nonCompliantLots.length > 0) {
      inconsistencies.push(`${nonCompliantLots.length} lots non conformes EUDR`);
      riskLevel = 'high';
    }

    // Vérifier les scores de risque
    const highRiskLots = selectedLots.filter(lot => (lot.riskScore || 0) > 70);
    if (highRiskLots.length > 0) {
      inconsistencies.push(`${highRiskLots.length} lots à haut risque`);
      riskLevel = 'high';
    }

    // Générer les recommandations
    if (riskLevel === 'high') {
      recommendations.push("Validation manuelle requise");
      recommendations.push("Contactez les agriculteurs concernés");
    } else if (riskLevel === 'medium') {
      recommendations.push("Vérification supplémentaire recommandée");
    } else {
      recommendations.push("Fusion peut procéder normalement");
    }

    const canProceed = riskLevel !== 'high';

    return {
      riskLevel,
      inconsistencies,
      recommendations,
      canProceed
    } as FraudDetection;
  }, [selectedIds, lotsToUse]);

  const toggleLot = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const sendNotificationsToFarmers = async (groupedLotId: string, farmerIds: string[]) => {
    if (!notificationsEnabled) return;
    
    try {
      // Simuler l'envoi de notifications aux agriculteurs
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      farmerIds.forEach(farmerId => {
        toast.success(`Notification envoyée à l'agriculteur ${farmerId}`);
      });
      
      return true;
    } catch (error) {
      toast.error("Erreur lors de l'envoi des notifications");
      return false;
    }
  };

  const handleFinalize = async () => {
    if (selectedIds.size < 2) {
      toast.error("Sélectionnez au moins 2 lots pour une fusion.");
      return;
    }

    // Analyser pour la détection de fraude
    const fraudResult = analyzeForFraud;
    if (fraudResult && !fraudResult.canProceed) {
      setShowFraudDetection(true);
      setFraudAnalysis(fraudResult);
      toast.error("Détection de risque élevé - Validation requise");
      return;
    }

    setIsProcessing(true);
    try {
      await new Promise(res => setTimeout(res, 3000));
      
      // Envoyer les notifications aux agriculteurs
      const notificationsSent = await sendNotificationsToFarmers(
        `GRP-${Date.now()}`,
        summary.farmersList
      );
      
      onConfirmGrouping(Array.from(selectedIds), summary.weight);
      toast.success(`Fusion validée et notifications envoyées à ${summary.farmers} agriculteurs`);
      
      // Optionnel: envoyer directement à l'exportateur si pas de fraude
      if (fraudResult?.riskLevel === 'low' && onSendToExporter) {
        setTimeout(() => {
          onSendToExporter(`GRP-${Date.now()}`);
        }, 2000);
      }
      
    } catch (err) {
      toast.error("Échec de la synchronisation blockchain.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendToExporter = async (groupedLotId: string) => {
    if (!onSendToExporter) return;
    
    setIsProcessing(true);
    try {
      await new Promise(res => setTimeout(res, 2000));
      onSendToExporter(groupedLotId);
      toast.success("Lot envoyé à l'exportateur avec succès");
    } catch (err) {
      toast.error("Erreur lors de l'envoi à l'exportateur");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream/30 pb-32">
      {/* HEADER FIXE */}
      <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-cacao/10 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="p-2.5 bg-white shadow-sm border border-cacao/10 rounded-xl text-slate-600 hover:text-cacao transition-all"
            >
              <ArrowLeft size={20} />
            </motion.button>
            <div>
              <h2 className="text-xl font-serif font-black text-cacao tracking-tight flex items-center gap-2">
                <Layers className="text-gold" size={24} />
                Fusion Multi-Agriculteurs
              </h2>
              <p className="text-[11px] font-bold text-gold/70 uppercase tracking-[0.2em]">Coopérative - Validation & Export</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border transition-all ${
                notificationsEnabled 
                  ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                  : 'bg-slate-50 text-slate-500 border-slate-200'
              }`}
            >
              <Bell size={12} className="inline mr-1" />
              {notificationsEnabled ? 'ON' : 'OFF'}
            </button>
            <div className="bg-cacao/5 px-3 py-1 rounded-full text-[10px] font-bold text-cacao/60 uppercase border border-cacao/10">
              Étape 02/03
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-6 pt-8">
        {/* BARRE DE RECHERCHE & INFO */}
        <div className="space-y-6">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-gold transition-colors" size={18} />
            <input 
              type="text"
              placeholder="Rechercher un ID lot, agriculteur, localisation..."
              className="w-full bg-white border border-cacao/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-4 focus:ring-gold/10 focus:border-gold outline-none transition-all shadow-sm"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* STATISTIQUES MULTI-AGRICULTEURS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white p-3 rounded-2xl border border-cacao/10 shadow-sm">
              <div className="flex items-center gap-2">
                <Package className="text-cacao" size={16} />
                <div>
                  <p className="text-lg font-black text-cacao">{summary.count}</p>
                  <p className="text-[9px] text-cacao/60">Lots sélectionnés</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-cacao/10 shadow-sm">
              <div className="flex items-center gap-2">
                <Users className="text-gold" size={16} />
                <div>
                  <p className="text-lg font-black text-cacao">{summary.farmers}</p>
                  <p className="text-[9px] text-cacao/60">Agriculteurs</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-cacao/10 shadow-sm">
              <div className="flex items-center gap-2">
                <Weight className="text-gold" size={16} />
                <div>
                  <p className="text-lg font-black text-cacao">{summary.weight}kg</p>
                  <p className="text-[9px] text-cacao/60">Poids total</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-cacao/10 shadow-sm">
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-emerald-600" size={16} />
                <div>
                  <p className="text-lg font-black text-cacao">100%</p>
                  <p className="text-[9px] text-cacao/60">Traçabilité</p>
                </div>
              </div>
            </div>
          </div>

          {/* ALERTE DÉTECTION FRAUDE */}
          {analyzeForFraud && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`border-2 rounded-[2.5rem] p-5 ${
                analyzeForFraud.riskLevel === 'high' 
                  ? 'bg-red-50 border-red-200' 
                  : analyzeForFraud.riskLevel === 'medium'
                  ? 'bg-amber-50 border-amber-200'
                  : 'bg-emerald-50 border-emerald-200'
              }`}
            >
              <div className="flex gap-4">
                <div className={`p-3 rounded-xl ${
                  analyzeForFraud.riskLevel === 'high' 
                    ? 'bg-red-100' 
                    : analyzeForFraud.riskLevel === 'medium'
                    ? 'bg-amber-100'
                    : 'bg-emerald-100'
                }`}>
                  {analyzeForFraud.riskLevel === 'high' && <AlertTriangle className="text-red-600" size={20} />}
                  {analyzeForFraud.riskLevel === 'medium' && <AlertCircle className="text-amber-600" size={20} />}
                  {analyzeForFraud.riskLevel === 'low' && <CheckCircle2 className="text-emerald-600" size={20} />}
                </div>
                <div className="flex-1">
                  <p className={`font-bold mb-2 ${
                    analyzeForFraud.riskLevel === 'high' 
                      ? 'text-red-800' 
                      : analyzeForFraud.riskLevel === 'medium'
                      ? 'text-amber-800'
                      : 'text-emerald-800'
                  }`}>
                    {analyzeForFraud.riskLevel === 'high' && '⚠️ RISQUE ÉLEVÉ DÉTECTÉ'}
                    {analyzeForFraud.riskLevel === 'medium' && '⚡ RISQUE MOYEN'}
                    {analyzeForFraud.riskLevel === 'low' && '✅ FAIBLE RISQUE'}
                  </p>
                  {analyzeForFraud.inconsistencies.length > 0 && (
                    <div className="mb-2">
                      <p className="text-xs font-bold text-slate-600 mb-1">Incohérences détectées:</p>
                      <ul className="text-xs space-y-1">
                        {analyzeForFraud.inconsistencies.map((inc, i) => (
                          <li key={i} className="flex items-center gap-1">
                            <span className="w-1 h-1 bg-current rounded-full"></span>
                            {inc}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {analyzeForFraud.recommendations.map((rec, i) => (
                      <span key={i} className="text-xs bg-white/70 px-2 py-1 rounded-lg font-medium">
                        {rec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* LISTE DES LOTS */}
        <div className="mt-8 space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-cacao/40 ml-2">Lots Cacao Disponibles ({filteredLots.length})</h3>
          
          <AnimatePresence mode='popLayout'>
            {filteredLots.length > 0 ? (
              filteredLots.map((lot, index) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  key={lot.id}
                  onClick={() => toggleLot(lot.id)}
                  className={`
                    relative cursor-pointer overflow-hidden p-6 rounded-[2rem] border-2 transition-all duration-300
                    ${selectedIds.has(lot.id) 
                      ? 'border-gold bg-white shadow-xl shadow-gold/20 -translate-y-1' 
                      : 'border-cacao/10 bg-white shadow-sm hover:border-cacao/20'}
                  `}
                >
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-4">
                      <div className={`
                        w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500
                        ${selectedIds.has(lot.id) ? 'bg-gold text-white rotate-12 shadow-lg' : 'bg-cacao/5 text-cacao/60'}
                      `}>
                        <Package size={28} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-black text-cacao">{lot.id}</p>
                          {selectedIds.has(lot.id) && (
                            <span className="bg-gold/10 text-gold text-[9px] px-2 py-0.5 rounded-full font-bold uppercase">Sélectionné</span>
                          )}
                          {(lot.riskScore || 0) > 70 && (
                            <span className="bg-red-100 text-red-600 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase">
                              <AlertTriangle size={8} className="inline mr-1" />
                              RISQUE
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs">
                          <span className="text-cacao/70 font-medium">{lot.producer}</span>
                          <span className="text-gold/60">•</span>
                          <span className="text-cacao/70 font-medium">{lot.origin}</span>
                          <span className="text-gold/60">•</span>
                          <span className="text-[9px] font-mono text-cacao/40">{lot.producerId}</span>
                        </div>
                        <div className="flex items-center gap-3 mt-2">
                          {lot.eudrCompliant && (
                            <span className="flex items-center gap-1 text-emerald-600 text-[9px] font-black uppercase">
                              <ShieldCheck size={10} /> EUDR
                            </span>
                          )}
                          <span className="text-[9px] font-mono text-cacao/40">{lot.date}</span>
                          {lot.lastVerification && (
                            <span className="flex items-center gap-1 text-blue-600 text-[9px] font-black uppercase">
                              <Clock size={10} /> Vérifié
                            </span>
                          )}
                        </div>
                        {lot.blockchainHash && (
                          <div className="mt-2 bg-cacao/5 rounded-lg px-2 py-1">
                            <p className="text-[8px] font-mono text-cacao/60">Hash: {lot.blockchainHash}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-5">
                      <div className="text-right">
                        <div className="flex items-center gap-1.5 justify-end">
                          <Scale size={14} className="text-gold/60" />
                          <p className="font-black text-cacao text-lg">{lot.weight} kg</p>
                        </div>
                        <div className="flex items-center gap-2 justify-end mt-1">
                          <span className="text-[9px] font-black text-gold uppercase tracking-wider">{lot.quality}</span>
                          <span className="text-[8px] text-cacao/40">Grade</span>
                        </div>
                      </div>
                      <div className={`
                        w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-300
                        ${selectedIds.has(lot.id) ? 'bg-gold border-gold scale-110 shadow-lg shadow-gold/40' : 'border-cacao/20'}
                      `}>
                        {selectedIds.has(lot.id) && <CheckCircle2 size={16} className="text-white" strokeWidth={3} />}
                      </div>
                    </div>
                  </div>
                  {/* Effet visuel au clic */}
                  {selectedIds.has(lot.id) && (
                    <motion.div 
                      layoutId="active-bg"
                      className="absolute inset-0 bg-gradient-to-r from-gold/5 to-transparent pointer-events-none"
                    />
                  )}
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="text-center py-20 bg-cacao/5 rounded-[2.5rem] border-2 border-dashed border-cacao/10"
              >
                 <Package size={48} className="mx-auto mb-4 text-cacao/20" />
                 <p className="font-bold text-cacao/60">Aucun lot disponible</p>
                 <p className="text-xs text-cacao/40 mt-1">Vérifiez vos filtres de recherche.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* BARRE DE RÉSUMÉ FLOTTANTE */}
      <div className="fixed bottom-8 left-6 right-6 z-40">
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="max-w-xl mx-auto bg-cacao rounded-[2.5rem] p-4 pl-8 shadow-[0_20px_50px_rgba(45,27,19,0.4)] border border-gold/20 flex items-center justify-between gap-4"
        >
          <div className="py-2">
            <div className="flex items-center gap-3 text-gold">
              <Weight size={20} strokeWidth={2.5} />
              <span className="text-2xl font-black tabular-nums">{summary.weight} kg</span>
            </div>
            <p className="text-cream/40 text-[10px] font-bold uppercase tracking-widest mt-0.5">
              {summary.count} lot{summary.count > 1 ? 's' : ''} • {summary.farmers} agriculteur{summary.farmers > 1 ? 's' : ''}
            </p>
            {notificationsEnabled && (
              <p className="text-emerald-400 text-[9px] font-medium mt-1">
                <Bell size={10} className="inline mr-1" />
                Notifications activées
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            {analyzeForFraud?.riskLevel === 'low' && selectedIds.size >= 2 && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                className="bg-emerald-600 text-white px-4 py-3 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg"
              >
                <Send size={14} />
                Export Direct
              </motion.button>
            )}
            
            <motion.button 
              whileHover={selectedIds.size >= 1 ? { scale: 1.02, x: 2 } : {}}
              whileTap={{ scale: 0.95 }}
              disabled={selectedIds.size === 0 || isProcessing || (analyzeForFraud?.riskLevel === 'high')}
              onClick={handleFinalize}
              className={`
                relative overflow-hidden group flex items-center gap-3 px-10 py-5 rounded-[1.8rem] font-bold text-[11px] uppercase tracking-[0.15em] transition-all
                ${selectedIds.size > 0 && analyzeForFraud?.riskLevel !== 'high'
                  ? 'bg-gold text-cacao shadow-xl shadow-gold/20' 
                  : 'bg-white/10 text-cream/30 cursor-not-allowed'}
              `}
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-cacao" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Fusion & Notifications...
                </span>
              ) : (
                <>
                  <Activity className="w-4 h-4" />
                  {analyzeForFraud?.riskLevel === 'high' ? 'Risque Élevé' : 'Fusion & Notifier'}
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
