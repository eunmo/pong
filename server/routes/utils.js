const defaultRank = { rating: 1400 };

function calculate(games, people) {
  games.forEach(({ l, r, lp, rp }) => {
    const left = people[l] ?? { id: l, ...defaultRank };
    const right = people[r] ?? { id: r, ...defaultRank };
    let { rating: lr } = left;
    let { rating: rr } = right;

    const exponent = (rr - lr) / 400;
    const wel = 1 / (10 ** exponent + 1);
    const wer = 1 - wel;

    let [wl, wr] = [0.5, 0.5];

    if (lp > rp) {
      [wl, wr] = [1.0, 0.0];
    } else if (lp < rp) {
      [wl, wr] = [0.0, 1.0];
    }

    const k = 20;
    lr += k * (wl - wel);
    rr += k * (wr - wer);

    left.rating = Math.round(lr);
    right.rating = Math.round(rr);
    people[l] = left;
    people[r] = right;
  });

  return people;
}

module.exports = { calculate };
