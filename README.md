🍫 ChainCacao – Système de Traçabilité Immuable
ChainCacao est une solution technologique dédiée à la transformation de la filière cacao au Togo. Elle garantit la conformité aux normes EUDR (Règlementation européenne contre la déforestation) et assure la transparence des revenus des agriculteurs grâce à la puissance de la Blockchain.

🚀 État actuel du projet
Le projet est actuellement en phase de développement Frontend et de modélisation de la logique métier. L’architecture est conçue selon une approche Mobile-First, garantissant une stack moderne, légère et scalable.

✅ Réalisations
Identité Visuelle Hybride : Fusion entre la rigueur fonctionnelle des SaaSet l'identité organique de ChainCacao.

Dashboard Agriculteur : Suivi en temps réel des récoltes, des revenus et du score de conformité.

Workflow "Nouvelle Récolte" (3 étapes) :

Saisie des données physiques (poids, variété).

Capture automatisée des coordonnées GPS (Géolocalisation parcellaire).

Preuve visuelle (Champ & Sac) avec simulation de hachage immuable.

Traçabilité Granulaire : Page de suivi de lot avec timeline interactive du cycle de vie.

Portail Coopérative : Interface d'accueil, inscription et gestion des flux de production.

Architecture de Navigation : Routage dynamique fluide via react-router-dom.

🛠️ Stack Technique
Core : React 18, TypeScript, Tailwind CSS.

UI/UX : frame motion, Lucide React (Icônes).

Navigation : React Router v6.

