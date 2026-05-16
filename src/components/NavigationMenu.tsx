import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, Users, Package, Factory, Ship, ShieldCheck, 
  Search, Building, BarChart3, LogOut, Menu, X
} from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '../stores/useAuthStore';

interface NavigationItem {
  label: string;
  icon: React.ReactNode;
  path: string;
  description?: string;
  badge?: string;
}

const NavigationMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Navigation items based on user role
  const getNavigationItems = (): NavigationItem[] => {
    if (location.pathname.includes('cooperative')) {
      return [
        { label: 'Accueil', icon: <Home size={20} />, path: '/cooperative', description: 'Tableau de bord' },
        { label: 'Producteurs', icon: <Users size={20} />, path: '/cooperative/membres', description: 'Gestion des membres' },
        { label: 'Partenaires', icon: <Building size={20} />, path: '/cooperative/partenaires', description: 'Répertoire des partenaires' },
      ];
    }
    
    if (location.pathname.includes('agriculteur')) {
      return [
        { label: 'Accueil', icon: <Home size={20} />, path: '/agriculteur/dashboard', description: 'Tableau de bord' },
        { label: 'Nouveau Lot', icon: <Package size={20} />, path: '/agriculteur/nouveau-lot', description: 'Déclarer une récolte' },
      ];
    }

    // External modules navigation
    return [
      { label: 'Transformateur', icon: <Factory size={20} />, path: '/transformateur', description: 'Usine de transformation' },
      { label: 'Exportateur', icon: <Ship size={20} />, path: '/exportateur', description: 'Logistique & Export' },
      { label: 'Certifieur', icon: <ShieldCheck size={20} />, path: '/certifieur', description: 'Organisme de certification' },
      { label: 'Vérificateur', icon: <Search size={20} />, path: '/verifier', description: 'Vérification publique' },
      { label: 'Ministère', icon: <BarChart3 size={20} />, path: '/ministere', description: 'Supervision étatique' },
    ];
  };

  const navigationItems = getNavigationItems();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex bg-white border-b border-gray-200 px-6 py-3 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-cacao rounded-lg flex items-center justify-center text-gold">
                <Home size={16} />
              </div>
              <span className="font-black text-cacao text-lg">ChainCacao</span>
            </div>
            
            <div className="flex items-center gap-6">
              {navigationItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                    isActive(item.path)
                      ? 'bg-cacao text-gold font-black'
                      : 'text-gray-600 hover:text-cacao hover:bg-gray-50'
                  }`}
                >
                  {item.icon}
                  <span className="text-sm font-medium">{item.label}</span>
                  {item.badge && (
                    <span className="bg-gold text-cacao text-xs px-2 py-1 rounded-full font-black">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {user?.name || 'Utilisateur'}
              </p>
              <p className="text-xs text-gray-500">
                {user?.id || 'ID: Unknown'}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
              title="Déconnexion"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        {/* Mobile Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-cacao rounded-lg flex items-center justify-center text-gold">
                <Home size={16} />
              </div>
              <span className="font-black text-cacao text-lg">ChainCacao</span>
            </div>
            
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-cacao rounded-lg"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setIsMobileMenuOpen(false)}>
            <div 
              className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-black text-cacao text-lg">Navigation</h3>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-2 mb-6">
                  {navigationItems.map((item) => (
                    <button
                      key={item.path}
                      onClick={() => {
                        navigate(item.path);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        isActive(item.path)
                          ? 'bg-cacao text-gold font-black'
                          : 'text-gray-600 hover:text-cacao hover:bg-gray-50'
                      }`}
                    >
                      {item.icon}
                      <div className="flex-1 text-left">
                        <p className="font-medium">{item.label}</p>
                        {item.description && (
                          <p className="text-xs opacity-70">{item.description}</p>
                        )}
                      </div>
                      {item.badge && (
                        <span className="bg-gold text-cacao text-xs px-2 py-1 rounded-full font-black">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {user?.name || 'Utilisateur'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {user?.id || 'ID: Unknown'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <LogOut size={20} />
                    <span className="font-medium">Déconnexion</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default NavigationMenu;
