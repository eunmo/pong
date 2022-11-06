const { dml, query, cleanup } = require('@eunmo/mysql');
const { addGame, editGame, removeGame } = require('./dml');

afterAll(async () => {
  await cleanup();
});

beforeEach(async () => {
  await dml('TRUNCATE TABLE game');
});

test('add one game', async () => {
  const [l, r, lp, rp] = [1, 2, 3, 4];
  await addGame(l, r, lp, rp);
  const rows = await query('SELECT * FROM game');
  expect(rows.length).toBe(1);

  const [row] = rows;
  expect(row.l).toBe(l);
  expect(row.r).toBe(r);
  expect(row.lp).toBe(lp);
  expect(row.rp).toBe(rp);
});

test('update one game', async () => {
  let [l, r, lp, rp] = [1, 2, 3, 4];
  await addGame(l, r, lp, rp);

  let rows = await query('SELECT * FROM game');
  expect(rows.length).toBe(1);

  let [row] = rows;
  expect(row.l).toBe(l);
  expect(row.r).toBe(r);
  expect(row.lp).toBe(lp);
  expect(row.rp).toBe(rp);

  const { id } = row;
  ([l, r, lp, rp] = [5, 6, 7, 8]);
  await editGame(id, l, r, lp, rp);

  rows = await query('SELECT * FROM game WHERE id = ?', [id]);
  expect(rows.length).toBe(1);

  ([row] = rows);
  expect(row.l).toBe(l);
  expect(row.r).toBe(r);
  expect(row.lp).toBe(lp);
  expect(row.rp).toBe(rp);
});

test('delete one game', async () => {
  const [l, r, lp, rp] = [1, 2, 3, 4];
  await addGame(l, r, lp, rp);

  let rows = await query('SELECT * FROM game');
  expect(rows.length).toBe(1);

  const [row] = rows;
  const { id } = row;

  await removeGame(id);

  rows = await query('SELECT * FROM game');
  expect(rows.length).toBe(0);
});
