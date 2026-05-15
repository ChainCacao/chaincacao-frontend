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
export type FiliereType = 'CAFE' | 'CACAO';
export type StatutConformite = 'EN_ATTENTE' | 'CONFORME' | 'ALERTE' | 'NON_CONFORME';
export type EtapeTrajet =
  | 'COLLECTE_FERME'
  | 'STOCKAGE_COOPERATIVE'
  | 'FUSION_LOTS'
  | 'EN_COURS_DE_TRANSIT'
  | 'LIVRE_TRANSFORMATEUR'
  | 'LIVRE_EXPORTATEUR';
export type ActionType = 'PESEE' | 'STOCKAGE' | 'TRANSIT' | 'LIVRAISON' | 'CERTIFICATION' | 'EXPORT';
export type BlockchainStatus = 'EN_ATTENTE_ANCRAGE' | 'ANCRE_SUR_LA_CHAINE' | 'ECHEC_ANCRAGE';

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type ApiErrorBody = {
  success: false;
  message: string;
  code?: string | null;
};

export type GpsPoint = {
  latitude: number;
  longitude: number;
  precisionMetres?: number;
  capturedAt?: string;
  source?: 'APP_CAMERA' | 'EXIF' | 'DEVICE_GPS';
};

export type DocumentAssocie = {
  nom: string;
  url: string;
  hashSha256?: string;
  type?: string;
};

export type User = {
  id: string;
  internalId: string;
  email?: string | null;
  telephone?: string | null;
  name: string;
  nom?: string;
  village?: string;
  role: Role;
  statut: Statut;
  validationStatus: ValidationStatus;
  isValidatedByMinistry: boolean;
  cooperative?: Cooperative | null;
  agriculteur?: Agriculteur | null;
  transformateur?: Transformateur | null;
  exportateur?: Exportateur | null;
  certifieur?: Certifieur | null;
  ministereAgent?: { id: string } | null;
};

export type Cooperative = {
  id: string;
  userId: string;
  nomCoop: string;
  region: string;
  prefecture: string;
  commune: string;
  canton: string;
  siegeSocial: string;
};

export type Agriculteur = {
  id: string;
  userId?: string | null;
  cooperativeId: string;
  nom: string;
  prenom: string;
  village: string;
  canton: string;
  region: string;
  prefecture: string;
  commune: string;
  superficieHa: number;
  donneesGeospatiales: unknown;
};

export type Transformateur = {
  id: string;
  userId: string;
  raisonSociale: string;
  ville: string;
  quartierZone: string;
};

export type Exportateur = {
  id: string;
  userId: string;
  raisonSociale: string;
  siegeSocial: string;
  adresseEntrepot: string;
};

export type Certifieur = {
  id: string;
  userId: string;
  nomOrganisme: string;
  accreditation?: string | null;
  labelAutorise?: string | null;
};

export type LotHistorique = {
  id: string;
  lotId: string;
  etape: EtapeTrajet;
  action: string;
  actionType?: ActionType | null;
  acteurId: string;
  acteurNom: string;
  acteurRole: Role;
  localisationNom: string;
  latitude?: number | null;
  longitude?: number | null;
  donneesEtape?: unknown;
  documentsAssocies?: DocumentAssocie[] | null;
  blockchainTxHash?: string | null;
  blockchainStatus: BlockchainStatus;
  createdAt: string;
};

export type LotRecolte = {
  id: string;
  codeLot: string;
  agriculteurId?: string | null;
  cooperativeId: string;
  lotParentId?: string | null;
  filiere: FiliereType;
  especeVariete: string;
  poidsBrutKg: number;
  poidsNetKg: number;
  nbSacsJute: number;
  tauxHumidite: number;
  photoChampUrl: string;
  agentGpsLatitude: number;
  agentGpsLongitude: number;
  metadataPhotoExif?: unknown;
  geolocalisationPreuve: unknown;
  statutTrajet: EtapeTrajet;
  statutConformiteEUDR: StatutConformite;
  transformateurId?: string | null;
  exportateurId?: string | null;
  certifieurId?: string | null;
  documentsAssocies?: DocumentAssocie[] | null;
  blockchainTxHash?: string | null;
  tokenId?: string | null;
  createdAt: string;
  updatedAt: string;
  agriculteur?: Agriculteur | null;
  cooperative?: Cooperative;
  transformateur?: Transformateur | null;
  exportateur?: Exportateur | null;
  certifieur?: Certifieur | null;
  sousLots?: LotRecolte[];
  lotParent?: LotRecolte | null;
  lothistorique?: LotHistorique[];
};

export type LoginRequest = {
  identifier?: string;
  email?: string;
  qrPayload?: string | Record<string, unknown>;
  password: string;
};

export type LoginResponse = {
  token: string;
  loginMode: 'INTERNAL_ID_OR_QR' | 'EMAIL_RECOVERY';
  user: User;
};

export type CreateLotRequest = {
  agriculteurId?: string;
  filiere: FiliereType;
  especeVariete: string;
  poidsBrutKg: number;
  poidsNetKg: number;
  nbSacsJute: number;
  tauxHumidite: number;
  photoCapture: {
    photoChampUrl: string;
    photoGps?: GpsPoint;
    metadataPhotoExif?: Record<string, unknown>;
  };
  geolocalisationPreuve?: Record<string, unknown>;
  documentsAssocies?: DocumentAssocie[];
  dateActionTerrain?: string;
};

export type LotMutationResponse = {
  lot: LotRecolte;
  notification?: {
    action: string;
    message: string;
    lotId: string;
    codeLot: string;
    statutTrajet: EtapeTrajet;
    recipients: Array<{ userId: string; role: Role; actorId: string }>;
  };
  alertePoids?: boolean;
};

export type MergeLotsRequest = {
  lotIds: string[];
  especeVariete?: string;
  documentsAssocies?: DocumentAssocie[];
  dateActionTerrain?: string;
};

export type TransferLotRequest = {
  lotId: string;
  destinataireType: 'TRANSFORMATEUR' | 'EXPORTATEUR';
  destinataireId: string;
  localisationNom?: string;
  latitude?: number;
  longitude?: number;
  documentsAssocies?: DocumentAssocie[];
  dateActionTerrain?: string;
};

export type ReceiveLotRequest = {
  lotId: string;
  poidsRecuKg?: number;
  localisationNom?: string;
  latitude?: number;
  longitude?: number;
  controleQualite?: Record<string, unknown>;
  documentsAssocies?: DocumentAssocie[];
  dateActionTerrain?: string;
};

export type LotActionRequest = {
  lotId: string;
  action: string;
  actionType: ActionType;
  donneesEtape?: Record<string, unknown>;
  documentAssocieUrl?: string;
  documentsAssocies?: DocumentAssocie[];
  localisationNom?: string;
  latitude?: number;
  longitude?: number;
  dateActionTerrain?: string;
};

export type CertifyLotRequest = {
  lotId: string;
  decision: 'CERTIFIE' | 'REJETE';
  certifieurId?: string;
  notes?: string;
  documentsAssocies?: DocumentAssocie[];
};
