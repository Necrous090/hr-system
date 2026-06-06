const prisma = require('../prisma');

const getAll = async (req, res) => {
  try {
    const departments = await prisma.department.findMany();
    res.json(departments);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const create = async (req, res) => {
  const data = req.body;

  try {
    if (Array.isArray(data)) {
      const departments = await prisma.department.createMany({
        data: data.map(d => ({ name: d.name })),
        skipDuplicates: true
      });
      res.status(201).json(departments);
    } else {
      const department = await prisma.department.create({ data: { name: data.name } });
      res.status(201).json(department);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { getAll, create };