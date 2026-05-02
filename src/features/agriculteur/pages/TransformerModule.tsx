import { useState } from 'react';
import { 
  Factory, Package, Database, 
  TrendingUp, ShieldCheck, 
  PlusCircle, Activity, History, Ship, ArrowRight, PackageCheck
} from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';

export default function TransformerModule() {
  const [view, setView] = useState<'dashboard' | 'declare' | 'history'>('dashboard');
  
  // Statistiques simulées
  const kpis = [
    { label: "Matière Reçue", value: "24.5 T", icon: <Database />, color: "text-gold" },
    { label: "En Transformation", value: "8.2 T", icon: <Activity />, color: "text-cacao" },
    { label: "Stock Fini", value: "12.0 T", icon: <Package />, color: "text-gold" },
  ];

  return (
    <div className="min-h-screen bg-cream/30 flex flex-col md:flex-row">
      <Toaster position="bottom-right" />
      
      {/* SIDEBAR MINI (Navigation Gauche) */}
      <nav className="w-full md:w-20 bg-cacao flex md:flex-col items-center py-6 gap-8 px-4 md:px-0 z-50 shadow-xl">
        <div className="w-12 h-12 bg-gold rounded-2xl flex items-center justify-center text-cacao font-black">TF</div>
        <div className="flex md:flex-col gap-6 flex-1 justify-center">
          <NavIcon active={view === 'dashboard'} onClick={() => setView('dashboard')} icon={<TrendingUp />} />
          <NavIcon active={view === 'declare'} onClick={() => setView('declare')} icon={<PlusCircle />} />
          <NavIcon active={view === 'history'} onClick={() => setView('history')} icon={<History size={20} />} />
        </div>
      </nav>

      {/* ZONE DE CONTENU PRINCIPALE */}
      <main className="flex-1 p-6 md:p-10">
        
        {/* HEADER */}
        <header className="flex justify-between items-start mb-10">
          <div>
            <h1 className="text-3xl font-serif font-black text-cacao">Usine de Kara-Centre</h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Statut: Opérationnel / Certifié EUDR</span>
            </div>
          </div>
          <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 hidden sm:flex items-center gap-4">
             <div className="text-right">
               <p className="text-xs font-bold text-slate-700">Responsable Prod.</p>
               <p className="text-[9px] text-slate-400 uppercase font-black tracking-tighter">ID: TR-228-KARA</p>
             </div>
             <div className="w-10 h-10 bg-slate-100 rounded-full border border-slate-200"></div>
          </div>
        </header>

        {view === 'dashboard' && <TransformerDashboard kpis={kpis} onStartProd={() => setView('declare')} />}
        {view === 'declare' && <ProductionForm onFinish={() => setView('dashboard')} />}
      </main>
    </div>
  );
}

// --- FONCTIONS DE SIMULATION TRANSFERT ---
const handleTransferToExporter = (produit: any) => {
  toast.success(`Transfert initié: ${produit.quantite} de ${produit.produit} vers exportateur certifié EUDR!`);
  toast.loading("Génération du manifeste EUDR en cours...", { duration: 2000 });
  setTimeout(() => {
    toast.success("Manifeste EUDR généré et transféré vers la blockchain!");
  }, 2000);
};

const simulateBulkTransfer = () => {
  toast.success("Démarrage du transfert groupé vers les exportateurs...");
  toast.loading("Validation EUDR pour tous les lots...", { duration: 1500 });
  setTimeout(() => {
    toast.success("3 lots transférés avec succès vers Global Cocoa Exports!");
    toast.success("Manifeste EUDR consolidé généré!");
  }, 1500);
};

