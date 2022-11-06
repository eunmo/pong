const express = require('express');

const { getGamesByPerson } = require('../db');

const router = express.Router();

router.get('/summary/:pid', async (req, res) => {
  const { pid } = req.params;
  const games = await getGamesByPerson(pid);

  const id = Number(pid);
  const byOpponent = {};

  games
    .map(({ l, r, lp, rp }) =>
      r === id ? { r: l, lp: rp, rp: lp } : { r, lp, rp }
    )
    .forEach(({ r, lp, rp }) => {
      const opponent = byOpponent[r] ?? { id: r, count: 0, wins: 0 };

      if (lp > rp) {
        opponent.wins += 1;
      }

      opponent.count += 1;
      byOpponent[r] = opponent;
    });

  res.json({ opponents: Object.values(byOpponent) });
});

module.exports = router;
