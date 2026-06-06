const prisma = require('../prisma');

const getAll = async (req, res) => {
  try {
    const trainings = await prisma.training.findMany({
      include: {
        employees: {
          include: {
            employee: { select: { firstName: true, lastName: true } }
          }
        }
      }
    });
    res.json(trainings);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const create = async (req, res) => {
  const data = req.body;
  try {
    if (Array.isArray(data)) {
      const trainings = await prisma.training.createMany({
        data: data.map(t => ({
          name: t.name,
          description: t.description || null,
          startDate: new Date(t.startDate),
          endDate: new Date(t.endDate)
        }))
      });
      res.status(201).json(trainings);
    } else {
      const training = await prisma.training.create({
        data: {
          name: data.name,
          description: data.description || null,
          startDate: new Date(data.startDate),
          endDate: new Date(data.endDate)
        }
      });
      res.status(201).json(training);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const assignEmployee = async (req, res) => {
  const { employeeId, trainingId, score } = req.body;
  try {
    const record = await prisma.employeeTraining.create({
      data: {
        employeeId,
        trainingId,
        score: score || null,
        completed: false
      }
    });
    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const updateProgress = async (req, res) => {
  try {
    const record = await prisma.employeeTraining.update({
      where: { id: parseInt(req.params.id) },
      data: {
        completed: req.body.completed,
        score: req.body.score || null
      }
    });
    res.json(record);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { getAll, create, assignEmployee, updateProgress };