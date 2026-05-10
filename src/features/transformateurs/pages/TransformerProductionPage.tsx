import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Play, CheckCircle2, Clock, Package, Camera, 
  Thermometer, Droplets, QrCode, Eye, Factory, Award, X
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ProductionAction {
  id: string;
  name: string;
  type: 'sechage' | 'fermentation' | 'torrefaction' | 'custom';
  status: 'pending' | 'in_progress' | 'completed';
  date?: string;
  time?: string;
  responsible: string;
  parameters: {
    temperature?: number;
    humidity?: number;
    duration?: string;
    customParams?: Record<string, unknown>;
  };
  proofs: {
    photos: string[];
    certificates: string[];
    documents: string[];
  };
  blockchainHash?: string;
  notes?: string;
}

interface ProductionLot {
  id: string;
  originalLotId: string;
  weight: number;
  origin: string;
  status: 'received' | 'in_production' | 'transformed';
  receivedDate: string;
  cooperative: string;
  farmer: string;
  quality: string;
  transformationHash?: string;
  qrCode: string;
  actions: ProductionAction[];
  currentActionIndex: number;
  journal: string[];
  eudrCompliant: boolean;
  gpsCoordinates: string;
  documents: {
    receptionProof: string;
    cooperativeValidation: string;
    transportDocument: string;
  };
}

