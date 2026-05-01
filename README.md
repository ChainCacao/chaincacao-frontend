src/
├── api/               # Client HTTP (Axios configuré, interceptors, baseURL)
├── services/          # Logique métier (API, blockchainService, authService)
├── store/             # État global (Zustand, slices par domaine)
├── features/          # Interfaces par acteur (Agriculteur, Coopérative, Exportateur…)
│   ├── agriculteur/
│   │   ├── DashboardAgriculteur.jsx
│   │   ├── CreateLotStepper.jsx
│   │   └── QRCodeCertificat.jsx
│   ├── coopérative/
│   ├── exportateur/
│   └── certificateur/
├── hooks/             # Hooks réutilisables (useAuth, useBlockchain, useLoading)
├── core/              # Constantes globales (ABI, contractAddress, config réseau)
├── components/        # UI génériques (Button, Card, Modal, Input, Navbar)
├── assets/            # Images, icônes, logos
├── mocks/             # Données simulées (lots.json, users.json, payments.json)
├── routes/            # Définition des routes React Router
├── App.jsx            # Point d’entrée, layout global
└── main.jsx           # Bootstrap React + Tailwind + Zustand
