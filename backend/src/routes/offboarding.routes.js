const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { getAll, create } = require('../controllers/offboarding.controller');

router.get('/', auth, getAll);
router.post('/', auth, create);

module.exports = router;