import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

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
  const { user } = useAuth();
  const [stats, setStats] = useState({
    employees: 0,
    active: 0,
    vacations: 0,
    trainings: 0,
    jobs: 0,
    candidates: 0,
    absences: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const role = user?.role;

        if (role === 'ADMIN' || role === 'HR_MANAGER') {
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
        } else if (role === 'RECRUITER') {
          const [jobsRes, candidatesRes] = await Promise.all([
            api.get('/recruitment/jobs'),
            api.get('/recruitment/candidates')
          ]);
          setStats(prev => ({
            ...prev,
            jobs: jobsRes.data.filter(j => j.status === 'OPEN').length,
            candidates: candidatesRes.data.filter(c => c.status === 'PENDING').length
          }));
        } else if (role === 'SUPERVISOR') {
          const [empRes, attRes] = await Promise.all([
            api.get('/employees'),
            api.get('/attendance')
          ]);
          setStats(prev => ({
            ...prev,
            employees: empRes.data.length,
            absences: attRes.data.filter(a => a.status === 'ABSENT').length
          }));
        } else if (role === 'EMPLOYEE') {
          const [vacRes, trainRes] = await Promise.all([
            api.get('/vacations'),
            api.get('/training')
          ]);
          setStats(prev => ({
            ...prev,
            vacations: vacRes.data.filter(v => v.status === 'PENDING').length,
            trainings: trainRes.data.length
          }));
        }
      } catch (error) {
        console.error(error);
      }
    };
    if (user?.role) fetchStats();
  }, [user]);

  const renderKPIs = () => {
    const role = user?.role;

    if (role === 'ADMIN' || role === 'HR_MANAGER') {
      return (
        <>
          <StatCard title="Total Empleados" value={stats.employees} icon="👥" color="border-blue-500" />
          <StatCard title="Empleados Activos" value={stats.active} icon="✅" color="border-green-500" />
          <StatCard title="Vacaciones Pendientes" value={stats.vacations} icon="🏖️" color="border-yellow-500" />
          <StatCard title="Capacitaciones" value={stats.trainings} icon="📚" color="border-purple-500" />
        </>
      );
    }

    if (role === 'RECRUITER') {
      return (
        <>
          <StatCard title="Vacantes Activas" value={stats.jobs} icon="📋" color="border-cyan-500" />
          <StatCard title="Candidatos en Proceso" value={stats.candidates} icon="👤" color="border-blue-500" />
        </>
      );
    }

    if (role === 'SUPERVISOR') {
      return (
        <>
          <StatCard title="Empleados en Área" value={stats.employees} icon="👥" color="border-purple-500" />
          <StatCard title="Ausencias Hoy" value={stats.absences} icon="❌" color="border-red-500" />
        </>
      );
    }

    if (role === 'EMPLOYEE') {
      return (
        <>
          <StatCard title="Mis Vacaciones Pendientes" value={stats.vacations} icon="🏖️" color="border-yellow-500" />
          <StatCard title="Mis Capacitaciones" value={stats.trainings} icon="📚" color="border-purple-500" />
        </>
      );
    }

    return null;
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Dashboard</h1>
      <p className="text-gray-500 mb-6">Bienvenido, {user?.email}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {renderKPIs()}
      </div>
    </div>
  );
};

export default Dashboard;