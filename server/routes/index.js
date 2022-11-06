const express = require('express');

const crud = require('./crud');
const game = require('./game');

const router = express.Router();
router.use('/crud', crud);
router.use('/game', game);

module.exports = router;
