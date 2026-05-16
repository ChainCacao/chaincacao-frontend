import type {
  Role,
  Statut,
  ValidationStatus,
  CertificationType,
  Sexe,
  TypeIdentite,
  TypePropriete,
  ModeProduction,
  StatutConformite,
  FiliereType,
  EtapeTrajet,
  ActionType,
  BlockchainStatus,
  JsonValue,
  User as PrismaUser,
  LotRecolte,
  Agriculteur,
  Cooperative,
  Transformateur,
  Certifieur,
  Exportateur,
  MinistereAgent,
  LotHistorique,
  PartenariatMetier,
} from './prisma';

export type { Role, Statut, ValidationStatus, CertificationType, Sexe, TypeIdentite, TypePropriete, ModeProduction, StatutConformite, FiliereType, EtapeTrajet, ActionType, BlockchainStatus, JsonValue };
export type { LotRecolte, Agriculteur, Cooperative, Transformateur, Certifieur, Exportateur, MinistereAgent, LotHistorique, PartenariatMetier };

export type SafeUser = Omit<PrismaUser, 'password'>;

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  code?: string;
}

export interface ApiErrorBody {
  success: boolean;
  message: string;
  code?: string;
}

export interface LoginRequest {
  identifier?: string;
  qrPayload?: string | { internalId: string; type?: string; role?: string; validationStatus?: string };
  email?: string;
  password?: string;
}

export interface LoginResponse {
  token: string;
  loginMode: string;
  user: SafeUser;
}

export interface DocumentsPayload {
  rccmUrl?: string;
  nifUrl?: string;
  agrementUrl?: string;
  pieceIdentiteUrl?: string;
  statutsUrl?: string;
  procesVerbalUrl?: string;
  autorisationUrl?: string;
  autres?: string[];
}

export interface GpsPoint {
  latitude: number;
  longitude: number;
  precisionMetres?: number;
  capturedAt?: string;
  source?: 'APP_CAMERA' | 'EXIF' | 'DEVICE_GPS';
}

export interface PhotoCapture {
  photoChampUrl: string;
  photoGps?: GpsPoint;
  metadataPhotoExif?: JsonValue;
}

export interface DocumentAssocie {
  nom: string;
  url: string;
  hashSha256?: string;
  type?: string;
}

export interface BaseUserRegistration {
  email: string;
  password: string;
  telephone: string;
  name: string;
  role: Role;
  walletAddress?: string;
  documents?: DocumentsPayload;
  hashDocuments?: string;
}

export interface CooperativePayload {
  nomCoop: string;
  numRemCoop: string;
  dateAgrement?: string;
  numEnregistrementCCFCC?: string;
  region: string;
  prefecture: string;
  commune: string;
  canton: string;
  siegeSocial: string;
  coordenneesGPS?: GpsPoint;
  certification?: CertificationType;
  capaciteStockageTonnes?: number;
  infrastructure?: JsonValue;
  documents: DocumentsPayload;
  hashDocuments?: string;
}

export interface AgriculteurPayload {
  cooperativeId: string;
  nom: string;
  prenom: string;
  sexe: Sexe;
  dateNaissance?: string;
  nationalite?: string;
  numeroIdentite?: string;
  typeIdentite?: TypeIdentite;
  copieIdentiteUrl?: string;
  telephone?: string;
  personnesACharge?: number;
  region: string;
  prefecture: string;
  commune: string;
  canton: string;
  village: string;
  superficieHa: number;
  donneesGeospatiales: JsonValue;
  agePlantations?: number;
  nbPiedsCacao?: number;
  nbPiedsCafe?: number;
  capaciteProductionKg?: number;
  typePropriete: TypePropriete;
  partsSociales?: number;
  droitAdhesionPaye?: boolean;
  acteEngagementUrl?: string;
  modeProduction?: ModeProduction;
  documents?: DocumentsPayload;
  hashDocuments?: string;
}

export interface TransformateurPayload {
  raisonSociale: string;
  numRCCM: string;
  numNIF: string;
  nomResponsable: string;
  ville: string;
  quartierZone: string;
  coordonneesGPS?: GpsPoint;
  numAMM?: string;
  numAgrementCCFCC?: string;
  documentsUrl: DocumentsPayload;
  hashDocuments?: string;
  capaciteAnuelleTonnes?: number;
  produitsFinis: string[];
}

