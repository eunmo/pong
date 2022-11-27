const { calculate, calculateDiff, writeHistory } = require('./utils');

test.each([
  [1400, 1400, 11, 0, 10],
  [1400, 1400, 11, 11, 0],
  [1400, 1400, 0, 11, -10],
  [1600, 1400, 11, 0, 5],
  [1600, 1400, 11, 11, -5],
  [1600, 1400, 0, 11, -15],
  [1400, 1400, 11, 0, 10], // game 1, 1 vs 2
  [1410, 1390, 11, 0, 9], // game 2, 1 vs 2
  [1419, 1400, 11, 0, 9], // game 3, 1 vs 3
  [1381, 1391, 11, 0, 10], // game 3, 2 vs 3
])('test calculate', (lr, rr, lp, rp, expected) => {
  const diff = calculateDiff(lr, rr, lp, rp);
  expect(diff).toBe(expected);
});

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
    const preset = {
      1: { id: 1, rating: leftRatingBefore },
      2: { id: 2, rating: rightRatingBefore },
    };
    const people = calculate(games, preset);

    expect(people[1].rating).toBe(leftRatingAfter);
    expect(people[2].rating).toBe(rightRatingAfter);
  }
);

test('write history', () => {
  const games = [
    { id: 1, l: 1, r: 2, lp: 11, rp: 6, d: 10 },
    { id: 2, l: 1, r: 2, lp: 11, rp: 7, d: 9 },
    { id: 3, l: 1, r: 3, lp: 11, rp: 8, d: 9 },
    { id: 4, l: 2, r: 3, lp: 11, rp: 9, d: 10 },
  ];
  const [gamesToUpdate, personsToUpdate] = writeHistory(games);
  expect(gamesToUpdate).toStrictEqual([]);
  expect(personsToUpdate).toStrictEqual([
    [1, 1428],
    [2, 1391],
    [3, 1381],
  ]);
});

test('write history, fix some errors', () => {
  const games = [
    { id: 1, l: 1, r: 2, lp: 11, rp: 6, d: 10 },
    { id: 2, l: 1, r: 2, lp: 11, rp: 7, d: 10 },
    { id: 3, l: 1, r: 3, lp: 11, rp: 8, d: 10 },
    { id: 4, l: 2, r: 3, lp: 11, rp: 9, d: 10 },
  ];
  const [gamesToUpdate, personsToUpdate] = writeHistory(games);
  expect(gamesToUpdate).toStrictEqual([
    [2, 9],
    [3, 9],
  ]);
  expect(personsToUpdate).toStrictEqual([
    [1, 1428],
    [2, 1391],
    [3, 1381],
  ]);
});
