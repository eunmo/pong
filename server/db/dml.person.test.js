const { dml, query, cleanup } = require('@eunmo/mysql');
const { upsertPerson } = require('./dml');

afterAll(async () => {
  await cleanup();
});

beforeEach(async () => {
  await dml('TRUNCATE TABLE person');
});

test('upsert person', async () => {
  const [id, rating1, rating2] = [1, 1400, 1500];

  let rows = await query('SELECT * FROM person');
  expect(rows.length).toBe(0);

  await upsertPerson(id, rating1);

  rows = await query('SELECT * FROM person');
  expect(rows.length).toBe(1);

  let [row] = rows;
  expect(row.id).toBe(id);
  expect(row.rating).toBe(rating1);

  await upsertPerson(id, rating2);

  rows = await query('SELECT * FROM person');
  expect(rows.length).toBe(1);

  [row] = rows;
  expect(row.id).toBe(id);
  expect(row.rating).toBe(rating2);
});
