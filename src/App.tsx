import { Routes, Route } from 'react-router-dom';
import { DashboardPage } from './components/incidents/DashboardPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/incidents/:incidentId" element={<DashboardPage />} />
    </Routes>
  );
}

export default App;
