export type JsonValue =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JsonValue }
  | JsonValue[];

export type Role =
  | 'AGRICULTEUR'
  | 'COOPERATIVE'
  | 'EXPORTATEUR'
  | 'TRANSFORMATEUR'
  | 'CERTIFIEUR'
  | 'MINISTERE'
  | 'ADMIN';

export type Statut = 'ACTIF' | 'INACTIF' | 'SUSPENDU';
export type ValidationStatus = 'EN_ATTENTE' | 'APPROUVE' | 'REJETE';
export type CertificationType = 'CONVENTIONNEL' | 'BIO' | 'FAIRTRADE' | 'RAINFOREST_ALLIANCE';
export type Sexe = 'M' | 'F';
export type TypeIdentite = 'CNI' | 'PASSEPORT' | 'CARTE_ELECTEUR' | 'CARTE_NATIONALE_PRODUCTEUR';
export type TypePropriete = 'COUTUMIER' | 'TITRE_FONCIER' | 'METAYAGE' | 'LOCATION';
export type ModeProduction = 'CONVENTIONNEL' | 'TRANSITION' | 'BIO' | 'FAIRTRADE' | 'RAINFOREST_ALLIANCE';
export type StatutConformite = 'EN_ATTENTE' | 'CONFORME' | 'ALERTE' | 'NON_CONFORME';
export type FiliereType = 'CAFE' | 'CACAO';
export type StatutPaiement = 'EN_ATTENTE' | 'PAYE' | 'REJETE';
export type ModePaiement = 'TMONEY' | 'FLOOZ' | 'ESPECES' | 'VIREMENT_BANCAIRE';
export type EtapeTrajet =
  | 'COLLECTE_FERME'
  | 'STOCKAGE_COOPERATIVE'
  | 'FUSION_LOTS'
  | 'EN_COURS_DE_TRANSIT'
  | 'LIVRE_TRANSFORMATEUR'
  | 'LIVRE_EXPORTATEUR';
export type BlockchainStatus = 'EN_ATTENTE_ANCRAGE' | 'ANCRE_SUR_LA_CHAINE' | 'ECHEC_ANCRAGE';
export type ActionType = 'PESEE' | 'STOCKAGE' | 'TRANSIT' | 'LIVRAISON' | 'CERTIFICATION' | 'EXPORT';

export interface User {
  id: string;
  internalId: string;
  email?: string | null;
  password?: string | null;
  telephone?: string | null;
  name: string;
  role: Role;
  statut: Statut;
  validationStatus: ValidationStatus;
  isValidatedByMinistry: boolean;
  walletAddress?: string | null;
  documents?: JsonValue | null;
  hashDocuments?: string | null;
  lastLogin?: string | null;
  createdAt: string;
  updatedAt: string;
  cooperative?: Cooperative | null;
  agriculteur?: Agriculteur | null;
  transformateur?: Transformateur | null;
  certifieur?: Certifieur | null;
  exportateur?: Exportateur | null;
  ministereAgent?: MinistereAgent | null;
}

export interface Cooperative {
  id: string;
  userId: string;
  user: User;
  nomCoop: string;
  numRemCoop: string;
  dateAgrement?: string | null;
  numEnregistrementCCFCC?: string | null;
  region: string;
  prefecture: string;
  commune: string;
  canton: string;
  siegeSocial: string;
  coordenneesGPS?: JsonValue | null;
  certification: CertificationType;
  capaciteStockageTonnes: number;
  infrastructure?: JsonValue | null;
  validationStatus: ValidationStatus;
  isValidatedByMinistry: boolean;
  statut: Statut;
  validateAt?: string | null;
  validateurId?: string | null;
  validateurMinistere?: MinistereAgent | null;
  notesMinistere?: string | null;
  documents?: JsonValue | null;
  hashDocuments?: string | null;
  createdAt: string;
  updatedAt: string;
  agriculteurs: Agriculteur[];
  lotsRecoltes: LotRecolte[];
  partenariatsMetier: PartenariatMetier[];
}

export interface Agriculteur {
  id: string;
  userId?: string | null;
  user?: User | null;
  cooperativeId: string;
  cooperative: Cooperative;
  nom: string;
  prenom: string;
  sexe: Sexe;
  dateNaissance?: string | null;
  nationalite: string;
  numeroIdentite?: string | null;
  typeIdentite?: TypeIdentite | null;
  copieIdentiteUrl?: string | null;
  telephone?: string | null;
  personnesACharge?: number | null;
  region: string;
  prefecture: string;
  commune: string;
  canton: string;
  village: string;
  superficieHa: number;
  donneesGeospatiales: JsonValue;
  agePlantations?: number | null;
  nbPiedsCacao?: number | null;
  nbPiedsCafe?: number | null;
  capaciteProductionKg?: number | null;
  typePropriete: TypePropriete;
  partsSociales: number;
  droitAdhesionPaye: boolean;
  acteEngagementUrl?: string | null;
  modeProduction: ModeProduction;
  numeroProducteurUTCC: string;
  statut: Statut;
  validationStatus: ValidationStatus;
  isValidatedByMinistry: boolean;
  validatedAt?: string | null;
  validateurId?: string | null;
  validateurMinistere?: MinistereAgent | null;
  notesMinistere?: string | null;
  documents?: JsonValue | null;
  hashDocuments?: string | null;
  createdAt: string;
  updatedAt: string;
  lotsRecoltes: LotRecolte[];
}

