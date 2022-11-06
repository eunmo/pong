const express = require('express');
const {
  getGameDates,
  getGamesByDate,
  getGamesById,
  getGamesByPerson,
  getHistory,
} = require('../db');

const router = express.Router();

router.get('/id/:id', async (req, res) => {
  const { id } = req.params;
  const games = await getGamesById(id);

  if (games.length === 0) {
    res.json(null);
  }

  const [game] = games;
  res.json(game);
});

router.get('/dates', async (req, res) => {
  const dates = await getGameDates();
  res.json(dates);
});

router.get('/date/:date', async (req, res) => {
  const { date } = req.params;
  const games = await getGamesByDate(date);
  res.json({ games });
});

router.get('/person/:pid', async (req, res) => {
  const { pid } = req.params;
  const games = await getGamesByPerson(pid);
  res.json({ games });
});

router.get('/history/:pid1/:pid2', async (req, res) => {
  const { pid1, pid2 } = req.params;
  const games = await getHistory(pid1, pid2);
  res.json({ games });
});

module.exports = router;
