export const routePermissions = {
  '/': ['ADMIN', 'HR_MANAGER', 'RECRUITER', 'SUPERVISOR', 'EMPLOYEE'],
  '/employees': ['ADMIN', 'HR_MANAGER', 'SUPERVISOR'],
  '/recruitment': ['ADMIN', 'HR_MANAGER', 'RECRUITER'],
  '/attendance': ['ADMIN', 'HR_MANAGER', 'SUPERVISOR'],
  '/vacations': ['ADMIN', 'HR_MANAGER', 'SUPERVISOR', 'EMPLOYEE'],
  '/training': ['ADMIN', 'HR_MANAGER', 'EMPLOYEE'],
  '/performance': ['ADMIN', 'HR_MANAGER'],
  '/offboarding': ['ADMIN', 'HR_MANAGER'],
  '/reports': ['ADMIN', 'HR_MANAGER'],
  '/settings': ['ADMIN'],
};

export const roleLabels = {
  ADMIN: 'Administrador',
  HR_MANAGER: 'Gerente de RRHH',
  RECRUITER: 'Reclutador',
  SUPERVISOR: 'Supervisor',
  EMPLOYEE: 'Empleado',
};

export const rolePills = {
  ADMIN: 'bg-red-100 text-red-700',
  HR_MANAGER: 'bg-blue-100 text-blue-700',
  RECRUITER: 'bg-cyan-100 text-cyan-700',
  SUPERVISOR: 'bg-purple-100 text-purple-700',
  EMPLOYEE: 'bg-green-100 text-green-700',
};