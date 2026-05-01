import { useState, useEffect, type ReactNode } from 'react';
import { 
  LayoutDashboard, Package, Wallet, ShieldCheck, 
  Bell, Menu, Plus, MoreHorizontal, 
  ExternalLink, LogOut, ChevronRight
} from 'lucide-react';
import { agriService } from '../services/agriService';
import { useAuthStore } from '../../../stores/useAuthStore';
import { useNavigate } from 'react-router-dom';

type DashboardStat = {
  label: string;
  value: string | number;
  detail: string;
};

type DashboardLot = {
  id: string;
  date: string;
  status: string;
  amount: string | number;
  hash: string;
};

type DashboardData = {
  stats: DashboardStat[];
  recentLots: DashboardLot[];
};

const toRecord = (value: unknown): Record<string, unknown> =>
  value && typeof value === 'object' ? value as Record<string, unknown> : {};

const text = (value: unknown, fallback = '-') =>
  value === null || value === undefined || value === '' ? fallback : String(value);

const normalizeDashboard = (dashboard: unknown): DashboardData => {
  const source = toRecord(dashboard);
  const statsSource = Array.isArray(source.stats) ? source.stats : [];
  const lotsSource =
    Array.isArray(source.recentLots) ? source.recentLots :
    Array.isArray(source.lots) ? source.lots :
    Array.isArray(source.recoltes) ? source.recoltes :
    Array.isArray(source.harvests) ? source.harvests :
    [];
   

  return {
    stats: statsSource.map((item) => {
      const stat = toRecord(item);

      return {
        label: text(stat.label ?? stat.title ?? stat.name),
        value: text(stat.value ?? stat.valeur ?? stat.total, '0'),
        detail: text(stat.detail ?? stat.description ?? stat.subtitle),
      };
    }),
    recentLots: lotsSource.map((item) => {
      const lot = toRecord(item);

      return {
        id: text(lot.id ?? lot.lotId ?? lot.identifiant ?? lot.code ?? lot.reference),
        date: text(lot.date ?? lot.createdAt ?? lot.created_at),
        status: text(lot.status ?? lot.statut ?? lot.etat),
        amount: text(lot.amount ?? lot.poids ?? lot.weight ?? lot.quantite ?? lot.quantity, '0 kg'),
        hash: text(lot.hash ?? lot.blockchainHash ?? lot.txHash ?? lot.transactionHash),
      };
    }),
  };
};

