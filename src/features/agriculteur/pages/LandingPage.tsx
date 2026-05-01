import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguageStore } from '../../../stores/useLanguageStors';
import { translations } from '../../../core/translations';
import { Globe } from 'lucide-react';

const languages = [
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'ewe', label: 'Ewe', flag: '🇹🇬' },
  { code: 'kabye', label: 'Kabyè', flag: '🇹🇬' },
] as const;

export default function LandingPage() {
  const navigate = useNavigate();
  const { lang, setLanguage } = useLanguageStore();
  const t = translations[lang];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-cream">
      {/* Hero Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-linear-to-br from-cacao to-cacao-mid p-10 rounded-3xl shadow-2xl text-center"
      >
        <div className="text-3xl font-bold text-cream mb-2 tracking-tight">
          Chain<span className="text-gold">Cacao</span>
        </div>
        
        <h1 className="text-2xl font-serif font-black text-cream mt-6">
          {t.welcome}
        </h1>
        <p className="text-cream/70 text-sm mt-2">
          {t.sub}
        </p>

        {/* Lang Picker */}
        <div className="grid grid-cols-3 gap-3 mt-10">
          {languages.map((l) => (
            <button
              key={l.code}
              onClick={() => setLanguage(l.code)}
              className={`flex flex-col items-center p-4 rounded-2xl border transition-all active:scale-95 ${
                lang === l.code 
                ? 'bg-gold/20 border-gold text-gold' 
                : 'bg-white/5 border-white/20 text-cream/80 hover:bg-white/10'
              }`}
            >
              <span className="text-2xl mb-2">{l.flag}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider">{l.label}</span>
            </button>
          ))}
        </div>

        <button 
          onClick={() => navigate('/agriculteur/login')}
          className="w-full mt-10 bg-gold text-cacao font-bold py-4 rounded-2xl shadow-lg hover:brightness-110 transition-all"
        >
          {t.start}
        </button>
      </motion.div>

      <div className="mt-8 flex items-center gap-2 text-cacao/40 text-xs font-bold uppercase">
        <Globe size={14} />
        <span>Togo Cacao Traceability Standard</span>
      </div>
    </div>
  );
}