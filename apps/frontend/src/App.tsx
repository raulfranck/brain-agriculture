import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/templates/Layout/Layout';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { Producers } from './pages/Producers/Producers';
import { Farms } from './pages/Farms/Farms';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/producers" element={<Producers />} />
          <Route path="/farms" element={<Farms />} />
          <Route path="/analytics" element={<div style={{ padding: '24px' }}>Página de análises em desenvolvimento...</div>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
