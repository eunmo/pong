const { dml, query, cleanup } = require('@eunmo/mysql');
const { addGame, editGame, removeGame } = require('./dml');

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
  let [l, r, lp, rp, d] = [1, 2, 3, 4, 5];
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
  [l, r, lp, rp, d] = [6, 7, 8, 9, 10];
  await editGame(id, l, r, lp, rp, d);

  rows = await query('SELECT * FROM game WHERE id = ?', [id]);
  expect(rows.length).toBe(1);

  [row] = rows;
  expect(row.l).toBe(l);
  expect(row.r).toBe(r);
  expect(row.lp).toBe(lp);
  expect(row.rp).toBe(rp);
  expect(row.d).toBe(d);
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
