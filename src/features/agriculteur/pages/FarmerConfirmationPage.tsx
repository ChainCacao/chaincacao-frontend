import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Share2, Download, ArrowRight, User, Copy, MapPin, Phone } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react'; // Assurez-vous d'avoir installé 'qrcode.react' (npm install qrcode.react)
import { toast } from 'react-hot-toast';

interface FarmerData {
  nom: string;
  prenom: string;
  telephone?: string;
  commune?: string;
  internalId: string;
  // Ajoutez d'autres champs pertinents de l'agriculteur ici
}

export default function FarmerConfirmationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const farmerData = location.state?.farmerData as FarmerData | undefined;

  if (!farmerData) {
    // Gérer le cas où les données de l'agriculteur ne sont pas disponibles (ex: accès direct à la page)
    // Rediriger ou afficher un message d'erreur
    React.useEffect(() => {
      toast.error("Aucune donnée d'agriculteur trouvée. Redirection vers le tableau de bord.");
      navigate('/cooperative/dashboard', { replace: true });
    }, [navigate]);
    return null;
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(farmerData.internalId);
    toast.success('ID copié dans le presse-papiers');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Identifiants ChainCacao pour ${farmerData.nom} ${farmerData.prenom}`,
        text: `Bonjour ${farmerData.prenom},\nVotre ID interne ChainCacao est : ${farmerData.internalId}\nVous pouvez vous connecter à l'application agriculteur avec cet ID.`,
        url: window.location.origin + '/agriculteur/login', // Lien vers la page de connexion agriculteur
      })
      .then(() => toast.success('Identifiants partagés avec succès !'))
      .catch((error) => toast.error('Erreur lors du partage : ' + error.message));
    } else {
      toast.error("Le partage n'est pas supporté par votre navigateur.");
      // Fallback: copier l'ID dans le presse-papiers
      navigator.clipboard.writeText(farmerData.internalId);
      toast.success('ID interne copié dans le presse-papiers !');
    }
  };

  const handleSave = () => {
    // Simuler la sauvegarde du QR code ou des informations
    const qrCodeCanvas = document.getElementById('qrcode-canvas') as HTMLCanvasElement;
    if (qrCodeCanvas) {
      const pngUrl = qrCodeCanvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `chaincacao_id_${farmerData.internalId}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      toast.success('QR Code et identifiants sauvegardés !');
    } else {
      toast.error('Impossible de générer le QR Code pour la sauvegarde.');
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
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
          Agriculteur enregistré !
        </h1>

        <p className="text-cacao/70 leading-relaxed mb-6">
          L'agriculteur <span className="font-bold">{farmerData.nom} {farmerData.prenom}</span> a été enregistré avec succès.
          Voici ses identifiants pour se connecter à la plateforme.
        </p>

        {/* Carte d'identité visuelle de l'agriculteur */}
        <div className="bg-cacao text-white rounded-3xl p-6 mb-8 shadow-xl text-left relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <User size={120} />
          </div>
          
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-gold font-bold mb-1">Identifiant Agriculteur</p>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-mono font-black">{farmerData.internalId}</span>
                  <button onClick={copyToClipboard} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                    <Copy size={16} className="text-gold" />
                  </button>
                </div>
              </div>
              <div className="bg-white p-2 rounded-xl">
                <QRCodeCanvas
                  id="qrcode-canvas"
                  value={farmerData.internalId}
                  size={60}
                  level="H"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-[10px] uppercase text-white/50 font-bold">Nom & Prénom</p>
                <p className="font-bold">{farmerData.nom} {farmerData.prenom}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] uppercase text-white/50 font-bold">Localisation</p>
                  <p className="text-xs flex items-center gap-1"><MapPin size={12}/> {farmerData.commune || 'Non spécifié'}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-white/50 font-bold">Contact</p>
                  <p className="text-xs flex items-center gap-1"><Phone size={12}/> {farmerData.telephone || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4 mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 bg-cacao text-gold rounded-xl font-bold text-sm shadow-md hover:bg-cacao/90 transition-all"
          >
            <Share2 size={18} /> Partager
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-gold text-cacao rounded-xl font-bold text-sm shadow-md hover:bg-gold/90 transition-all"
          >
            <Download size={18} /> Sauvegarder
          </motion.button>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/cooperative/membres')}
          className="w-full bg-emerald-600 text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all"
        >
          Retour à la gestion des membres
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </motion.div>
    </div>
  );
}