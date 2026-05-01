import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, MapPin, Camera, Check, 
  Loader2, Info, ChevronRight, QrCode, Share2,
  ShieldCheck, ExternalLink, RefreshCw
} from 'lucide-react';

// --- TYPES ---
interface LotFormData {
  poids: string;
  variete: string;
  coords: { lat: number; lng: number } | null;
  photoChamp: string | null;
  photoSac: string | null;
}

export default function CreateLotPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const [formData, setFormData] = useState<LotFormData>({
    poids: '',
    variete: 'Forastero (Classique)',
    coords: null,
    photoChamp: null,
    photoSac: null
  });

  const captureGPS = () => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormData(prev => ({
          ...prev, 
          coords: { lat: pos.coords.latitude, lng: pos.coords.longitude }
        }));
        setLoading(false);
      },
      () => {
        // En prod, utilisez un Toast ici
        alert("Localisation requise pour la conformité EUDR.");
        setLoading(false);
      },
      { enableHighAccuracy: true } // Crucial pour la précision blockchain
    );
  };

  const isFormValid = formData.poids && Number(formData.poids) > 0;

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col items-center font-sans">
      
      {/* Header : Navigation Intuitive */}
      <header className="w-full h-16 border-b border-slate-100 flex items-center px-6 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <button 
          onClick={() => step === 4 ? navigate('/agriculteur/dashboard') : step > 1 ? setStep(step - 1) : navigate(-1)} 
          className="p-2 hover:bg-slate-50 rounded-full transition-colors"
        >
          <ArrowLeft size={22} className="text-slate-900" />
        </button>
        <div className="flex-1 flex flex-col items-center">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            {step < 4 ? `Processus de Certification` : 'Certificat Émis'}
          </span>
          <div className="flex gap-1 mt-1">
             {[1,2,3].map(i => (
               <div key={i} className={`h-1 w-4 rounded-full transition-all duration-500 ${step >= i ? 'bg-[#3B1E08]' : 'bg-slate-100'}`} />
             ))}
          </div>
        </div>
        <div className="w-10"></div>
      </header>

      <main className="w-full max-w-xl p-6 md:py-12">
        
        {/* ÉTAPE 1 : RÉCOLTE */}
        {step === 1 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <header>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Détails de récolte</h1>
              <p className="text-slate-500 font-medium">Saisissez les informations de base du lot.</p>
            </header>

            <div className="space-y-6">
              <div className="group">
                <label className="text-[11px] font-bold text-slate-500 uppercase ml-1 mb-2 block">Variété de Cacao</label>
                <select 
                  className="w-full p-4 bg-white border-2 border-slate-100 rounded-2xl font-bold text-slate-800 outline-none focus:border-[#3B1E08] transition-all appearance-none cursor-pointer shadow-sm"
                  value={formData.variete}
                  onChange={(e) => setFormData({...formData, variete: e.target.value})}
                >
                  <option>Forastero (Classique)</option>
                  <option>Trinitario</option>
                  <option>Criollo (Premium)</option>
                </select>
              </div>

              <div className="relative">
                <label className="text-[11px] font-bold text-slate-500 uppercase ml-1 mb-2 block">Poids net (KG)</label>
                <input 
                  type="number" 
                  inputMode="decimal"
                  placeholder="0.00"
                  className="w-full p-6 bg-white border-2 border-slate-100 rounded-[2rem] text-4xl font-black outline-none focus:border-[#3B1E08] transition-all shadow-sm"
                  value={formData.poids}
                  onChange={(e) => setFormData({...formData, poids: e.target.value})}
                />
                <div className="absolute right-6 bottom-6 text-slate-300 font-black text-xl">KG</div>
              </div>

              <button 
                disabled={!isFormValid}
                onClick={() => setStep(2)}
                className="w-full bg-[#3B1E08] text-white py-5 rounded-[2rem] font-bold flex justify-center items-center gap-2 disabled:opacity-10 transition-all shadow-xl shadow-brown-200 active:scale-95"
              >
                Continuer <ChevronRight size={20}/>
              </button>
            </div>
          </div>
        )}

        {/* ÉTAPE 2 : GPS - LOOK "HIGH TECH" */}
        {step === 2 && (
          <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
            <div className="text-center space-y-4">
              <div className="relative w-24 h-24 mx-auto">
                <div className={`absolute inset-0 bg-emerald-100 rounded-full ${loading ? 'animate-ping' : ''}`} />
                <div className="relative w-24 h-24 bg-white rounded-full border shadow-sm flex items-center justify-center">
                  <MapPin className="text-emerald-600" size={40} />
                </div>
              </div>
              <h1 className="text-2xl font-black text-slate-900">Géolocalisation EUDR</h1>
              <p className="text-slate-500 text-sm leading-relaxed px-4">
                Nous devons prouver que ce cacao ne provient pas de zones déforestées.
              </p>
            </div>

            <div className={`p-8 rounded-[2.5rem] border-2 transition-all duration-500 flex flex-col items-center gap-6 ${formData.coords ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100 border-dashed'}`}>
              {formData.coords ? (
                <div className="text-center space-y-2">
                  <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Position Validée</span>
                  <div className="font-mono text-lg font-bold text-slate-700">
                    {formData.coords.lat.toFixed(6)}°N <br/> {formData.coords.lng.toFixed(6)}°W
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-2">
                  <div className="h-2 w-32 bg-slate-200 rounded-full mx-auto animate-pulse" />
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter">Signal satellite requis</p>
                </div>
              )}
              
              <button 
                onClick={captureGPS}
                className="bg-white px-8 py-4 rounded-2xl text-sm font-black shadow-sm border border-slate-200 flex items-center gap-2 hover:shadow-md transition-all active:scale-95"
              >
                {loading ? <RefreshCw className="animate-spin text-emerald-600" size={18}/> : <MapPin size={18}/>}
                {formData.coords ? 'Recalibrer' : 'Activer le GPS'}
              </button>
            </div>

            <button 
              disabled={!formData.coords || loading}
              onClick={() => setStep(3)}
              className="w-full bg-[#3B1E08] text-white py-5 rounded-[2rem] font-bold shadow-lg disabled:opacity-20 transition-all"
            >
              Étape Suivante
            </button>
          </div>
        )}

        {/* ÉTAPE 3 : PHOTOS - LOOK "QUALITÉ" */}
        {step === 3 && (
          <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
            <header>
              <h1 className="text-2xl font-black text-slate-900">Preuve Visuelle</h1>
              <p className="text-slate-500 text-sm">Capturez les preuves physiques du lot.</p>
            </header>

            <div className="grid grid-cols-2 gap-4">
              <PhotoUploader 
                label="Champ de cacao" 
                onCapture={() => setFormData({...formData, photoChamp: 'captured'})} 
                active={!!formData.photoChamp} 
              />
              <PhotoUploader 
                label="Sac de fèves" 
                onCapture={() => setFormData({...formData, photoSac: 'captured'})} 
                active={!!formData.photoSac} 
              />
            </div>

            <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100 flex gap-4">
              <ShieldCheck className="text-blue-600 shrink-0" size={24} />
              <p className="text-[11px] text-blue-800 leading-tight font-semibold italic">
                SÉCURITÉ : Vos images sont horodatées et liées numériquement à vos coordonnées GPS pour empêcher toute fraude.
              </p>
            </div>

            <button 
              disabled={!formData.photoChamp || !formData.photoSac || loading}
              onClick={() => {
                setLoading(true);
                // Simulation d'envoi blockchain
                setTimeout(() => {
                  setResult({ lotId: "CACAO-2024-X98" });
                  setStep(4);
                  setLoading(false);
                }, 2000);
              }}
              className="w-full bg-emerald-600 text-white py-6 rounded-[2.5rem] font-black tracking-widest shadow-xl shadow-emerald-100 flex justify-center items-center gap-3 active:scale-95 transition-all disabled:opacity-30"
            >
              {loading ? <Loader2 className="animate-spin" size={24}/> : 'SCELLER SUR LA BLOCKCHAIN'}
            </button>
          </div>
        )}

        {/* ÉTAPE 4 : SUCCÈS (La "Récompense" visuelle) */}
        {step === 4 && (
          <div className="text-center space-y-10 animate-in fade-in zoom-in-95 duration-1000">
            <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-emerald-200">
              <Check className="text-white" size={48} strokeWidth={3} />
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Succès Certifié</h1>
              <p className="text-slate-500 font-medium">Le hachage cryptographique a été validé.</p>
            </div>

            <div className="bg-white p-2 rounded-[3rem] border border-slate-100 shadow-[0_32px_64px_-15px_rgba(0,0,0,0.1)] relative overflow-hidden group">
               <div className="p-8 bg-gradient-to-b from-slate-50 to-white rounded-[2.5rem]">
                  <div className="absolute top-6 right-8 flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full border shadow-sm">
                    <ShieldCheck size={14} className="text-emerald-500" />
                    <span className="text-[10px] font-black uppercase text-slate-800">EUDR Compliant</span>
                  </div>
                  
                  <div className="bg-white w-48 h-48 mx-auto rounded-3xl flex items-center justify-center my-8 shadow-inner border border-slate-50 group-hover:scale-105 transition-transform duration-700">
                    <QrCode size={140} strokeWidth={1.5} className="text-[#3B1E08]" />
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Certificat Blockchain</p>
                    <p className="text-2xl font-mono font-black text-[#3B1E08] tracking-tighter">{result?.lotId}</p>
                  </div>
               </div>

               <div className="bg-slate-50 p-4 flex justify-between gap-4">
                  <button className="flex-1 bg-white p-4 rounded-2xl flex flex-col items-center gap-1 shadow-sm hover:shadow-md transition-all active:scale-95">
                    <Share2 size={22} className="text-slate-700" />
                    <span className="text-[9px] font-black uppercase text-slate-500">Partager</span>
                  </button>
                  <button className="flex-1 bg-white p-4 rounded-2xl flex flex-col items-center gap-1 shadow-sm hover:shadow-md transition-all active:scale-95">
                    <ExternalLink size={22} className="text-slate-700" />
                    <span className="text-[9px] font-black uppercase text-slate-500">Blockchain</span>
                  </button>
               </div>
            </div>

            <button 
              onClick={() => navigate('/agriculteur/dashboard')}
              className="w-full py-4 text-xs font-black text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest"
            >
              Retourner à l'accueil
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

// --- SOUS-COMPOSANTS OPTIMISÉS ---

const PhotoUploader = ({ label, onCapture, active }: { label: string, onCapture: () => void, active: boolean }) => (
  <button 
    onClick={onCapture}
    className={`aspect-[4/5] rounded-[2rem] border-2 flex flex-col items-center justify-center gap-4 transition-all duration-500 ${
      active 
      ? 'border-emerald-500 bg-emerald-50 shadow-inner' 
      : 'border-dashed border-slate-200 bg-white hover:border-[#3B1E08] hover:bg-slate-50 shadow-sm'
    }`}
  >
    <div className={`p-5 rounded-2xl transition-all duration-500 ${
      active 
      ? 'bg-emerald-500 text-white rotate-[360deg]' 
      : 'bg-slate-50 text-slate-400 group-hover:scale-110'
    }`}>
      {active ? <Check size={28} strokeWidth={3} /> : <Camera size={28} />}
    </div>
    <div className="text-center px-4">
      <span className={`text-[11px] font-black uppercase tracking-tight block ${active ? 'text-emerald-700' : 'text-slate-500'}`}>
        {active ? 'Validé ✓' : label}
      </span>
      {!active && <span className="text-[9px] text-slate-400 font-medium italic">Appuyez pour capturer</span>}
    </div>
  </button>
);
