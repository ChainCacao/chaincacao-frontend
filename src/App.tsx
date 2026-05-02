import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './features/agriculteur/pages/LandingPage';
import LoginPage from './features/agriculteur/pages/LoginPage';
import Dashboard from './features/agriculteur/pages/Dashboard';
import CreateLotPage from './features/agriculteur/pages/CreateLotPage';
import LotDetailPage from './features/agriculteur/pages/LotDetailPage';
import CoopLandingPage from './features/coperative/pages/CoopLandingPage';
import CoopDashboard from './features/coperative/pages/CoopDashboard';
import CoopLoginPage from './features/coperative/pages/CoopLoginPage';
import ProducerManagementPage from './features/coperative/pages/ProducerManagementPage';
import PartnerModule from './features/coperative/pages/PartnerModule';
import TransformerModule from './features/agriculteur/pages/TransformerModule';
import ExporterModule from './features/agriculteur/pages/ExporterModule';
import CertifierModule from './features/agriculteur/pages/CertifierModule';
import MinistryModule from './features/agriculteur/pages/MinistryModule';
import VerifierModule from './features/agriculteur/pages/VerifierModule';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/agriculteur/login" element={<LoginPage />} />
        <Route path="/agriculteur/dashboard" element={<Dashboard />} />
        <Route path="/agriculteur/nouveau-lot" element={<CreateLotPage />} />
        <Route path="/agriculteur/lot/:id" element={<LotDetailPage />} />
        <Route path="/cooperative" element={<CoopLandingPage />} />
        <Route path="/cooperative/dashboard" element={<CoopDashboard />} />
        <Route path="/cooperative/login" element={<CoopLoginPage />} />
        <Route path="/cooperative/membres" element={<ProducerManagementPage />} />
        <Route path="/cooperative/partenaires" element={<PartnerModule />} />
        
        {/* Modules transformateurs et exportateurs */}
        <Route path="/transformateur" element={<TransformerModule />} />
        <Route path="/exportateur" element={<ExporterModule />} />
        
        {/* Modules certification et vérification */}
        <Route path="/certifieur" element={<CertifierModule />} />
        <Route path="/verifier" element={<VerifierModule />} />
        
        {/* Module ministère */}
        <Route path="/ministere" element={<MinistryModule />} />

      </Routes>
    </Router>
  );
}

export default App;