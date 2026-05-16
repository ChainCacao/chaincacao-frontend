import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import {
  Search, QrCode, ShieldCheck, Link, FileText,
  MapPin, Calendar, Box, ExternalLink, CheckCircle2, Info, Download, Globe, X,
} from 'lucide-react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { lotService } from '../../../services/lot.service';
import { getApiErrorMessage } from '../../../services/http';
import type { LotRecolte, DocumentAssocie } from '../../../types/api';

export default function VerifierModule() {
  const [searchId, setSearchId] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [lotData, setLotData] = useState<LotRecolte | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showScanner, setShowScanner] = useState(false);

  const handleSearchWithId = async (id: string) => {
    const codeLot = id.trim().toUpperCase();
    if (!codeLot) return;

    setIsSearching(true);
    setErrorMessage(null);
    try {
      const lot = await lotService.verify(codeLot);
      setLotData(lot);
    } catch (error) {
      setLotData(null);
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    if (!showScanner) return;

    const scanner = new Html5QrcodeScanner('reader', {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0,
    }, false);

    scanner.render((decodedText) => {
      setSearchId(decodedText);
      setShowScanner(false);
      scanner.clear();
      void handleSearchWithId(decodedText);
    }, () => undefined);

    return () => { void scanner.clear(); };
  }, [showScanner]);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <nav className="h-20 border-b border-slate-100 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-cacao rounded-lg flex items-center justify-center text-gold">
            <ShieldCheck size={20} />
          </div>
          <span className="font-serif font-black text-xl text-cacao">ChainCacao</span>
        </div>
        <span className="text-[10px] font-black uppercase text-slate-400 bg-slate-50 px-3 py-1 rounded-full">Explorer Public</span>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <section className="text-center mb-12">
          <h1 className="text-4xl font-serif font-black text-cacao mb-4">Vérifiez l'origine de votre cacao</h1>
          <p className="text-slate-500 mb-8">Scannez un QR Code ou entrez l'identifiant unique du lot.</p>

          <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
              <input
                type="text"
                placeholder="Ex: LOT-CACAO-2026-00000003"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-gold transition-all font-mono text-sm"
                value={searchId}
                onChange={(event) => setSearchId(event.target.value)}
              />
            </div>
            <button
              onClick={() => void handleSearchWithId(searchId)}
              className="bg-cacao text-gold px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-cacao/90 transition-all"
            >
              {isSearching ? 'Recherche...' : 'Vérifier'}
            </button>
            <button
              onClick={() => setShowScanner(true)}
              className="bg-gold/10 text-gold p-4 rounded-2xl hover:bg-gold/20 transition-all"
            >
              <QrCode size={24} />
            </button>
          </div>
        </section>

        {errorMessage && (
          <div className="mb-8 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-700">
            {errorMessage}
          </div>
        )}

        {lotData && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-8">
            <div className="bg-cacao rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                  <span className="bg-gold text-cacao px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                    {lotData.certifieurId ? 'CERTIFIÉ' : lotData.statutConformiteEUDR}
                  </span>
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase text-gold/60">Lot ID</p>
                    <p className="font-mono text-sm font-bold">{lotData.codeLot}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  <InfoBlock icon={<MapPin size={16} />} label="Provenance" value={lotData.cooperative?.siegeSocial || lotData.cooperativeId} />
                  <InfoBlock icon={<Box size={16} />} label="Poids" value={`${lotData.poidsNetKg} kg`} />
                  <InfoBlock icon={<Info size={16} />} label="Variété" value={lotData.especeVariete} />
                  <InfoBlock icon={<Calendar size={16} />} label="Récolte" value={new Date(lotData.createdAt).toLocaleDateString('fr-FR')} />
                </div>
              </div>
              <div className="absolute -right-20 -bottom-20 opacity-5">
                <ShieldCheck size={300} />
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
              <h3 className="font-serif font-black text-xl mb-10 text-cacao">Parcours du produit</h3>
              <div className="space-y-12 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                {(lotData.lothistorique || []).map((item, index, all) => (
                  <TimelineStep
                    key={item.id}
                    title={item.etape}
                    desc={item.action}
                    date={new Date(item.createdAt).toLocaleString('fr-FR')}
                    details={`${item.acteurRole}: ${item.acteurNom} | ${item.blockchainTxHash || 'hash en attente'}`}
                    status={index === all.length - 1 ? 'current' : 'completed'}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                <h4 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                  <Link size={14} /> Preuves On-Chain
                </h4>
                <div className="space-y-4">
                  <BlockchainLink label="Transaction du lot" hash={lotData.blockchainTxHash || 'En attente'} />
                  <BlockchainLink label="Token ID" hash={lotData.tokenId || lotData.codeLot} />
                </div>
              </div>
              <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                <h4 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                  <FileText size={14} /> Documents vérifiés
                </h4>
                <div className="flex flex-wrap gap-2">
                  {((lotData.documentsAssocies as unknown as DocumentAssocie[] | null | undefined) || []).map((document: DocumentAssocie) => (
                    <a key={document.url} href={document.url} className="bg-white px-4 py-2 rounded-xl text-[10px] font-bold border border-slate-200 hover:border-gold flex items-center gap-2">
                      <Download size={12} /> {document.nom}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

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

      <footer className="mt-20 py-12 border-t border-slate-100 text-center">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">
          ChainCacao Togo - Blockchain & Transparence
        </p>
      </footer>
    </div>
  );
}

function InfoBlock({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
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

function TimelineStep({ title, desc, date, details, status }: { title: string; desc: string; date: string; details: string; status: 'completed' | 'current' }) {
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

function BlockchainLink({ label, hash }: { label: string; hash: string }) {
  return (
    <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100">
      <span className="text-xs font-bold text-slate-600">{label}</span>
      <span className="text-gold flex items-center gap-1 text-[10px] font-mono">
        {hash.slice(0, 24)} <ExternalLink size={10} />
      </span>
    </div>
  );
}
