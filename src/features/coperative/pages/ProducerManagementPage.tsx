// TODO [SIMULATED] This page uses hardcoded mock data. Replace with real API call to cooperativeService.getAgriculteurs().
// Backend integration needed: GET /cooperatives/:id/agriculteurs
import { useState, useMemo } from 'react';
import { 
  Users, UserPlus, Search, 
  MapPin, ShieldCheck, Trash2, Edit3, 
  XCircle, ChevronRight, Download, Home,
  BarChart, Package, Settings, LogOut,
  Calendar, Building2, FileText
} from 'lucide-react';
import AddProducerModal from './AddProducerModal';

// Types pour la gestion des producteurs
type ProducerStatus = 'Actif' | 'Suspendu' | 'En attente';

interface Producer {
  id: string;
  name: string;
  location: string;
  surface: string;
  status: ProducerStatus;
  joinedDate: string;
  lastDelivery: string;
  isEudrCompliant: boolean;
}

export default function ProducerManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<ProducerStatus | 'Tous'>('Tous');
  const [isAddProducerModalOpen, setIsAddProducerModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Mock data - À remplacer par ton appel API plus tard
  const [producers] = useState<Producer[]>([
    { id: 'PRD-001', name: 'Koffi Mensah', location: 'Kara Sud', surface: '2.5 ha', status: 'Actif', joinedDate: '12/01/2024', lastDelivery: 'il y a 2j', isEudrCompliant: true },
    { id: 'PRD-002', name: 'Awa Diallo', location: 'Pya', surface: '1.8 ha', status: 'En attente', joinedDate: '05/03/2026', lastDelivery: 'Aucune', isEudrCompliant: false },
    { id: 'PRD-003', name: 'Samuel Eto', location: 'Niamtougou', surface: '5.0 ha', status: 'Actif', joinedDate: '20/11/2023', lastDelivery: 'il y a 5j', isEudrCompliant: true },
    { id: 'PRD-004', name: 'Kodjo Afan', location: 'Kara Nord', surface: '3.2 ha', status: 'Suspendu', joinedDate: '15/06/2025', lastDelivery: 'il y a 1 mois', isEudrCompliant: true },
  ]);

  // Logique de recherche et filtrage
  const filteredProducers = useMemo(() => {
    return producers.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === 'Tous' || p.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, filterStatus, producers]);

  return (
    <div className="min-h-screen bg-cream/30 flex">
      {/* SIDEBAR */}
      <aside className={`${sidebarOpen ? 'w-72' : 'w-20'} bg-cacao text-cream transition-all duration-300 flex flex-col shadow-2xl`}>
        {/* Header Sidebar */}
        <div className="p-6 border-b border-cacao/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gold rounded-2xl flex items-center justify-center text-cacao font-black shadow-lg">
              <Building2 size={24} />
            </div>
            {sidebarOpen && (
              <div>
                <h2 className="font-serif font-black text-xl">Coopérative</h2>
                <p className="text-[10px] font-black uppercase text-gold/80 tracking-widest">Kpalimé Central</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <SidebarItem icon={<Home size={20} />} label="Dashboard" active={false} sidebarOpen={sidebarOpen} />
          <SidebarItem icon={<Users size={20} />} label="Producteurs" active={true} sidebarOpen={sidebarOpen} />
          <SidebarItem icon={<Package size={20} />} label="Lots" active={false} sidebarOpen={sidebarOpen} />
          <SidebarItem icon={<BarChart size={20} />} label="Statistiques" active={false} sidebarOpen={sidebarOpen} />
          <SidebarItem icon={<FileText size={20} />} label="Rapports" active={false} sidebarOpen={sidebarOpen} />
          <SidebarItem icon={<Calendar size={20} />} label="Calendrier" active={false} sidebarOpen={sidebarOpen} />
        </nav>

        {/* Footer Sidebar */}
        <div className="p-4 border-t border-cacao/20 space-y-2">
          <SidebarItem icon={<Settings size={20} />} label="Paramètres" active={false} sidebarOpen={sidebarOpen} />
          <SidebarItem icon={<LogOut size={20} />} label="Déconnexion" active={false} sidebarOpen={sidebarOpen} />
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        {/* Header avec bouton toggle sidebar */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 bg-white rounded-xl shadow-sm hover:shadow-md transition-all"
          >
            <ChevronRight className={`text-cacao transition-transform ${!sidebarOpen ? 'rotate-180' : ''}`} size={20} />
          </button>
          
          <div className="flex gap-2">
            <button className="bg-white border border-cacao/10 text-cacao px-4 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-50 transition-all">
              <Download size={18} /> EXPORTER (CSV)
            </button>
            <button 
              onClick={() => setIsAddProducerModalOpen(true)}
              className="bg-cacao text-gold px-4 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cacao/20 hover:scale-105 transition-all"
            >
              <UserPlus size={18} /> NOUVEAU
            </button>
          </div>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-black text-cacao flex items-center gap-3 mb-2">
            <Users className="text-gold" size={32} />
            Registre des Producteurs
          </h1>
          <p className="text-slate-500 text-medium">Gérez les membres de la coopérative et leur conformité légale.</p>
        </div>

        {/* BARRE DE RECHERCHE ET FILTRES */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-cacao/5 flex flex-col lg:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text"
              placeholder="Rechercher un nom ou un ID Producteur..."
              className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-2xl outline-none focus:ring-2 ring-gold/30 border-transparent transition-all font-medium text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
            {['Tous', 'Actif', 'En attente', 'Suspendu'].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s as any)}
                className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                  filterStatus === s 
                  ? 'bg-gold text-cacao shadow-md' 
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

      {/* LISTE DES PRODUCTEURS (DESKTOP: TABLEAU / MOBILE: CARDS) */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-cacao/5 overflow-hidden">
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <th className="px-6 py-5">Producteur</th>
                  <th className="px-6 py-5">Localisation</th>
                  <th className="px-6 py-5">Superficie</th>
                <th className="px-6 py-5">EUDR Status</th>
                <th className="px-6 py-5">Statut</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredProducers.map((p) => (
                <tr key={p.id} className="hover:bg-cream/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-cacao font-bold border-2 border-white shadow-sm">
                        {p.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-cacao text-sm leading-none">{p.name}</p>
                        <p className="text-[10px] font-mono text-slate-400 mt-1">{p.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-slate-600 text-xs font-medium">
                      <MapPin size={14} className="text-gold" /> {p.location}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-black text-cacao text-xs">{p.surface}</td>
                  <td className="px-6 py-4">
                    {p.isEudrCompliant ? (
                      <span className="flex items-center gap-1.5 text-emerald-600 text-[10px] font-black uppercase">
                        <ShieldCheck size={14} /> Conforme
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-slate-400 text-[10px] font-black uppercase">
                        <XCircle size={14} /> Non vérifié
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-slate-400 hover:text-cacao hover:bg-slate-100 rounded-lg"><Edit3 size={18}/></button>
                      <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={18}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MOBILE VIEW (CARDS) */}
        <div className="md:hidden divide-y divide-slate-50">
          {filteredProducers.map((p) => (
            <div key={p.id} className="p-5 space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-cacao text-gold flex items-center justify-center font-black">
                    {p.name.substring(0, 1)}
                  </div>
                  <div>
                    <h4 className="font-bold text-cacao">{p.name}</h4>
                    <p className="text-[10px] font-mono text-slate-400 uppercase tracking-tighter">{p.id}</p>
                  </div>
                </div>
                <StatusBadge status={p.status} />
              </div>
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase">Superficie</p>
                  <p className="text-xs font-bold text-cacao">{p.surface}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase">Dernier Don</p>
                  <p className="text-xs font-bold text-cacao">{p.lastDelivery}</p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                   <button className="p-2.5 bg-slate-100 text-slate-600 rounded-xl"><Edit3 size={18}/></button>
                   <button className="p-2.5 bg-red-50 text-red-500 rounded-xl"><Trash2 size={18}/></button>
                </div>
                <button className="bg-cacao text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
                  Détails <ChevronRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredProducers.length === 0 && (
          <div className="p-20 text-center">
            <Users size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-500 font-medium">Aucun producteur ne correspond à votre recherche.</p>
          </div>
        )}
      </div>

      {/* MODAL AJOUT PRODUCTEUR */}
        <AddProducerModal 
          isOpen={isAddProducerModalOpen} 
          onClose={() => setIsAddProducerModalOpen(false)} 
        />
      </main>
    </div>
  );
}

// Sous-composant Badge de Statut
const StatusBadge = ({ status }: { status: ProducerStatus }) => {
  const styles = {
    'Actif': 'bg-emerald-50 text-emerald-600 border-emerald-100',
    'Suspendu': 'bg-red-50 text-red-600 border-red-100',
    'En attente': 'bg-amber-50 text-amber-600 border-amber-100',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${styles[status]}`}>
      {status}
    </span>
  );
};

// Composant SidebarItem
const SidebarItem = ({ icon, label, active, sidebarOpen }: { 
  icon: React.ReactNode; 
  label: string; 
  active: boolean; 
  sidebarOpen: boolean;
}) => {
  return (
    <button
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        active 
          ? 'bg-gold text-cacao font-black shadow-lg shadow-gold/10' 
          : 'text-cream/80 hover:bg-cream/10 hover:text-cream'
      }`}
    >
      <div className="flex-shrink-0">{icon}</div>
      {sidebarOpen && (
        <span className="text-sm font-medium tracking-wide">{label}</span>
      )}
    </button>
  );
};