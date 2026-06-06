import { useEffect, useState } from 'react';
import api from '../../services/api';

const Training = () => {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        const res = await api.get('/training');
        setTrainings(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrainings();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Capacitaciones</h1>
        <span className="text-sm text-gray-500">{trainings.length} programas</span>
      </div>

      {loading ? (
        <p className="text-gray-500">Cargando...</p>
      ) : trainings.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
          No hay capacitaciones registradas aún.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trainings.map(t => (
            <div key={t.id} className="bg-white rounded-lg shadow p-6">
              <h3 className="font-bold text-gray-800 text-lg mb-2">{t.name}</h3>
              {t.description && (
                <p className="text-gray-500 text-sm mb-4">{t.description}</p>
              )}
              <div className="text-sm text-gray-600 space-y-1">
                <p>📅 Inicio: {new Date(t.startDate).toLocaleDateString('es-PA')}</p>
                <p>📅 Fin: {new Date(t.endDate).toLocaleDateString('es-PA')}</p>
                <p>👥 Participantes: {t.employees?.length || 0}</p>
              </div>
              {t.employees?.length > 0 && (
                <div className="mt-4 border-t pt-4">
                  <p className="text-xs font-medium text-gray-500 uppercase mb-2">Participantes</p>
                  <div className="space-y-1">
                    {t.employees.map(e => (
                      <div key={e.id} className="flex justify-between text-sm">
                        <span className="text-gray-700">
                          {e.employee?.firstName} {e.employee?.lastName}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${e.completed ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {e.completed ? 'Completado' : 'En progreso'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Training;