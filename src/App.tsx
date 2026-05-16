import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthGuard from './components/guards/AuthGuard';
import RoleGuard from './components/guards/RoleGuard';
import SocketProvider from './components/SocketProvider';
import WipPage from './components/WipPage';

// Agriculteur
import LandingPage from './features/agriculteur/pages/LandingPage';
import AgriLoginPage from './features/agriculteur/pages/LoginPage';
import AgriDashboard from './features/agriculteur/pages/Dashboard';
import CreateLotPage from './features/agriculteur/pages/CreateLotPage';
import LotDetailPage from './features/agriculteur/pages/LotDetailPage';
import FarmerConfirmationPage from './features/agriculteur/pages/FarmerConfirmationPage';
import LotGroupingView from './features/agriculteur/pages/LotGroupingView';

// Cooperative
import CoopLoginPage from './features/coperative/pages/CoopLoginPage';
import CoopRegisterPage from './features/coperative/pages/CoopRegisterPage';
import CoopConfirmationPage from './features/coperative/pages/CoopConfirmationPage';
import CoopTransferPage from './features/coperative/pages/CoopTransferPage';
import LotGrouping from './features/coperative/pages/LotGrouping';
import ProducerManagementPage from './features/coperative/pages/ProducerManagementPage';
import CoopLotGroupingPage from './features/coperative/pages/CoopLotGroupingPage';

// Transformateur
import TransformerLoginPage from './features/transformateurs/pages/TransformerLoginPage';
import TransformerRegisterPage from './features/transformateurs/pages/TransformerRegisterPage';
import TransformerDashboard from './features/transformateurs/pages/TransformerDashboard';

// Exportateur
import ExporterLoginPage from './features/exportateur/pages/ExporterLoginPage';
import ExporterRegisterPage from './features/exportateur/pages/ExporterRegisterPage';
import ExporterDashboard from './features/exportateur/pages/ExporterDashboard';

// Certifieur
import CertifierLoginPage from './features/certificateur/pages/CertifierLoginPage';
import CertifierRegisterPage from './features/certificateur/pages/CertifierRegisterPage';
import CertifierDashboard from './features/certificateur/pages/CertifierDashboard';

// Ministere / Verifier
import VerifierModule from './features/importateur/pages/VerifierModule';
import MinistryModule from './features/Admin/pages/MinistryModule';

function App() {
  return (
    <Router>
      <SocketProvider>
        <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/agriculteur/login" element={<LoginPage />} />
        <Route path="/agriculteur/dashboard" element={<Dashboard />} />
        <Route path="/agriculteur/nouveau-lot" element={<CreateLotPage />} />
        <Route path="/agriculteur/lot/:id" element={<LotDetailPage />} />
        <Route path="/agriculteur/confirmation-inscription" element={<FarmerConfirmationPage />} />
        <Route path="/agriculteur/regroupement" element={<LotGroupingView />} />
        <Route path="/cooperative" element={<CoopLandingPage />} />
        <Route path="/cooperative/dashboard" element={<CoopDashboard />} />
        <Route path="/cooperative/login" element={<CoopLoginPage />} />
        <Route path="/cooperative/register" element={<CoopRegisterPage />} />
        <Route path="/cooperative/confirmation-inscription" element={<CoopConfirmationPage />} />
        <Route path="/cooperative/membres" element={<ProducerManagementPage />} />
        <Route path="/cooperative/partenaires" element={<PartnerModule />} />
        <Route path="/cooperative/regroupement" element={<LotGrouping 
          availableLots={[]} 
          onBack={() => {}} 
          onConfirmGrouping={() => {}} 
        />} />
        <Route path="/cooperative/transfert" element={<CoopTransferPage />} />
        
        {/* Modules transformateurs et exportateurs */}
        <Route path="/transformateur" element={<TransformerModule />} />
        <Route path="/transformateur/login" element={<TransformerLoginPage />} />
        <Route path="/transformateur/register" element={<TransformerRegisterPage />} />
        <Route path="/transformateur/dashboard" element={
          <AuthGuard fallback="/transformateur/login">
            <RoleGuard allowedRoles={['TRANSFORMATEUR']}>
              <TransformerDashboard />
            </RoleGuard>
          </AuthGuard>
        } />

        {/* Exportateur */}
        <Route path="/exportateur/login" element={<ExporterLoginPage />} />
        <Route path="/exportateur/register" element={<ExporterRegisterPage />} />
        <Route path="/exportateur/dashboard" element={
          <AuthGuard fallback="/exportateur/login">
            <RoleGuard allowedRoles={['EXPORTATEUR']}>
              <ExporterDashboard />
            </RoleGuard>
          </AuthGuard>
        } />

        {/* Certifieur */}
        <Route path="/certifieur/login" element={<CertifierLoginPage />} />
        <Route path="/certifieur/register" element={<CertifierRegisterPage />} />
        <Route path="/certifieur/dashboard" element={
          <AuthGuard fallback="/certifieur/login">
            <RoleGuard allowedRoles={['CERTIFIEUR']}>
              <CertifierDashboard />
            </RoleGuard>
          </AuthGuard>
        } />

        {/* Ministere */}
        <Route path="/ministere/dashboard" element={
          <AuthGuard fallback="/">
            <RoleGuard allowedRoles={['MINISTERE', 'ADMIN']}>
              <MinistryModule />
            </RoleGuard>
          </AuthGuard>
        } />

        {/* WIP fallback */}
        <Route path="*" element={<WipPage />} />
        </Routes>
      </SocketProvider>
    </Router>
  );
}

export default App;
