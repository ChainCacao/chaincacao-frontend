import { lotService } from '../../../services/lot.service';

export const agriService = {
  getDashboard: async () => {
    const lots = await lotService.list({ limit: 20 });
    const totalWeight = lots.reduce((sum, lot) => sum + lot.poidsNetKg, 0);
    const compliantLots = lots.filter((lot) => lot.statutConformiteEUDR === 'CONFORME').length;

    return {
      stats: [
        { label: 'Poids Total', value: `${totalWeight.toLocaleString()} kg`, detail: 'Lots actifs' },
        { label: 'Lots Validés', value: compliantLots, detail: `${lots.length - compliantLots} en alerte` },
        { label: 'Lots Suivis', value: lots.length, detail: 'Traçabilité blockchain' },
        { label: 'Conformité', value: lots.length ? `${Math.round((compliantLots / lots.length) * 100)}%` : '0%', detail: 'Standard EUDR' },
      ],
      recentLots: lots.map((lot) => ({
        id: lot.id,
        code: lot.codeLot,
        date: new Date(lot.createdAt).toLocaleDateString('fr-FR'),
        status: lot.statutTrajet,
        amount: `${lot.poidsNetKg} kg`,
        hash: lot.blockchainTxHash || '-',
      })),
    };
  },
};
