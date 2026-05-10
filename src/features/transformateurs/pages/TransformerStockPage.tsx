import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Package, Search, Filter, Calendar,
  AlertCircle, CheckCircle2, Clock, Play, Eye,
  Thermometer, Droplets, Hash, QrCode, Truck,
  Factory, Award, BarChart3, TrendingUp, Users
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface StockLot {
  id: string;
  originalLotId: string;
  weight: number;
  origin: string;
  status: 'received' | 'in_production' | 'transformed' | 'transferred';
  receivedDate: string;
  cooperative: string;
  quality: string;
  transformationHash?: string;
  qrCode: string;
  measurements: {
    temperature: number;
    humidity: number;
  };
  expiryDate: string;
  storageLocation: string;
  batchNumber: string;
}

export default function TransformerStockPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedLots, setSelectedLots] = useState<string[]>([]);

  // Données simulées de stock
  const stockLots: StockLot[] = [
    {
      id: 'STOCK-2024-001',
      originalLotId: 'LOT-2024-015',
      weight: 500,
      origin: 'Kara, Togo',
      status: 'received',
      receivedDate: '2024-03-28',
      cooperative: 'Coopérative Kara',
      quality: 'Premium',
      qrCode: 'STOCK-2024-001-QR',
      measurements: {
        temperature: 25,
        humidity: 65
      },
      expiryDate: '2024-09-28',
      storageLocation: 'Entrepôt A - Zone 1',
      batchNumber: 'BATCH-2024-03-001'
    },
    {
      id: 'STOCK-2024-002',
      originalLotId: 'LOT-2024-016',
      weight: 750,
      origin: 'Lomé, Togo',
      status: 'in_production',
      receivedDate: '2024-03-27',
      cooperative: 'Coopérative Lomé',
      quality: 'Standard',
      qrCode: 'STOCK-2024-002-QR',
      measurements: {
        temperature: 28,
        humidity: 70
      },
      expiryDate: '2024-09-27',
      storageLocation: 'Entrepôt A - Zone 2',
      batchNumber: 'BATCH-2024-03-002'
    },
    {
      id: 'STOCK-2024-003',
      originalLotId: 'LOT-2024-017',
      weight: 320,
      origin: 'Sokodé, Togo',
      status: 'transformed',
      receivedDate: '2024-03-25',
      cooperative: 'Coopérative Sokodé',
      quality: 'Premium',
      transformationHash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c',
      qrCode: 'STOCK-2024-003-QR',
      measurements: {
        temperature: 22,
        humidity: 60
      },
      expiryDate: '2024-09-25',
      storageLocation: 'Entrepôt B - Zone 1',
      batchNumber: 'BATCH-2024-03-003'
    },
    {
      id: 'STOCK-2024-004',
      originalLotId: 'LOT-2024-018',
      weight: 450,
      origin: 'Kpalimé, Togo',
      status: 'transferred',
      receivedDate: '2024-03-20',
      cooperative: 'Coopérative Kpalimé',
      quality: 'Standard',
      transformationHash: '0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d',
      qrCode: 'STOCK-2024-004-QR',
      measurements: {
        temperature: 24,
        humidity: 62
      },
      expiryDate: '2024-09-20',
      storageLocation: 'Entrepôt B - Zone 2',
      batchNumber: 'BATCH-2024-03-004'
    }
  ];

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  const filteredLots = stockLots.filter(lot => {
    const matchesSearch = lot.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        lot.originalLotId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        lot.cooperative.toLowerCase().includes(searchTerm.toLowerCase());
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

  const startProduction = (lotId: string) => {
    const lot = stockLots.find(l => l.id === lotId);
    if (lot && lot.status === 'received') {
      navigate('/transformateur/production');
    } else {
      toast.error('Ce lot ne peut pas être transformé');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'received': return 'text-blue-600 bg-blue-50';
      case 'in_production': return 'text-amber-600 bg-amber-50';
      case 'transformed': return 'text-emerald-600 bg-emerald-50';
      case 'transferred': return 'text-slate-600 bg-slate-50';
      default: return 'text-cacao/60 bg-cacao/10';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'received': return <Package size={16} />;
      case 'in_production': return <Factory size={16} />;
      case 'transformed': return <Award size={16} />;
      case 'transferred': return <Truck size={16} />;
      default: return <Package size={16} />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'received': return 'Reçu';
      case 'in_production': return 'En Production';
      case 'transformed': return 'Transformé';
      case 'transferred': return 'Transféré';
      default: return status;
    }
  };

  const stockStats = {
    total: stockLots.length,
    received: stockLots.filter(l => l.status === 'received').length,
    inProduction: stockLots.filter(l => l.status === 'in_production').length,
    transformed: stockLots.filter(l => l.status === 'transformed').length,
    transferred: stockLots.filter(l => l.status === 'transferred').length,
    totalWeight: stockLots.reduce((sum, lot) => sum + lot.weight, 0)
  };

  if (loading) return (
    <div className="min-h-screen bg-cream flex items-center justify-center text-cacao font-bold">
      Chargement de la gestion des stocks...
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
                <h1 className="text-xl font-serif font-black text-cacao tracking-tight">Gestion des Stocks</h1>
                <p className="text-[11px] font-bold text-gold/70 uppercase tracking-[0.2em]">Lots Reçus</p>
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
                <p className="text-sm text-cacao/60">Total Lots</p>
                <p className="text-2xl font-bold text-cacao">{stockStats.total}</p>
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
                <p className="text-sm text-cacao/60">Reçus</p>
                <p className="text-2xl font-bold text-blue-600">{stockStats.received}</p>
              </div>
              <Package className="text-blue-600" size={24} />
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
                <p className="text-sm text-cacao/60">En Production</p>
                <p className="text-2xl font-bold text-amber-600">{stockStats.inProduction}</p>
              </div>
              <Factory className="text-amber-600" size={24} />
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
                <p className="text-sm text-cacao/60">Transformés</p>
                <p className="text-2xl font-bold text-emerald-600">{stockStats.transformed}</p>
              </div>
              <Award className="text-emerald-600" size={24} />
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
                <p className="text-2xl font-bold text-cacao">{stockStats.totalWeight} kg</p>
              </div>
              <BarChart3 className="text-cacao/40" size={24} />
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
                <option value="received">Reçus</option>
                <option value="in_production">En production</option>
                <option value="transformed">Transformés</option>
                <option value="transferred">Transférés</option>
              </select>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/transformateur/production')}
                className="px-4 py-2 bg-gold text-cacao rounded-lg text-sm font-bold hover:bg-gold/90 transition-all flex items-center gap-2"
              >
                <Play size={16} />
                Démarrer Production
              </motion.button>
            </div>
          </div>
        </div>

        {/* Stock List */}
        <div className="bg-white rounded-xl border border-cacao/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-cacao/5">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold text-cacao uppercase tracking-wider">ID Stock</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-cacao uppercase tracking-wider">Lot Original</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-cacao uppercase tracking-wider">Poids</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-cacao uppercase tracking-wider">Origine</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-cacao uppercase tracking-wider">Coopérative</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-cacao uppercase tracking-wider">Statut</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-cacao uppercase tracking-wider">Date Réception</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-cacao uppercase tracking-wider">Stockage</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-cacao uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cacao/10">
                {filteredLots.map((lot, index) => (
                  <motion.tr
                    key={lot.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-cacao/5 transition-colors"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-cacao">{lot.id}</span>
                        <QrCode size={16} className="text-cacao/40" />
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-cacao">{lot.originalLotId}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="font-bold text-cacao">{lot.weight} kg</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-cacao">{lot.origin}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-cacao">{lot.cooperative}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1 ${getStatusColor(lot.status)}`}>
                        {getStatusIcon(lot.status)}
                        {getStatusText(lot.status)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-cacao">{lot.receivedDate}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-cacao">{lot.storageLocation}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        {lot.status === 'received' && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => startProduction(lot.id)}
                            className="p-2 bg-gold text-cacao rounded-lg hover:bg-gold/90 transition-all"
                          >
                            <Play size={16} />
                          </motion.button>
                        )}
                        {lot.status === 'transformed' && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/transformateur/transfert')}
                            className="p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all"
                          >
                            <Truck size={16} />
                          </motion.button>
                        )}
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 border border-cacao/10 rounded-lg hover:bg-cacao/5 transition-all"
                        >
                          <Eye size={16} />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
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
    </div>
  );
}
