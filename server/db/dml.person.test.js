const { dml, query, cleanup } = require('@eunmo/mysql');
const { upsertPersons, removePersonsNotIn } = require('./dml');

afterAll(async () => {
  await cleanup();
});

beforeEach(async () => {
  await dml('TRUNCATE TABLE person');
});

test('upsert one person', async () => {
  const [id, rating1, rating2] = [1, 1400, 1500];

  let rows = await query('SELECT * FROM person');
  expect(rows.length).toBe(0);

  await upsertPersons([[id, rating1]]);

  rows = await query('SELECT * FROM person');
  expect(rows.length).toBe(1);

  let [row] = rows;
  expect(row.id).toBe(id);
  expect(row.rating).toBe(rating1);

  await upsertPersons([[id, rating2]]);

  rows = await query('SELECT * FROM person');
  expect(rows.length).toBe(1);

  [row] = rows;
  expect(row.id).toBe(id);
  expect(row.rating).toBe(rating2);
});

test('upsert two persons', async () => {
  const [id1, rating1, id2, rating2] = [1, 1400, 2, 1500];

  let rows = await query('SELECT * FROM person');
  expect(rows.length).toBe(0);

  await upsertPersons([
    [id1, rating1],
    [id2, rating2],
  ]);

  rows = await query('SELECT * FROM person ORDER BY id');
  expect(rows.length).toBe(2);

  const [row1, row2] = rows;
  expect(row1.id).toBe(id1);
  expect(row1.rating).toBe(rating1);
  expect(row2.id).toBe(id2);
  expect(row2.rating).toBe(rating2);
});

test('remove persons not in', async () => {
  const [id1, rating1, id2, rating2] = [1, 1400, 2, 1500];

  let rows = await query('SELECT * FROM person');
  expect(rows.length).toBe(0);

  await upsertPersons([
    [id1, rating1],
    [id2, rating2],
  ]);

  rows = await query('SELECT * FROM person ORDER BY id');
  expect(rows.length).toBe(2);

  await removePersonsNotIn([id2]);

  rows = await query('SELECT * FROM person ORDER BY id');
  expect(rows.length).toBe(1);

  const [row] = rows;
  expect(row.id).toBe(id2);
  expect(row.rating).toBe(rating2);
});
