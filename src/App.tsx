import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './features/agriculteur/pages/LandingPage';
import LoginPage from './features/agriculteur/pages/LoginPage';
import Dashboard from './features/agriculteur/pages/Dashboard';
import CreateLotPage from './features/agriculteur/pages/CreateLotPage';
import LotDetailPage from './features/agriculteur/pages/LotDetailPage';
import LotGroupingView from './features/agriculteur/pages/LotGroupingView';
import CoopLandingPage from './features/coperative/pages/CoopLandingPage';
import CoopDashboard from './features/coperative/pages/CoopDashboard';
import CoopLoginPage from './features/coperative/pages/CoopLoginPage';
import CoopRegisterPage from './features/coperative/pages/CoopRegisterPage';
import CoopTransferPage from './features/coperative/pages/CoopTransferPage';
import CoopLotGroupingPage from './features/coperative/pages/CoopLotGroupingPage';
import ProducerManagementPage from './features/coperative/pages/ProducerManagementPage';
import PartnerModule from './features/coperative/pages/PartnerModule';
import TransformerModule from './features/transformateurs/pages/TransformerModule';
import TransformerRegisterPage from './features/transformateurs/pages/TransformerRegisterPage';
import TransformerLoginPage from './features/transformateurs/pages/TransformerLoginPage';
import TransformerDashboard from './features/transformateurs/pages/TransformerDashboard';
import TransformerReceptionPage from './features/transformateurs/pages/TransformerReceptionPage';
import TransformerProductionPage from './features/transformateurs/pages/TransformerProductionPage';
import TransformerTransferPage from './features/transformateurs/pages/TransformerTransferPage';
import ExporterModule from './features/exportateur/pages/ExporterModule';
import ExporterRegisterPage from './features/exportateur/pages/ExporterRegisterPage';
import ExporterLoginPage from './features/exportateur/pages/ExporterLoginPage';
import ExporterDashboard from './features/exportateur/pages/ExporterDashboard';
import ExporterTransferPage from './features/exportateur/pages/ExporterTransferPage';
import CertifierModule from './features/certificateur/pages/CertifierModule';
import CertifierRegisterPage from './features/certificateur/pages/CertifierRegisterPage';
import CertifierLoginPage from './features/certificateur/pages/CertifierLoginPage';
import CertifierDashboard from './features/certificateur/pages/CertifierDashboard';
import MinistryModule from './features/Admin/pages/MinistryModule';
import VerifierModule from './features/importateur/pages/VerifierModule';
import ImportateurScanPage from './features/importateur/pages/ImportateurScanPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/agriculteur/login" element={<LoginPage />} />
        <Route path="/agriculteur/dashboard" element={<Dashboard />} />
        <Route path="/agriculteur/nouveau-lot" element={<CreateLotPage />} />
        <Route path="/agriculteur/lot/:id" element={<LotDetailPage />} />
        <Route path="/agriculteur/regroupement" element={<LotGroupingView />} />
        <Route path="/cooperative" element={<CoopLandingPage />} />
        <Route path="/cooperative/dashboard" element={<CoopDashboard />} />
        <Route path="/cooperative/login" element={<CoopLoginPage />} />
        <Route path="/cooperative/register" element={<CoopRegisterPage />} />
        <Route path="/cooperative/membres" element={<ProducerManagementPage />} />
        <Route path="/cooperative/partenaires" element={<PartnerModule />} />
        <Route path="/cooperative/regroupement" element={<CoopLotGroupingPage />} />
        <Route path="/cooperative/transfert" element={<CoopTransferPage />} />
        
        {/* Modules transformateurs et exportateurs */}
        <Route path="/transformateur" element={<TransformerModule />} />
        <Route path="/transformateur/login" element={<TransformerLoginPage />} />
        <Route path="/transformateur/register" element={<TransformerRegisterPage />} />
        <Route path="/transformateur/dashboard" element={<TransformerDashboard />} />
        <Route path="/transformateur/reception" element={<TransformerReceptionPage />} />
        <Route path="/transformateur/production" element={<TransformerProductionPage />} />
        <Route path="/transformateur/transfert" element={<TransformerTransferPage />} />
        <Route path="/exportateur" element={<ExporterModule />} />
        <Route path="/exportateur/login" element={<ExporterLoginPage />} />
        <Route path="/exportateur/register" element={<ExporterRegisterPage />} />
        <Route path="/exportateur/dashboard" element={<ExporterDashboard />} />
        <Route path="/exportateur/transfert" element={<ExporterTransferPage />} />
        
        {/* Modules certification et vérification */}
        <Route path="/certifieur" element={<CertifierModule />} />
        <Route path="/certifieur/login" element={<CertifierLoginPage />} />
        <Route path="/certifieur/register" element={<CertifierRegisterPage />} />
        <Route path="/certifieur/dashboard" element={<CertifierDashboard />} />
        <Route path="/verifier" element={<VerifierModule />} />
        <Route path="/verifier/scan" element={<ImportateurScanPage />} />
        
        {/* Module ministère */}
        <Route path="/ministere" element={<MinistryModule />} />

      </Routes>
    </Router>
  );
}

export default App;
