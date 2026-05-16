// TODO [SIMULATED] This module uses hardcoded mock data for approvals and stats.
// Backend integration needed: GET /ministry/pending-validations, POST /ministry/validate, GET /ministry/stats
import { useState } from 'react';
import { 
  ShieldCheck, Users, BarChart, 
  AlertTriangle, Landmark, FileCheck, MapPin,
  Lock, CheckCircle2, XCircle, Download
} from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';

export default function MinistryModule() {
  const [view, setView] = useState<'dashboard' | 'approvals' | 'fraud'>('dashboard');

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex overflow-hidden">
      <Toaster position="top-right" />
      
      {/* SIDEBAR ADMIN (SÉCURISÉE) */}
      <aside className="w-80 bg-[#0F172A] text-white p-8 flex flex-col shadow-2xl">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-12 h-12 bg-gold rounded-2xl flex items-center justify-center text-slate-900 shadow-lg shadow-gold/20">
            <Landmark size={28} />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tighter">MINISTÈRE</h2>
            <p className="text-[9px] font-black uppercase text-gold tracking-widest opacity-80">Super Admin Portal</p>
          </div>
        </div>

        <nav className="space-y-2 flex-1">
          <AdminNavItem active={view === 'dashboard'} onClick={() => setView('dashboard')} icon={<BarChart size={20}/>} label="Tableau de Bord" />
          <AdminNavItem active={view === 'approvals'} onClick={() => setView('approvals')} icon={<Users size={20}/>} label="Inscriptions (4)" />
          <AdminNavItem active={view === 'fraud'} onClick={() => setView('fraud')} icon={<AlertTriangle size={20}/>} label="Alertes Fraude" />
          <AdminNavItem active={false} onClick={() => {}} icon={<FileCheck size={20}/>} label="Rapports Nationaux" />
        </nav>

        <div className="mt-auto p-4 bg-white/5 rounded-2xl border border-white/10">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400"><Lock size={14}/></div>
             <div>
               <p className="text-[10px] font-bold text-slate-400 uppercase">Accès Gouvernemental</p>
               <p className="text-[11px] font-mono">ID: MIN-ADMIN-01</p>
             </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto p-8 lg:p-12">
        
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-serif font-black text-slate-900">ChainCacao Togo</h1>
            <p className="text-slate-500 font-medium">Système National de Traçabilité et de Conformité EUDR</p>
          </div>
          <button className="bg-white border border-slate-200 px-6 py-3 rounded-2xl flex items-center gap-2 text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
            <Download size={16}/> Exporter Rapport Mensuel
          </button>
        </header>

        {view === 'dashboard' && <MinistryDashboard />}
        {view === 'approvals' && <ApprovalSystem />}
        {view === 'fraud' && <FraudControl />}

      </main>
    </div>
  );
}

// --- SOUS-COMPOSANT : DASHBOARD ---
function MinistryDashboard() {
  const stats = [
    { label: "Acteurs Validés", value: "482", sub: "+12 ce mois", icon: <Users className="text-blue-500"/> },
    { label: "Volume Exporté", value: "1,240 T", sub: "Cacao Certifié", icon: <BarChart className="text-emerald-500"/> },
    { label: "Lots Bloqués", value: "07", sub: "Alertes Fraude", icon: <AlertTriangle className="text-rose-500"/> },
    { label: "Conformité EUDR", value: "94.2%", sub: "Moyenne Nationale", icon: <ShieldCheck className="text-gold"/> },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100">
            <div className="bg-slate-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-4">{s.icon}</div>
            <p className="text-3xl font-black text-slate-900">{s.value}</p>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-1">{s.label}</p>
            <p className="text-[10px] font-bold text-emerald-600 mt-2">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-sm">
           <h3 className="font-bold text-lg mb-6">Activité Récente de la Chaîne</h3>
           <div className="space-y-6">
             <ActivityItem label="Coopérative de Kpalimé" action="Déclaration de 50 Lots" time="Il y a 10 min" />
             <ActivityItem label="Douanes de Lomé" action="Certification Export (Lot #402)" time="Il y a 2h" />
             <ActivityItem label="SGS Togo" action="Contrôle Qualité Validé" time="Il y a 4h" />
           </div>
        </div>
        <div className="bg-[#0F172A] rounded-[3rem] p-8 text-white">
           <h3 className="font-bold text-lg mb-6 text-gold">Zones de Production Actives</h3>
           <div className="h-64 bg-white/5 rounded-[2rem] border border-white/10 flex items-center justify-center">
              <MapPin size={40} className="text-gold animate-bounce" />
              <span className="text-xs font-bold ml-2">Carte Interactive Interfacée avec Google Maps/Sentinel</span>
           </div>
        </div>
      </div>
    </div>
  );
}

// --- SOUS-COMPOSANT : SYSTÈME D'APPROBATION ---
function ApprovalSystem() {
  const [requests] = useState([
    { id: 1, name: "Coop-Tové", type: "Coopérative", doc: "Agrément_2026_01.pdf" },
    { id: 2, name: "Export-Lomé-SA", type: "Exportateur", doc: "Licence_Douane.pdf" },
  ]);

  return (
    <div className="max-w-4xl space-y-6 animate-in slide-in-from-bottom-4">
      <div className="bg-white rounded-[3rem] p-8 shadow-sm border border-slate-100">
        <h3 className="font-bold text-xl mb-8">Demandes d'inscription en attente</h3>
        <div className="space-y-4">
          {requests.map((req) => (
            <div key={req.id} className="flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-slate-400"><Users /></div>
                <div>
                  <p className="font-black text-slate-800">{req.name}</p>
                  <p className="text-[10px] font-bold text-gold uppercase tracking-wider">{req.type}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="px-4 py-2 text-[10px] font-black uppercase text-slate-400 hover:text-slate-600 transition-colors">Vérifier Doc</button>
                <button onClick={() => toast.success("Acteur validé !")} className="bg-emerald-500 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all flex items-center gap-2">
                  <CheckCircle2 size={14}/> Valider
                </button>
                <button onClick={() => toast.error("Inscription rejetée")} className="bg-rose-500 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 transition-all flex items-center gap-2">
                  <XCircle size={14}/> Rejeter
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- UTILITAIRES ---
function AdminNavItem({ icon, label, active, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${active ? 'bg-gold text-slate-900 font-black shadow-lg shadow-gold/10' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
    >
      {icon}
      <span className="text-[11px] uppercase tracking-widest">{label}</span>
    </button>
  );
}

function ActivityItem({ label, action, time }: any) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
      <div>
        <p className="text-sm font-bold text-slate-800">{label}</p>
        <p className="text-xs text-slate-400">{action}</p>
      </div>
      <span className="text-[10px] font-medium text-slate-300 italic">{time}</span>
    </div>
  );
}

function FraudControl() {
  return (
    <div className="bg-rose-50 border border-rose-100 rounded-[3rem] p-10 flex flex-col items-center justify-center text-center animate-pulse">
      <AlertTriangle size={48} className="text-rose-500 mb-4" />
      <h3 className="text-xl font-black text-rose-900">Système de Surveillance Actif</h3>
      <p className="text-sm text-rose-700 max-w-md mt-2">Le moteur d'intelligence ChainCacao scanne les lots pour détecter des incohérences GPS ou de poids. Aucune alerte critique pour le moment.</p>
    </div>
  );
}