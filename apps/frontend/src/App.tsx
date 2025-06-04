import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/templates/Layout/Layout';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { Producers } from './pages/Producers/Producers';
import { Farms } from './pages/Farms/Farms';
import { Crops } from './components/pages/Crops/Crops';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/producers" element={<Producers />} />
          <Route path="/farms" element={<Farms />} />
          <Route path="/crops" element={<Crops />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
