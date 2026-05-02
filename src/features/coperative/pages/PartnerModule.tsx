import React, { useState, useMemo } from 'react';
import { 
  Handshake, Plus, Search, Building2, MapPin, 
  ArrowLeft, Save, Building, 
  Tag, Loader2, CheckCircle2
} from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';

// --- TYPES ---
type PartnerType = 'Privé' | 'ONG / Association' | 'Gouvernemental' | 'International';

interface Partner {
  id: string;
  name: string;
  type: PartnerType;
  city: string;
  createdAt: string;
}

// --- COMPOSANT PRINCIPAL ---
export default function PartnerModule() {
  const [view, setView] = useState<'list' | 'form'>('list');
  const [partners, setPartners] = useState<Partner[]>([
    { id: 'PAR-771', name: 'EcoCert Togo', type: 'Privé', city: 'Lomé', createdAt: '2024-05-01' },
    { id: 'PAR-802', name: 'SOTOCO', type: 'Gouvernemental', city: 'Atakpamé', createdAt: '2024-04-15' },
  ]);

  // Logique d'ajout
  const handleSave = (newPartner: Omit<Partner, 'id' | 'createdAt'>) => {
    const fullPartner: Partner = {
      ...newPartner,
      id: `PAR-${Math.floor(Math.random() * 900) + 100}`,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setPartners([fullPartner, ...partners]);
    setView('list');
    
    // Toast élégant
    toast.success(`${fullPartner.name} a été enregistré avec succès !`, {
      icon: <CheckCircle2 className="text-gold" />,
      style: {
        background: '#2B1B17',
        color: '#F4EBD0',
        borderRadius: '20px',
        border: '1px solid rgba(244, 235, 208, 0.1)'
      },
    });
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8">
      <Toaster position="top-right" />
      
      <div className="max-w-6xl mx-auto">
        {view === 'list' ? (
          <PartnerList 
            partners={partners} 
            onAddNew={() => setView('form')} 
          />
        ) : (
          <PartnerForm 
            onBack={() => setView('list')} 
            onSave={handleSave} 
          />
        )}
      </div>
    </div>
  );
}

// --- SOUS-COMPOSANT : LISTE ---
function PartnerList({ partners, onAddNew }: { partners: Partner[], onAddNew: () => void }) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => 
    partners.filter(p => p.name.toLowerCase().includes(search.toLowerCase())),
    [partners, search]
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-black text-cacao flex items-center gap-3">
            <Handshake className="text-gold" size={32} />
            Partenaires
          </h1>
          <p className="text-slate-500 text-sm font-medium">Répertoire des collaborations stratégiques.</p>
        </div>
        
        <button 
          onClick={onAddNew}
          className="bg-cacao text-gold px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-cacao/20 hover:scale-[1.02] active:scale-95 transition-all"
        >
          <Plus size={20} /> Nouveau Partenaire
        </button>
      </div>

      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-gold transition-colors" size={20} />
        <input 
          type="text" 
          placeholder="Rechercher par nom..." 
          className="w-full pl-12 pr-4 py-4 bg-white border border-cacao/5 rounded-[1.5rem] shadow-sm outline-none focus:ring-2 ring-gold/20 transition-all font-medium"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((p) => (
          <div key={p.id} className="bg-white p-6 rounded-[2.5rem] border border-cacao/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-cream rounded-2xl flex items-center justify-center text-cacao group-hover:bg-gold group-hover:scale-110 transition-all">
                <Building2 size={24} />
              </div>
              <span className="text-[10px] font-mono text-slate-300 group-hover:text-cacao transition-colors">{p.id}</span>
            </div>
            
            <h3 className="font-bold text-cacao text-lg mb-1 truncate">{p.name}</h3>
            
            <div className="flex flex-col gap-2 mt-4">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-gold">
                <Tag size={12} /> {p.type}
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                <MapPin size={14} className="text-slate-300" /> {p.city}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- SOUS-COMPOSANT : FORMULAIRE ---
function PartnerForm({ onBack, onSave }: { onBack: () => void, onSave: (data: any) => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', type: 'Privé' as PartnerType, city: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => onSave(formData), 1000); // Simulation réseau
  };

  return (
    <div className="max-w-2xl mx-auto animate-in zoom-in-95 duration-300">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-cacao font-black text-[10px] uppercase tracking-widest mb-6 transition-colors">
        <ArrowLeft size={16} /> Annuler et quitter
      </button>

      <div className="bg-white rounded-[3rem] shadow-2xl shadow-cacao/10 border border-cacao/5 overflow-hidden">
        <div className="bg-cacao p-8 md:p-10 text-cream relative">
          <div className="absolute top-0 right-0 p-8 opacity-10">
             <Handshake size={80} />
          </div>
          <h2 className="text-3xl font-serif font-bold relative z-10">Déclaration</h2>
          <p className="text-gold/80 text-xs font-black uppercase tracking-widest mt-2">Nouveau Partenaire Stratégique</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Nom de l'organisation *</label>
            <div className="relative">
              <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/50" size={18} />
              <input 
                required
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 ring-gold/40 outline-none font-bold text-cacao placeholder:text-slate-300 transition-all"
                placeholder="Ex: Fédération des Producteurs..."
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Type de Structure</label>
              <select 
                className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 ring-gold/40 outline-none font-bold text-cacao appearance-none cursor-pointer"
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value as PartnerType})}
              >
                <option>Privé</option>
                <option>ONG / Association</option>
                <option>Gouvernemental</option>
                <option>International</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Ville d'ancrage *</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/50" size={18} />
                <input 
                  required
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 ring-gold/40 outline-none font-bold text-cacao placeholder:text-slate-300 transition-all"
                  placeholder="Ex: Lomé, Togo"
                  value={formData.city}
                  onChange={e => setFormData({...formData, city: e.target.value})}
                />
              </div>
            </div>
          </div>

          <button 
            disabled={isSubmitting}
            className="w-full bg-cacao text-gold py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 shadow-xl shadow-cacao/20 hover:bg-cacao/90 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <> <Save size={18} /> Finaliser l'enregistrement </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}