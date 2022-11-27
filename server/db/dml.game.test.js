const { dml, query, cleanup } = require('@eunmo/mysql');
const { addGame, editGame, editGames, removeGame } = require('./dml');

afterAll(async () => {
  await cleanup();
});

beforeEach(async () => {
  await dml('TRUNCATE TABLE game');
});

test('add one game', async () => {
  const [l, r, lp, rp, d] = [1, 2, 3, 4, 5];
  await addGame(l, r, lp, rp, d);
  const rows = await query('SELECT * FROM game');
  expect(rows.length).toBe(1);

  const [row] = rows;
  expect(row.l).toBe(l);
  expect(row.r).toBe(r);
  expect(row.lp).toBe(lp);
  expect(row.rp).toBe(rp);
  expect(row.d).toBe(d);
});

test('update one game', async () => {
  let [l, r, lp, rp] = [1, 2, 3, 4];
  const d = 10;
  await addGame(l, r, lp, rp, d);

  let rows = await query('SELECT * FROM game');
  expect(rows.length).toBe(1);

  let [row] = rows;
  expect(row.l).toBe(l);
  expect(row.r).toBe(r);
  expect(row.lp).toBe(lp);
  expect(row.rp).toBe(rp);
  expect(row.d).toBe(d);

  const { id } = row;
  [l, r, lp, rp] = [5, 6, 7, 8];
  await editGame(id, l, r, lp, rp);

  rows = await query('SELECT * FROM game WHERE id = ?', [id]);
  expect(rows.length).toBe(1);

  [row] = rows;
  expect(row.l).toBe(l);
  expect(row.r).toBe(r);
  expect(row.lp).toBe(lp);
  expect(row.rp).toBe(rp);
  expect(row.d).toBe(d);
});

test('update two games', async () => {
  const [l, r, lp, rp] = [1, 2, 3, 4];
  let d1 = 5;
  let d2 = 6;
  await addGame(l, r, lp, rp, d1);
  await addGame(l, r, lp, rp, d2);

  let rows = await query('SELECT * FROM game ORDER BY id');
  expect(rows.length).toBe(2);

  let [row1, row2] = rows;
  expect(row1.d).toBe(d1);
  expect(row2.d).toBe(d2);

  const { id: id1 } = row1;
  const { id: id2 } = row2;
  [d1, d2] = [7, 8];
  await editGames([
    [id1, d1],
    [id2, d2],
  ]);

  rows = await query('SELECT * FROM game ORDER BY id');
  expect(rows.length).toBe(2);

  [row1, row2] = rows;
  expect(row1.d).toBe(d1);
  expect(row2.d).toBe(d2);
});

test('delete one game', async () => {
  const [l, r, lp, rp, d] = [1, 2, 3, 4, 5];
  await addGame(l, r, lp, rp, d);

  let rows = await query('SELECT * FROM game');
  expect(rows.length).toBe(1);

  const [row] = rows;
  const { id } = row;

  await removeGame(id);

  rows = await query('SELECT * FROM game');
  expect(rows.length).toBe(0);
});
