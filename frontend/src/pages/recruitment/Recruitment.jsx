import { useEffect, useState } from 'react';
import api from '../../services/api';

const candidateStatusLabel = {
  PENDING: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-700' },
  REVIEWED: { label: 'Revisado', color: 'bg-blue-100 text-blue-700' },
  INTERVIEWED: { label: 'Entrevistado', color: 'bg-purple-100 text-purple-700' },
  HIRED: { label: 'Contratado', color: 'bg-green-100 text-green-700' },
  REJECTED: { label: 'Rechazado', color: 'bg-red-100 text-red-700' }
};

const jobStatusLabel = {
  OPEN: { label: 'Abierta', color: 'bg-green-100 text-green-700' },
  CLOSED: { label: 'Cerrada', color: 'bg-red-100 text-red-700' },
  ON_HOLD: { label: 'En pausa', color: 'bg-yellow-100 text-yellow-700' }
};

const Recruitment = () => {
  const [jobs, setJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [tab, setTab] = useState('jobs');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, candidatesRes] = await Promise.all([
          api.get('/recruitment/jobs'),
          api.get('/recruitment/candidates')
        ]);
        setJobs(jobsRes.data);
        setCandidates(candidatesRes.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const updateCandidateStatus = async (id, status) => {
    try {
      await api.put(`/recruitment/candidates/${id}/status`, { status });
      setCandidates(prev =>
        prev.map(c => c.id === id ? { ...c, status } : c)
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Reclutamiento</h1>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setTab('jobs')}
          className={`px-4 py-2 rounded font-medium text-sm ${tab === 'jobs' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 shadow'}`}
        >
          Vacantes ({jobs.length})
        </button>
        <button
          onClick={() => setTab('candidates')}
          className={`px-4 py-2 rounded font-medium text-sm ${tab === 'candidates' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 shadow'}`}
        >
          Candidatos ({candidates.length})
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Cargando...</p>
      ) : tab === 'jobs' ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 text-left">Título</th>
                <th className="px-6 py-3 text-left">Descripción</th>
                <th className="px-6 py-3 text-left">Estado</th>
                <th className="px-6 py-3 text-left">Candidatos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {jobs.map(job => (
                <tr key={job.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">{job.title}</td>
                  <td className="px-6 py-4 text-gray-600">{job.description || '—'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${jobStatusLabel[job.status]?.color}`}>
                      {jobStatusLabel[job.status]?.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{job.candidates?.length || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 text-left">Nombre</th>
                <th className="px-6 py-3 text-left">Correo</th>
                <th className="px-6 py-3 text-left">Vacante</th>
                <th className="px-6 py-3 text-left">Estado</th>
                <th className="px-6 py-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {candidates.map(c => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">{c.firstName} {c.lastName}</td>
                  <td className="px-6 py-4 text-gray-600">{c.email}</td>
                  <td className="px-6 py-4 text-gray-600">{c.jobOpening?.title}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${candidateStatusLabel[c.status]?.color}`}>
                      {candidateStatusLabel[c.status]?.label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={c.status}
                      onChange={(e) => updateCandidateStatus(c.id, e.target.value)}
                      className="text-xs border border-gray-300 rounded px-2 py-1"
                    >
                      {Object.keys(candidateStatusLabel).map(s => (
                        <option key={s} value={s}>{candidateStatusLabel[s].label}</option>
                      ))}
                    </select>
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

export default Recruitment;