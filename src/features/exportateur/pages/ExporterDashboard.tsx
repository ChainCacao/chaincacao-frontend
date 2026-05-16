// TODO [SIMULATED] This page uses hardcoded mock data. Replace with real API calls to lotService / exportateurService.
// Backend integration needed: GET /lots?exportateurId=&statutTrajet=, GET /exportateur/stats
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Plane, Package, Ship, Users, FileText, ShieldCheck,
  AlertTriangle, CheckCircle2, LogOut, Menu, X, Settings,
  TrendingUp, Clock, Activity, BarChart3, Eye,
  Plus, Filter, Search, Download, RefreshCw, Globe2,
  MapPin, Calendar, DollarSign, Truck
} from 'lucide-react';
import { useAuthStore } from '../../../stores/useAuthStore';

interface DashboardStat {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
}

interface Shipment {
  id: string;
  weight: number;
  origin: string;
  destination: string;
  status: string;
  date: string;
  progress: number;
  value: string;
}

export default function ExporterDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Données simulées
  const stats: DashboardStat[] = [
    { title: "Expéditions en cours", value: "06", icon: <Ship size={20} />, color: "text-amber-600", bg: "bg-amber-50" },
    { title: "Volume exporté (T)", value: "12.5", icon: <Package size={20} />, color: "text-emerald-600", bg: "bg-emerald-50" },
    { title: "Pays desservis", value: "08", icon: <Globe2 size={20} />, color: "text-cacao", bg: "bg-white" },
    { title: "Certifications", value: "05", icon: <ShieldCheck size={20} />, color: "text-blue-600", bg: "bg-blue-50" }
  ];

  const shipments: Shipment[] = [
    {
      id: 'EXP-2024-015',
      weight: 2500,
      origin: 'Transformateur Lomé',
      destination: 'France, Marseille',
      status: 'En transit',
      date: '28/03/2024',
      progress: 65,
      value: '€125,000'
    },
    {
      id: 'EXP-2024-016',
      weight: 3200,
      origin: 'Transformateur Kara',
      destination: 'Allemagne, Hambourg',
      status: 'Préparation',
      date: '29/03/2024',
      progress: 25,
      value: '€160,000'
    },
    {
      id: 'EXP-2024-017',
      weight: 1800,
      origin: 'Transformateur Sokodé',
      destination: 'Suisse, Zurich',
      status: 'En transit',
      date: '30/03/2024',
      progress: 45,
      value: '€90,000'
    }
  ];

  const menuItems = [
    { label: 'Tableau de bord', icon: <BarChart3 size={20} />, path: '/exportateur/dashboard' },
    { label: 'Expéditions', icon: <Plane size={20} />, path: '/exportateur/expeditions' },
    { label: 'Lots disponibles', icon: <Package size={20} />, path: '/exportateur/lots' },
    { label: 'Certifications', icon: <ShieldCheck size={20} />, path: '/exportateur/certifications' },
    { label: 'Documents', icon: <FileText size={20} />, path: '/exportateur/documents' },
    { label: 'Pays clients', icon: <Globe2 size={20} />, path: '/exportateur/pays' }
  ];

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  const filteredShipments = shipments.filter(shipment => 
    shipment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shipment.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shipment.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'En transit': return 'text-amber-600 bg-amber-50';
      case 'Préparation': return 'text-slate-600 bg-slate-50';
      case 'Livré': return 'text-emerald-600 bg-emerald-50';
      case 'En douane': return 'text-blue-600 bg-blue-50';
      default: return 'text-cacao/60 bg-cacao/10';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 75) return 'bg-emerald-500';
    if (progress >= 50) return 'bg-amber-500';
    if (progress >= 25) return 'bg-orange-500';
    return 'bg-slate-300';
  };

  if (loading) return (
    <div className="min-h-screen bg-cream flex items-center justify-center text-cacao font-bold">
      Initialisation du tableau de bord...
    </div>
  );

  return (
    <div className="min-h-screen bg-cream/30 flex">
      {/* Sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-cacao/40 backdrop-blur-sm z-[55] lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <aside className={`
        fixed inset-y-0 left-0 z-[60] w-72 bg-cacao text-cream transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col p-6">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-gold rounded-xl flex items-center justify-center text-cacao font-black shadow-lg">TC</div>
            <span className="font-serif text-xl font-bold tracking-tight">ChainCacao</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm hover:bg-white/10 text-cream/70"
              >
                {item.icon} {item.label}
              </Link>
            ))}
          </nav>

          {/* User section */}
          <div className="border-t border-cream/20 pt-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gold/20 rounded-xl flex items-center justify-center">
                <Plane size={20} className="text-gold" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{user?.name || 'Exportateur'}</p>
                <p className="text-xs text-cream/60">0x742d...8f44e</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm hover:bg-white/10 text-cream/70 transition-all w-full"
            >
              <LogOut size={18} />
              Déconnexion
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Header */}
        <header className="bg-white border-b border-cacao/10 sticky top-0 z-40">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(!isSidebarOpen)}
                  className="lg:hidden p-2 hover:bg-cacao/10 rounded-lg"
                >
                  {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
                <h1 className="text-xl font-serif font-black text-cacao">
                  Tableau de bord Exportateur
                </h1>
              </div>
              
              <div className="flex items-center gap-3">
                <button className="p-2 hover:bg-cacao/10 rounded-lg transition-colors">
                  <RefreshCw size={18} className="text-cacao/60" />
                </button>
                <button className="p-2 hover:bg-cacao/10 rounded-lg transition-colors">
                  <Settings size={18} className="text-cacao/60" />
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="px-6 py-6 bg-cream/30">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`${stat.bg} rounded-2xl p-6 border border-cacao/10`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`${stat.color} p-3 rounded-xl`}>
                      {stat.icon}
                    </div>
                    <div>
                      <p className="text-2xl font-black text-cacao">{stat.value}</p>
                      <p className="text-xs text-cacao/60">{stat.title}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </header>

        {/* Main Dashboard Content */}
        <main className="p-6">
          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-lg font-serif font-black text-cacao mb-4">Actions rapides</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/exportateur/nouvelle-expedition')}
                className="bg-gold text-cacao p-6 rounded-2xl font-bold text-sm hover:bg-gold/90 transition-all shadow-lg flex items-center gap-3"
              >
                <Plus size={20} />
                Nouvelle expédition
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/exportateur/lots')}
                className="bg-emerald-600 text-white p-6 rounded-2xl font-bold text-sm hover:bg-emerald-700 transition-all shadow-lg flex items-center gap-3"
              >
                <Package size={20} />
                Voir les lots
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/exportateur/documents')}
                className="bg-cacao text-white p-6 rounded-2xl font-bold text-sm hover:bg-cacao/90 transition-all shadow-lg flex items-center gap-3"
              >
                <FileText size={20} />
                Documents
              </motion.button>
            </div>
          </div>

          {/* Shipments */}
          <div className="bg-white rounded-2xl border border-cacao/10 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-serif font-black text-cacao flex items-center gap-2">
                <Ship size={20} />
                Expéditions en cours
              </h2>
              
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-cacao/40" size={16} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Rechercher une expédition..."
                    className="pl-10 pr-4 py-2 border border-cacao/10 rounded-lg text-sm focus:ring-4 focus:ring-gold/10 focus:border-gold outline-none"
                  />
                </div>
                
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="px-4 py-2 border border-cacao/10 rounded-lg text-sm focus:ring-4 focus:ring-gold/10 focus:border-gold outline-none"
                >
                  <option value="all">Toutes les expéditions</option>
                  <option value="transit">En transit</option>
                  <option value="preparation">Préparation</option>
                  <option value="delivered">Livrées</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {filteredShipments.map((shipment, index) => (
                <motion.div
                  key={shipment.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border border-cacao/10 rounded-xl p-4 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-cacao">{shipment.id}</h3>
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(shipment.status)}`}>
                          {shipment.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-cacao/60">Poids:</span>
                          <p className="font-bold text-cacao">{shipment.weight} kg</p>
                        </div>
                        <div>
                          <span className="text-cacao/60">Origine:</span>
                          <p className="font-bold text-cacao">{shipment.origin}</p>
                        </div>
                        <div>
                          <span className="text-cacao/60">Destination:</span>
                          <p className="font-bold text-cacao">{shipment.destination}</p>
                        </div>
                        <div>
                          <span className="text-cacao/60">Valeur:</span>
                          <p className="font-bold text-emerald-600">{shipment.value}</p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-cacao/60">Progression expédition</span>
                          <span className="font-bold text-cacao">{shipment.progress}%</span>
                        </div>
                        <div className="w-full bg-cacao/10 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all ${getProgressColor(shipment.progress)}`}
                            style={{ width: `${shipment.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate(`/exportateur/expedition/${shipment.id}`)}
                        className="p-2 bg-gold/10 text-gold rounded-lg hover:bg-gold/20 transition-colors"
                      >
                        <Eye size={16} />
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 bg-cacao/10 text-cacao rounded-lg hover:bg-cacao/20 transition-colors"
                      >
                        <Download size={16} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-8 bg-white rounded-2xl border border-cacao/10 p-6">
            <h2 className="text-lg font-serif font-black text-cacao mb-4 flex items-center gap-2">
              <Clock size={20} />
              Activité récente
            </h2>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg">
                <CheckCircle2 className="text-emerald-600" size={16} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-cacao">Expédition EXP-2024-014 livrée</p>
                  <p className="text-xs text-cacao/60">Il y a 2 heures - France, Paris</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
                <AlertTriangle className="text-amber-600" size={16} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-cacao">Douane en cours - EXP-2024-015</p>
                  <p className="text-xs text-cacao/60">Il y a 1 jour - Allemagne, Hambourg</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <TrendingUp className="text-blue-600" size={16} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-cacao">Nouveau marché ouvert - Japon</p>
                  <p className="text-xs text-cacao/60">Cette semaine</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
