const express = require('express');
const {
  addGame,
  editGame,
  editGames,
  removeGame,
  getGames,
  getPersons,
  upsertPersons,
  removePersonsNotIn,
} = require('../db');
const { calculateDiff, writeHistory } = require('./utils');

const router = express.Router();

async function getPersonRatingMap(ids) {
  const persons = await getPersons(ids);
  const personsMap = Object.fromEntries(
    persons.map(({ id, rating }) => [id, rating])
  );
  return ids.map((id) => personsMap[id] ?? 1400);
}

router.post('/game', async (req, res) => {
  const { l, r, lp, rp } = req.body;

  const [lr, rr] = await getPersonRatingMap([l, r]);
  const d = calculateDiff(lr, rr, lp, rp);
  await addGame(l, r, lp, rp, d);
  await upsertPersons([
    [l, lr + d],
    [r, rr - d],
  ]);

  res.sendStatus(200);
});

async function restoreHistory() {
  const games = await getGames();
  const [gamesToUpdate, personsToUpdate] = writeHistory(games);
  if (gamesToUpdate.length > 0) {
    await editGames(gamesToUpdate);
  }
  await removePersonsNotIn(personsToUpdate.map(([id]) => id));
  if (personsToUpdate.length > 0) {
    await upsertPersons(personsToUpdate);
  }
}

router.put('/game', async (req, res) => {
  const { id, l, r, lp, rp } = req.body;

  await editGame(id, l, r, lp, rp, 0);
  await restoreHistory();

  res.sendStatus(200);
});

router.delete('/game', async (req, res) => {
  const { id } = req.body;

  await removeGame(id);
  await restoreHistory();

  res.sendStatus(200);
});

module.exports = router;
