import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import InstitucionPage from './pages/InstitucionPage';
import CompetenciasPage from './pages/CompetenciasPage';
import MarcoLegalPage from './pages/MarcoLegalPage';
import PrensaPage from './pages/PrensaPage';
import ContactoPage from './pages/ContactoPage';
import AdminLayout from './admin/AdminLayout';

export default function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  // Admin has its own full layout (sidebar, no public navbar/footer)
  if (isAdmin) {
    return (
      <Routes>
        <Route path="/admin/*" element={<AdminLayout />} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/institucion" element={<InstitucionPage />} />
          <Route path="/competencias" element={<CompetenciasPage />} />
          <Route path="/marco-legal" element={<MarcoLegalPage />} />
          <Route path="/prensa" element={<PrensaPage />} />
          <Route path="/contacto" element={<ContactoPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
