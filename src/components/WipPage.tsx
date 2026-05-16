import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Construction } from 'lucide-react';

export default function WipPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-6">
      <div className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-md">
        <Construction size={48} className="text-gold mx-auto mb-4" />
        <h1 className="text-xl font-black text-cacao mb-2">Fonctionnalite en cours</h1>
        <p className="text-cacao/60 text-sm mb-6">
          Cette page n'est pas encore disponible. Revenez bientot.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 bg-cacao text-gold px-6 py-3 rounded-xl font-bold hover:bg-[#522a0b] transition-all"
        >
          <ArrowLeft size={18} /> Retour
        </button>
      </div>
    </div>
  );
}
