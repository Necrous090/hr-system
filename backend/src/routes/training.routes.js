const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { getAll, create, assignEmployee, updateProgress } = require('../controllers/training.controller');

router.get('/', getAll);
router.post('/', create);
router.post('/assign', assignEmployee);
router.put('/:id/progress', updateProgress);

module.exports = router;