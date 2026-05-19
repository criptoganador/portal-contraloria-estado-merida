import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import InstitucionPage from './pages/InstitucionPage';
import CompetenciasPage from './pages/CompetenciasPage';
import MarcoLegalPage from './pages/MarcoLegalPage';
import PrensaPage from './pages/PrensaPage';
import MultimediaPage from './pages/MultimediaPage';
import ContactoPage from './pages/ContactoPage';
import AdminLayout from './admin/AdminLayout';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  const location = useLocation();
  const isCleanLayout = location.pathname.startsWith('/admin') || location.pathname === '/login';

  // Admin and Login have their own layout (no public navbar/footer)
  if (isCleanLayout) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        />
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
          <Route path="/multimedia" element={<MultimediaPage />} />
          <Route path="/contacto" element={<ContactoPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
