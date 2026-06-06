const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { getAll, create, assignEmployee, updateProgress } = require('../controllers/training.controller');

router.get('/', auth, getAll);
router.post('/', auth, create);
router.post('/assign', auth, assignEmployee);
router.put('/:id/progress', auth, updateProgress);

module.exports = router;