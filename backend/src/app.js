const express = require('express');
const cors = require('cors');
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
app.use('/api/employees', employeeRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/positions', positionRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/vacations', vacationRoutes);
app.use('/api/recruitment', recruitmentRoutes);
app.use('/api/training', trainingRoutes);
app.use('/api/performance', performanceRoutes);
app.use('/api/offboarding', offboardingRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'HR System API running' });
});

module.exports = app;