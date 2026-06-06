import { useEffect, useState } from 'react';
import api from '../../services/api';

const Reports = () => {
  const [data, setData] = useState({
    employees: [],
    attendance: [],
    vacations: [],
    performance: [],
    offboarding: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [empRes, attRes, vacRes, perfRes, offRes] = await Promise.all([
          api.get('/employees'),
          api.get('/attendance'),
          api.get('/vacations'),
          api.get('/performance'),
          api.get('/offboarding')
        ]);
        setData({
          employees: empRes.data,
          attendance: attRes.data,
          vacations: vacRes.data,
          performance: perfRes.data,
          offboarding: offRes.data
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) return <p className="text-gray-500">Cargando...</p>;

  const active = data.employees.filter(e => e.status === 'ACTIVE').length;
  const inactive = data.employees.filter(e => e.status === 'INACTIVE').length;
  const rotacion = data.employees.length
    ? ((inactive / data.employees.length) * 100).toFixed(1)
    : 0;
  const avgScore = data.performance.length
    ? (data.performance.reduce((s, e) => s + e.score, 0) / data.performance.length).toFixed(1)
    : 0;
  const pendingVac = data.vacations.filter(v => v.status === 'PENDING').length;
  const approvedVac = data.vacations.filter(v => v.status === 'APPROVED').length;
  const presentDays = data.attendance.filter(a => a.status === 'PRESENT').length;
  const absentDays = data.attendance.filter(a => a.status === 'ABSENT').length;

  const deptCount = data.employees.reduce((acc, e) => {
    const dept = e.department?.name || 'Sin departamento';
    acc[dept] = (acc[dept] || 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Reportes y KPIs</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <p className="text-sm text-gray-500">Total Empleados</p>
          <p className="text-3xl font-bold text-gray-800">{data.employees.length}</p>
          <p className="text-xs text-gray-400 mt-1">Activos: {active} | Inactivos: {inactive}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
          <p className="text-sm text-gray-500">Rotación de Personal</p>
          <p className="text-3xl font-bold text-gray-800">{rotacion}%</p>
          <p className="text-xs text-gray-400 mt-1">{inactive} salidas registradas</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <p className="text-sm text-gray-500">Desempeño Promedio</p>
          <p className="text-3xl font-bold text-gray-800">{avgScore}/10</p>
          <p className="text-xs text-gray-400 mt-1">{data.performance.length} evaluaciones</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
          <p className="text-sm text-gray-500">Vacaciones Pendientes</p>
          <p className="text-3xl font-bold text-gray-800">{pendingVac}</p>
          <p className="text-xs text-gray-400 mt-1">Aprobadas: {approvedVac}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="font-bold text-gray-800 mb-4">Asistencia General</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Días Presentes</span>
              <span className="font-bold text-green-600">{presentDays}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Días Ausentes</span>
              <span className="font-bold text-red-600">{absentDays}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Tardanzas</span>
              <span className="font-bold text-yellow-600">
                {data.attendance.filter(a => a.status === 'LATE').length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Medio Día</span>
              <span className="font-bold text-blue-600">
                {data.attendance.filter(a => a.status === 'HALF_DAY').length}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="font-bold text-gray-800 mb-4">Empleados por Departamento</h2>
          <div className="space-y-3">
            {Object.entries(deptCount).map(([dept, count]) => (
              <div key={dept} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{dept}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(count / data.employees.length) * 100}%` }}
                    />
                  </div>
                  <span className="font-bold text-gray-800 text-sm w-4">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;