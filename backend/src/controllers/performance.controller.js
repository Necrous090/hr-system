const prisma = require('../prisma');

const getAll = async (req, res) => {
  try {
    const evaluations = await prisma.performanceEvaluation.findMany({
      include: {
        employee: { select: { firstName: true, lastName: true } }
      }
    });
    res.json(evaluations);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const getByEmployee = async (req, res) => {
  try {
    const evaluations = await prisma.performanceEvaluation.findMany({
      where: { employeeId: parseInt(req.params.employeeId) }
    });
    res.json(evaluations);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const create = async (req, res) => {
  const data = req.body;
  try {
    if (Array.isArray(data)) {
      const evaluations = await prisma.performanceEvaluation.createMany({
        data: data.map(e => ({
          employeeId: e.employeeId,
          score: e.score,
          comments: e.comments || null,
          period: e.period
        }))
      });
      res.status(201).json(evaluations);
    } else {
      const evaluation = await prisma.performanceEvaluation.create({
        data: {
          employeeId: data.employeeId,
          score: data.score,
          comments: data.comments || null,
          period: data.period
        }
      });
      res.status(201).json(evaluation);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { getAll, getByEmployee, create };