export default function TransformerProductionPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [selectedLot, setSelectedLot] = useState<ProductionLot | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [showJournalModal, setShowJournalModal] = useState(false);
  const [selectedLotForJournal, setSelectedLotForJournal] = useState<ProductionLot | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Données simulées de lots reçus et en production
  const availableLots: ProductionLot[] = [
    {
      id: 'LOT-2024-015',
      originalLotId: 'LOT-2024-015',
      weight: 620,
      origin: 'Kara, Togo',
      status: 'received',
      receivedDate: '2024-03-28',
      cooperative: 'Coopérative Kara',
      farmer: 'Koffi Amouzou',
      quality: 'Premium',
      qrCode: 'LOT-2024-015-QR',
      currentActionIndex: 0,
      actions: [],
      journal: ['Lot reçu de Coopérative Kara - Poids: 620kg - Conformité EUDR validée'],
      eudrCompliant: true,
      gpsCoordinates: '9.5594°N, 0.7831°E',
      documents: {
        receptionProof: 'RECEPTION-PROOF-015.pdf',
        cooperativeValidation: 'COOP-VALID-015.pdf',
        transportDocument: 'TRANSPORT-015.pdf'
      }
    },
    {
      id: 'LOT-2024-016',
      originalLotId: 'LOT-2024-016',
      weight: 480,
      origin: 'Lomé, Togo',
      status: 'in_production',
      receivedDate: '2024-03-27',
      cooperative: 'Coopérative Lomé',
      farmer: 'Mawuli Adet',
      quality: 'Standard',
      qrCode: 'LOT-2024-016-QR',
      currentActionIndex: 1,
      actions: [
        {
          id: 'action-1',
          name: 'Séchage',
          type: 'sechage',
          status: 'completed',
          date: '2024-03-28',
          time: '08:00',
          responsible: 'Chef de Production',
          parameters: {
            temperature: 45,
            humidity: 60,
            duration: '48 heures'
          },
          proofs: {
            photos: ['SECHAGE-PHOTO-001.jpg', 'SECHAGE-PHOTO-002.jpg'],
            certificates: ['SECHAGE-CERT-001.pdf'],
            documents: ['SECHAGE-REPORT-001.pdf']
          },
          blockchainHash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c',
          notes: 'Séchage effectué selon les standards qualité'
        }
      ],
      journal: [
        'Lot reçu de Coopérative Lomé - Poids: 480kg',
        'Validation réception confirmée par double signature',
        'Début séchage - 28/03/2024 08:00',
        'Séchage terminé - 30/03/2024 08:00'
      ],
      eudrCompliant: true,
      gpsCoordinates: '6.1319°N, 1.2225°E',
      documents: {
        receptionProof: 'RECEPTION-PROOF-016.pdf',
        cooperativeValidation: 'COOP-VALID-016.pdf',
        transportDocument: 'TRANSPORT-016.pdf'
      }
    },
    {
      id: 'LOT-2024-017',
      originalLotId: 'LOT-2024-017',
      weight: 750,
      origin: 'Sokodé, Togo',
      status: 'transformed',
      receivedDate: '2024-03-25',
      cooperative: 'Coopérative Sokodé',
      farmer: 'Komlan Adzagbe',
      quality: 'Premium',
      transformationHash: '0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d',
      qrCode: 'LOT-2024-017-QR',
      currentActionIndex: 3,
      actions: [
        {
          id: 'action-1',
          name: 'Séchage',
          type: 'sechage',
          status: 'completed',
          date: '2024-03-26',
          time: '09:00',
          responsible: 'Chef de Production',
          parameters: {
            temperature: 42,
            humidity: 58,
            duration: '48 heures'
          },
          proofs: {
            photos: ['SECHAGE-PHOTO-003.jpg'],
            certificates: ['SECHAGE-CERT-002.pdf'],
            documents: ['SECHAGE-REPORT-002.pdf']
          },
          blockchainHash: '0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e'
        },
        {
          id: 'action-2',
          name: 'Fermentation',
          type: 'fermentation',
          status: 'completed',
          date: '2024-03-28',
          time: '10:00',
          responsible: 'Technicien Fermentation',
          parameters: {
            temperature: 28,
            humidity: 85,
            duration: '72 heures'
          },
          proofs: {
            photos: ['FERMENT-PHOTO-001.jpg'],
            certificates: ['FERMENT-CERT-001.pdf'],
            documents: ['FERMENT-REPORT-001.pdf']
          },
          blockchainHash: '0x4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f'
        },
        {
          id: 'action-3',
          name: 'Torréfaction',
          type: 'torrefaction',
          status: 'completed',
          date: '2024-03-31',
          time: '14:00',
          responsible: 'Chef Torréfacteur',
          parameters: {
            temperature: 120,
            humidity: 30,
            duration: '4 heures'
          },
          proofs: {
            photos: ['ROAST-PHOTO-001.jpg'],
            certificates: ['ROAST-CERT-001.pdf'],
            documents: ['ROAST-REPORT-001.pdf']
          },
          blockchainHash: '0x5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a'
        }
      ],
      journal: [
        'Lot reçu de Coopérative Sokodé - Poids: 750kg',
        'Réception validée avec conformité EUDR',
        'Séchage terminé avec succès',
        'Fermentation contrôlée et validée',
        'Torréfaction effectuée selon standards',
        'Transformation terminée - Lot prêt pour transfert'
      ],
      eudrCompliant: true,
      gpsCoordinates: '8.9833°N, 1.1167°E',
      documents: {
        receptionProof: 'RECEPTION-PROOF-017.pdf',
        cooperativeValidation: 'COOP-VALID-017.pdf',
        transportDocument: 'TRANSPORT-017.pdf'
      }
    }
  ];

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  const filteredLots = availableLots.filter(lot => 
    lot.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lot.originalLotId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lot.cooperative.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startProduction = async (lot: ProductionLot) => {
    if (lot.status !== 'received') {
      toast.error('Ce lot ne peut pas démarrer la production');
      return;
    }
    setSelectedLot(lot);
    setShowActionModal(true);
  };

  const declareAction = async (lot: ProductionLot, actionType: string) => {
    const newAction: ProductionAction = {
      id: `action-${Date.now()}`,
      name: actionType,
      type: actionType.toLowerCase() as 'sechage' | 'fermentation' | 'torrefaction' | 'custom',
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().split(' ')[0],
      responsible: 'Chef de Production',
      parameters: {
        temperature: actionType === 'Séchage' ? 45 : actionType === 'Fermentation' ? 28 : 120,
        humidity: actionType === 'Séchage' ? 60 : actionType === 'Fermentation' ? 85 : 30,
        duration: actionType === 'Séchage' ? '48 heures' : actionType === 'Fermentation' ? '72 heures' : '4 heures'
      },
      proofs: {
        photos: [],
        certificates: [],
        documents: []
      },
      blockchainHash: `0x${Date.now().toString(16)}${Math.random().toString(16).substr(2, 24)}`,
      notes: `Action déclarée le ${new Date().toLocaleString()}`
    };
    
    // Simuler l'ajout de l'action
    const updatedActions = [...lot.actions, newAction];
    const updatedJournal = [
      ...lot.journal,
      `Action débutée: ${newAction.name} - ${newAction.date} ${newAction.time}`,
      `Responsable: ${newAction.responsible}`,
      `Paramètres: T=${newAction.parameters.temperature}°C, H=${newAction.parameters.humidity}%`
    ];
    
    const updatedLot = {
      ...lot,
      actions: updatedActions,
      currentActionIndex: updatedActions.length,
      journal: updatedJournal,
      status: 'in_production' as const
    };
    
    toast.success('Action déclarée avec succès !');
    console.log('Action déclarée:', newAction);
  };

  const completeAction = async (lot: ProductionLot, actionIndex: number) => {
    // Simuler la complétion de l'action
    const updatedActions = lot.actions.map((action, index) => 
      index === actionIndex 
        ? { ...action, status: 'completed' as const }
        : action
    );
    
    const updatedJournal = [
      ...lot.journal,
      `Action terminée: ${lot.actions[actionIndex].name} - ${new Date().toLocaleString()}`,
      `Hash blockchain: ${lot.actions[actionIndex].blockchainHash}`
    ];
    
    const updatedLot = {
      ...lot,
      actions: updatedActions,
      journal: updatedJournal
    };
    
    toast.success('Action terminée avec succès !');
    console.log('Action terminée:', updatedLot);
  };

  const completeProduction = async (lot: ProductionLot) => {
    // Générer le hash de transformation
    const transformationHash = `0x${Date.now().toString(16)}${Math.random().toString(16).substr(2, 48)}`;
    
    const updatedJournal = [
      ...lot.journal,
      'Production terminée avec succès',
      `Hash de transformation: ${transformationHash}`,
      'Lot prêt pour transfert vers exportateur'
    ];
    
    const updatedLot = {
      ...lot,
      status: 'transformed' as const,
      transformationHash,
      journal: updatedJournal
    };
    
    toast.success('Production terminée ! Lot prêt pour transfert.');
    
    // Rediriger vers la page de transfert après 2 secondes
    setTimeout(() => {
      navigate('/transformateur/transfert');
    }, 2000);
    
    console.log('Production terminée:', updatedLot);
  };

  const viewJournal = (lot: ProductionLot) => {
    setSelectedLotForJournal(lot);
    setShowJournalModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'received': return 'text-blue-600 bg-blue-50';
      case 'in_production': return 'text-amber-600 bg-amber-50';
      case 'transformed': return 'text-emerald-600 bg-emerald-50';
      default: return 'text-cacao/60 bg-cacao/10';
    }
  };

  const getActionStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-amber-600 bg-amber-50';
      case 'in_progress': return 'text-blue-600 bg-blue-50';
      case 'completed': return 'text-emerald-600 bg-emerald-50';
      default: return 'text-cacao/60 bg-cacao/10';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'received': return <Package size={16} />;
      case 'in_production': return <Factory size={16} />;
      case 'transformed': return <Award size={16} />;
      default: return <Package size={16} />;
    }
  };

  const getActionStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock size={16} />;
      case 'in_progress': return <Play size={16} />;
      case 'completed': return <CheckCircle2 size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'received': return 'Reçu';
      case 'in_production': return 'En Production';
      case 'transformed': return 'Transformé';
      default: return status;
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-cream flex items-center justify-center text-cacao font-bold">
      Chargement de la page de production...
    </div>
  );

  return (
    <div className="min-h-screen bg-cream/30">
      {/* Header */}
      <nav className="bg-white border-b border-cacao/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/transformateur/dashboard')}
                className="p-2.5 bg-white shadow-sm border border-cacao/10 rounded-xl text-cacao hover:text-gold transition-all"
              >
                <ArrowLeft size={20} />
              </motion.button>
              <div>
                <h1 className="text-xl font-serif font-black text-cacao tracking-tight">Production</h1>
                <p className="text-[11px] font-bold text-gold/70 uppercase tracking-[0.2em]">Workflow de Transformation</p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Info Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <Factory className="text-blue-600 mt-0.5" size={20} />
            <div>
              <h3 className="text-sm font-bold text-blue-800 mb-2">
                🏭 Workflow de Production
              </h3>
              <div className="space-y-1 text-xs text-blue-700">
                <p>• <span className="font-bold">Réception :</span> Validation double signature expéditeur/destinataire</p>
                <p>• <span className="font-bold">Actions :</span> Déclaration des étapes (séchage, fermentation, torréfaction)</p>
                <p>• <span className="font-bold">Preuves :</span> Photos, certificats, mesures enregistrées</p>
                <p>• <span className="font-bold">Blockchain :</span> Chaque action hashée et immuable</p>
                <p>• <span className="font-bold">Journal :</span> Traçabilité complète consultable</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Package className="absolute left-3 top-1/2 -translate-y-1/2 text-cacao/40" size={16} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher un lot..."
              className="w-full pl-10 pr-4 py-3 border border-cacao/10 rounded-xl text-sm focus:ring-4 focus:ring-gold/10 focus:border-gold outline-none"
            />
          </div>
        </div>

        {/* Production Lots */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredLots.map((lot, index) => (
            <motion.div
              key={lot.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl border border-cacao/10 p-6"
            >
              {/* Lot Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center">
                    <Package className="text-gold" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-cacao text-lg">{lot.id}</h3>
                    <p className="text-sm text-cacao/60">Lot original: {lot.originalLotId}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1 ${getStatusColor(lot.status)}`}>
                    {getStatusIcon(lot.status)}
                    {getStatusText(lot.status)}
                  </span>
                </div>
              </div>

              {/* Lot Info */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <span className="text-cacao/60 text-xs">Poids:</span>
                  <p className="font-bold text-cacao">{lot.weight} kg</p>
                </div>
                <div>
                  <span className="text-cacao/60 text-xs">Qualité:</span>
                  <p className="font-bold text-cacao">{lot.quality}</p>
                </div>
                <div>
                  <span className="text-cacao/60 text-xs">Origine:</span>
                  <p className="font-bold text-cacao">{lot.origin}</p>
                </div>
                <div>
                  <span className="text-cacao/60 text-xs">Agriculteur:</span>
                  <p className="font-bold text-cacao">{lot.farmer}</p>
                </div>
                <div>
                  <span className="text-cacao/60 text-xs">Coopérative:</span>
                  <p className="font-bold text-cacao">{lot.cooperative}</p>
                </div>
                <div>
                  <span className="text-cacao/60 text-xs">Date réception:</span>
                  <p className="font-bold text-cacao">{lot.receivedDate}</p>
                </div>
                <div>
                  <span className="text-cacao/60 text-xs">EUDR:</span>
                  <p className="font-bold text-emerald-600">{lot.eudrCompliant ? 'Conforme' : 'Non conforme'}</p>
                </div>
              </div>

              {/* Actions List */}
              <div className="mb-4">
                <h4 className="text-sm font-bold text-cacao mb-2">Actions de Production</h4>
                <div className="space-y-2">
                  {lot.actions.map((action, actionIndex) => (
                    <div key={action.id} className="flex items-center justify-between p-2 bg-cacao/5 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          action.status === 'completed' ? 'bg-emerald-600' :
                          action.status === 'in_progress' ? 'bg-blue-600' :
                          'bg-cacao/20'
                        }`}>
                          {getActionStatusIcon(action.status)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-cacao">{action.name}</p>
                          <p className="text-xs text-cacao/60">{action.parameters.duration}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {action.parameters.temperature && (
                          <p className="text-xs text-cacao/60">{action.parameters.temperature}°C</p>
                        )}
                        {action.parameters.humidity && (
                          <p className="text-xs text-cacao/60">{action.parameters.humidity}%</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Blockchain Info */}
              <div className="bg-cacao/5 rounded-lg p-3 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-cacao">Hash de Transformation</p>
                    <code className="text-xs text-cacao font-mono">
                      {lot.transformationHash ? lot.transformationHash.slice(0, 20) + '...' : 'Non généré'}
                    </code>
                  </div>
                  <QrCode size={20} className="text-cacao/40" />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {lot.status === 'received' && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => startProduction(lot)}
                    className="flex-1 px-4 py-2 bg-gold text-cacao rounded-xl text-sm font-bold hover:bg-gold/90 transition-all flex items-center justify-center gap-2"
                  >
                    <Play size={16} />
                    Démarrer Production
                  </motion.button>
                )}
                {lot.status === 'in_production' && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => completeProduction(lot)}
                    className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                  >
                    <Award size={16} />
                    Terminer Production
                  </motion.button>
                )}
                {lot.status === 'transformed' && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/transformateur/transfert')}
                    className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                  >
                    <Package size={16} />
                    Transférer vers Exportateur
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => viewJournal(lot)}
                  className="px-4 py-2 border border-cacao/10 rounded-xl text-sm font-medium text-cacao hover:bg-cacao/5 transition-all"
                >
                  <Eye size={16} />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredLots.length === 0 && (
          <div className="bg-white rounded-xl border border-cacao/10 p-12 text-center">
            <Package size={48} className="text-cacao/20 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-cacao mb-2">Aucun lot trouvé</h3>
            <p className="text-sm text-cacao/60">
              Aucun lot ne correspond à vos critères de recherche.
            </p>
          </div>
        )}
      </main>

      {/* Action Modal */}
      {showActionModal && selectedLot && (
        <div className="fixed inset-0 bg-cacao/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl border border-cacao/10 p-8 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-serif font-black text-cacao">
                Démarrer Production - Lot {selectedLot.id}
              </h3>
              <button
                onClick={() => setShowActionModal(false)}
                className="text-cacao/40 hover:text-cacao"
              >
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-bold text-cacao mb-3">Informations du Lot</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">ID:</span> {selectedLot.id}</p>
                  <p><span className="font-medium">Poids:</span> {selectedLot.weight} kg</p>
                  <p><span className="font-medium">Origine:</span> {selectedLot.origin}</p>
                  <p><span className="font-medium">Agriculteur:</span> {selectedLot.farmer}</p>
                  <p><span className="font-medium">Coopérative:</span> {selectedLot.cooperative}</p>
                  <p><span className="font-medium">Qualité:</span> {selectedLot.quality}</p>
                  <p><span className="font-medium">EUDR:</span> 
                    <span className={selectedLot.eudrCompliant ? 'text-emerald-600' : 'text-red-600'}>
                      {selectedLot.eudrCompliant ? 'Conforme' : 'Non conforme'}
                    </span>
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-cacao mb-3">Actions Disponibles</h4>
                <div className="space-y-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => declareAction(selectedLot, 'Séchage')}
                    className="w-full px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-left hover:bg-red-100 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Thermometer size={16} className="text-red-600" />
                        <span className="font-medium text-cacao">Séchage</span>
                      </div>
                      <span className="text-xs text-cacao/60">45°C, 60% H, 48h</span>
                    </div>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => declareAction(selectedLot, 'Fermentation')}
                    className="w-full px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg text-left hover:bg-blue-100 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Droplets size={16} className="text-blue-600" />
                        <span className="font-medium text-cacao">Fermentation</span>
                      </div>
                      <span className="text-xs text-cacao/60">28°C, 85% H, 72h</span>
                    </div>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => declareAction(selectedLot, 'Torréfaction')}
                    className="w-full px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg text-left hover:bg-amber-100 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Factory size={16} className="text-amber-600" />
                        <span className="font-medium text-cacao">Torréfaction</span>
                      </div>
                      <span className="text-xs text-cacao/60">120°C, 30% H, 4h</span>
                    </div>
                  </motion.button>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <Camera size={20} className="text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-blue-800 mb-2">
                    📋 Déclaration d'Action
                  </p>
                  <p className="text-xs text-blue-700">
                    Chaque action sera enregistrée sur la blockchain avec date, responsable, 
                    paramètres et preuves. Le journal de transformation sera mis à jour automatiquement.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowActionModal(false)}
                className="flex-1 px-4 py-3 border border-cacao/10 rounded-lg text-sm font-medium text-cacao hover:bg-cacao/5"
              >
                Annuler
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Journal Modal */}
      {showJournalModal && selectedLotForJournal && (
        <div className="fixed inset-0 bg-cacao/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl border border-cacao/10 p-8 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-serif font-black text-cacao">
                Journal de Transformation - Lot {selectedLotForJournal.id}
              </h3>
              <button
                onClick={() => setShowJournalModal(false)}
                className="text-cacao/40 hover:text-cacao"
              >
                <X size={24} />
              </button>
            </div>

            <div className="bg-cacao/5 rounded-lg p-4 mb-6">
              <h4 className="font-bold text-cacao mb-3">📋 Journal Complet</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {selectedLotForJournal.journal.map((entry, index) => (
                  <div key={index} className="flex items-start gap-2 p-2 bg-white rounded-lg">
                    <span className="text-xs text-cacao/60 font-mono">
                      {String(index + 1).padStart(2, '0')}.
                    </span>
                    <span className="text-sm text-cacao">{entry}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-bold text-cacao mb-3">🔗 Hash Blockchain</h4>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-cacao/60">Hash de Transformation</p>
                    <code className="block bg-cacao/10 px-2 py-1 rounded text-cacao font-mono text-xs mt-1">
                      {selectedLotForJournal.transformationHash || 'Non généré'}
                    </code>
                  </div>
                  {selectedLotForJournal.actions.map((action, index) => (
                    <div key={index}>
                      <p className="text-xs text-cacao/60">Hash {action.name}</p>
                      <code className="block bg-cacao/10 px-2 py-1 rounded text-cacao font-mono text-xs mt-1">
                        {action.blockchainHash || 'Non généré'}
                      </code>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-cacao mb-3">📄 Documents</h4>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-cacao/60">Preuve de Réception</p>
                    <p className="text-sm text-cacao">{selectedLotForJournal.documents.receptionProof}</p>
                  </div>
                  <div>
                    <p className="text-xs text-cacao/60">Validation Coopérative</p>
                    <p className="text-sm text-cacao">{selectedLotForJournal.documents.cooperativeValidation}</p>
                  </div>
                  <div>
                    <p className="text-xs text-cacao/60">Document Transport</p>
                    <p className="text-sm text-cacao">{selectedLotForJournal.documents.transportDocument}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowJournalModal(false)}
                className="flex-1 px-4 py-3 bg-gold text-cacao rounded-lg text-sm font-bold hover:bg-gold/90"
              >
                Fermer
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
