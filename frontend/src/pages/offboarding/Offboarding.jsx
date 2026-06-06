import { useEffect, useState } from 'react';
import api from '../../services/api';

const Offboarding = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const res = await api.get('/offboarding');
        setRecords(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Salida de Personal</h1>
        <span className="text-sm text-gray-500">{records.length} registros</span>
      </div>

      {loading ? (
        <p className="text-gray-500">Cargando...</p>
      ) : records.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
          No hay registros de salida aún.
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 text-left">Empleado</th>
                <th className="px-6 py-3 text-left">Departamento</th>
                <th className="px-6 py-3 text-left">Posición</th>
                <th className="px-6 py-3 text-left">Fecha de Salida</th>
                <th className="px-6 py-3 text-left">Motivo</th>
                <th className="px-6 py-3 text-left">Notas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {records.map(r => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {r.employee?.firstName} {r.employee?.lastName}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {r.employee?.department?.name || '—'}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {r.employee?.position?.title || '—'}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(r.exitDate).toLocaleDateString('es-PA')}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{r.reason}</td>
                  <td className="px-6 py-4 text-gray-600">{r.notes || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Offboarding;