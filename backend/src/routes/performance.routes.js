const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { getAll, getByEmployee, create } = require('../controllers/performance.controller');

router.get('/', getAll);
router.get('/employee/:employeeId', getByEmployee);
router.post('/', create);

module.exports = router;