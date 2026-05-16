import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import LotGrouping from './LotGrouping';
import { lotService } from '../../../services/lot.service';
import { getApiErrorMessage } from '../../../services/http';
import type { LotRecolte } from '../../../types/api';

const toFarmerLot = (lot: LotRecolte) => ({
  id: lot.id,
  weight: lot.poidsNetKg,
  origin: lot.agriculteur?.village || lot.cooperative?.siegeSocial || 'Togo',
  status: lot.statutTrajet,
  date: new Date(lot.createdAt).toLocaleDateString('fr-FR'),
  producer: lot.agriculteur ? `${lot.agriculteur.prenom} ${lot.agriculteur.nom}` : 'Lot fusionné',
  producerId: lot.agriculteurId || lot.id,
  quality: lot.especeVariete,
  eudrCompliant: lot.statutConformiteEUDR === 'CONFORME',
  gpsCoordinates: `${lot.agentGpsLatitude}, ${lot.agentGpsLongitude}`,
  blockchainHash: lot.blockchainTxHash || undefined,
  lastVerification: new Date(lot.updatedAt).toLocaleDateString('fr-FR'),
  riskScore: lot.statutConformiteEUDR === 'CONFORME' ? 10 : 85,
});

export default function CoopLotGroupingPage() {
  const navigate = useNavigate();
  const [lots, setLots] = useState<LotRecolte[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    lotService.list({ statutTrajet: 'COLLECTE_FERME', limit: 100 })
      .then(setLots)
      .catch((error) => toast.error(getApiErrorMessage(error)))
      .finally(() => setLoading(false));
  }, []);

  const availableLots = useMemo(() => lots.map(toFarmerLot), [lots]);

  const handleConfirmGrouping = async (selectedIds: string[]) => {
    try {
      const result = await lotService.merge({ lotIds: selectedIds });
      toast.success('Lots fusionnés avec succès');
      navigate(`/agriculteur/lot/${result.lot.id}`);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-cream flex items-center justify-center text-cacao font-bold">Chargement des lots...</div>;
  }

  return (
    <LotGrouping
      availableLots={availableLots}
      onBack={() => navigate('/cooperative/dashboard')}
      onConfirmGrouping={handleConfirmGrouping}
    />
  );
}
