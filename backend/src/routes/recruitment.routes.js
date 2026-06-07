const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const {
  getAllJobs, createJob, updateJobStatus,
  getAllCandidates, createCandidate, updateCandidateStatus
} = require('../controllers/recruitment.controller');

router.get('/jobs', getAllJobs);
router.post('/jobs', createJob);
router.put('/jobs/:id/status', updateJobStatus);

router.get('/candidates', getAllCandidates);
router.post('/candidates', createCandidate);
router.put('/candidates/:id/status', updateCandidateStatus);

module.exports = router;