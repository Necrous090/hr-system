import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Employees from './pages/personnel/Employees';
import Attendance from './pages/attendance/Attendance';
import Vacations from './pages/attendance/Vacations';
import Recruitment from './pages/recruitment/Recruitment';
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
            <Route path="/" element={<Dashboard />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/recruitment" element={<Recruitment />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/vacations" element={<Vacations />} />
            <Route path="/training" element={<Training />} />
            <Route path="/performance" element={<Performance />} />
            <Route path="/offboarding" element={<Offboarding />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;