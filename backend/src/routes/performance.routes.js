const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { getAll, getByEmployee, create } = require('../controllers/performance.controller');

router.get('/', auth, getAll);
router.get('/employee/:employeeId', auth, getByEmployee);
router.post('/', auth, create);

module.exports = router;