// --- SOUS-COMPOSANT : DASHBOARD ---
function TransformerDashboard({ kpis, onStartProd }: any) {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {kpis.map((kpi: any, i: number) => (
          <div key={i} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 group hover:shadow-lg transition-all">
            <div className={`${kpi.color} mb-4 bg-slate-50 w-10 h-10 rounded-xl flex items-center justify-center`}>{kpi.icon}</div>
            <p className="text-3xl font-black text-cacao">{kpi.value}</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* QUICK ACTIONS & RECENT PRODUCTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-cacao">Suivi des Lots en Temps Réel</h3>
            <button className="text-xs font-black text-gold uppercase hover:underline">Voir tout</button>
          </div>
          <div className="space-y-4">
            <BatchItem id="LOT-2026-A1" product="Beurre de Cacao" status="En cours" date="Aujourd'hui" />
            <BatchItem id="LOT-2026-A2" product="Poudre de Cacao" status="Transformé" date="Hier" />
          </div>
        </div>

        <div className="bg-cacao rounded-[2.5rem] p-8 text-cream flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-xl mb-4 text-gold">Capacité de Production</h3>
            <p className="text-cream/60 text-sm">Rendement actuel : <span className="text-cream font-bold">94%</span></p>
            <div className="w-full bg-white/10 h-2 rounded-full mt-4 overflow-hidden">
              <div className="bg-gold h-full w-[94%]"></div>
            </div>
          </div>
          <button 
            onClick={onStartProd}
            className="w-full bg-gold text-cacao py-4 rounded-2xl font-black text-xs uppercase tracking-widest mt-8 flex items-center justify-center gap-2 hover:scale-105 transition-all"
          >
            <PlusCircle size={18}/> Nouvelle Production
          </button>
        </div>
      </div>

      {/* SECTION TRANSFERT VERS EXPORTATEUR */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gold/10 rounded-2xl flex items-center justify-center text-gold">
              <Ship size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-cacao">Transferts vers Exportateurs</h3>
              <p className="text-sm text-slate-400 mt-1">Simulez un transfert de produit fini vers un exportateur</p>
            </div>
          </div>
        </div>
        
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Produits disponibles */}
            <div>
              <h4 className="font-bold text-cacao mb-4">Stock Disponible</h4>
              <div className="space-y-3">
                {[
                  { id: 'TF-2026-B1', produit: 'Beurre de Cacao Premium', quantite: '5.2 T', qualite: 'A+', date: '15/04/2026' },
                  { id: 'TF-2026-P1', produit: 'Poudre de Cacao Bio', quantite: '3.8 T', qualite: 'AA', date: '18/04/2026' },
                  { id: 'TF-2026-M1', produit: 'Masse de Cacao', quantite: '2.1 T', qualite: 'A', date: '20/04/2026' },
                ].map((produit, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors cursor-pointer group">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-black text-cacao text-sm">{produit.produit}</p>
                        <p className="text-xs font-mono text-slate-400 mt-1">{produit.id}</p>
                        <div className="flex gap-4 mt-2">
                          <span className="text-xs font-bold text-gold">{produit.quantite}</span>
                          <span className="text-xs font-bold text-emerald-600">Qualité {produit.qualite}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleTransferToExporter(produit)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity bg-gold text-cacao p-2 rounded-xl hover:scale-105"
                      >
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Exportateurs disponibles */}
            <div>
              <h4 className="font-bold text-cacao mb-4">Exportateurs Certifiés</h4>
              <div className="space-y-3">
                {[
                  { nom: 'Global Cocoa Exports', pays: 'Pays-Bas', certificat: 'EUDR-NL-2026', statut: 'actif' },
                  { nom: 'Africa Trade Ltd', pays: 'Allemagne', certificat: 'EUDR-DE-2026', statut: 'actif' },
                  { nom: 'Cacao International', pays: 'France', certificat: 'EUDR-FR-2026', statut: 'actif' },
                ].map((exportateur, idx) => (
                  <div key={idx} className="p-4 bg-cacao/5 rounded-2xl border border-cacao/10">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-black text-cacao text-sm">{exportateur.nom}</p>
                        <p className="text-xs text-slate-600">{exportateur.pays}</p>
                        <p className="text-xs font-mono text-gold mt-1">{exportateur.certificat}</p>
                      </div>
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[8px] font-black uppercase rounded">
                        {exportateur.statut}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Actions rapides */}
          <div className="mt-8 p-6 bg-gold/5 rounded-2xl border border-gold/20">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gold rounded-xl flex items-center justify-center text-cacao">
                  <PackageCheck size={20} />
                </div>
                <div>
                  <p className="font-bold text-cacao text-sm">Transfert Automatisé</p>
                  <p className="text-xs text-slate-600">Générez un manifeste EUDR pour l'export</p>
                </div>
              </div>
              <button 
                onClick={() => simulateBulkTransfer()}
                className="bg-cacao text-gold px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-cacao/20"
              >
                <Ship size={16} className="inline mr-2" />
                Transférer Tout le Stock
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- SOUS-COMPOSANT : FORMULAIRE DE PRODUCTION ---
function ProductionForm({ onFinish }: { onFinish: () => void }) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      toast.success("Production enregistrée et stock mis à jour !");
      onFinish();
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden animate-in zoom-in-95">
      <div className="bg-cacao p-8 text-cream flex items-center gap-4">
        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-gold"><Factory /></div>
        <div>
          <h2 className="text-xl font-bold">Déclaration de Transformation</h2>
          <p className="text-cream/60 text-xs mt-1 italic tracking-wide">Reliez la matière première au produit fini.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Lot de Matière Première (Entrée)</label>
          <select className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 ring-gold/40 outline-none font-bold text-slate-700 appearance-none cursor-pointer">
            <option>LOT-2026-X1 (10.5 Tonnes Cacao Kara)</option>
            <option>LOT-2026-X2 (5.0 Tonnes Cacao Centrale)</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Produit Fini</label>
            <select className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 ring-gold/40 outline-none font-bold text-slate-700 appearance-none cursor-pointer">
              <option>Beurre de Cacao</option>
              <option>Poudre de Cacao</option>
              <option>Masse de Cacao</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Quantité Produite (T)</label>
            <input required type="number" step="0.01" className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 ring-gold/40 outline-none font-bold text-slate-700" placeholder="0.00" />
          </div>
        </div>

        <div className="pt-4 flex gap-4">
          <button type="button" onClick={onFinish} className="flex-1 py-4 font-black text-xs uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">Annuler</button>
          <button disabled={loading} type="submit" className="flex-2 bg-gold text-cacao px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-gold/20 flex items-center justify-center gap-3">
            {loading ? <Loader2 className="animate-spin" /> : <><ShieldCheck size={18}/> Enregistrer la production</>}
          </button>
        </div>
      </form>
    </div>
  );
}

// --- UTILITAIRES ---
const NavIcon = ({ icon, active, onClick }: any) => (
  <button onClick={onClick} className={`p-3 rounded-xl transition-all ${active ? 'bg-gold text-cacao scale-110 shadow-lg shadow-gold/20' : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}>
    {icon}
  </button>
);

const BatchItem = ({ id, product, status, date }: any) => (
  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors cursor-default">
    <div className="flex items-center gap-4">
      <div className={`w-2 h-10 rounded-full ${status === 'En cours' ? 'bg-amber-400' : 'bg-emerald-500'}`}></div>
      <div>
        <p className="text-xs font-mono font-bold text-slate-400">{id}</p>
        <p className="text-sm font-black text-slate-700">{product}</p>
      </div>
    </div>
    <div className="text-right">
      <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-md ${status === 'En cours' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>{status}</span>
      <p className="text-[10px] text-slate-400 mt-1 font-bold">{date}</p>
    </div>
  </div>
);

const Loader2 = ({ className }: { className?: string }) => (
  <Activity className={`animate-spin ${className}`} />
);