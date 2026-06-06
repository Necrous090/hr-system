import { useEffect, useState } from 'react';
import api from '../../services/api';

const statusLabel = {
  PENDING: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-700' },
  APPROVED: { label: 'Aprobada', color: 'bg-green-100 text-green-700' },
  REJECTED: { label: 'Rechazada', color: 'bg-red-100 text-red-700' }
};

const Vacations = () => {
  const [vacations, setVacations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVacations = async () => {
      try {
        const res = await api.get('/vacations');
        setVacations(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchVacations();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/vacations/${id}/status`, { status });
      setVacations(prev =>
        prev.map(v => v.id === id ? { ...v, status } : v)
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Vacaciones</h1>
        <span className="text-sm text-gray-500">{vacations.length} solicitudes</span>
      </div>

      {loading ? (
        <p className="text-gray-500">Cargando...</p>
      ) : vacations.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
          No hay solicitudes de vacaciones aún.
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 text-left">Empleado</th>
                <th className="px-6 py-3 text-left">Inicio</th>
                <th className="px-6 py-3 text-left">Fin</th>
                <th className="px-6 py-3 text-left">Estado</th>
                <th className="px-6 py-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {vacations.map(v => (
                <tr key={v.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {v.employee?.firstName} {v.employee?.lastName}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(v.startDate).toLocaleDateString('es-PA')}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(v.endDate).toLocaleDateString('es-PA')}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusLabel[v.status]?.color}`}>
                      {statusLabel[v.status]?.label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {v.status === 'PENDING' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateStatus(v.id, 'APPROVED')}
                          className="text-xs bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                        >
                          Aprobar
                        </button>
                        <button
                          onClick={() => updateStatus(v.id, 'REJECTED')}
                          className="text-xs bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          Rechazar
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Vacations;