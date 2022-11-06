const { calculate } = require('./utils');

test.each([
  [1400, 1400, 11, 0, 1410, 1390],
  [1400, 1400, 11, 11, 1400, 1400],
  [1400, 1400, 0, 11, 1390, 1410],
  [1600, 1400, 11, 0, 1605, 1395],
  [1600, 1400, 11, 11, 1595, 1405],
  [1600, 1400, 0, 11, 1585, 1415],
  [1400, 1400, 11, 0, 1410, 1390], // game 1, 1 vs 2
  [1410, 1390, 11, 0, 1419, 1381], // game 2, 1 vs 2
  [1419, 1400, 11, 0, 1428, 1391], // game 3, 1 vs 3
  [1381, 1391, 11, 0, 1391, 1381], // game 3, 2 vs 3
])(
  'test calculate',
  (
    leftRatingBefore,
    rightRatingBefore,
    lp,
    rp,
    leftRatingAfter,
    rightRatingAfter
  ) => {
    const games = [{ l: 1, r: 2, lp, rp }];
    const people = {
      1: { id: 1, rating: leftRatingBefore },
      2: { id: 2, rating: rightRatingBefore },
    };
    calculate(games, people);

    expect(people[1].rating).toBe(leftRatingAfter);
    expect(people[2].rating).toBe(rightRatingAfter);
  }
);
