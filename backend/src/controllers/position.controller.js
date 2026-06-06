const prisma = require('../prisma');

const getAll = async (req, res) => {
  try {
    const positions = await prisma.position.findMany({
      include: { department: true }
    });
    res.json(positions);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const create = async (req, res) => {
  const data = req.body;
  try {
    if (Array.isArray(data)) {
      const positions = await prisma.position.createMany({
        data: data.map(p => ({ title: p.title, departmentId: p.departmentId })),
        skipDuplicates: true
      });
      res.status(201).json(positions);
    } else {
      const position = await prisma.position.create({ data: { title: data.title, departmentId: data.departmentId } });
      res.status(201).json(position);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { getAll, create };