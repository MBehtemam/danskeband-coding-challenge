import { Routes, Route } from 'react-router-dom';
import { DashboardPage } from './components/incidents/DashboardPage';
import { DeveloperSettingsPage } from './pages/DeveloperSettingsPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/incidents/:incidentId" element={<DashboardPage />} />
      <Route path="/developer" element={<DeveloperSettingsPage />} />
    </Routes>
  );
}

export default App;
