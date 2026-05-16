// TODO [SIMULATED] This page uses hardcoded mock data for KPIs and lot tables.
// Backend integration needed: GET /cooperatives/:id/stats, GET /lots?cooperativeId=&statutTrajet=RECU_COOPERATIVE
import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, PackageCheck, Truck, Users, 
  FileText, ShieldCheck, AlertTriangle, CheckCircle2, 
  XCircle, Bell, LogOut, Menu, X, Settings, HelpCircle, UserPlus, Layers
} from 'lucide-react';
import { useAuthStore } from '../../../stores/useAuthStore';
import AddProducerModal from './AddProducerModal';

export default function CoopDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAddProducerModalOpen, setIsAddProducerModalOpen] = useState(false);

  // Simulation des données (KPIs et Lots)
  const stats = [
    { title: "Lots à valider", value: "12", icon: <PackageCheck size={20} />, color: "text-amber-600", bg: "bg-amber-50" },
    { title: "Transferts urgents", value: "03", icon: <Truck size={20} />, color: "text-red-600", bg: "bg-red-50" },
    { title: "Volume (Tonnes)", value: "4.8", icon: <LayoutDashboard size={20} />, color: "text-cacao", bg: "bg-white" },
    { title: "Membres actifs", value: "156", icon: <Users size={20} />, color: "text-emerald-600", bg: "bg-emerald-50" }
  ];

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  const menuItems = [
    { label: 'Vue d\'ensemble', icon: <LayoutDashboard size={20} />, path: '/cooperative/dashboard' },
    { label: 'Réceptions', icon: <PackageCheck size={20} />, path: '/cooperative/receptions' },
    { label: 'Regroupement', icon: <Layers size={20} />, path: '/cooperative/regroupement' },
    { label: 'Transferts', icon: <Truck size={20} />, path: '/cooperative/transferts' },
    { label: 'Producteurs', icon: <Users size={20} />, path: '/cooperative/membres' },
    { label: 'Documents & EUDR', icon: <FileText size={20} />, path: '/cooperative/documents' },
  ];

  if (loading) return <div className="min-h-screen bg-cream flex items-center justify-center text-cacao font-bold">Initialisation du noeud...</div>;

  return (
    <div className="min-h-screen bg-cream/30 flex">
      {/* 1. SIDEBAR (Desktop: Fixe, Mobile: Overlay) */}
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
          {/* Logo Section */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-gold rounded-xl flex items-center justify-center text-cacao font-black shadow-lg">CC</div>
            <span className="font-serif text-xl font-bold tracking-tight">ChainCacao</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm
                  ${location.pathname === item.path ? 'bg-gold text-cacao shadow-lg' : 'hover:bg-white/10 text-cream/70'}
                `}
              >
                {item.icon} {item.label}
              </Link>
            ))}
          </nav>

          {/* Bottom Sidebar */}
          <div className="pt-6 border-t border-white/10 space-y-2">
            <button 
              onClick={() => setIsAddProducerModalOpen(true)}
              className="flex items-center gap-3 px-4 py-3 w-full bg-gold text-cacao hover:bg-gold/90 rounded-xl text-sm font-bold transition-all"
            >
              <UserPlus size={20} /> Ajouter Producteur
            </button>
            <button className="flex items-center gap-3 px-4 py-3 w-full text-cream/50 hover:text-gold text-sm transition-colors">
              <Settings size={20} /> Paramètres
            </button>
            <button 
              onClick={() => navigate('/cooperative')}
              className="flex items-center gap-3 px-4 py-3 w-full text-red-400 hover:bg-red-500/10 rounded-xl text-sm transition-all"
            >
              <LogOut size={20} /> Déconnexion
            </button>
          </div>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* TOPBAR */}
        <header className="h-20 bg-white border-b border-cacao/5 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="lg:hidden p-2 text-cacao">
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h2 className="hidden lg:block font-bold text-cacao-mid uppercase text-xs tracking-widest">Tableau de Bord / Kara</h2>
          </div>

          <div className="flex items-center gap-3 lg:gap-6">
            <div className="relative cursor-pointer hover:scale-110 transition-transform">
              <Bell size={22} className="text-cacao/40" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </div>
            
            <div className="h-8 w-[1px] bg-cacao/10 hidden lg:block"></div>

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-cacao leading-none">Admin Coop</p>
                <p className="text-[10px] text-gold font-bold uppercase mt-1 tracking-tighter">Node #TG-45</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-cacao border-2 border-gold/20 flex items-center justify-center text-gold font-black shadow-inner">
                {user?.name?.substring(0, 1).toUpperCase() || 'K'}
              </div>
            </div>
          </div>
        </header>

        {/* CONTENT PAGE */}
        <main className="p-4 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
          
          {/* Dashboard Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-serif font-black text-cacao">Bonjour, Union de Kara</h1>
              <p className="text-slate-500 text-sm">Voici l'état des flux de traçabilité aujourd'hui.</p>
            </div>
            <button className="bg-cacao text-gold px-6 py-3 rounded-xl font-bold text-sm shadow-xl flex items-center gap-2 hover:bg-cacao-mid transition-all active:scale-95">
              <PackageCheck size={18} /> NOUVELLE RÉCEPTION
            </button>
          </div>

          {/* KPIs SECTION */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <div key={i} className={`${stat.bg} p-6 rounded-3xl border border-cacao/5 shadow-sm hover:shadow-md transition-all group cursor-default`}>
                <div className={`${stat.color} mb-4 bg-white p-2 rounded-lg inline-block shadow-sm group-hover:scale-110 transition-transform`}>{stat.icon}</div>
                <p className="text-3xl font-black text-cacao mb-1">{stat.value}</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.title}</p>
              </div>
            ))}
          </div>

          {/* ALERTE BLOCKCHAIN / EUDR */}
          <div className="bg-red-50 border border-red-100 p-5 rounded-3xl flex flex-col md:flex-row items-center gap-4">
            <div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-red-200">
              <AlertTriangle size={24} />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h4 className="font-bold text-red-900">Urgence Logistique EUDR</h4>
              <p className="text-xs text-red-700/80 font-medium">3 lots risquent d'expirer le délai de transfert blockchain. Une validation immédiate est requise pour le port de Lomé.</p>
            </div>
            <button className="bg-red-600 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-700 shadow-md">Traiter</button>
          </div>

          {/* LISTE DES LOTS (TABLEAU) */}
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-cacao/5 overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex items-center justify-between">
              <h3 className="font-bold text-cacao uppercase text-xs tracking-[0.2em]">Flux en attente de validation</h3>
              <HelpCircle size={18} className="text-slate-300 cursor-pointer" />
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <th className="px-6 py-4">Identifiant Lot</th>
                    <th className="px-6 py-4">Producteur</th>
                    <th className="px-6 py-4">Poids Net</th>
                    <th className="px-6 py-4">Conformité</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {[1, 2, 3].map((_, i) => (
                    <tr key={i} className="hover:bg-cream/10 transition-colors group">
                      <td className="px-6 py-4 font-mono text-xs font-bold text-cacao">LOT-TG-2026-00{i+1}</td>
                      <td className="px-6 py-4 font-bold text-sm text-slate-700">M. Koffi {['Ablam', 'Kodjo', 'Yaovi'][i]}</td>
                      <td className="px-6 py-4 text-sm font-black text-cacao">{125 + i * 40} kg</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full text-[10px] font-bold border border-emerald-100">
                          <ShieldCheck size={12} /> VALIDE EUDR
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors"><CheckCircle2 size={20}/></button>
                        <button className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"><XCircle size={20}/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* MODAL AJOUT PRODUCTEUR */}
      <AddProducerModal 
        isOpen={isAddProducerModalOpen} 
        onClose={() => setIsAddProducerModalOpen(false)} 
      />
    </div>
  );
}