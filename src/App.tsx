import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './features/agriculteur/pages/LandingPage';
import LoginPage from './features/agriculteur/pages/LoginPage';
import Dashboard from './features/agriculteur/pages/Dashboard';
import CreateLotPage from './features/agriculteur/pages/CreateLotPage';
import LotDetailPage from './features/agriculteur/pages/LotDetailPage';
import CoopLandingPage from './features/coperative/pages/CoopLandingPage';

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
      </Routes>
    </Router>
  );
}

export default App;