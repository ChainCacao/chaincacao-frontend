// Simulation d'une réponse API propre
export const agriService = {
  getDashboard: async () => {
    // On simule un délai réseau
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      stats: [
        { label: "Poids Total", value: "1,284 kg", detail: "Cacao Grade A" },
        { label: "Lots Validés", value: "24", detail: "8 en attente" },
        { label: "Revenus (XOF)", value: "450,000", detail: "Prévu le 05/05" },
        { label: "Conformité", value: "98%", detail: "Standard EUDR" },
      ],
      recentLots: [
        { id: "LOT-2026-001", date: "01 Mai 2026", status: "Validé", amount: "120 kg", hash: "0x7f3...a1b" },
        { id: "LOT-2026-002", date: "30 Avr 2026", status: "En attente", amount: "85 kg", hash: "0x2d1...e4c" },
        { id: "LOT-2026-003", date: "28 Avr 2026", status: "Transféré", amount: "200 kg", hash: "0x9b8...f9d" },
      ]
    };
  }
};