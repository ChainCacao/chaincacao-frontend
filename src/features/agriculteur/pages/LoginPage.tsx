import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Html5QrcodeScanner } from "html5-qrcode";
import { loginSchema} from '../lib/loginSchema';
import type { LoginFormData } from '../lib/loginSchema';
import { authService } from '../services/authService';
import { useAuthStore } from '../../../stores/useAuthStore';
import { getApiErrorMessage } from '../../../services/http';
import { QrCode, ArrowLeft, Loader2, ShieldCheck, X } from 'lucide-react';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const loginToStore = useAuthStore((state) => state.login);
  const [showScanner, setShowScanner] = useState(false);
  
  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });

  // Logique du Scanner
  useEffect(() => {
    if (showScanner) {
      const scanner = new Html5QrcodeScanner("reader", { 
        fps: 10, 
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      }, false);

      scanner.render((decodedText) => {
        setValue("internalId", decodedText); // Remplit l'ID automatiquement
        setShowScanner(false);
        scanner.clear();
      }, () => {
        // On ignore les erreurs de scan continu pour ne pas polluer la console
      });

      return () => { scanner.clear(); };
    }
  }, [showScanner, setValue]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      const session = await authService.login({ identifier: data.internalId, password: data.password });
      if (!session) return;
      loginToStore(session);
      navigate('/agriculteur/dashboard');
    } catch (err: unknown) {
      alert(getApiErrorMessage(err));
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF3E0] flex flex-col items-center justify-center p-0 md:p-8">
      
      {/* Container Principal : S'adapte à l'écran */}
      <div className="w-full max-w-4xl bg-white md:rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[100vh] md:min-h-[600px]">
        
        {/* Section Gauche : Branding (Visible surtout sur PC/Tablette) */}
        <div className="hidden md:flex md:w-1/2 bg-[#3B1E08] p-12 flex-col justify-between text-white">
          <div>
            <h1 className="text-4xl font-black text-[#F0C040] tracking-tighter">CHAINCACAO</h1>
            <p className="mt-4 text-white/70 text-lg">La révolution de la traçabilité pour les producteurs de cacao au Togo.</p>
          </div>
          <div className="bg-white/10 p-6 rounded-3xl border border-white/10">
            <p className="text-sm italic font-light">"Pas d'identifiant ? Veuillez vous rapprocher de votre coopérative de rattachement pour obtenir vos accès certifiés."</p>
          </div>
        </div>

        {/* Section Droite : Formulaire */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft size={24} className="text-[#3B1E08]" />
            </button>
            <span className="md:hidden font-black text-[#3B1E08]">CHAINCACAO</span>
          </div>

          <h2 className="text-2xl font-bold text-[#3B1E08] mb-2">Connexion Agriculteur</h2>
          <p className="text-gray-500 text-sm mb-8">Accédez à votre espace sécurisé</p>

          {/* Zone du Scanner Modal-like */}
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

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            <button 
              type="button"
              onClick={() => setShowScanner(true)}
              className="w-full group border-2 border-dashed border-gray-300 rounded-2xl p-6 flex flex-col items-center gap-2 hover:border-[#3B1E08] transition-all active:scale-95"
            >
              <QrCode size={40} className="text-gray-400 group-hover:text-[#3B1E08]" />
              <span className="text-sm font-bold text-gray-600 group-hover:text-[#3B1E08]">Utiliser mon Pass QR</span>
            </button>

            <div className="relative flex items-center justify-center">
              <span className="absolute inset-x-0 h-[1px] bg-gray-200"></span>
              <span className="relative bg-white px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Ou ID Manuel</span>
            </div>

            <div>
              <label className="block text-[11px] font-black text-gray-400 uppercase mb-2 ml-1">Identifiant Personnel</label>
              <input 
                {...register("internalId")}
                placeholder="Ex: AGR-TG-001"
                className={`w-full p-4 bg-gray-50 rounded-xl border-2 transition-all outline-none ${
                  errors.internalId ? 'border-red-500 focus:border-red-500' : 'border-transparent focus:border-[#3B1E08] focus:bg-white'
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
                className={`w-full p-4 bg-gray-50 rounded-xl border-2 transition-all outline-none ${
                  errors.password ? 'border-red-500 focus:border-red-500' : 'border-transparent focus:border-[#3B1E08] focus:bg-white'
                }`}
              />
              {errors.password && <p className="text-red-500 text-[10px] mt-2 font-bold uppercase">{errors.password.message}</p>}
            </div>

            <button 
              disabled={isSubmitting}
              className="w-full bg-[#3B1E08] text-white py-4 rounded-xl font-black shadow-lg flex justify-center items-center gap-3 hover:bg-[#522a0b] active:scale-95 transition-all disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <><ShieldCheck size={20} className="text-[#F0C040]" /> SE CONNECTER</>}
            </button>
          </form>

          <div className="mt-auto pt-8 text-center">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Propulsé par la technologie Blockchain</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