export interface CertifieurPayload {
  nomOrganisme: string;
  numRCCM?: string;
  numNIF?: string;
  addresse: string;
  numAgrement?: string;
  numEnregistrementCCFCC?: string;
  accreditation?: string;
  labelAutorise?: CertificationType;
  documentsUrl: DocumentsPayload;
  hashDocuments?: string;
  datesDernierAudit?: string;
}

export interface ExportateurPayload {
  raisonSociale: string;
  numRCCM: string;
  numNIF: string;
  codeExportateurOTR: string;
  nomRepresentant: string;
  telephoneRepresentant?: string;
  emailRepresentant?: string;
  numAgrementCCFCC: string;
  dateValiditeAgrement: string;
  siegeSocial: string;
  adresseEntrepot: string;
  coordonneesGPSJson?: GpsPoint;
  capaciteStockageTonnes?: number;
  documentsUrl: DocumentsPayload;
  hashDocuments?: string;
}

export interface RegisterRequest {
  user: BaseUserRegistration;
  cooperative?: CooperativePayload;
  agriculteur?: AgriculteurPayload;
  transformateur?: TransformateurPayload;
  certifieur?: CertifieurPayload;
  exportateur?: ExportateurPayload;
}

export interface MinistryAgentPayload {
  nomAgent: string;
  prenomAgent: string;
  directionService: string;
  posteOccupe: string;
  telephonePro?: string;
}

export interface MinistryAgentRegisterRequest {
  user: Omit<BaseUserRegistration, 'role'>;
  ministereAgent: MinistryAgentPayload;
}

export interface CooperativeAgriculteurUserPayload {
  email?: string;
  password?: string;
  telephone?: string;
  name?: string;
  walletAddress?: string;
  documents?: DocumentsPayload;
  hashDocuments?: string;
}

export interface CooperativeAgriculteurRegisterRequest {
  user: CooperativeAgriculteurUserPayload;
  agriculteur: Omit<AgriculteurPayload, 'cooperativeId' | 'numeroProducteurUTCC'>;
}

export interface CreateLotRequest {
  agriculteurId?: string;
  filiere: FiliereType;
  especeVariete: string;
  poidsBrutKg: number;
  poidsNetKg: number;
  nbSacsJute: number;
  tauxHumidite: number;
  photoCapture: PhotoCapture;
  geolocalisationPreuve?: JsonValue;
  documentsAssocies?: DocumentAssocie[];
  dateActionTerrain?: string;
}

export interface MergeLotsRequest {
  lotIds: string[];
  especeVariete?: string;
  documentsAssocies?: DocumentAssocie[];
  dateActionTerrain?: string;
}

export interface TransferLotRequest {
  lotId: string;
  destinataireType: 'TRANSFORMATEUR' | 'EXPORTATEUR';
  destinataireId: string;
  localisationNom?: string;
  latitude?: number;
  longitude?: number;
  documentsAssocies?: DocumentAssocie[];
  dateActionTerrain?: string;
}

export interface ReceiveLotRequest {
  lotId: string;
  poidsRecuKg?: number;
  localisationNom?: string;
  latitude?: number;
  longitude?: number;
  controleQualite?: JsonValue;
  documentsAssocies?: DocumentAssocie[];
  dateActionTerrain?: string;
}

export interface LotActionRequest {
  lotId: string;
  action: string;
  actionType: ActionType;
  donneesEtape?: JsonValue;
  documentAssocieUrl?: string;
  documentsAssocies?: DocumentAssocie[];
  localisationNom?: string;
  latitude?: number;
  longitude?: number;
  dateActionTerrain?: string;
}

export interface CertifyLotRequest {
  lotId: string;
  decision: 'CERTIFIE' | 'REJETE';
  certifieurId?: string;
  notes?: string;
  documentsAssocies?: DocumentAssocie[];
}

export interface MinistryValidationRequest {
  userId: string;
  acteurType: Role;
  acteurId: string;
  decision: 'APPROUVE' | 'REJETE';
  internalId?: string;
  notesMinistere?: string;
  documentsVerifies: boolean;
  validateurId?: string;
}

export interface LotMutationResponse {
  lot: LotRecolte;
  alertePoids?: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  data?: JsonValue;
  isRead: boolean;
  channels: string[];
  createdAt: string;
}
