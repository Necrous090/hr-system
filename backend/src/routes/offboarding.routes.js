const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { getAll, create } = require('../controllers/offboarding.controller');

router.get('/', getAll);
router.post('/', create);

module.exports = router;