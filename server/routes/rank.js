const express = require('express');
const { getGames } = require('../db');
const { calculate } = require('./utils');

const router = express.Router();

router.get('', async (req, res) => {
  const games = await getGames();
  const people = calculate(games, {});
  res.json({ ratings: Object.values(people) });
});

module.exports = router;
