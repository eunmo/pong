const express = require('express');
const { addGame, editGame, removeGame } = require('../db');

const router = express.Router();

router.post('/game', async (req, res) => {
  const { l, r, lp, rp } = req.body;

  await addGame(l, r, lp, rp);

  res.sendStatus(200);
});

router.put('/game', async (req, res) => {
  const { id, l, r, lp, rp } = req.body;

  await editGame(id, l, r, lp, rp);

  res.sendStatus(200);
});

router.delete('/game', async (req, res) => {
  const { id } = req.body;

  await removeGame(id);

  res.sendStatus(200);
});

module.exports = router;
