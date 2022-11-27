const defaultRank = { rating: 1400 };
const K = 20;

function calculateDiff(lr, rr, lp, rp) {
  const exponent = (rr - lr) / 400;
  const we = 1 / (10 ** exponent + 1);

  let w = 0.5;

  if (lp > rp) {
    w = 1.0;
  } else if (lp < rp) {
    w = 0.0;
  }

  return Math.round(K * (w - we));
}

function writeHistory(games) {
  const people = {};
  const gamesToUpdate = games
    .map(({ id, l, r, lp, rp, d }) => {
      const left = people[l] ?? { id: l, ...defaultRank };
      const right = people[r] ?? { id: r, ...defaultRank };
      const { rating: lr } = left;
      const { rating: rr } = right;

      const diff = calculateDiff(lr, rr, lp, rp);

      left.rating = lr + diff;
      right.rating = rr - diff;
      people[l] = left;
      people[r] = right;

      return { id, d, diff };
    })
    .filter(({ d, diff }) => d !== diff)
    .map(({ id, diff }) => [id, diff]);
  const personsToUpdate = Object.values(people).map(({ id, rating }) => [
    id,
    rating,
  ]);

  return [gamesToUpdate, personsToUpdate];
}

module.exports = { calculateDiff, writeHistory };
