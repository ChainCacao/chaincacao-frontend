// TODO [SIMULATED] This registration page does not call the backend. Replace with authService.register() + exportateur payload.
// Backend integration needed: POST /auth/register with exportateur payload
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Upload, FileText, ShieldCheck, AlertCircle, 
  CheckCircle2, Plane, MapPin, Phone, Mail, Globe,
  User, Camera, Eye, EyeOff, Info, Award, Package, Globe2
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ExporterFormData {
  // Informations de base
  nomEntreprise: string;
  sigle: string;
  numeroExportateur: string;
  anneeCreation: string;
  capaciteExport: string;
  
  // Contact
  responsable: string;
  email: string;
  telephone: string;
  siteWeb: string;
  
  // Adresse
  siegeSocial: string;
  region: string;
  departement: string;
  commune: string;
  coordonneesGPS: string;
  
  // Certifications
  certificationExport: File | null;
  certificationDouane: File | null;
  certificationQualite: File | null;
  agrementMinistériel: File | null;
  photoEntrepot: File | null;
  
  // Wallet Blockchain
  walletAddress: string;
  
  // Validation
  accepteConditions: boolean;
  accepteBlockchain: boolean;
}

interface FormErrors {
  [key: string]: string;
}

export default function ExporterRegisterPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  
  const [formData, setFormData] = useState<ExporterFormData>({
    nomEntreprise: '',
    sigle: '',
    numeroExportateur: '',
    anneeCreation: '',
    capaciteExport: '',
    responsable: '',
    email: '',
    telephone: '',
    siteWeb: '',
    siegeSocial: '',
    region: '',
    departement: '',
    commune: '',
    coordonneesGPS: '',
    certificationExport: null,
    certificationDouane: null,
    certificationQualite: null,
    agrementMinistériel: null,
    photoEntrepot: null,
    walletAddress: '',
    accepteConditions: false,
    accepteBlockchain: false
  });

  const regionsTogo = [
    'Maritime', 'Plateaux', 'Centrale', 'Kara', 'Savanes'
  ];

  const paysExports = [
    'France', 'Allemagne', 'Belgique', 'Suisse', 'Pays-Bas',
    'Italie', 'Espagne', 'Portugal', 'Royaume-Uni', 'USA',
    'Canada', 'Japon', 'Chine', 'Inde', 'Brésil'
  ];

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {};

    switch (step) {
      case 1:
        if (!formData.nomEntreprise.trim()) newErrors.nomEntreprise = 'Nom obligatoire';
        if (!formData.sigle.trim()) newErrors.sigle = 'Sigle obligatoire';
        if (!formData.numeroExportateur.trim()) newErrors.numeroExportateur = 'Numéro d\'exportateur obligatoire';
        if (!formData.anneeCreation) newErrors.anneeCreation = 'Année de création obligatoire';
        if (!formData.capaciteExport.trim()) newErrors.capaciteExport = 'Capacité d\'export obligatoire';
        if (!formData.responsable.trim()) newErrors.responsable = 'Responsable obligatoire';
        if (!formData.email.trim()) newErrors.email = 'Email obligatoire';
        if (!formData.telephone.trim()) newErrors.telephone = 'Téléphone obligatoire';
        break;
        
      case 2:
        if (!formData.siegeSocial.trim()) newErrors.siegeSocial = 'Siège social obligatoire';
        if (!formData.region) newErrors.region = 'Région obligatoire';
        if (!formData.departement) newErrors.departement = 'Département obligatoire';
        if (!formData.commune) newErrors.commune = 'Commune obligatoire';
        if (!formData.coordonneesGPS.trim()) newErrors.coordonneesGPS = 'Coordonnées GPS obligatoires';
        break;
        
      case 3:
        if (!formData.certificationExport) newErrors.certificationExport = 'Certification d\'export obligatoire';
        if (!formData.agrementMinistériel) newErrors.agrementMinistériel = 'Agrément ministériel obligatoire';
        if (!formData.photoEntrepot) newErrors.photoEntrepot = 'Photo de l\'entrepôt obligatoire';
        if (!formData.walletAddress.trim()) newErrors.walletAddress = 'Adresse wallet obligatoire';
        break;
        
      case 4:
        if (!formData.accepteConditions) newErrors.accepteConditions = 'Conditions d\'utilisation obligatoires';
        if (!formData.accepteBlockchain) newErrors.accepteBlockchain = 'Consentement blockchain obligatoire';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof ExporterFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileUpload = (field: keyof ExporterFormData, file: File) => {
    setFormData(prev => ({ ...prev, [field]: file }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulation d'envoi au backend
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast.success('Demande d\'inscription envoyée avec succès ! En attente de validation par le Ministère.');
      
      // Redirection vers la page de confirmation
      setTimeout(() => {
        navigate('/exportateur/confirmation-inscription');
      }, 2000);
      
    } catch (error) {
      toast.error('Erreur lors de l\'envoi de la demande. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <Plane className="w-16 h-16 text-cacao mx-auto mb-4" />
              <h2 className="text-2xl font-serif font-black text-cacao mb-2">Informations de l'Entreprise</h2>
              <p className="text-sm text-cacao/60">Renseignez les informations de base de votre entreprise d'export</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-cacao mb-2">
                  Nom de l'entreprise <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Globe2 className="absolute left-3 top-1/2 -translate-y-1/2 text-cacao/40" size={18} />
                  <input
                    type="text"
                    value={formData.nomEntreprise}
                    onChange={(e) => handleInputChange('nomEntreprise', e.target.value)}
                    className={`w-full bg-white border rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-4 focus:ring-gold/10 focus:border-gold outline-none transition-all ${
                      errors.nomEntreprise ? 'border-red-300' : 'border-cacao/10'
                    }`}
                    placeholder="Ex: Togo Cacao Export International"
                  />
                  {errors.nomEntreprise && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.nomEntreprise}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-cacao mb-2">
                  Sigle <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.sigle}
                  onChange={(e) => handleInputChange('sigle', e.target.value)}
                  className={`w-full bg-white border rounded-xl py-3 px-4 text-sm focus:ring-4 focus:ring-gold/10 focus:border-gold outline-none transition-all ${
                    errors.sigle ? 'border-red-300' : 'border-cacao/10'
                  }`}
                  placeholder="Ex: TCEI"
                  maxLength={10}
                />
                {errors.sigle && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.sigle}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-cacao mb-2">
                  Numéro d'exportateur <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Award className="absolute left-3 top-1/2 -translate-y-1/2 text-cacao/40" size={18} />
                  <input
                    type="text"
                    value={formData.numeroExportateur}
                    onChange={(e) => handleInputChange('numeroExportateur', e.target.value)}
                    className={`w-full bg-white border rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-4 focus:ring-gold/10 focus:border-gold outline-none transition-all ${
                      errors.numeroExportateur ? 'border-red-300' : 'border-cacao/10'
                    }`}
                    placeholder="N° d'exportateur officiel"
                  />
                  {errors.numeroExportateur && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.numeroExportateur}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-cacao mb-2">
                  Année de création <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.anneeCreation}
                  onChange={(e) => handleInputChange('anneeCreation', e.target.value)}
                  className={`w-full bg-white border rounded-xl py-3 px-4 text-sm focus:ring-4 focus:ring-gold/10 focus:border-gold outline-none transition-all ${
                    errors.anneeCreation ? 'border-red-300' : 'border-cacao/10'
                  }`}
                  placeholder="Ex: 2005"
                  min="1950"
                  max={new Date().getFullYear()}
                />
                {errors.anneeCreation && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.anneeCreation}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-cacao mb-2">
                  Capacité d'export (tonnes/an) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Package className="absolute left-3 top-1/2 -translate-y-1/2 text-cacao/40" size={18} />
                  <input
                    type="text"
                    value={formData.capaciteExport}
                    onChange={(e) => handleInputChange('capaciteExport', e.target.value)}
                    className={`w-full bg-white border rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-4 focus:ring-gold/10 focus:border-gold outline-none transition-all ${
                      errors.capaciteExport ? 'border-red-300' : 'border-cacao/10'
                    }`}
                    placeholder="Ex: 10000"
                  />
                  {errors.capaciteExport && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.capaciteExport}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-cacao mb-2">
                  Responsable <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-cacao/40" size={18} />
                  <input
                    type="text"
                    value={formData.responsable}
                    onChange={(e) => handleInputChange('responsable', e.target.value)}
                    className={`w-full bg-white border rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-4 focus:ring-gold/10 focus:border-gold outline-none transition-all ${
                      errors.responsable ? 'border-red-300' : 'border-cacao/10'
                    }`}
                    placeholder="Nom complet du responsable"
                  />
                  {errors.responsable && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.responsable}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-cacao mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-cacao/40" size={18} />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full bg-white border rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-4 focus:ring-gold/10 focus:border-gold outline-none transition-all ${
                      errors.email ? 'border-red-300' : 'border-cacao/10'
                    }`}
                    placeholder="contact@exportateur.tg"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-cacao mb-2">
                  Téléphone <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-cacao/40" size={18} />
                  <input
                    type="tel"
                    value={formData.telephone}
                    onChange={(e) => handleInputChange('telephone', e.target.value)}
                    className={`w-full bg-white border rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-4 focus:ring-gold/10 focus:border-gold outline-none transition-all ${
                      errors.telephone ? 'border-red-300' : 'border-cacao/10'
                    }`}
                    placeholder="+228 90 12 34 56"
                  />
                  {errors.telephone && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.telephone}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-cacao mb-2">
                  Site web
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-cacao/40" size={18} />
                  <input
                    type="url"
                    value={formData.siteWeb}
                    onChange={(e) => handleInputChange('siteWeb', e.target.value)}
                    className="w-full bg-white border border-cacao/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-4 focus:ring-gold/10 focus:border-gold outline-none transition-all"
                    placeholder="https://www.exportateur.tg"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <MapPin className="w-16 h-16 text-cacao mx-auto mb-4" />
              <h2 className="text-2xl font-serif font-black text-cacao mb-2">Localisation</h2>
              <p className="text-sm text-cacao/60">Précisez l'adresse de votre siège et entrepôt</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-cacao mb-2">
                  Siège social <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.siegeSocial}
                  onChange={(e) => handleInputChange('siegeSocial', e.target.value)}
                  className={`w-full bg-white border rounded-xl py-3 px-4 text-sm focus:ring-4 focus:ring-gold/10 focus:border-gold outline-none transition-all ${
                    errors.siegeSocial ? 'border-red-300' : 'border-cacao/10'
                  }`}
                  placeholder="Adresse complète du siège social"
                />
                {errors.siegeSocial && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.siegeSocial}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-cacao mb-2">
                  Région <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.region}
                  onChange={(e) => handleInputChange('region', e.target.value)}
                  className={`w-full bg-white border rounded-xl py-3 px-4 text-sm focus:ring-4 focus:ring-gold/10 focus:border-gold outline-none transition-all ${
                    errors.region ? 'border-red-300' : 'border-cacao/10'
                  }`}
                >
                  <option value="">Sélectionner une région</option>
                  {regionsTogo.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
                {errors.region && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.region}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-cacao mb-2">
                  Département <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.departement}
                  onChange={(e) => handleInputChange('departement', e.target.value)}
                  className={`w-full bg-white border rounded-xl py-3 px-4 text-sm focus:ring-4 focus:ring-gold/10 focus:border-gold outline-none transition-all ${
                    errors.departement ? 'border-red-300' : 'border-cacao/10'
                  }`}
                  placeholder="Ex: Golfe, Lomé, Maritime"
                />
                {errors.departement && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.departement}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-cacao mb-2">
                  Commune <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.commune}
                  onChange={(e) => handleInputChange('commune', e.target.value)}
                  className={`w-full bg-white border rounded-xl py-3 px-4 text-sm focus:ring-4 focus:ring-gold/10 focus:border-gold outline-none transition-all ${
                    errors.commune ? 'border-red-300' : 'border-cacao/10'
                  }`}
                  placeholder="Ex: Bè, Adétikopé, Agoè"
                />
                {errors.commune && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.commune}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-cacao mb-2">
                  Coordonnées GPS <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.coordonneesGPS}
                  onChange={(e) => handleInputChange('coordonneesGPS', e.target.value)}
                  className={`w-full bg-white border rounded-xl py-3 px-4 text-sm focus:ring-4 focus:ring-gold/10 focus:border-gold outline-none transition-all ${
                    errors.coordonneesGPS ? 'border-red-300' : 'border-cacao/10'
                  }`}
                  placeholder="6.1319°N, 1.2228°E"
                />
                {errors.coordonneesGPS && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.coordonneesGPS}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <ShieldCheck className="w-16 h-16 text-cacao mx-auto mb-4" />
              <h2 className="text-2xl font-serif font-black text-cacao mb-2">Certifications et Documents</h2>
              <p className="text-sm text-cacao/60">Téléchargez vos certifications et configurez votre wallet</p>
            </div>

            <div className="space-y-6">
              {/* Certifications */}
              <div className="bg-blue-50 rounded-2xl p-6">
                <h3 className="font-bold text-cacao mb-4 flex items-center gap-2">
                  <Award size={20} />
                  Certifications (obligatoires)
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-cacao mb-2">
                      Certification d'export <span className="text-red-500">*</span>
                    </label>
                    <div className={`border-2 border-dashed rounded-xl p-4 text-center transition-all cursor-pointer hover:border-gold ${
                      errors.certificationExport ? 'border-red-300' : 'border-cacao/20'
                    }`}>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => e.target.files?.[0] && handleFileUpload('certificationExport', e.target.files[0])}
                        className="hidden"
                        id="certificationExport"
                      />
                      <label htmlFor="certificationExport" className="cursor-pointer">
                        {formData.certificationExport ? (
                          <div className="flex items-center justify-center gap-2">
                            <CheckCircle2 className="text-emerald-600" size={20} />
                            <span className="text-sm text-cacao">{formData.certificationExport.name}</span>
                          </div>
                        ) : (
                          <div>
                            <Upload className="w-8 h-8 text-cacao/40 mx-auto mb-2" />
                            <p className="text-xs text-cacao/60">Cliquez pour télécharger</p>
                            <p className="text-xs text-cacao/40">PDF, JPG, PNG (max 10MB)</p>
                          </div>
                        )}
                      </label>
                    </div>
                    {errors.certificationExport && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle size={12} /> {errors.certificationExport}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-cacao mb-2">
                      Certification Douane
                    </label>
                    <div className="border-2 border-dashed rounded-xl p-4 text-center transition-all cursor-pointer hover:border-gold border-cacao/20">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => e.target.files?.[0] && handleFileUpload('certificationDouane', e.target.files[0])}
                        className="hidden"
                        id="certificationDouane"
                      />
                      <label htmlFor="certificationDouane" className="cursor-pointer">
                        {formData.certificationDouane ? (
                          <div className="flex items-center justify-center gap-2">
                            <CheckCircle2 className="text-emerald-600" size={20} />
                            <span className="text-sm text-cacao">{formData.certificationDouane.name}</span>
                          </div>
                        ) : (
                          <div>
                            <Upload className="w-8 h-8 text-cacao/40 mx-auto mb-2" />
                            <p className="text-xs text-cacao/60">Cliquez pour télécharger</p>
                            <p className="text-xs text-cacao/40">PDF, JPG, PNG (max 10MB)</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-cacao mb-2">
                      Certification Qualité
                    </label>
                    <div className="border-2 border-dashed rounded-xl p-4 text-center transition-all cursor-pointer hover:border-gold border-cacao/20">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => e.target.files?.[0] && handleFileUpload('certificationQualite', e.target.files[0])}
                        className="hidden"
                        id="certificationQualite"
                      />
                      <label htmlFor="certificationQualite" className="cursor-pointer">
                        {formData.certificationQualite ? (
                          <div className="flex items-center justify-center gap-2">
                            <CheckCircle2 className="text-emerald-600" size={20} />
                            <span className="text-sm text-cacao">{formData.certificationQualite.name}</span>
                          </div>
                        ) : (
                          <div>
                            <Upload className="w-8 h-8 text-cacao/40 mx-auto mb-2" />
                            <p className="text-xs text-cacao/60">Cliquez pour télécharger</p>
                            <p className="text-xs text-cacao/40">PDF, JPG, PNG (max 10MB)</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-cacao mb-2">
                      Agrément ministériel <span className="text-red-500">*</span>
                    </label>
                    <div className={`border-2 border-dashed rounded-xl p-4 text-center transition-all cursor-pointer hover:border-gold ${
                      errors.agrementMinistériel ? 'border-red-300' : 'border-cacao/20'
                    }`}>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => e.target.files?.[0] && handleFileUpload('agrementMinistériel', e.target.files[0])}
                        className="hidden"
                        id="agreement"
                      />
                      <label htmlFor="agreement" className="cursor-pointer">
                        {formData.agrementMinistériel ? (
                          <div className="flex items-center justify-center gap-2">
                            <CheckCircle2 className="text-emerald-600" size={20} />
                            <span className="text-sm text-cacao">{formData.agrementMinistériel.name}</span>
                          </div>
                        ) : (
                          <div>
                            <Upload className="w-8 h-8 text-cacao/40 mx-auto mb-2" />
                            <p className="text-xs text-cacao/60">Cliquez pour télécharger</p>
                            <p className="text-xs text-cacao/40">PDF, JPG, PNG (max 10MB)</p>
                          </div>
                        )}
                      </label>
                    </div>
                    {errors.agrementMinistériel && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle size={12} /> {errors.agrementMinistériel}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-cacao mb-2">
                      Photo de l'entrepôt <span className="text-red-500">*</span>
                    </label>
                    <div className={`border-2 border-dashed rounded-xl p-4 text-center transition-all cursor-pointer hover:border-gold ${
                      errors.photoEntrepot ? 'border-red-300' : 'border-cacao/20'
                    }`}>
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        onChange={(e) => e.target.files?.[0] && handleFileUpload('photoEntrepot', e.target.files[0])}
                        className="hidden"
                        id="photo"
                      />
                      <label htmlFor="photo" className="cursor-pointer">
                        {formData.photoEntrepot ? (
                          <div className="flex items-center justify-center gap-2">
                            <CheckCircle2 className="text-emerald-600" size={20} />
                            <span className="text-sm text-cacao">{formData.photoEntrepot.name}</span>
                          </div>
                        ) : (
                          <div>
                            <Camera className="w-8 h-8 text-cacao/40 mx-auto mb-2" />
                            <p className="text-xs text-cacao/60">Cliquez pour télécharger</p>
                            <p className="text-xs text-cacao/40">JPG, PNG (max 5MB)</p>
                          </div>
                        )}
                      </label>
                    </div>
                    {errors.photoEntrepot && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle size={12} /> {errors.photoEntrepot}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Wallet Blockchain */}
              <div className="bg-gold/5 rounded-2xl p-6">
                <h3 className="font-bold text-cacao mb-4 flex items-center gap-2">
                  <ShieldCheck size={20} />
                  Configuration Blockchain
                </h3>
                
                <div>
                  <label className="block text-sm font-bold text-cacao mb-2">
                    Adresse Wallet Ethereum <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.walletAddress}
                    onChange={(e) => handleInputChange('walletAddress', e.target.value)}
                    className={`w-full bg-white border rounded-xl py-3 px-4 text-sm font-mono focus:ring-4 focus:ring-gold/10 focus:border-gold outline-none transition-all ${
                      errors.walletAddress ? 'border-red-300' : 'border-cacao/10'
                    }`}
                    placeholder="0x742d35Cc6634C0532925a3b844Bc454e4438f44e"
                  />
                  {errors.walletAddress && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.walletAddress}
                    </p>
                  )}
                  <p className="text-xs text-cacao/60 mt-2">
                    Cette adresse sera utilisée pour les transactions blockchain et l'attribution des rôles.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
              <h2 className="text-2xl font-serif font-black text-cacao mb-2">Validation finale</h2>
              <p className="text-sm text-cacao/60">Vérifiez vos informations et acceptez les conditions</p>
            </div>

            {/* Récapitulatif */}
            <div className="bg-cacao/5 rounded-2xl p-6 space-y-4">
              <h3 className="font-bold text-cacao mb-4">Récapitulatif de l'inscription</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-bold text-cacao/60">Entreprise:</span>
                  <p className="text-cacao">{formData.nomEntreprise}</p>
                </div>
                <div>
                  <span className="font-bold text-cacao/60">Sigle:</span>
                  <p className="text-cacao">{formData.sigle}</p>
                </div>
                <div>
                  <span className="font-bold text-cacao/60">Capacité export:</span>
                  <p className="text-cacao">{formData.capaciteExport} tonnes/an</p>
                </div>
                <div>
                  <span className="font-bold text-cacao/60">Responsable:</span>
                  <p className="text-cacao">{formData.responsable}</p>
                </div>
                <div>
                  <span className="font-bold text-cacao/60">Email:</span>
                  <p className="text-cacao">{formData.email}</p>
                </div>
                <div>
                  <span className="font-bold text-cacao/60">Siège:</span>
                  <p className="text-cacao">{formData.siegeSocial}</p>
                </div>
                <div>
                  <span className="font-bold text-cacao/60">Région:</span>
                  <p className="text-cacao">{formData.region}</p>
                </div>
                <div className="md:col-span-2">
                  <span className="font-bold text-cacao/60">Wallet:</span>
                  <p className="text-cacao font-mono text-xs">{formData.walletAddress}</p>
                </div>
              </div>
            </div>

            {/* Conditions */}
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Info className="text-amber-600 mt-0.5" size={20} />
                  <div>
                    <p className="text-sm text-amber-800 font-bold mb-1">
                      Processus de validation
                    </p>
                    <p className="text-xs text-amber-700">
                      Après soumission, votre demande sera examinée par le Ministère du Commerce. 
                      Le processus de validation peut prendre 7-10 jours ouvrés. 
                      Vous recevrez un email une fois la décision prise.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.accepteConditions}
                    onChange={(e) => handleInputChange('accepteConditions', e.target.checked)}
                    className="mt-1 w-4 h-4 text-gold border-cacao/20 rounded focus:ring-gold"
                  />
                  <span className="text-sm text-cacao">
                    J'accepte les <span className="font-bold">conditions d'utilisation</span> et la 
                    <span className="font-bold"> politique de confidentialité</span> de ChainCacao
                  </span>
                </label>
                {errors.accepteConditions && (
                  <p className="text-red-500 text-xs flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.accepteConditions}
                  </p>
                )}

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.accepteBlockchain}
                    onChange={(e) => handleInputChange('accepteBlockchain', e.target.checked)}
                    className="mt-1 w-4 h-4 text-gold border-cacao/20 rounded focus:ring-gold"
                  />
                  <span className="text-sm text-cacao">
                    Je consens à l'enregistrement de mes données sur la blockchain Ethereum et 
                    comprends que les transactions sont irréversibles
                  </span>
                </label>
                {errors.accepteBlockchain && (
                  <p className="text-red-500 text-xs flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.accepteBlockchain}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <nav className="bg-white border-b border-cacao/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/exportateur')}
                className="p-2.5 bg-white shadow-sm border border-cacao/10 rounded-xl text-cacao hover:text-gold transition-all"
              >
                <ArrowLeft size={20} />
              </motion.button>
              <div>
                <h1 className="text-xl font-serif font-black text-cacao tracking-tight">Inscription Exportateur</h1>
                <p className="text-[11px] font-bold text-gold/70 uppercase tracking-[0.2em]">Demande d'Agrément Ministériel</p>
              </div>
            </div>
            <div className="bg-cacao/5 px-3 py-1 rounded-full text-[10px] font-bold text-cacao/60 uppercase border border-cacao/10">
              Étape {currentStep}/4
            </div>
          </div>
        </div>
      </nav>

      {/* Progress Bar */}
      <div className="bg-white border-b border-cacao/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all
                  ${currentStep >= step ? 'bg-gold text-cacao' : 'bg-cacao/10 text-cacao/40'}
                `}>
                  {currentStep > step ? <CheckCircle2 size={18} /> : step}
                </div>
                {step < 4 && (
                  <div className={`
                    flex-1 h-1 mx-2 transition-all
                    ${currentStep > step ? 'bg-gold' : 'bg-cacao/10'}
                  `} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-cacao/60">Entreprise</span>
            <span className="text-xs text-cacao/60">Localisation</span>
            <span className="text-xs text-cacao/60">Documents</span>
            <span className="text-xs text-cacao/60">Validation</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {renderStepContent()}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className={`
              px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2
              ${currentStep === 1 
                ? 'bg-cacao/10 text-cacao/40 cursor-not-allowed' 
                : 'bg-white text-cacao border border-cacao/20 hover:bg-cacao/5'
              }
            `}
          >
            <ArrowLeft size={18} />
            Précédent
          </motion.button>

          {currentStep < 4 ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleNext}
              className="bg-gold text-cacao px-8 py-3 rounded-xl font-bold text-sm hover:bg-gold/90 transition-all flex items-center gap-2 shadow-lg"
            >
              Suivant
              <ArrowLeft size={18} className="rotate-180" />
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`
                px-8 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-lg
                ${isSubmitting 
                  ? 'bg-cacao/30 text-cacao/60 cursor-not-allowed' 
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }
              `}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Envoi en cours...
                </>
              ) : (
                <>
                  <CheckCircle2 size={18} />
                  Soumettre la demande
                </>
              )}
            </motion.button>
          )}
        </div>
      </main>
    </div>
  );
}
