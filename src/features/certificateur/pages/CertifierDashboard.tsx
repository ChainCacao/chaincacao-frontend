// TODO [SIMULATED] This page uses hardcoded mock data. Replace with real API calls to lotService / ministryService.
// Backend integration needed: GET /lots?certifieurId=&statutConformiteEUDR=, GET /certifieur/stats
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Award, Package, ShieldCheck, FileText, Users, AlertTriangle,
  CheckCircle2, LogOut, Menu, X, Settings, TrendingUp,
  Clock, Activity, BarChart3, Eye, Plus, Filter,
  Search, Download, RefreshCw, GraduationCap, Building2,
  Calendar, MapPin, Star, Award as AwardIcon
} from 'lucide-react';
import { useAuthStore } from '../../../stores/useAuthStore';

interface DashboardStat {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
}

interface Certification {
  id: string;
  organisme: string;
  type: string;
  status: string;
  date: string;
  progress: number;
  lotId: string;
  producteur: string;
}

export default function CertifierDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Données simulées
  const stats: DashboardStat[] = [
    { title: "Certifications en cours", value: "12", icon: <Award size={20} />, color: "text-amber-600", bg: "bg-amber-50" },
    { title: "Certifiés ce mois", value: "28", icon: <ShieldCheck size={20} />, color: "text-emerald-600", bg: "bg-emerald-50" },
    { title: "Lots inspectés", value: "45", icon: <Package size={20} />, color: "text-cacao", bg: "bg-white" },
    { title: "Producteurs actifs", value: "156", icon: <Users size={20} />, color: "text-blue-600", bg: "bg-blue-50" }
  ];

  const certifications: Certification[] = [
    {
      id: 'CERT-2024-015',
      organisme: 'Bureau de Certification Togolais',
      type: 'Certification Bio',
      status: 'En inspection',
      date: '28/03/2024',
      progress: 75,
      lotId: 'LOT-2024-023',
      producteur: 'Coopérative Kara'
    },
    {
      id: 'CERT-2024-016',
      organisme: 'Bureau de Certification Togolais',
      type: 'Fair Trade',
      status: 'En attente',
      date: '29/03/2024',
      progress: 0,
      lotId: 'LOT-2024-024',
      producteur: 'Coopérative Lomé'
    },
    {
      id: 'CERT-2024-017',
      organisme: 'Bureau de Certification Togolais',
      type: 'Rainforest Alliance',
      status: 'En inspection',
      date: '30/03/2024',
      progress: 45,
      lotId: 'LOT-2024-025',
      producteur: 'Coopérative Sokodé'
    }
  ];

  const menuItems = [
    { label: 'Tableau de bord', icon: <BarChart3 size={20} />, path: '/certifieur/dashboard' },
    { label: 'Certifications', icon: <Award size={20} />, path: '/certifieur/certifications' },
    { label: 'Inspections', icon: <ShieldCheck size={20} />, path: '/certifieur/inspections' },
    { label: 'Producteurs', icon: <Users size={20} />, path: '/certifieur/producteurs' },
    { label: 'Documents', icon: <FileText size={20} />, path: '/certifieur/documents' },
    { label: 'Rapports', icon: <Activity size={20} />, path: '/certifieur/rapports' }
  ];

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  const filteredCertifications = certifications.filter(cert => 
    cert.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.producteur.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'En inspection': return 'text-amber-600 bg-amber-50';
      case 'En attente': return 'text-slate-600 bg-slate-50';
      case 'Certifié': return 'text-emerald-600 bg-emerald-50';
      case 'Rejeté': return 'text-red-600 bg-red-50';
      default: return 'text-cacao/60 bg-cacao/10';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 75) return 'bg-emerald-500';
    if (progress >= 50) return 'bg-amber-500';
    if (progress >= 25) return 'bg-orange-500';
    return 'bg-slate-300';
  };

  const getTypeIcon = (type: string) => {
    if (type.includes('Bio')) return <Award className="text-emerald-600" size={16} />;
    if (type.includes('Fair')) return <Star className="text-amber-600" size={16} />;
    if (type.includes('Rainforest')) return <ShieldCheck className="text-blue-600" size={16} />;
    return <AwardIcon size={16} />;
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
          className="fixed inset-0 bg-cacao/40 backdrop-blur-sm z-55 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <aside className={`
        fixed inset-y-0 left-0 z-60 w-72 bg-cacao text-cream transform transition-transform duration-300 ease-in-out
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
                <Award size={20} className="text-gold" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{user?.name || 'Certificateur'}</p>
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
                  Tableau de bord Certificateur
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
                onClick={() => navigate('/certifieur/nouvelle-certification')}
                className="bg-gold text-cacao p-6 rounded-2xl font-bold text-sm hover:bg-gold/90 transition-all shadow-lg flex items-center gap-3"
              >
                <Plus size={20} />
                Nouvelle certification
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/certifieur/inspection')}
                className="bg-emerald-600 text-white p-6 rounded-2xl font-bold text-sm hover:bg-emerald-700 transition-all shadow-lg flex items-center gap-3"
              >
                <ShieldCheck size={20} />
                Démarrer inspection
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/certifieur/rapports')}
                className="bg-cacao text-white p-6 rounded-2xl font-bold text-sm hover:bg-cacao/90 transition-all shadow-lg flex items-center gap-3"
              >
                <FileText size={20} />
                Nouveau rapport
              </motion.button>
            </div>
          </div>

          {/* Certifications */}
          <div className="bg-white rounded-2xl border border-cacao/10 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-serif font-black text-cacao flex items-center gap-2">
                <Award size={20} />
                Certifications en cours
              </h2>
              
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-cacao/40" size={16} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Rechercher une certification..."
                    className="pl-10 pr-4 py-2 border border-cacao/10 rounded-lg text-sm focus:ring-4 focus:ring-gold/10 focus:border-gold outline-none"
                  />
                </div>
                
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="px-4 py-2 border border-cacao/10 rounded-lg text-sm focus:ring-4 focus:ring-gold/10 focus:border-gold outline-none"
                >
                  <option value="all">Toutes les certifications</option>
                  <option value="inspection">En inspection</option>
                  <option value="waiting">En attente</option>
                  <option value="certified">Certifiées</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {filteredCertifications.map((certification, index) => (
                <motion.div
                  key={certification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border border-cacao/10 rounded-xl p-4 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-cacao">{certification.id}</h3>
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(certification.status)}`}>
                          {certification.status}
                        </span>
                        <div className="flex items-center gap-1">
                          {getTypeIcon(certification.type)}
                          <span className="text-xs text-cacao/60">{certification.type}</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-cacao/60">Organisme:</span>
                          <p className="font-bold text-cacao">{certification.organisme}</p>
                        </div>
                        <div>
                          <span className="text-cacao/60">Lot:</span>
                          <p className="font-bold text-cacao">{certification.lotId}</p>
                        </div>
                        <div>
                          <span className="text-cacao/60">Producteur:</span>
                          <p className="font-bold text-cacao">{certification.producteur}</p>
                        </div>
                        <div>
                          <span className="text-cacao/60">Date:</span>
                          <p className="font-bold text-cacao">{certification.date}</p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      {certification.progress > 0 && (
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-cacao/60">Progression inspection</span>
                            <span className="font-bold text-cacao">{certification.progress}%</span>
                          </div>
                          <div className="w-full bg-cacao/10 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all ${getProgressColor(certification.progress)}`}
                              style={{ width: `${certification.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate(`/certifieur/certification/${certification.id}`)}
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
                  <p className="text-sm font-medium text-cacao">Certification CERT-2024-014 complétée</p>
                  <p className="text-xs text-cacao/60">Il y a 2 heures - Coopérative Lomé</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
                <AlertTriangle className="text-amber-600" size={16} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-cacao">Inspection requise - LOT-2024-015</p>
                  <p className="text-xs text-cacao/60">Il y a 1 jour - Coopérative Kara</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <TrendingUp className="text-blue-600" size={16} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-cacao">Nouveau standard de certification</p>
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