export interface Transformateur {
  id: string;
  userId: string;
  user: User;
  raisonSociale: string;
  numRCCM: string;
  numNIF: string;
  nomResponsable: string;
  ville: string;
  quartierZone: string;
  coordonneesGPS?: JsonValue | null;
  numAMM?: string | null;
  numAgrementCCFCC?: string | null;
  documentsUrl?: JsonValue | null;
  hashDocuments?: string | null;
  capaciteAnuelleTonnes: number;
  produitsFinis: string[];
  statut: Statut;
  lotsTransformes: LotRecolte[];
  partenariatsMetier: PartenariatMetier[];
  validationStatus: ValidationStatus;
  isValidatedByMinistry: boolean;
  validatedAt?: string | null;
  validateurId?: string | null;
  validateurMinistere?: MinistereAgent | null;
  notesMinistere?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Certifieur {
  id: string;
  userId: string;
  user: User;
  nomOrganisme: string;
  numRCCM?: string | null;
  numNIF?: string | null;
  addresse: string;
  numAgrement?: string | null;
  numEnregistrementCCFCC?: string | null;
  accreditation?: string | null;
  labelAutorise?: string | null;
  documentsUrl?: JsonValue | null;
  hashDocuments?: string | null;
  totalCertificatEmis: number;
  totalAuditsRealises: number;
  statut: Statut;
  validationStatus: ValidationStatus;
  lotsCertifies: LotRecolte[];
  isValidatedByMinistry: boolean;
  validatedAt?: string | null;
  validateurId?: string | null;
  validateurMinistere?: MinistereAgent | null;
  datesDernierAudit?: string | null;
  notesMinistere?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Exportateur {
  id: string;
  userId: string;
  user: User;
  raisonSociale: string;
  numRCCM: string;
  numNIF: string;
  codeExportateurOTR: string;
  nomRepresentant: string;
  telephoneRepresentant?: string | null;
  emailRepresentant?: string | null;
  numAgrementCCFCC: string;
  dateValiditeAgrement: string;
  siegeSocial: string;
  adresseEntrepot: string;
  coordonneesGPSJson?: JsonValue | null;
  capaciteStockageTonnes?: number | null;
  documentsUrl?: JsonValue | null;
  hashDocuments?: string | null;
  statut: Statut;
  validationStatus: ValidationStatus;
  lotsExportes: LotRecolte[];
  partenariatsMetier: PartenariatMetier[];
  isValidatedByMinistry: boolean;
  validatedAt?: string | null;
  validateurId?: string | null;
  validateurMinistere?: MinistereAgent | null;
  dateDerniereInspectionMinistere?: string | null;
  notesMinistere?: string | null;
  totalLotsExportes: number;
  totalCampagnesRealisees: number;
  createdAt: string;
  updatedAt: string;
}

export interface LotRecolte {
  id: string;
  codeLot: string;
  agriculteurId?: string | null;
  agriculteur?: Agriculteur | null;
  cooperativeId: string;
  cooperative: Cooperative;
  lotParentId?: string | null;
  lotParent?: LotRecolte | null;
  sousLots: LotRecolte[];
  lothistorique: LotHistorique[];
  filiere: FiliereType;
  especeVariete: string;
  poidsBrutKg: number;
  poidsNetKg: number;
  nbSacsJute: number;
  tauxHumidite: number;
  photoChampUrl: string;
  agentGpsLatitude: number;
  agentGpsLongitude: number;
  metadataPhotoExif?: JsonValue | null;
  geolocalisationPreuve: JsonValue;
  statutTrajet: EtapeTrajet;
  statutConformiteEUDR: StatutConformite;
  transformateurId?: string | null;
  transformateur?: Transformateur | null;
  exportateurId?: string | null;
  exportateur?: Exportateur | null;
  certifieurId?: string | null;
  certifieur?: Certifieur | null;
  documentsAssocies?: JsonValue | null;
  blockchainTxHash?: string | null;
  tokenId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PartenariatMetier {
  id: string;
  cooperativeId: string;
  cooperative: Cooperative;
  transformateurId?: string | null;
  transformateur?: Transformateur | null;
  exportateurId?: string | null;
  exportateur?: Exportateur | null;
  estApprouve: boolean;
  createdAt: string;
}

export interface LotHistorique {
  id: string;
  lotId: string;
  lot: LotRecolte;
  etape: EtapeTrajet;
  action: string;
  actionType?: ActionType | null;
  acteurId: string;
  acteurNom: string;
  acteurRole: Role;
  localisationNom: string;
  latitude?: number | null;
  longitude?: number | null;
  donneesEtape?: JsonValue | null;
  documentAssocieUrl?: string | null;
  documentsAssocies?: JsonValue | null;
  blockchainTxHash?: string | null;
  blockchainStatus: BlockchainStatus;
  dateActionTerrain?: string | null;
  createdAt: string;
}

export interface MinistereAgent {
  id: string;
  userId: string;
  user: User;
  nomAgent: string;
  prenomAgent: string;
  directionService: string;
  posteOccupe: string;
  telephonePro?: string | null;
  cooperativesValidees: Cooperative[];
  agriculteursValides: Agriculteur[];
  certifieursValides: Certifieur[];
  exportateursValides: Exportateur[];
  transformateursValides: Transformateur[];
  createdAt: string;
  updatedAt: string;
}
