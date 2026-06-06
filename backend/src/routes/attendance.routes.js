const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { getAll, getByEmployee, create, update } = require('../controllers/attendance.controller');

router.get('/', auth, getAll);
router.get('/employee/:employeeId', auth, getByEmployee);
router.post('/', auth, create);
router.put('/:id', auth, update);

module.exports = router;