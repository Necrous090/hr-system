const prisma = require('../prisma');

const getAll = async (req, res) => {
  try {
    const vacations = await prisma.vacation.findMany({
      include: { employee: { select: { firstName: true, lastName: true } } }
    });
    res.json(vacations);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const getByEmployee = async (req, res) => {
  try {
    const vacations = await prisma.vacation.findMany({
      where: { employeeId: parseInt(req.params.employeeId) }
    });
    res.json(vacations);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const create = async (req, res) => {
  const data = req.body;
  try {
    if (Array.isArray(data)) {
      const vacations = await prisma.vacation.createMany({
        data: data.map(v => ({
          employeeId: v.employeeId,
          startDate: new Date(v.startDate),
          endDate: new Date(v.endDate),
          status: v.status || 'PENDING',
          notes: v.notes || null
        }))
      });
      res.status(201).json(vacations);
    } else {
      const vacation = await prisma.vacation.create({
        data: {
          employeeId: data.employeeId,
          startDate: new Date(data.startDate),
          endDate: new Date(data.endDate),
          status: data.status || 'PENDING',
          notes: data.notes || null
        }
      });
      res.status(201).json(vacation);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const updateStatus = async (req, res) => {
  try {
    const vacation = await prisma.vacation.update({
      where: { id: parseInt(req.params.id) },
      data: { status: req.body.status }
    });
    res.json(vacation);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { getAll, getByEmployee, create, updateStatus };