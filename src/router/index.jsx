import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import MachinesPage from '../pages/MachinesPage';
import MachineDetailPage from '../pages/MachineDetailPage';
import AlarmsPage from '../pages/AlarmsPage';
import TicketsPage from '../pages/TicketsPage';
import AdminPage from '../pages/AdminPage';
import NotFoundPage from '../pages/NotFoundPage';

export default function AppRouter() {
  return (
    <Routes>
      {/* Rotta pubblica: chiunque può accedere */}
      <Route path="/login" element={<LoginPage />} />

      {/* Se qualcuno va su "/" lo mandiamo automaticamente al login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Tutte le rotte qui dentro passano PRIMA da ProtectedRoute */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard"   element={<DashboardPage />} />
        <Route path="/machines"    element={<MachinesPage />} />
        {/* :id è un PARAMETRO DINAMICO — es. /machine/M003 */}
        <Route path="/machine/:id" element={<MachineDetailPage />} />
        <Route path="/alarms"      element={<AlarmsPage />} />
        <Route path="/tickets"     element={<TicketsPage />} />
      </Route>

      {/* Questa rotta passa PRIMA da AdminRoute (richiede ruolo admin) */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminPage />} />
      </Route>

      {/* "*" cattura QUALSIASI url non definito sopra -> pagina 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}