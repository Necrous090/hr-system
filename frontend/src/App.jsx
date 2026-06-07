import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/guards/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Employees from './pages/personnel/Employees';
import Recruitment from './pages/recruitment/Recruitment';
import Attendance from './pages/attendance/Attendance';
import Vacations from './pages/attendance/Vacations';
import Training from './pages/development/Training';
import Performance from './pages/development/Performance';
import Offboarding from './pages/offboarding/Offboarding';
import Reports from './pages/reports/Reports';

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<Layout />}>
            <Route path="/" element={<ProtectedRoute path="/"><Dashboard /></ProtectedRoute>} />
            <Route path="/employees" element={<ProtectedRoute path="/employees"><Employees /></ProtectedRoute>} />
            <Route path="/recruitment" element={<ProtectedRoute path="/recruitment"><Recruitment /></ProtectedRoute>} />
            <Route path="/attendance" element={<ProtectedRoute path="/attendance"><Attendance /></ProtectedRoute>} />
            <Route path="/vacations" element={<ProtectedRoute path="/vacations"><Vacations /></ProtectedRoute>} />
            <Route path="/training" element={<ProtectedRoute path="/training"><Training /></ProtectedRoute>} />
            <Route path="/performance" element={<ProtectedRoute path="/performance"><Performance /></ProtectedRoute>} />
            <Route path="/offboarding" element={<ProtectedRoute path="/offboarding"><Offboarding /></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute path="/reports"><Reports /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;