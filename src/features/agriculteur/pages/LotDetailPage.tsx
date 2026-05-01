import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, MapPin, Calendar, Scale, 
  ExternalLink, ShieldCheck, Clock, CheckCircle2,
  QrCode, Download, Share2
} from 'lucide-react';

export default function LotDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Simulation de récupération de données (à lier à ton service plus tard)
  const lot = {
    id: id || "CACAO-2026-TG01",
    status: "Validé",
    date: "12 Avril 2026",
    poids: "150 kg",
    variete: "Forastero",
    gps: "9.5489, 1.1903",
    village: "Kara, Togo",
    txHash: "0x742d...45f3",
    conformite: "98%",
    historique: [
      { date: "12/04 - 08:30", action: "Récolte créée", user: "Moi (Agriculteur)", done: true },
      { date: "12/04 - 14:20", action: "Validation Coopérative", user: "Coopérative de Kara", done: true },
      { date: "En attente", action: "Contrôle Qualité", user: "Agent Certificateur", done: false },
    ]
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA] flex flex-col">
      {/* Header */}
      <header className="h-16 bg-white border-b border-slate-100 flex items-center px-4 sticky top-0 z-50">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="flex-1 text-center font-black text-xs uppercase tracking-[0.2em] text-slate-400">
          Détails du Lot
        </h1>
        <button className="p-2"><Share2 size={20} className="text-slate-400"/></button>
      </header>

      <main className="flex-1 p-5 space-y-6 max-w-xl mx-auto w-full">
        
        {/* CARD PRINCIPALE : IDENTITÉ */}
        <section className="bg-[#3B1E08] rounded-[2rem] p-6 text-white shadow-xl relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
          
          <div className="flex justify-between items-start mb-8">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#F0C040]/70">Référence Blockchain</span>
              <h2 className="text-2xl font-black tracking-tighter">{lot.id}</h2>
            </div>
            <div className="bg-[#F0C040] text-[#3B1E08] p-2 rounded-xl shadow-lg">
              <QrCode size={24} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-sm">
              <div className="flex items-center gap-2 text-[10px] font-bold text-white/50 uppercase mb-1">
                <Scale size={12} /> Poids
              </div>
              <p className="font-black text-lg">{lot.poids}</p>
            </div>
            <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-sm">
              <div className="flex items-center gap-2 text-[10px] font-bold text-white/50 uppercase mb-1">
                <Calendar size={12} /> Date
              </div>
              <p className="font-black text-lg">{lot.date}</p>
            </div>
          </div>
        </section>

        {/* SECTION CONFORMITÉ EUDR */}
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500 p-2 rounded-full text-white">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-emerald-800 uppercase leading-none">Score Conformité EUDR</p>
              <p className="text-sm font-bold text-emerald-600">Conforme à {lot.conformite}</p>
            </div>
          </div>
          <CheckCircle2 className="text-emerald-500" size={24} />
        </div>

        {/* TIMELINE DE TRAÇABILITÉ */}
        <section className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 px-1">Cycle de vie du lot</h3>
          <div className="bg-white rounded-3xl border border-slate-100 p-6 space-y-8">
            {lot.historique.map((item, index) => (
              <div key={index} className="flex gap-4 relative">
                {/* Ligne verticale entre les points */}
                {index !== lot.historique.length - 1 && (
                  <div className="absolute left-[11px] top-7 w-[2px] h-10 bg-slate-100"></div>
                )}
                
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 ${
                  item.done ? 'bg-[#3B1E08] text-[#F0C040]' : 'bg-slate-100 text-slate-300'
                }`}>
                  {item.done ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className={`text-sm font-bold ${item.done ? 'text-slate-900' : 'text-slate-400'}`}>
                      {item.action}
                    </p>
                    <span className="text-[10px] font-medium text-slate-400">{item.date}</span>
                  </div>
                  <p className="text-xs text-slate-500">{item.user}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* INFOS TECHNIQUES & BLOCKCHAIN */}
        <section className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 px-1">Données Techniques</h3>
          <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden">
            <div className="p-4 flex items-center justify-between border-b border-slate-50">
              <span className="text-[11px] font-bold text-slate-500">Localisation GPS</span>
              <span className="text-[11px] font-mono font-bold flex items-center gap-1">
                <MapPin size={12} className="text-red-500"/> {lot.gps}
              </span>
            </div>
            <div className="p-4 flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500">Hash Blockchain</span>
              <a 
                href={`https://sepolia.etherscan.io/tx/${lot.txHash}`} 
                target="_blank" 
                className="text-[11px] font-mono text-emerald-600 flex items-center gap-1 hover:underline"
              >
                {lot.txHash} <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </section>

        {/* ACTIONS DE BAS DE PAGE */}
        <div className="flex gap-3 pt-4">
          <button className="flex-1 bg-white border border-slate-200 py-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm active:bg-slate-50">
            <Download size={16} /> CERTIFICAT PDF
          </button>
        </div>
      </main>
    </div>
  );
}