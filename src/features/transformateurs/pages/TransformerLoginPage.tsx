import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Html5QrcodeScanner } from "html5-qrcode";
import { useAuthStore } from '../../../stores/useAuthStore';
import { authService } from '../../../services/auth.service';
import { getApiErrorMessage } from '../../../services/http';
import { QrCode, ArrowLeft, Loader2, ShieldCheck, X, Factory } from 'lucide-react';

type TransformerLoginFormData = {
  internalId: string;
  password: string;
};

const TransformerLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const loginToStore = useAuthStore((state) => state.login);
  const [showScanner, setShowScanner] = useState(false);
  
  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue } = useForm<TransformerLoginFormData>({
    defaultValues: {
      internalId: '',
      password: '',
    }
  });

  // Logique du Scanner QR
  useEffect(() => {
    if (showScanner) {
      const scanner = new Html5QrcodeScanner("reader", { 
        fps: 10, 
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      }, false);

      scanner.render((decodedText) => {
        setValue("internalId", decodedText);
        setShowScanner(false);
        scanner.clear();
      }, () => {});

      return () => { scanner.clear(); };
    }
  }, [showScanner, setValue]);

  const onSubmit = async (data: TransformerLoginFormData) => {
    try {
      const session = await authService.login({ identifier: data.internalId, password: data.password });
      loginToStore(session);
      navigate('/transformateur/dashboard');
    } catch (err: unknown) {
      alert(getApiErrorMessage(err));
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF3E0] flex flex-col items-center justify-center p-0 md:p-8">
      
      <div className="w-full max-w-4xl bg-white md:rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[100vh] md:min-h-[600px]">
        
        {/* Section Gauche : Branding Institutionnel */}
        <div className="hidden md:flex md:w-1/2 bg-[#2B1608] p-12 flex-col justify-between text-white relative">
          {/* Motif subtil en arrière-plan */}
          <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center">
             <Factory size={300} />
          </div>

          <div className="relative z-10">
            <h1 className="text-4xl font-black text-[#D4A017] tracking-tighter italic">CHAINCACAO</h1>
            <div className="mt-4 h-1 w-12 bg-[#D4A017]"></div>
            <p className="mt-6 text-white/70 text-lg leading-relaxed">
              Espace de production certifié pour les transformateurs de cacao.
            </p>
          </div>

          <div className="relative z-10 bg-[#D4A017]/10 p-6 rounded-3xl border border-[#D4A017]/20 backdrop-blur-sm">
            <p className="text-xs font-bold text-[#D4A017] uppercase tracking-widest mb-2">Sécurité Blockchain</p>
            <p className="text-sm italic font-light text-cream/80">
              "L'accès à ce portail nécessite un identifiant d'organisation délivré par l'autorité de régulation."
            </p>
          </div>
        </div>

        {/* Section Droite : Formulaire */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft size={24} className="text-[#3B1E08]" />
            </button>
            <span className="md:hidden font-black text-[#3B1E08]">TRANSFORM PORTAL</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-black text-[#3B1E08] flex items-center gap-2">
              <Factory size={24} className="text-[#D4A017]" />
              Accès Transformateur
            </h2>
            <p className="text-gray-500 text-sm mt-1">Identifiez votre organisation de transformation</p>
          </div>

          {/* Scanner Modal */}
          {showScanner && (
            <div className="fixed inset-0 z-50 bg-[#2B1608]/95 flex flex-col items-center justify-center p-4 backdrop-blur-md">
              <button onClick={() => setShowScanner(false)} className="absolute top-6 right-6 text-white p-2 border border-white/20 rounded-full">
                <X size={24} />
              </button>
              <div id="reader" className="w-full max-w-sm overflow-hidden rounded-3xl border-4 border-[#D4A017] bg-white shadow-2xl"></div>
              <p className="text-[#D4A017] mt-6 font-black tracking-widest uppercase text-sm">Scanner le badge d'organisation</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            <button 
              type="button"
              onClick={() => setShowScanner(true)}
              className="w-full group border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center gap-2 hover:border-[#D4A017] hover:bg-[#D4A017]/5 transition-all active:scale-95"
            >
              <QrCode size={40} className="text-gray-400 group-hover:text-[#D4A017]" />
              <span className="text-sm font-bold text-gray-600 group-hover:text-[#D4A017]">Scanner le Badge Organisme</span>
            </button>

            <div className="relative flex items-center justify-center">
              <span className="absolute inset-x-0 h-[1px] bg-gray-100"></span>
              <span className="relative bg-white px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Ou Saisie Manuelle</span>
            </div>

            <div>
              <label className="block text-[11px] font-black text-gray-400 uppercase mb-2 ml-1">ID Organisation (Certifié)</label>
              <input 
                {...register("internalId")}
                placeholder="Ex: TRANS-KARA-2026"
                className={`w-full p-4 bg-gray-50 rounded-xl border-2 transition-all outline-none font-bold ${
                  errors.internalId ? 'border-red-500 focus:border-red-500' : 'border-transparent focus:border-[#D4A017] focus:bg-white'
                }`}
              />
              {errors.internalId && <p className="text-red-500 text-[10px] mt-2 font-bold uppercase">{errors.internalId.message}</p>}
            </div>

            <div>
              <label className="block text-[11px] font-black text-gray-400 uppercase mb-2 ml-1">Mot de passe</label>
              <input 
                {...register("password")}
                type="password"
                placeholder="Secret123"
                className={`w-full p-4 bg-gray-50 rounded-xl border-2 transition-all outline-none font-bold ${
                  errors.password ? 'border-red-500 focus:border-red-500' : 'border-transparent focus:border-[#D4A017] focus:bg-white'
                }`}
              />
              {errors.password && <p className="text-red-500 text-[10px] mt-2 font-bold uppercase">{errors.password.message}</p>}
            </div>

            <button 
              disabled={isSubmitting}
              className="w-full bg-[#3B1E08] text-white py-4 rounded-xl font-black shadow-xl flex justify-center items-center gap-3 hover:bg-[#2B1608] active:scale-95 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <><ShieldCheck size={20} className="text-[#D4A017]" /> SE CONNECTER</>
              )}
            </button>
          </form>

          <div className="mt-auto pt-8 text-center">
            <p className="text-[9px] text-gray-400 uppercase tracking-[0.3em] font-black">Node de Production #456 - Togo Network</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransformerLoginPage;
