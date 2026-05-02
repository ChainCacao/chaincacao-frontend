import { useState } from 'react';
import { 
  Ship, FileCheck, UploadCloud, Link as LinkIcon, 
  Globe, PackageCheck, 
  CheckCircle2, ShieldAlert, Layers, FileText
} from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';

// --- TYPES ---
interface ExportDoc {
  name: string;
  status: 'pending' | 'uploaded';
  hash?: string;
}

export default function ExporterModule() {
  const [view, setView] = useState<'inventory' | 'compliance' | 'shipping'>('inventory');
  
  return (
    <div className="min-h-screen bg-[#F1F5F9] flex">
      <Toaster position="top-right" />
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-72 bg-cacao text-cream p-8 hidden lg:flex flex-col shadow-2xl">
        <div className="mb-12">
          <h2 className="text-2xl font-serif font-bold text-gold">ChainCacao</h2>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50">Exporter Portal</p>
        </div>

        <nav className="space-y-4 flex-1">
          <NavItem active={view === 'inventory'} onClick={() => setView('inventory')} icon={<Layers size={20}/>} label="Inventaire Global" />
          <NavItem active={view === 'compliance'} onClick={() => setView('compliance')} icon={<FileCheck size={20}/>} label="Conformité EUDR" />
          <NavItem active={view === 'shipping'} onClick={() => setView('shipping')} icon={<Ship size={20}/>} label="Expéditions" />
        </nav>

        <div className="mt-auto bg-white/5 p-4 rounded-2xl border border-white/10">
          <p className="text-[10px] font-black uppercase text-gold mb-2">Wallet Status</p>
          <div className="flex items-center gap-2 text-xs font-mono">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            0x71C...8E4F
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <header className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-serif font-black text-cacao">
            {view === 'inventory' && "Lots Prêts pour Export"}
            {view === 'compliance' && "Certification Documentaire"}
            {view === 'shipping' && "Suivi des Cargaisons"}
          </h1>
          <div className="flex gap-4">
            <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200 flex items-center gap-2">
              <Globe size={16} className="text-slate-400" />
              <span className="text-xs font-bold text-slate-600">Port de Lomé, TG</span>
            </div>
          </div>
        </header>

        {view === 'inventory' && <InventoryView onCertify={() => setView('compliance')} />}
        {view === 'compliance' && <ComplianceView onExport={() => setView('shipping')} />}
        {view === 'shipping' && <ShippingView />}
      </main>
    </div>
  );
}

