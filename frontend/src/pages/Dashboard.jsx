import { useEffect, useState } from 'react';
import api from '../services/api';

const StatCard = ({ title, value, icon, color }) => (
  <div className={`bg-white rounded-lg shadow p-6 border-l-4 ${color}`}>
    <div className="flex justify-between items-center">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
      </div>
      <span className="text-4xl">{icon}</span>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    employees: 0,
    active: 0,
    vacations: 0,
    trainings: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [empRes, vacRes, trainRes] = await Promise.all([
          api.get('/employees'),
          api.get('/vacations'),
          api.get('/training')
        ]);
        setStats({
          employees: empRes.data.length,
          active: empRes.data.filter(e => e.status === 'ACTIVE').length,
          vacations: vacRes.data.filter(v => v.status === 'PENDING').length,
          trainings: trainRes.data.length
        });
      } catch (error) {
        console.error(error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Empleados" value={stats.employees} icon="👥" color="border-blue-500" />
        <StatCard title="Empleados Activos" value={stats.active} icon="✅" color="border-green-500" />
        <StatCard title="Vacaciones Pendientes" value={stats.vacations} icon="🏖️" color="border-yellow-500" />
        <StatCard title="Capacitaciones" value={stats.trainings} icon="📚" color="border-purple-500" />
      </div>
    </div>
  );
};

export default Dashboard;