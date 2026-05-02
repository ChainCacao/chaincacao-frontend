import { useState } from 'react';
import { 
  ShieldCheck, FileSearch, Map, CheckCircle, 
  XCircle, Camera, 
  Fingerprint
} from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';

export default function CertifierModule() {
  const [view, setView] = useState<'pending' | 'audit'>('pending');
  const [selectedLot, setSelectedLot] = useState<any>(null);

  const stats = [
    { label: "En attente", value: 14, icon: <FileSearch />, color: "text-amber-500" },
    { label: "Certifiés", value: 128, icon: <ShieldCheck />, color: "text-emerald-500" },
    { label: "Rejetés", value: 3, icon: <XCircle />, color: "text-rose-500" },
  ];

  const openAudit = (lot: any) => {
    setSelectedLot(lot);
    setView('audit');
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex flex-col">
      <Toaster position="top-center" />
      
      {/* HEADER TOP BAR */}
      <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-cacao rounded-xl flex items-center justify-center text-gold shadow-lg shadow-cacao/20">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black text-cacao uppercase tracking-tighter">Organisme de Certification</h1>
            <p className="text-[10px] font-bold text-slate-400">Rainforest Alliance - Bureau Régional Togo</p>
          </div>
        </div>
        
        <nav className="flex gap-8">
          <button onClick={() => setView('pending')} className={`text-xs font-black uppercase tracking-widest ${view === 'pending' ? 'text-gold border-b-2 border-gold pb-1' : 'text-slate-400'}`}>Files d'attente</button>
          <button className="text-xs font-black uppercase tracking-widest text-slate-400">Historique Audit</button>
          <button className="text-xs font-black uppercase tracking-widest text-slate-400">Rapports</button>
        </nav>
      </header>

      <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
        {view === 'pending' ? (
          <div className="space-y-10 animate-in fade-in duration-500">
            {/* KPI GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stats.map((s, i) => (
                <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6">
                  <div className={`${s.color} bg-slate-50 p-4 rounded-2xl`}>{s.icon}</div>
                  <div>
                    <p className="text-2xl font-black text-cacao">{s.value}</p>
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* LISTE DES LOTS EN ATTENTE */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">ID Lot</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Coopérative</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Conformité GPS</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {[
                    { id: 'LOT-TG-2026-042', coop: 'Coopérative de Kpalimé', gps: '98%', status: 'high' },
                    { id: 'LOT-TG-2026-045', coop: 'Union des Producteurs Atakpamé', gps: '85%', status: 'medium' },
                  ].map((lot) => (
                    <tr key={lot.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-6 font-mono text-xs font-bold text-cacao">{lot.id}</td>
                      <td className="px-8 py-6 text-sm font-bold text-slate-600">{lot.coop}</td>
                      <td className="px-8 py-6">
                        <span className="flex items-center gap-2 text-xs font-black text-emerald-600">
                          <CheckCircle size={14} /> {lot.gps}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <button onClick={() => openAudit(lot)} className="bg-cacao text-cream px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gold hover:text-cacao transition-all">Analyser</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <AuditView lot={selectedLot} onBack={() => setView('pending')} />
        )}
      </main>
    </div>
  );
}

// --- SOUS-COMPOSANT : VUE AUDIT DÉTAILLÉE ---
function AuditView({ lot, onBack }: any) {
  const [reason, setReason] = useState("");

  const handleDecision = (decision: 'certify' | 'reject') => {
    if (decision === 'reject' && !reason) {
      toast.error("Veuillez indiquer un motif de refus.");
      return;
    }
    toast.success(decision === 'certify' ? "Certification ancrée sur Blockchain !" : "Lot marqué comme non-conforme.");
    onBack();
  };

  return (
    <div className="animate-in slide-in-from-right-8 duration-500 space-y-8">
      <button onClick={onBack} className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2 hover:text-cacao transition-colors">
        ← Retour à la file d'attente
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* COLONNE GAUCHE : PREUVES */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-100">
            <h2 className="text-2xl font-serif font-black text-cacao mb-8 flex items-center gap-3">
              <FileSearch className="text-gold" /> Dossier de Preuves : {lot.id}
            </h2>

            <div className="grid grid-cols-2 gap-8 mb-10">
              <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Preuve Photographique</p>
                <div className="aspect-video bg-slate-100 rounded-[2rem] flex flex-col items-center justify-center border-2 border-dashed border-slate-200">
                   <Camera size={32} className="text-slate-300 mb-2" />
                   <span className="text-[10px] font-bold text-slate-400">Photo de la parcelle (Géo-taguée)</span>
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Empreinte Blockchain</p>
                <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                  <Fingerprint size={32} className="text-gold mb-4" />
                  <p className="text-[10px] font-mono break-all text-slate-500 leading-relaxed">
                    Hash: 8f3b2c...a1e94d7b21...f09e
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Données GPS & Déforestation (EUDR)</p>
               <div className="h-48 bg-emerald-50 rounded-[2rem] border border-emerald-100 flex items-center justify-center">
                  <div className="text-center">
                    <Map size={32} className="text-emerald-500 mx-auto mb-2" />
                    <p className="text-xs font-bold text-emerald-800">Aucune zone de déforestation détectée depuis 2020</p>
                    <p className="text-[10px] text-emerald-600">Superposition via satellite (Sentinel-2)</p>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* COLONNE DROITE : DÉCISION */}
        <div className="space-y-6">
          <div className="bg-cacao rounded-[2.5rem] p-8 text-cream shadow-xl">
            <h3 className="font-bold text-lg mb-6 text-gold">Décision Finale</h3>
            <div className="space-y-4">
              <button 
                onClick={() => handleDecision('certify')}
                className="w-full bg-gold text-cacao py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] transition-all"
              >
                <CheckCircle size={18} /> Certifier le Lot
              </button>
              
              <div className="pt-4 border-t border-white/10">
                <textarea 
                  placeholder="Motif de refus si nécessaire..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs outline-none focus:border-rose-400 transition-all mb-4"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
                <button 
                  onClick={() => handleDecision('reject')}
                  className="w-full bg-rose-500/10 text-rose-400 py-4 rounded-2xl font-black text-xs uppercase tracking-widest border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all"
                >
                  <XCircle size={18} /> Refuser Certification
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] p-6 border border-slate-100">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Timeline du Lot</h4>
            <div className="space-y-4">
              <TimelinePoint status="complete" label="Récolte validée" date="12/04/26" />
              <TimelinePoint status="complete" label="Transformation" date="15/04/26" />
              <TimelinePoint status="pending" label="Certification finale" date="En attente" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- UTILITAIRES ---
const TimelinePoint = ({ status, label, date }: any) => (
  <div className="flex items-center gap-3">
    <div className={`w-2 h-2 rounded-full ${status === 'complete' ? 'bg-emerald-500' : 'bg-amber-400 animate-pulse'}`}></div>
    <div className="flex-1">
      <p className="text-[11px] font-bold text-cacao">{label}</p>
      <p className="text-[9px] text-slate-400 font-medium">{date}</p>
    </div>
  </div>
);