// --- SOUS-COMPOSANT : INVENTAIRE ---
function InventoryView({ onCertify }: { onCertify: () => void }) {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="bg-slate-50 p-3 rounded-2xl text-cacao group-hover:bg-gold transition-colors">
                <PackageCheck size={24} />
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded">LOT-2026-A{i}</span>
            </div>
            <h3 className="font-bold text-xl text-cacao">12.5 Tonnes Cacao</h3>
            <p className="text-xs text-slate-500 mt-1">Origine: Coopérative Kloto</p>
            
            <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 border-2 border-white flex items-center justify-center text-emerald-600"><CheckCircle2 size={14}/></div>
                <div className="w-8 h-8 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-blue-600"><LinkIcon size={14}/></div>
              </div>
              <button 
                onClick={onCertify}
                className="bg-cacao text-gold px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-cacao/90 transition-all"
              >
                Certifier
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- SOUS-COMPOSANT : CONFORMITÉ (UPLOAD) ---
function ComplianceView({ onExport }: { onExport: () => void }) {
  const [docs] = useState<ExportDoc[]>([
    { name: "Certificat Phytosanitaire", status: 'pending' },
    { name: "Certificat d'Origine", status: 'uploaded', hash: "sha256:8f3b...2a" },
    { name: "Contrat Commercial (EU)", status: 'pending' },
    { name: "Manifeste Logistique", status: 'pending' },
  ]);

  return (
    <div className="max-w-4xl space-y-8 animate-in slide-in-from-bottom-4">
      <div className="bg-white rounded-[3rem] p-10 shadow-2xl border border-slate-100">
        <div className="flex items-center gap-4 mb-10 border-b border-slate-50 pb-8">
          <div className="bg-gold/10 p-4 rounded-3xl text-gold"><ShieldAlert size={32} /></div>
          <div>
            <h2 className="text-2xl font-bold text-cacao">Dossier EXP-2026-001</h2>
            <p className="text-slate-400 text-sm">Téléversez les documents requis pour l'ancrage Blockchain.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {docs.map((doc, idx) => (
            <div key={idx} className={`p-6 rounded-3xl border-2 transition-all ${doc.status === 'uploaded' ? 'border-emerald-100 bg-emerald-50/30' : 'border-dashed border-slate-200 hover:border-gold/50'}`}>
              <div className="flex justify-between items-start mb-4">
                <FileText className={doc.status === 'uploaded' ? 'text-emerald-500' : 'text-slate-300'} size={24} />
                {doc.status === 'uploaded' && <span className="text-[8px] font-mono text-emerald-600 bg-white px-2 py-1 rounded shadow-sm italic">{doc.hash}</span>}
              </div>
              <h4 className="font-bold text-cacao text-sm mb-4">{doc.name}</h4>
              
              {doc.status === 'pending' ? (
                <button className="flex items-center gap-2 text-[10px] font-black uppercase text-gold hover:text-cacao transition-colors">
                  <UploadCloud size={14} /> Choisir le fichier
                </button>
              ) : (
                <div className="flex items-center gap-2 text-[10px] font-black uppercase text-emerald-600">
                  <CheckCircle2 size={14} /> Document Validé
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 p-8 bg-cacao rounded-[2rem] text-cream flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center"><LinkIcon className="text-gold" /></div>
            <div>
              <p className="text-xs font-bold">Ancrage Blockchain</p>
              <p className="text-[10px] opacity-60">Signature numérique du manifeste global</p>
            </div>
          </div>
          <button 
            onClick={() => {
              toast.success("Manifeste EUDR ancré sur la Blockchain !");
              setTimeout(onExport, 1500);
            }}
            className="w-full md:w-auto bg-gold text-cacao px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-gold/20"
          >
            Générer & Signer le Manifeste
          </button>
        </div>
      </div>
    </div>
  );
}

// --- SOUS-COMPOSANT : SUIVI DES CARGAISONS ---
function ShippingView() {
  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <Ship className="text-cacao/40" size={24} />
            <span className="text-[8px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-1 rounded">En Transit</span>
          </div>
          <p className="text-2xl font-black text-cacao">3</p>
          <p className="text-xs text-slate-400 mt-1">Cargaisons Actives</p>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <PackageCheck className="text-cacao/40" size={24} />
            <span className="text-[8px] font-black uppercase text-blue-600 bg-blue-50 px-2 py-1 rounded">Livré</span>
          </div>
          <p className="text-2xl font-black text-cacao">12</p>
          <p className="text-xs text-slate-400 mt-1">Livraison Réussies</p>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <Globe className="text-cacao/40" size={24} />
            <span className="text-[8px] font-black uppercase text-gold bg-gold/10 px-2 py-1 rounded">Port</span>
          </div>
          <p className="text-2xl font-black text-cacao">Lomé</p>
          <p className="text-xs text-slate-400 mt-1">Port d'Origine</p>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <FileCheck className="text-cacao/40" size={24} />
            <span className="text-[8px] font-black uppercase text-slate-600 bg-slate-100 px-2 py-1 rounded">EUDR</span>
          </div>
          <p className="text-2xl font-black text-cacao">100%</p>
          <p className="text-xs text-slate-400 mt-1">Conformité</p>
        </div>
      </div>

      {/* Tableau des Cargaisons */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-50">
          <h3 className="text-xl font-bold text-cacao">Détail des Expéditions</h3>
          <p className="text-sm text-slate-400 mt-1">Suivez l'état de vos cargaisons en temps réel</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="px-6 py-5 text-left">ID Cargaison</th>
                <th className="px-6 py-5 text-left">Destination</th>
                <th className="px-6 py-5 text-left">Volume</th>
                <th className="px-6 py-5 text-left">Navire</th>
                <th className="px-6 py-5 text-left">Départ</th>
                <th className="px-6 py-5 text-left">Arrivée Est.</th>
                <th className="px-6 py-5 text-left">Statut</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {[
                { id: 'CGN-2026-001', dest: 'Rotterdam, NL', volume: '25.5t', ship: 'MV Cocoa Queen', depart: '15/04/2026', arrivee: '28/04/2026', statut: 'en_transit' },
                { id: 'CGN-2026-002', dest: 'Hambourg, DE', volume: '18.2t', ship: 'MV Golden Leaf', depart: '18/04/2026', arrivee: '02/05/2026', statut: 'en_transit' },
                { id: 'CGN-2026-003', dest: 'Le Havre, FR', volume: '32.1t', ship: 'MV Togo Pride', depart: '20/04/2026', arrivee: '05/05/2026', statut: 'en_preparation' },
                { id: 'CGN-2026-004', dest: 'Anvers, BE', volume: '28.7t', ship: 'MV West Africa', depart: '10/04/2026', arrivee: '25/04/2026', statut: 'livre' },
              ].map((cargaison, idx) => (
                <tr key={idx} className="hover:bg-slate-50/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-cacao/10 rounded-xl flex items-center justify-center">
                        <Ship size={16} className="text-cacao" />
                      </div>
                      <div>
                        <p className="font-bold text-cacao text-sm">{cargaison.id}</p>
                        <p className="text-[10px] text-slate-400 font-mono">EUDR-{idx + 1000}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-600">{cargaison.dest}</td>
                  <td className="px-6 py-4 font-black text-cacao text-sm">{cargaison.volume}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{cargaison.ship}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{cargaison.depart}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{cargaison.arrivee}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                      cargaison.statut === 'en_transit' ? 'bg-blue-50 text-blue-600' :
                      cargaison.statut === 'en_preparation' ? 'bg-amber-50 text-amber-600' :
                      'bg-emerald-50 text-emerald-600'
                    }`}>
                      {cargaison.statut === 'en_transit' ? 'En Transit' :
                       cargaison.statut === 'en_preparation' ? 'Préparation' : 'Livré'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-cacao hover:bg-slate-100 rounded-lg transition-colors">
                      <FileText size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Carte de Tracking */}
      <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
        <h3 className="text-xl font-bold text-cacao mb-6">Tracking en Temps Réel</h3>
        <div className="bg-slate-50 rounded-2xl h-96 flex items-center justify-center">
          <div className="text-center">
            <Ship className="text-slate-300 mx-auto mb-4" size={48} />
            <p className="text-slate-400 font-medium">Carte de tracking interactive</p>
            <p className="text-xs text-slate-400 mt-2">Intégration API GPS en cours</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- COMPOSANTS UI ATOMIQUES ---
function NavItem({ icon, label, active, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${active ? 'bg-gold text-cacao font-black shadow-lg shadow-gold/10' : 'text-cream/60 hover:bg-white/5 hover:text-cream'}`}
    >
      {icon}
      <span className="text-xs uppercase tracking-widest">{label}</span>
    </button>
  );
}
