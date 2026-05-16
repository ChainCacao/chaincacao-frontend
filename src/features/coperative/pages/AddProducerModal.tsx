// TODO [SIMULATED] This modal is UI-only and does not call the backend on save.
// Backend integration needed: POST /cooperatives/:id/agriculteurs via cooperativeService.createAgriculteur()
import { useState } from 'react';
import { 
  X, User, Sprout, FileText, Wallet, 
  ChevronRight, ChevronLeft, Save, MapPin 
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddProducerModal({ isOpen, onClose }: Props) {
  const [step, setStep] = useState(1);
  
  if (!isOpen) return null;

  const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay avec flou */}
      <div className="absolute inset-0 bg-cacao/60 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal Card */}
      <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* Header avec Stepper */}
        <div className="bg-cacao p-6 text-cream">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-serif font-bold">Nouvel Agriculteur</h2>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>
          
          {/* Indicateur de progression */}
          <div className="flex justify-between px-2">
            {[
              { icon: <User size={16}/>, label: 'Personnel' },
              { icon: <Sprout size={16}/>, label: 'Exploitation' },
              { icon: <FileText size={16}/>, label: 'Admin' },
              { icon: <Wallet size={16}/>, label: 'Économie' }
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                  step > i + 1 ? 'bg-gold border-gold text-cacao' : 
                  step === i + 1 ? 'bg-white border-white text-cacao' : 'border-white/30 text-white/30'
                }`}>
                  {step > i + 1 ? <Save size={14}/> : s.icon}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-tighter ${step === i + 1 ? 'text-gold' : 'text-white/40'}`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Formulaire Content */}
        <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
          
          {/* ÉTAPE 1 : PERSONNEL */}
          {step === 1 && (
            <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Nom Complet</label>
                  <input type="text" placeholder="Ex: Koffi Mensah" className="w-full p-3 bg-slate-50 border-none rounded-2xl focus:ring-2 ring-gold/50 outline-none font-medium text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Téléphone</label>
                  <input type="tel" placeholder="+228 90 00 00 00" className="w-full p-3 bg-slate-50 border-none rounded-2xl focus:ring-2 ring-gold/50 outline-none font-medium text-sm" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Localisation (Village/Commune)</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gold" size={18} />
                  <input type="text" placeholder="Rechercher ou pointer sur la carte..." className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 ring-gold/50 outline-none font-medium text-sm" />
                </div>
              </div>
            </div>
          )}

          {/* ÉTAPE 2 : PROFESSIONNEL */}
          {step === 2 && (
            <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Superficie (Ha)</label>
                  <input type="number" step="0.1" placeholder="Ex: 2.5" className="w-full p-3 bg-slate-50 border-none rounded-2xl focus:ring-2 ring-gold/50 outline-none font-medium text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Années d'expérience</label>
                  <input type="number" placeholder="Ex: 12" className="w-full p-3 bg-slate-50 border-none rounded-2xl focus:ring-2 ring-gold/50 outline-none font-medium text-sm" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Type de Culture</label>
                <select className="w-full p-3 bg-slate-50 border-none rounded-2xl focus:ring-2 ring-gold/50 outline-none font-medium text-sm appearance-none cursor-pointer">
                  <option>Cacao Biologique</option>
                  <option>Cacao Conventionnel</option>
                  <option>Café / Cacao Mixte</option>
                </select>
              </div>
            </div>
          )}

          {/* ÉTAPE 3 : ADMINISTRATIF */}
          {step === 3 && (
            <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
               <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Numéro ID National / Passport</label>
                <input type="text" className="w-full p-3 bg-slate-50 border-none rounded-2xl focus:ring-2 ring-gold/50 outline-none font-medium text-sm" />
              </div>
              <div className="p-6 border-2 border-dashed border-slate-200 rounded-3xl text-center hover:border-gold transition-colors cursor-pointer group">
                <FileText className="mx-auto text-slate-300 mb-2 group-hover:text-gold" size={32} />
                <p className="text-xs font-bold text-slate-500">Scanner ou Téléverser la Pièce d'Identité</p>
                <p className="text-[10px] text-slate-400 mt-1">PNG, JPG ou PDF (max. 5MB)</p>
              </div>
            </div>
          )}

          {/* ÉTAPE 4 : ÉCONOMIQUE */}
          {step === 4 && (
            <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
               <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Moyen de Financement Principal</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Fonds Propres', 'Crédit Agricole', 'Aide Coop', 'Microfinance'].map(m => (
                    <button key={m} className="p-3 text-xs font-bold border border-slate-100 rounded-xl hover:bg-gold hover:text-cacao transition-all">{m}</button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-50 flex items-center justify-between bg-slate-50/50">
          <button 
            onClick={prevStep}
            disabled={step === 1}
            className={`flex items-center gap-2 text-xs font-black uppercase px-4 py-2 rounded-xl transition-all ${step === 1 ? 'opacity-0' : 'text-slate-400 hover:text-cacao'}`}
          >
            <ChevronLeft size={16} /> Précédent
          </button>

          {step < 4 ? (
            <button 
              onClick={nextStep}
              className="bg-cacao text-gold px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-cacao/20 active:scale-95 transition-all"
            >
              Suivant <ChevronRight size={16} />
            </button>
          ) : (
            <button 
              className="bg-emerald-600 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-emerald-200 active:scale-95 transition-all"
            >
              Finaliser l'enregistrement <Save size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}