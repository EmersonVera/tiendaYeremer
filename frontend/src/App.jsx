import { Navigate, Route, BrowserRouter, Routes } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import ProtectedRoute from './auth/ProtectedRoute';
import Layout from './components/Layout';
import ClienteDetalle from './pages/ClienteDetalle';
import ClientesList from './pages/ClientesList';
import Login from './pages/Login';
import NuevoCliente from './pages/NuevoCliente';
import NuevoFiado from './pages/NuevoFiado';
import RegistrarPago from './pages/RegistrarPago';

function Protegida({ children }) {
  return (
    <ProtectedRoute>
      <Layout>{children}</Layout>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Protegida><ClientesList /></Protegida>} />
          <Route path="/clientes/nuevo" element={<Protegida><NuevoCliente /></Protegida>} />
          <Route path="/clientes/:id" element={<Protegida><ClienteDetalle /></Protegida>} />
          <Route path="/clientes/:id/fiado" element={<Protegida><NuevoFiado /></Protegida>} />
          <Route path="/clientes/:id/pago" element={<Protegida><RegistrarPago /></Protegida>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
