const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { getAll, getByEmployee, create, updateStatus } = require('../controllers/vacation.controller');

router.get('/', auth, getAll);
router.get('/employee/:employeeId', auth, getByEmployee);
router.post('/', auth, create);
router.put('/:id/status', auth, updateStatus);

module.exports = router;