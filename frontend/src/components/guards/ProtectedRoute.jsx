import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { routePermissions } from '../../config/permissions';

const AccessDenied = () => {
  const navigate = window.history;
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      gap: '12px'
    }}>
      <div className="bg-white rounded-xl border border-gray-200 p-12 flex flex-col items-center gap-3 shadow">
        <span style={{ fontSize: '64px' }}>🔒</span>
        <h2 className="text-2xl font-bold text-gray-800">Acceso restringido</h2>
        <p className="text-gray-500 text-center">No tienes permisos para ver esta sección</p>
        <button
          onClick={() => navigate.back()}
          className="mt-4 px-4 py-2 border border-gray-300 rounded text-gray-600 hover:bg-gray-50"
        >
          Volver al Dashboard
        </button>
      </div>
    </div>
  );
};

const ProtectedRoute = ({ children, path }) => {
  const { token, user } = useAuth();
  const location = useLocation();

  if (!token) return <Navigate to="/login" state={{ from: location }} replace />;

  const currentPath = path || location.pathname;
  const allowed = routePermissions[currentPath];

  if (allowed && user?.role && !allowed.includes(user.role)) {
    return <AccessDenied />;
  }

  return children;
};

export default ProtectedRoute;