const prisma = require('../prisma');

const getAll = async (req, res) => {
  try {
    const employees = await prisma.employee.findMany({
      include: { department: true, position: true }
    });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const getById = async (req, res) => {
  try {
    const employee = await prisma.employee.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { department: true, position: true }
    });
    if (!employee) return res.status(404).json({ error: 'Empleado no encontrado' });
    res.json(employee);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const create = async (req, res) => {
  const data = req.body;
  try {
    if (Array.isArray(data)) {
      const employees = await prisma.employee.createMany({
        data: data.map(e => ({
          firstName: e.firstName,
          lastName: e.lastName,
          email: e.email,
          phone: e.phone,
          hireDate: new Date(e.hireDate),
          departmentId: e.departmentId,
          positionId: e.positionId
        })),
        skipDuplicates: true
      });
      res.status(201).json(employees);
    } else {
      const employee = await prisma.employee.create({
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          hireDate: new Date(data.hireDate),
          departmentId: data.departmentId,
          positionId: data.positionId
        }
      });
      res.status(201).json(employee);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const update = async (req, res) => {
  try {
    const employee = await prisma.employee.update({
      where: { id: parseInt(req.params.id) },
      data: req.body
    });
    res.json(employee);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const remove = async (req, res) => {
  try {
    await prisma.employee.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Empleado eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { getAll, getById, create, update, remove };