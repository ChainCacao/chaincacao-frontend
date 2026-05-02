import { useState, useEffect } from 'react';
import { 
  Search, QrCode, ShieldCheck, Link, FileText, 
  MapPin, Calendar, Box, ExternalLink, CheckCircle2, Info, Download, Globe, X
} from 'lucide-react';
import { Html5QrcodeScanner } from "html5-qrcode";

export default function VerifierModule() {
  const [searchId, setSearchId] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [lotData, setLotData] = useState<any>(null);
  const [showScanner, setShowScanner] = useState(false);

  const handleSearchWithId = (id: string) => {
    setIsSearching(true);
    // Simulation d'appel API/Blockchain
    setTimeout(() => {
      setLotData({
        id: id,
        origin: "Coopérative Kloto, Togo",
        status: "CERTIFIÉ EUDR",
        weight: "500kg",
        variety: "Amelonado",
        harvestDate: "12 Avril 2026"
      });
      setIsSearching(false);
    }, 1200);
  };

  const handleSearch = () => {
    if (searchId.trim()) {
      handleSearchWithId(searchId);
    }
  };

  // Logique du Scanner QR
  useEffect(() => {
    if (showScanner) {
      const scanner = new Html5QrcodeScanner("reader", { 
        fps: 10, 
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      }, false);

      scanner.render((decodedText) => {
        setSearchId(decodedText);
        setShowScanner(false);
        scanner.clear();
        // Lancer la recherche automatiquement après scan
        setTimeout(() => handleSearchWithId(decodedText), 500);
      }, () => {
        // On ignore les erreurs de scan continu
      });

      return () => { scanner.clear(); };
    }
  }, [showScanner]);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* NAVBAR PUBLIQUE */}
      <nav className="h-20 border-b border-slate-100 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-cacao rounded-lg flex items-center justify-center text-gold">
            <ShieldCheck size={20} />
          </div>
          <span className="font-serif font-black text-xl text-cacao">ChainCacao</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-black uppercase text-slate-400 bg-slate-50 px-3 py-1 rounded-full">Explorer Public</span>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">
        
        {/* SECTION RECHERCHE */}
        <section className="text-center mb-16">
          <h1 className="text-4xl font-serif font-black text-cacao mb-4">Vérifiez l'Origine de votre Cacao</h1>
          <p className="text-slate-500 mb-8">Scannez un QR Code ou entrez l'identifiant unique du lot pour voir son parcours blockchain.</p>
          
          <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
              <input 
                type="text" 
                placeholder="Ex: LOT-TG-2026..."
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-gold transition-all font-mono text-sm"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
              />
            </div>
            <button 
              onClick={handleSearch}
              className="bg-cacao text-gold px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-cacao/90 transition-all flex items-center justify-center gap-2"
            >
              {isSearching ? "Recherche..." : "Vérifier"}
            </button>
            <button 
              onClick={() => setShowScanner(true)}
              className="bg-gold/10 text-gold p-4 rounded-2xl hover:bg-gold/20 transition-all"
            >
              <QrCode size={24} />
            </button>
          </div>
        </section>

        {lotData && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-8">
            
            {/* RÉSUMÉ DU LOT */}
            <div className="bg-cacao rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                  <span className="bg-gold text-cacao px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                    {lotData.status}
                  </span>
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase text-gold/60">Lot ID</p>
                    <p className="font-mono text-sm font-bold">{lotData.id}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  <InfoBlock icon={<MapPin size={16}/>} label="Provenance" value={lotData.origin} />
                  <InfoBlock icon={<Box size={16}/>} label="Poids" value={lotData.weight} />
                  <InfoBlock icon={<Info size={16}/>} label="Variété" value={lotData.variety} />
                  <InfoBlock icon={<Calendar size={16}/>} label="Récolte" value={lotData.harvestDate} />
                </div>
              </div>
              {/* Filigrane décoratif */}
              <div className="absolute -right-20 -bottom-20 opacity-5">
                <ShieldCheck size={300} />
              </div>
            </div>

            {/* TIMELINE DE TRAÇABILITÉ */}
            <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
              <h3 className="font-serif font-black text-xl mb-10 text-cacao">Parcours du Produit</h3>
              <div className="space-y-12 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                
                <TimelineStep 
                  title="Production & Récolte" 
                  desc="Enregistré par Jean Koffi (Producteur #821)" 
                  date="12/04/2026 - 08:30" 
                  details="GPS: 7.1895, 0.6124 | Photo parcelle validée."
                  status="completed"
                />
                <TimelineStep 
                  title="Validation Coopérative" 
                  desc="Vérifié par Coopérative Kloto" 
                  date="13/04/2026 - 14:15" 
                  details="Qualité Grade A | Analyse humidité: 7%."
                  status="completed"
                />
                <TimelineStep 
                  title="Exportation Lomé" 
                  desc="Manutention par Export-Togo SA" 
                  date="18/04/2026 - 10:00" 
                  details="Certificat d'origine #TG-992 attaché."
                  status="completed"
                />
                <TimelineStep 
                  title="Certification EUDR" 
                  desc="Approuvé par Rainforest Alliance" 
                  date="20/04/2026 - 09:45" 
                  details="Conformité non-déforestation garantie."
                  status="current"
                />

              </div>
            </div>

            {/* PREUVES BLOCKCHAIN */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                <h4 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                  <Link size={14} /> Preuves On-Chain
                </h4>
                <div className="space-y-4">
                  <BlockchainLink label="Transaction de Création" hash="0x8f3b...a1e9" />
                  <BlockchainLink label="Ancrage Certificat" hash="0x4c2e...f09e" />
                </div>
              </div>
              <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                <h4 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                  <FileText size={14} /> Documents Vérifiés
                </h4>
                <div className="flex flex-wrap gap-2">
                   <button className="bg-white px-4 py-2 rounded-xl text-[10px] font-bold border border-slate-200 hover:border-gold flex items-center gap-2">
                     <Download size={12}/> Dossier Complet (PDF)
                   </button>
                </div>
              </div>
            </div>
          </div>
        )}

      {/* MODAL SCANNER QR */}
      {showScanner && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4">
          <button 
            onClick={() => setShowScanner(false)}
            className="absolute top-6 right-6 text-white p-2 border border-white/20 rounded-full"
          >
            <X size={24} />
          </button>
          <div id="reader" className="w-full max-w-sm overflow-hidden rounded-2xl bg-white"></div>
          <p className="text-white mt-6 font-bold">Placez le QR Code devant la caméra</p>
        </div>
      )}

    </main>

    {/* FOOTER */}
    <footer className="mt-20 py-12 border-t border-slate-100 text-center">
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">
        ChainCacao Togo - Propulsé par la Technologie Blockchain & Transparence
      </p>
    </footer>
  </div>
);
}

