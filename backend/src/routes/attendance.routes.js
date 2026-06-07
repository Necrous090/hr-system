const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { getAll, getByEmployee, create, update } = require('../controllers/attendance.controller');

router.get('/', getAll);
router.get('/employee/:employeeId',getByEmployee);
router.post('/', create);
router.put('/:id', update);

module.exports = router;