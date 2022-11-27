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

function calculate(games, preset) {
  const people = { ...preset };

  games.forEach(({ l, r, lp, rp }) => {
    const left = people[l] ?? { id: l, ...defaultRank };
    const right = people[r] ?? { id: r, ...defaultRank };
    const { rating: lr } = left;
    const { rating: rr } = right;

    const d = calculateDiff(lr, rr, lp, rp);

    left.rating = lr + d;
    right.rating = rr - d;
    people[l] = left;
    people[r] = right;
  });

  return people;
}

module.exports = { calculate, calculateDiff };