// --- SOUS-COMPOSANTS ---

function InfoBlock({ icon, label, value }: any) {
  return (
    <div>
      <div className="flex items-center gap-2 text-gold/60 mb-1">
        {icon}
        <p className="text-[10px] font-black uppercase tracking-wider">{label}</p>
      </div>
      <p className="text-sm font-bold">{value}</p>
    </div>
  );
}

function TimelineStep({ title, desc, date, details, status }: any) {
  return (
    <div className="relative pl-12">
      <div className={`absolute left-0 top-1 w-9 h-9 rounded-full flex items-center justify-center z-10 ${status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-gold text-cacao animate-pulse'}`}>
        {status === 'completed' ? <CheckCircle2 size={18} /> : <Globe size={18} />}
      </div>
      <div>
        <div className="flex justify-between items-start">
          <h4 className="font-bold text-cacao">{title}</h4>
          <span className="text-[10px] font-medium text-slate-400">{date}</span>
        </div>
        <p className="text-sm text-slate-600 mt-1">{desc}</p>
        <p className="text-[10px] font-mono text-slate-400 mt-2 bg-slate-50 p-2 rounded-lg inline-block">{details}</p>
      </div>
    </div>
  );
}

function BlockchainLink({ label, hash }: any) {
  return (
    <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100">
      <span className="text-xs font-bold text-slate-600">{label}</span>
      <a href="#" className="text-gold hover:underline flex items-center gap-1 text-[10px] font-mono">
        {hash} <ExternalLink size={10} />
      </a>
    </div>
  );
}