const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { getAll, getByEmployee, create, updateStatus } = require('../controllers/vacation.controller');

router.get('/', getAll);
router.get('/employee/:employeeId', getByEmployee);
router.post('/', create);
router.put('/:id/status', updateStatus);

module.exports = router;