import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Layers, Weight, 
  Package, Search, 
  Scale, ShieldCheck, MapPin,
  Calendar, TrendingUp, Eye, Bell, QrCode
} from 'lucide-react';

// --- Types ---
interface Lot {
  id: string;
  weight: number;
  origin: string;
  status: string;
  date: string;
  quality: string;
  eudrCompliant: boolean;
  gpsCoordinates?: string;
  blockchainHash?: string;
  groupingStatus?: 'pending' | 'in_progress' | 'completed';
  groupedLots?: string[];
}

interface GroupedLot {
  id: string;
  originalLots: string[];
  totalWeight: number;
  groupingDate: string;
  blockchainHash: string;
  status: 'pending' | 'confirmed' | 'exported';
  destination?: string;
}

export default function LotGroupingView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<'individual' | 'grouped'>('individual');
  const [selectedLot, setSelectedLot] = useState<Lot | null>(null);

  // Mock data pour l'agriculteur
  const [individualLots] = useState<Lot[]>([
    {
      id: 'LOT-2024-001',
      weight: 250,
      origin: 'Kara Sud',
      status: 'En attente de groupement',
      date: '12/03/2024',
      quality: 'Premium A',
      eudrCompliant: true,
      gpsCoordinates: '9.5345°N, 1.0123°E',
      groupingStatus: 'pending'
    },
    {
      id: 'LOT-2024-002',
      weight: 180,
      origin: 'Pya',
      status: 'En cours de groupement',
      date: '15/03/2024',
      quality: 'Premium A',
      eudrCompliant: true,
      gpsCoordinates: '9.5234°N, 1.0456°E',
      groupingStatus: 'in_progress'
    },
    {
      id: 'LOT-2024-003',
      weight: 320,
      origin: 'Niamtougou',
      status: 'Groupé',
      date: '18/03/2024',
      quality: 'Premium A+',
      eudrCompliant: true,
      gpsCoordinates: '9.5678°N, 1.0678°E',
      groupingStatus: 'completed',
      blockchainHash: '0x7f9a...3d2e'
    }
  ]);

  const [groupedLots] = useState<GroupedLot[]>([
    {
      id: 'GRP-2024-001',
      originalLots: ['LOT-2024-003', 'LOT-2024-004', 'LOT-2024-005'],
      totalWeight: 850,
      groupingDate: '20/03/2024',
      blockchainHash: '0x7f9a...3d2e',
      status: 'confirmed',
      destination: 'Port de Lomé'
    }
  ]);

  const filteredIndividualLots = useMemo(() => {
    return individualLots.filter(lot => 
      lot.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      lot.origin.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [individualLots, searchTerm]);

  const filteredGroupedLots = useMemo(() => {
    return groupedLots.filter(lot => 
      lot.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [groupedLots, searchTerm]);

  const getStatusBadge = (status: string) => {
    const styles = {
      'pending': 'bg-amber-50 text-amber-600 border-amber-100',
      'in_progress': 'bg-blue-50 text-blue-600 border-blue-100',
      'completed': 'bg-emerald-50 text-emerald-600 border-emerald-100',
      'confirmed': 'bg-emerald-50 text-emerald-600 border-emerald-100',
      'exported': 'bg-purple-50 text-purple-600 border-purple-100'
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${styles[status] || styles.pending}`}>
        {status === 'pending' && 'En attente'}
        {status === 'in_progress' && 'En cours'}
        {status === 'completed' && 'Terminé'}
        {status === 'confirmed' && 'Confirmé'}
        {status === 'exported' && 'Exporté'}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-cream/30">
      {/* HEADER */}
      <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-cacao/10 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.history.back()}
              className="p-2.5 bg-white shadow-sm border border-cacao/10 rounded-xl text-slate-600 hover:text-cacao transition-all"
            >
              <ArrowLeft size={20} />
            </motion.button>
            <div>
              <h2 className="text-xl font-serif font-black text-cacao tracking-tight flex items-center gap-2">
                <Layers className="text-gold" size={24} />
                Suivi des Groupements
              </h2>
              <p className="text-[11px] font-bold text-gold/70 uppercase tracking-[0.2em]">Traçabilité Blockchain</p>
            </div>
          </div>
          <button className="bg-gold/10 text-gold px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-gold/20 transition-all">
            <Bell size={16} />
            Notifications
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 pt-8 pb-12">
        {/* BARRE DE RECHERCHE ET STATS */}
        <div className="space-y-6 mb-8">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-gold transition-colors" size={18} />
            <input 
              type="text"
              placeholder="Rechercher un ID lot, localisation..."
              className="w-full bg-white border border-cacao/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-4 focus:ring-gold/10 focus:border-gold outline-none transition-all shadow-sm"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* CARDS DE STATISTIQUES */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-cacao/10 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-cacao/10 rounded-xl flex items-center justify-center">
                  <Package className="text-cacao" size={20} />
                </div>
                <div>
                  <p className="text-2xl font-black text-cacao">{individualLots.length}</p>
                  <p className="text-xs text-cacao/60">Lots individuels</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-2xl border border-cacao/10 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center">
                  <Layers className="text-gold" size={20} />
                </div>
                <div>
                  <p className="text-2xl font-black text-cacao">{groupedLots.length}</p>
                  <p className="text-xs text-cacao/60">Lots groupés</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-2xl border border-cacao/10 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-10 rounded-xl flex items-center justify-center">
                  <Weight className="text-emerald-600" size={20} />
                </div>
                <div>
                  <p className="text-2xl font-black text-cacao">
                    {individualLots.reduce((sum, lot) => sum + lot.weight, 0)} kg
                  </p>
                  <p className="text-xs text-cacao/60">Poids total</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-2xl border border-cacao/10 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple/10 rounded-xl flex items-center justify-center">
                  <QrCode className="text-purple-600" size={20} />
                </div>
                <div>
                  <p className="text-2xl font-black text-cacao">100%</p>
                  <p className="text-xs text-cacao/60">Traçabilité</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('individual')}
            className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'individual'
                ? 'bg-cacao text-gold shadow-lg shadow-cacao/20'
                : 'bg-white text-cacao/60 border border-cacao/10'
            }`}
          >
            Lots Individuels
          </button>
          <button
            onClick={() => setActiveTab('grouped')}
            className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'grouped'
                ? 'bg-cacao text-gold shadow-lg shadow-cacao/20'
                : 'bg-white text-cacao/60 border border-cacao/10'
            }`}
          >
            Lots Groupés
          </button>
        </div>

        {/* CONTENU DYNAMIQUE */}
        <AnimatePresence mode="wait">
          {activeTab === 'individual' && (
            <motion.div
              key="individual"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <h3 className="text-[10px] font-black uppercase tracking-widest text-cacao/40 ml-2">
                Mes Lots Individuels ({filteredIndividualLots.length})
              </h3>
              
              {filteredIndividualLots.map((lot, index) => (
                <motion.div
                  key={lot.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-[2rem] border border-cacao/10 shadow-sm overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-cacao/5 rounded-2xl flex items-center justify-center">
                          <Package className="text-cacao" size={28} />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <p className="font-black text-cacao text-lg">{lot.id}</p>
                            {getStatusBadge(lot.groupingStatus || 'pending')}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-cacao/70">
                            <span className="flex items-center gap-1">
                              <MapPin size={14} />
                              {lot.origin}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar size={14} />
                              {lot.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Scale size={14} />
                              {lot.weight} kg
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mt-2">
                            {lot.eudrCompliant && (
                              <span className="flex items-center gap-1 text-emerald-600 text-[9px] font-black uppercase">
                                <ShieldCheck size={10} /> EUDR
                              </span>
                            )}
                            <span className="text-[9px] font-black text-gold uppercase">{lot.quality}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <button className="p-2.5 bg-cacao/10 text-cacao rounded-xl hover:bg-cacao/20 transition-all">
                          <Eye size={18} />
                        </button>
                        {lot.blockchainHash && (
                          <div className="text-right">
                            <p className="text-[8px] font-mono text-cacao/40">Hash Blockchain</p>
                            <p className="text-[10px] font-mono text-gold">{lot.blockchainHash}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'grouped' && (
            <motion.div
              key="grouped"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <h3 className="text-[10px] font-black uppercase tracking-widest text-cacao/40 ml-2">
                Lots Groupés ({filteredGroupedLots.length})
              </h3>
              
              {filteredGroupedLots.map((group, index) => (
                <motion.div
                  key={group.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-gold/5 to-cacao/5 rounded-[2rem] border border-gold/20 shadow-sm overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gold/20 rounded-2xl flex items-center justify-center">
                          <Layers className="text-gold" size={28} />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <p className="font-black text-cacao text-lg">{group.id}</p>
                            {getStatusBadge(group.status)}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-cacao/70">
                            <span className="flex items-center gap-1">
                              <Calendar size={14} />
                              {group.groupingDate}
                            </span>
                            <span className="flex items-center gap-1">
                              <Weight size={14} />
                              {group.totalWeight} kg
                            </span>
                            {group.destination && (
                              <span className="flex items-center gap-1">
                                <TrendingUp size={14} />
                                {group.destination}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white/50 rounded-2xl p-4 border border-gold/10">
                      <p className="text-[10px] font-black text-cacao/60 uppercase mb-2">Lots Origine</p>
                      <div className="flex flex-wrap gap-2">
                        {group.originalLots.map((lotId) => (
                          <span key={lotId} className="bg-cacao/10 text-cacao px-3 py-1 rounded-xl text-[10px] font-mono font-bold">
                            {lotId}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <p className="text-[8px] font-mono text-cacao/40">Hash Blockchain</p>
                        <p className="text-[10px] font-mono text-gold">{group.blockchainHash}</p>
                      </div>
                      <button className="bg-gold text-cacao px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-gold/80 transition-all">
                        <QrCode size={16} />
                        Voir Détails
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
