const prisma = require('../prisma');

const getAll = async (req, res) => {
  try {
    const records = await prisma.offboarding.findMany({
      include: {
        employee: { select: { firstName: true, lastName: true, department: true, position: true } }
      }
    });
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const create = async (req, res) => {
  const data = req.body;
  try {
    const record = await prisma.offboarding.create({
      data: {
        employeeId: data.employeeId,
        exitDate: new Date(data.exitDate),
        reason: data.reason,
        notes: data.notes || null
      }
    });

    await prisma.employee.update({
      where: { id: data.employeeId },
      data: { status: 'INACTIVE' }
    });

    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { getAll, create };