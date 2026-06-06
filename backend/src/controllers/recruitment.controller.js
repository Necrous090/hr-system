const prisma = require('../prisma');

// Job Openings
const getAllJobs = async (req, res) => {
  try {
    const jobs = await prisma.jobOpening.findMany({
      include: { candidates: true }
    });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const createJob = async (req, res) => {
  const data = req.body;
  try {
    if (Array.isArray(data)) {
      const jobs = await prisma.jobOpening.createMany({
        data: data.map(j => ({
          title: j.title,
          description: j.description || null,
          status: j.status || 'OPEN'
        }))
      });
      res.status(201).json(jobs);
    } else {
      const job = await prisma.jobOpening.create({
        data: {
          title: data.title,
          description: data.description || null,
          status: data.status || 'OPEN'
        }
      });
      res.status(201).json(job);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const updateJobStatus = async (req, res) => {
  try {
    const job = await prisma.jobOpening.update({
      where: { id: parseInt(req.params.id) },
      data: { status: req.body.status }
    });
    res.json(job);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Candidates
const getAllCandidates = async (req, res) => {
  try {
    const candidates = await prisma.candidate.findMany({
      include: { jobOpening: { select: { title: true } } }
    });
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const createCandidate = async (req, res) => {
  const data = req.body;
  try {
    if (Array.isArray(data)) {
      const candidates = await prisma.candidate.createMany({
        data: data.map(c => ({
          firstName: c.firstName,
          lastName: c.lastName,
          email: c.email,
          phone: c.phone || null,
          resumeUrl: c.resumeUrl || null,
          status: c.status || 'PENDING',
          jobOpeningId: c.jobOpeningId
        }))
      });
      res.status(201).json(candidates);
    } else {
      const candidate = await prisma.candidate.create({
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone || null,
          resumeUrl: data.resumeUrl || null,
          status: data.status || 'PENDING',
          jobOpeningId: data.jobOpeningId
        }
      });
      res.status(201).json(candidate);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const updateCandidateStatus = async (req, res) => {
  try {
    const candidate = await prisma.candidate.update({
      where: { id: parseInt(req.params.id) },
      data: { status: req.body.status }
    });
    res.json(candidate);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { getAllJobs, createJob, updateJobStatus, getAllCandidates, createCandidate, updateCandidateStatus };