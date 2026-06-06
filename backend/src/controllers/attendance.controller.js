const prisma = require('../prisma');

const getAll = async (req, res) => {
  try {
    const records = await prisma.attendance.findMany({
      include: { employee: { select: { firstName: true, lastName: true } } }
    });
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const getByEmployee = async (req, res) => {
  try {
    const records = await prisma.attendance.findMany({
      where: { employeeId: parseInt(req.params.employeeId) }
    });
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const create = async (req, res) => {
  const data = req.body;
  try {
    if (Array.isArray(data)) {
      const records = await prisma.attendance.createMany({
        data: data.map(a => ({
          employeeId: a.employeeId,
          date: new Date(a.date),
          status: a.status,
          notes: a.notes || null
        }))
      });
      res.status(201).json(records);
    } else {
      const record = await prisma.attendance.create({
        data: {
          employeeId: data.employeeId,
          date: new Date(data.date),
          status: data.status,
          notes: data.notes || null
        }
      });
      res.status(201).json(record);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const update = async (req, res) => {
  try {
    const record = await prisma.attendance.update({
      where: { id: parseInt(req.params.id) },
      data: req.body
    });
    res.json(record);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { getAll, getByEmployee, create, update };