Sécurité & Blockchain : Algorithmes SHA-256 pour le hachage des preuves (en attente d'intégration ethers.js sur le testnet Sepolia).

📅 Roadmap Phase 2 – Présentation Jury
🎯 Objectif
Présenter un prototype professionnel qui démontre :

Traçabilité complète (récolte → validation → certification → export).

Interfaces crédibles pour agriculteur et coopérative.

Connexion blockchain réelle (Sepolia).

Modules antifraude et conformité EUDR visibles, même si certains sont simulés.

🛠️ Étapes de développement
1️⃣ Frontend – Interfaces
[ ] Dashboard Agriculteur : récoltes, revenus, conformité.

[ ] Workflow Nouvelle Récolte (3 étapes) : données → GPS → photos → blockchain.

[ ] Page Suivi Lot : timeline complète + QR code + hash blockchain.

[ ] Dashboard Coopérative : vue globale des membres, lots reçus, validation/rejet.

[ ] Page Inscription Coopérative : formulaire antifraude (agrément + document).

2️⃣ Blockchain – Smart Contract
[ ] Déployer le contrat Solidity sur Sepolia.

[ ] Fonctions clés :

enregistrerLot() → agriculteur.

validerLot() → coopérative.

certifierLot() → certificateur.

transfererLot() → exportateur.

getLot() → vérificateur.

[ ] Vérification sur Etherscan Sepolia.

[ ] Liaison avec frontend via ethers.js.

3️⃣ Simulation Backend
[ ] Utiliser Zustand pour simuler API (stockage local).

[ ] Générer hash SHA‑256 pour photos et GPS.

[ ] Préparer transition vers Node.js/Express sans casser l’architecture.

4️⃣ Modules antifraude & conformité
[ ] GPS obligatoire → preuve géolocalisation.

[ ] Photos obligatoires → champ + sac.

[ ] Score conformité EUDR affiché (même simulé).

[ ] Validation coopérative avant export.

5️⃣ Démo Jury
[ ] Création d’un lot en direct (formulaire → GPS → photo → blockchain).

[ ] QR code généré → scannable.

[ ] Hash blockchain vérifiable sur Sepolia.

[ ] Dashboard coopérative montrant validation/rejet.

[ ] Timeline lot → cycle complet visible.


📖 Livrables pour la phase 2
Prototype React (mobile‑first).

Smart contract déployé sur Sepolia.

Documentation claire (README + cahier des charges).

Workflow imprimable (acteur / action / résultat).

Démo en conditions réelles (connexion MetaMask, QR code, Etherscan).


📖 Guide de Contribution – ChainCacao
Pour maintenir la qualité et la cohérence du projet, chaque collaborateur s’engage à respecter les règles suivantes :

🔧 Standardisation
Respecter strictement la structure Mobile‑First (interfaces optimisées pour mobile avant desktop).

Utiliser TypeScript avec conventions de nommage claires (PascalCase pour composants, camelCase pour fonctions/variables).

Respecter la hiérarchie des composants React (découpage logique et réutilisable).

Utiliser Tailwind CSS et Shadcn UI pour garantir une identité visuelle homogène.

🔗 Workflow
Suivre la chaîne de valeur définie :
Agriculteur → Coopérative → Exportateur → Certificateur → Vérificateur.

Chaque module doit refléter le rôle et les actions spécifiques de l’acteur.

Les données critiques (lotId, poids, GPS, hash) doivent être reliées au smart contract Sepolia.

Les données administratives (profil, téléphone, documents) restent off‑chain (backend ou simulation Zustand).

📚 Documentation
Chaque nouveau module ou composant doit être accompagné d’un README interne dans son dossier.

Le README doit préciser :

Objectif du module.

Dépendances utilisées.

Instructions pour tester et valider.

Les commits doivent être clairs et respecter une convention (feat:, fix:, docs:, test:).

🧪 Tests & Validation
Valider systématiquement les transactions blockchain sur Sepolia avant toute fusion (Pull Request).

Vérifier :

Fonction enregistrerLot() → création correcte.

Fonction validerLot() → validation par coopérative.

Hash et QR code générés → vérifiables sur Etherscan.

Ajouter des tests unitaires pour la logique critique (validation des champs, génération hash).

Aucun code ne doit être fusionné sans review croisée (au moins 1 autre collaborateur valide).

🚀 Bonnes pratiques
Toujours travailler sur une branche dédiée (feature/nom-module).

Utiliser Issues GitHub pour décrire les tâches et suivre l’avancement.

Respecter la roadmap : ne pas développer de fonctionnalités hors périmètre de la phase en cours.

Anticiper la transition backend : ne pas coder en dur, prévoir API simulée (Zustand) puis réelle (Node.js).


💻 Installation & Lancement
Bash
# 1. Cloner le dépôt
git clone [URL_DU_REPO]

# 2. Installer les dépendances
npm install

# 3. Lancer l'environnement de développement
npm run dev

---

## 🎯 Objectif Final – Prototype Professionnel & Démonstration Jury

1. **Prototype fonctionnel complet**  
   - Interfaces crédibles pour chaque acteur :  
     - Agriculteur (récolte, revenus, conformité).  
     - Coopérative (validation, gestion des membres, export).  
     - Exportateur (transfert, manifeste).  
     - Certificateur (certification EUDR).  
     - Vérificateur (consultation publique).  
   - Mobile‑first, fluide et adapté aux réalités terrain.

2. **Smart Contract immuable**  
   - Déployé sur **Ethereum Sepolia**.  
   - Fonctions clés : `enregistrerLot`, `validerLot`, `certifierLot`, `transfererLot`, `getLot`.  
   - Vérifiable sur **Etherscan** → preuve de traçabilité infalsifiable.

3. **Traçabilité complète et antifraude**  
   - Données critiques inscrites on‑chain (lotId, poids, GPS, hash photo).  
   - Données administratives off‑chain (profil agriculteur, documents coopérative).  
   - GPS obligatoire + photos champ/sac → conformité EUDR.  
   - Validation coopérative avant export → contrôle antifraude.

4. **Expérience utilisateur crédible**  
   - QR code unique pour chaque lot.  
   - Timeline du cycle de vie (création → validation → certification → export).  
   - Score conformité affiché (EUDR).  
   - Revenus transparents pour l’agriculteur.

5. **Livrables pour la phase finale**  
   - Prototype web/mobile (React + Tailwind + Shadcn).  
   - Smart contract Solidity déployé sur Sepolia.  
   - Vidéo de démonstration (workflow complet).  
   - PDF explicatif (acteurs, flux, conformité).  
   - Liens officiels (prototype, code, démo, notes).  

---

## 🚀 En résumé
L’objectif final est de présenter au jury une **solution professionnelle, crédible et conforme**, qui prouve que :  
- La traçabilité est **immuable** grâce à la blockchain.  
- Les agriculteurs et coopératives ont des **interfaces adaptées et fluides**.  
- La conformité EUDR est respectée avec preuves GPS + photos.  
- Le projet est **scalable et réaliste**, prêt à évoluer vers un backend réel.  

---
