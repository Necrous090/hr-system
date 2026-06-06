const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const {
  getAllJobs, createJob, updateJobStatus,
  getAllCandidates, createCandidate, updateCandidateStatus
} = require('../controllers/recruitment.controller');

router.get('/jobs', auth, getAllJobs);
router.post('/jobs', auth, createJob);
router.put('/jobs/:id/status', auth, updateJobStatus);

router.get('/candidates', auth, getAllCandidates);
router.post('/candidates', auth, createCandidate);
router.put('/candidates/:id/status', auth, updateCandidateStatus);

module.exports = router;