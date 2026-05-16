import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Mail, MessageSquare, ArrowRight, Info } from 'lucide-react';

export default function CoopConfirmationPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-[2.5rem] shadow-2xl shadow-cacao/10 border border-cacao/5 p-8 md:p-12 max-w-lg w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 10 }}
          className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8"
        >
          <CheckCircle2 size={60} className="text-emerald-600" />
        </motion.div>

        <h1 className="text-3xl font-serif font-black text-cacao mb-4">
          Demande d'inscription envoyée !
        </h1>

        <p className="text-cacao/70 leading-relaxed mb-8">
          Votre demande d'inscription pour la coopérative a été reçue avec succès.
          Elle est maintenant en cours d'examen par le Ministère de l'Agriculture.
        </p>

        <div className="bg-gold/5 rounded-2xl p-6 mb-8 border border-gold/20">
          <h3 className="font-bold text-cacao mb-3 flex items-center justify-center gap-2">
            <Info size={20} className="text-gold" />
            Prochaines étapes
          </h3>
          <p className="text-sm text-cacao/80 mb-4">
            Une fois votre demande validée par le Ministère, vous recevrez vos identifiants de connexion.
          </p>
          <div className="flex items-center justify-center gap-4 text-sm font-medium text-cacao">
            <div className="flex items-center gap-2">
              <Mail size={18} className="text-gold" />
              <span>Par Email</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare size={18} className="text-gold" />
              <span>Par SMS</span>
            </div>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/cooperative/login')}
          className="w-full bg-cacao text-gold py-4 rounded-xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-cacao/20 hover:bg-cacao/90 transition-all"
        >
          Se connecter
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </motion.button>

        <button
          onClick={() => navigate('/cooperative')}
          className="mt-4 text-cacao/60 hover:text-cacao transition-colors text-sm font-medium"
        >
          Retour à la page d'accueil
        </button>
      </motion.div>
    </div>
  );
}