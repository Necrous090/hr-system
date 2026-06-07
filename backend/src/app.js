const express = require('express');
const cors = require('cors');
const { authMiddleware, requireRole } = require('./middlewares/auth');

const authRoutes = require('./routes/auth.routes');
const employeeRoutes = require('./routes/employee.routes');
const departmentRoutes = require('./routes/department.routes');
const positionRoutes = require('./routes/position.routes');
const attendanceRoutes = require('./routes/attendance.routes');
const vacationRoutes = require('./routes/vacation.routes');
const recruitmentRoutes = require('./routes/recruitment.routes');
const trainingRoutes = require('./routes/training.routes');
const performanceRoutes = require('./routes/performance.routes');
const offboardingRoutes = require('./routes/offboarding.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.use('/api/employees', authMiddleware, requireRole('ADMIN', 'HR_MANAGER', 'SUPERVISOR'), employeeRoutes);
app.use('/api/departments', authMiddleware, requireRole('ADMIN', 'HR_MANAGER'), departmentRoutes);
app.use('/api/positions', authMiddleware, requireRole('ADMIN', 'HR_MANAGER'), positionRoutes);
app.use('/api/attendance', authMiddleware, requireRole('ADMIN', 'HR_MANAGER', 'SUPERVISOR'), attendanceRoutes);
app.use('/api/vacations', authMiddleware, requireRole('ADMIN', 'HR_MANAGER', 'EMPLOYEE'), vacationRoutes);
app.use('/api/recruitment', authMiddleware, requireRole('ADMIN', 'HR_MANAGER', 'RECRUITER'), recruitmentRoutes);
app.use('/api/training', authMiddleware, requireRole('ADMIN', 'HR_MANAGER', 'EMPLOYEE'), trainingRoutes);
app.use('/api/performance', authMiddleware, requireRole('ADMIN', 'HR_MANAGER'), performanceRoutes);
app.use('/api/offboarding', authMiddleware, requireRole('ADMIN', 'HR_MANAGER'), offboardingRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'HR System API running' });
});

module.exports = app;