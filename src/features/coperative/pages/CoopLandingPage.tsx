import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronRight, Globe, ShieldCheck, 
  Truck, ClipboardCheck, ArrowRight 
} from 'lucide-react';

export default function CoopLandingPage() {
  const navigate = useNavigate();
  const [lang, setLang] = useState('fr');

  return (
    <div className="min-h-screen bg-cream selection:bg-gold/30 font-sans flex flex-col items-center overflow-x-hidden">
      
      {/* Background Decor (Subtil) */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] bg-cacao/5 rounded-full blur-[100px]" />
      </div>

      <main className="relative z-10 w-full max-w-xl px-6 pt-16 pb-12 flex flex-col items-center">
        
        {/* Badge d'accueil */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-cacao/5 rounded-full shadow-sm mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
          <ShieldCheck size={14} className="text-gold" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-cacao-mid">Portail Officiel Coopérative</span>
        </div>

        {/* Titre Identitaire */}
        <h1 className="text-6xl font-serif font-bold text-cacao tracking-tighter mb-6 text-center">
          Chain<span className="text-gold">Cacao</span>
        </h1>
        
        <p className="text-center text-cacao-mid/70 font-medium leading-relaxed mb-12 px-4">
          Pilotez les réceptions, les regroupements et les preuves blockchain de votre coopérative depuis un seul écran mobile sécurisé.
        </p>

        {/* Cartes de Fonctionnalités - Look Pro */}
        <div className="w-full space-y-4 mb-12">
          <FeatureCard 
            icon={<ClipboardCheck className="text-gold" size={24} />}
            title="Réception rapide"
            desc="Validez les sacs et capturez les écarts en temps réel."
          />
          <FeatureCard 
            icon={<ShieldCheck className="text-gold" size={24} />}
            title="Conformité EUDR"
            desc="Suivi automatique des certifications et alertes d'origine."
          />
          <FeatureCard 
            icon={<Truck className="text-gold" size={24} />}
            title="Transferts Fiables"
            desc="Exportez vos lots avec preuve d'horodatage blockchain."
          />
        </div>

        {/* Sélecteur de Langue - Design Segmenté */}
        <div className="w-full max-w-[280px] bg-white p-1 rounded-2xl border border-cacao/5 flex shadow-inner mb-12">
          <button 
            onClick={() => setLang('fr')}
            className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${lang === 'fr' ? 'bg-cacao text-gold shadow-lg' : 'text-cacao/40 hover:text-cacao'}`}
          >
            Français
          </button>
          <button 
            onClick={() => setLang('en')}
            className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${lang === 'en' ? 'bg-cacao text-gold shadow-lg' : 'text-cacao/40 hover:text-cacao'}`}
          >
            English
          </button>
        </div>

        {/* Actions Principales */}
        <div className="w-full space-y-4">
          <button 
            onClick={() => navigate('/cooperative/register')}
            className="w-full bg-cacao text-gold py-6 rounded-[2.5rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-cacao/20 flex items-center justify-center gap-3 active:scale-95 transition-all group"
          >
            S'inscrire officiellement
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>

          <button 
            onClick={() => navigate('/cooperative/dashboard')}
            className="w-full bg-transparent border-2 border-cacao/10 text-cacao py-6 rounded-[2.5rem] font-bold text-sm hover:bg-cacao/5 transition-all active:scale-95"
          >
            Déjà inscrit ? <span className="font-black underline ml-1">Se connecter</span>
          </button>
        </div>

        {/* Footer Subtle */}
        <footer className="mt-16 flex items-center gap-2 opacity-30">
          <Globe size={12} />
          <span className="text-[10px] font-black uppercase tracking-widest">
            Région Afrique de l'Ouest • v2.0
          </span>
        </footer>
      </main>
    </div>
  );
}

// --- SOUS-COMPOSANT FEATURE CARD ---
const FeatureCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="w-full bg-white p-6 rounded-[2rem] border border-cacao/5 shadow-sm flex items-start gap-5 hover:shadow-xl hover:shadow-cacao/5 transition-all group">
    <div className="bg-cream p-4 rounded-2xl group-hover:bg-gold/10 transition-colors">
      {icon}
    </div>
    <div className="space-y-1">
      <h3 className="font-black text-cacao text-sm uppercase tracking-tight">{title}</h3>
      <p className="text-xs text-cacao-mid/60 font-medium leading-relaxed">{desc}</p>
    </div>
  </div>
);
