import type { EtapeTrajet, Statut, StatutConformite, ValidationStatus } from '../../types/api';

interface BadgeProps {
  value: Statut | ValidationStatus | StatutConformite | EtapeTrajet | string;
  type?: 'statut' | 'validation' | 'conformite' | 'trajet';
}

const styles: Record<string, string> = {
  ACTIF: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  INACTIF: 'bg-gray-50 text-gray-600 border-gray-200',
  SUSPENDU: 'bg-red-50 text-red-700 border-red-100',

  EN_ATTENTE: 'bg-amber-50 text-amber-700 border-amber-100',
  APPROUVE: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  REJETE: 'bg-red-50 text-red-700 border-red-100',

  CONFORME: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  ALERTE: 'bg-amber-50 text-amber-700 border-amber-100',
  NON_CONFORME: 'bg-red-50 text-red-700 border-red-100',

  COLLECTE_FERME: 'bg-blue-50 text-blue-700 border-blue-100',
  STOCKAGE_COOPERATIVE: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  FUSION_LOTS: 'bg-purple-50 text-purple-700 border-purple-100',
  EN_COURS_DE_TRANSIT: 'bg-amber-50 text-amber-700 border-amber-100',
  LIVRE_TRANSFORMATEUR: 'bg-cyan-50 text-cyan-700 border-cyan-100',
  LIVRE_EXPORTATEUR: 'bg-teal-50 text-teal-700 border-teal-100',
};

export default function Badge({ value }: BadgeProps) {
  const cls = styles[value] || 'bg-gray-50 text-gray-600 border-gray-200';
  return (
    <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-tight border ${cls}`}>
      {value.replace(/_/g, ' ')}
    </span>
  );
}
