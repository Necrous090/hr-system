import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const menu = [
  { path: '/', label: 'Dashboard', icon: '📊' },
  { path: '/employees', label: 'Personal', icon: '👥' },
  { path: '/recruitment', label: 'Reclutamiento', icon: '📋' },
  { path: '/attendance', label: 'Asistencia', icon: '📅' },
  { path: '/vacations', label: 'Vacaciones', icon: '🏖️' },
  { path: '/training', label: 'Capacitaciones', icon: '📚' },
  { path: '/performance', label: 'Evaluaciones', icon: '⭐' },
  { path: '/offboarding', label: 'Salida', icon: '🚪' },
  { path: '/reports', label: 'Reportes', icon: '📈' },
];

const Sidebar = () => {
  const { user, logout } = useAuth();

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen flex flex-col">
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-lg font-bold">Sistema RRHH</h1>
        <p className="text-gray-400 text-sm mt-1">{user?.email}</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700'
              }`
            }
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-700">
        <button
          onClick={logout}
          className="w-full text-left text-gray-400 hover:text-white text-sm px-3 py-2 rounded hover:bg-gray-700"
        >
          🚪 Cerrar sesión
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;