export default function Dashboard() {
  const [data, setData] = useState<DashboardData>({ stats: [], recentLots: [] });
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuthStore();
  const navigate = useNavigate();
  useEffect(() => {
    agriService.getDashboard().then((dashboard) => {
      setData(normalizeDashboard(dashboard));
    });
  }, []);

  return (
    <div className="flex min-h-screen bg-[#FBFBFA] text-slate-900 font-sans">
      
      {/* SIDEBAR - Style Shadcn avec couleurs ChainCacao */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#3B1E08] transform transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-20 flex items-center px-8 border-b border-white/5">
          <span className="text-xl font-black text-[#F0C040] tracking-tighter uppercase italic">ChainCacao</span>
        </div>
        <nav className="p-4 mt-4 space-y-1">
          <NavItem icon={<LayoutDashboard size={18}/>} label="Tableau de bord" active />
          <NavItem icon={<Package size={18}/>} label="Mes Récoltes" />
          <NavItem icon={<Wallet size={18}/>} label="Mes Finances" />
          <NavItem icon={<ShieldCheck size={18}/>} label="Conformité EUDR" />
        </nav>
        <div className="absolute bottom-0 w-full p-4 border-t border-white/5">
          <button className="flex items-center gap-3 px-4 py-3 text-white/50 hover:text-red-400 transition-colors w-full text-sm font-medium">
            <LogOut size={18} /> Déconnexion
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* NAVBAR - Épurée */}
        <header className="h-20 border-b border-slate-200 flex items-center justify-between px-6 lg:px-10 bg-white/80 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="lg:hidden p-2 hover:bg-slate-100 rounded-md">
              <Menu size={22} />
            </button>
            <div className="hidden md:flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <span>Portail Agriculteur</span>
              <ChevronRight size={12} />
              <span className="text-[#3B1E08]">{user?.village || 'Togo'}</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-black text-emerald-700 uppercase tracking-tight">Mainnet Sepolia</span>
            </div>
            <button className="relative p-2 text-slate-400 hover:text-slate-900">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-10 w-10 rounded-xl bg-[#3B1E08] flex items-center justify-center text-[#F0C040] font-bold shadow-sm">
              {user?.nom?.substring(0, 2).toUpperCase() || 'AG'}
            </div>
          </div>
        </header>

        {/* DASHBOARD BODY */}
        <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-10">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Dashboard</h1>
              <p className="text-slate-500 mt-1 text-sm font-medium">Bienvenue, {user?.nom}. Voici l'état de votre exploitation aujourd'hui.</p>
            </div>
            <button
            onClick={() => navigate('/agriculteur/nouveau-lot')}
             className="flex items-center justify-center gap-2 bg-[#3B1E08] text-[#F0C040] px-6 py-3.5 rounded-xl text-sm font-bold hover:bg-[#522a0b] transition-all shadow-lg active:scale-95">
              <Plus size={20} /> NOUVELLE RÉCOLTE
            </button>
          </div>

          {/* GRID STATS - Look Shadcn rigoureux */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {data.stats.map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-[#F0C040]/30 transition-colors group">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">{stat.label}</span>
                  <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-[#FAF3E0] transition-colors"><MoreHorizontal size={14} className="text-slate-400"/></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-black text-slate-900 leading-none">{stat.value}</span>
                  <span className="text-[11px] text-slate-400 mt-2 font-medium">{stat.detail}</span>
                </div>
              </div>
            ))}
          </div>

          {/* TABLEAU RÉCOLTES - Mixte Pro */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Package size={18} className="text-slate-400"/> Historique des Lots
              </h3>
              <button className="text-xs font-bold text-[#3B1E08] flex items-center gap-1 hover:underline">
                Exporter PDF <ExternalLink size={14} />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50/80 text-slate-400 font-bold border-b border-slate-100">
                  <tr>
                    <th className="px-8 py-4 uppercase tracking-tighter text-[10px]">Identifiant Lot</th>
                    <th className="px-8 py-4 uppercase tracking-tighter text-[10px]">Statut</th>
                    <th className="px-8 py-4 uppercase tracking-tighter text-[10px]">Poids</th>
                    <th className="px-8 py-4 uppercase tracking-tighter text-[10px] text-right">Blockchain Hash</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.recentLots.map((lot, i) => (
                   <tr 
  key={i} 
  onClick={() => navigate(`/agriculteur/lot/${lot.id}`)} // Lien cliquable
  className="hover:bg-slate-50/50 transition-colors cursor-pointer group"
>
                      <td className="px-8 py-5">
                        <div className="font-bold text-slate-900">{lot.id}</div>
                        <div className="text-[10px] text-slate-400 font-medium">{lot.date}</div>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-tight ${
                          lot.status.toLowerCase().startsWith('valid') ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-amber-50 text-amber-700 border border-amber-100'
                        }`}>
                          {lot.status}
                        </span>
                      </td>
                      <td className="px-8 py-5 font-bold text-slate-700">{lot.amount}</td>
                      <td className="px-8 py-5 text-right">
                        <code className="text-[10px] bg-slate-50 px-2 py-1 rounded text-slate-400 group-hover:text-[#3B1E08] transition-colors cursor-pointer">
                          {lot.hash}
                        </code>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

// Composant de navigation réutilisable
type NavItemProps = {
  icon: ReactNode;
  label: string;
  active?: boolean;
};

const NavItem = ({ icon, label, active = false }: NavItemProps) => (
  <button className={`
    w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all
    ${active 
      ? 'bg-[#F0C040] text-[#3B1E08] shadow-md' 
      : 'text-white/60 hover:bg-white/5 hover:text-white'}
  `}>
    {icon}
    {label}
  </button>
);
