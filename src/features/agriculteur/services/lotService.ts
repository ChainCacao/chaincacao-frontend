export const lotService = {
  // Simule l'envoi vers le Smart Contract et le Backend
  createLot: async (lotData: any) => {
    console.log("Données envoyées au Smart Contract:", lotData);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          lotId: `CACAO-${Math.floor(1000 + Math.random() * 9000)}-TG`,
          txHash: "0x" + [...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
          timestamp: new Date().toISOString()
        });
      }, 2500); // Temps de minage simulé
    });
  }
};