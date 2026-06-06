import { useEffect, useState } from 'react';
import api from '../../services/api';

const ScoreBadge = ({ score }) => {
  let color = 'bg-red-100 text-red-700';
  if (score >= 8) color = 'bg-green-100 text-green-700';
  else if (score >= 6) color = 'bg-yellow-100 text-yellow-700';
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-bold ${color}`}>
      {score}/10
    </span>
  );
};

const Performance = () => {
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvaluations = async () => {
      try {
        const res = await api.get('/performance');
        setEvaluations(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvaluations();
  }, []);

  const average = evaluations.length
    ? (evaluations.reduce((sum, e) => sum + e.score, 0) / evaluations.length).toFixed(1)
    : 0;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Evaluaciones de Desempeño</h1>
        <div className="bg-white rounded-lg shadow px-4 py-2 text-sm">
          Promedio general: <span className="font-bold text-blue-600">{average}/10</span>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500">Cargando...</p>
      ) : evaluations.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
          No hay evaluaciones registradas aún.
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 text-left">Empleado</th>
                <th className="px-6 py-3 text-left">Período</th>
                <th className="px-6 py-3 text-left">Puntuación</th>
                <th className="px-6 py-3 text-left">Comentarios</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {evaluations.map(e => (
                <tr key={e.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {e.employee?.firstName} {e.employee?.lastName}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{e.period}</td>
                  <td className="px-6 py-4">
                    <ScoreBadge score={e.score} />
                  </td>
                  <td className="px-6 py-4 text-gray-600">{e.comments || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Performance;