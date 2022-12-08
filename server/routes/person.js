const express = require('express');

const { getGamesByPerson, getPersons } = require('../db');

const router = express.Router();

router.get('/summary/:pid', async (req, res) => {
  const { pid } = req.params;
  const games = await getGamesByPerson(pid);

  const id = Number(pid);
  const byOpponent = {};

  games
    .map(({ l, r, lp, rp, d }) =>
      r === id ? { r: l, lp: rp, rp: lp, d: -d } : { r, lp, rp, d }
    )
    .forEach(({ r, lp, rp, d }) => {
      const opponent = byOpponent[r] ?? { id: r, count: 0, wins: 0, diff: 0 };

      if (lp > rp) {
        opponent.wins += 1;
      }

      opponent.count += 1;
      opponent.diff += d;
      byOpponent[r] = opponent;
    });

  const ids = [...Object.keys(byOpponent), id];
  const persons = await getPersons(ids);
  const ratingsMap = Object.fromEntries(
    persons.map(({ id: personId, rating }) => [personId, rating])
  );
  const opponents = Object.entries(byOpponent).map(
    ([opponentId, opponent]) => ({
      ...opponent,
      rating: ratingsMap[opponentId] ?? 1400,
    })
  );

  res.json({ opponents, rating: ratingsMap[id] ?? 1400 });
});

module.exports = router;
