type LoginFormData = { internalId: string;} 
import '../lib/loginSchema';

// Simulation d'une base de données Off-chain
const MOCK_FARMERS = [
  {
    id: "AGR-TG-001",
    nom: "Kossi Adjo",
    village: "Tchanadè",
    cooperativeId: "COOP-KARA-01",
    culturePrincipale: "Cacao",
    wallet: "0xAbC1234567890123456789012345678901234567"
  }
];

export const authService = {
  login: async (data: LoginFormData) => {
    // Simule un appel API
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const farmer = MOCK_FARMERS.find(f => f.id === data.internalId);
        if (farmer) resolve(farmer);
        else reject(new Error("Identifiant non reconnu par la coopérative"));
      }, 1000);
    });
  }
};