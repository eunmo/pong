const express = require('express');

const crud = require('./crud');
const game = require('./game');
const rank = require('./rank');

const router = express.Router();
router.use('/crud', crud);
router.use('/game', game);
router.use('/rank', rank);

module.exports = router;
