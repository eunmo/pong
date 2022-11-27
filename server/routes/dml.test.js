const { dml, query, cleanup } = require('@eunmo/mysql');
const request = require('supertest');
const app = require('../app');
const { prepare } = require('../db/mock');

afterAll(async () => {
  await cleanup();
});

beforeEach(async () => {
  await dml('TRUNCATE TABLE game');
  await dml('TRUNCATE TABLE person');
});

const baseUrl = '/api/crud';

async function del(url, body) {
  const { statusCode } = await request(app)
    .delete(`${baseUrl}/${url}`)
    .send(body);
  expect(statusCode).toBe(200);
}

async function post(url, body) {
  const { statusCode } = await request(app)
    .post(`${baseUrl}/${url}`)
    .send(body);
  expect(statusCode).toBe(200);
}

async function put(url, body) {
  const { statusCode } = await request(app).put(`${baseUrl}/${url}`).send(body);
  expect(statusCode).toBe(200);
}

test('create game', async () => {
  const [l, r, lp, rp] = [1, 2, 11, 6];
  await post('game', { l, r, lp, rp });

  let rows = await query('SELECT * FROM game');
  expect(rows.length).toBe(1);

  const [row] = rows;
  expect(row.l).toBe(l);
  expect(row.r).toBe(r);
  expect(row.lp).toBe(lp);
  expect(row.rp).toBe(rp);
  expect(row.d).toBe(10);

  rows = await query('SELECT * FROM person ORDER BY id');
  expect(rows.length).toBe(2);
  const [row1, row2] = rows;
  expect(row1.id).toBe(1);
  expect(row1.rating).toBe(1410);
  expect(row2.id).toBe(2);
  expect(row2.rating).toBe(1390);
});

test('update game', async () => {
  const { gid1 } = await prepare();

  const [l, r, lp, rp] = [10, 20, 1, 11];
  await put('game', { id: gid1, l, r, lp, rp });

  let rows = await query('SELECT * FROM game WHERE id = ?', [gid1]);
  expect(rows.length).toBe(1);

  const [row] = rows;
  expect(row.l).toBe(l);
  expect(row.r).toBe(r);
  expect(row.lp).toBe(lp);
  expect(row.rp).toBe(rp);
  expect(row.d).toBe(-10);

  rows = await query('SELECT * FROM person ORDER BY id');
  expect(rows.length).toBe(5);
  const [row1, row2, row3, row4, row5] = rows;
  expect(row1.id).toBe(1);
  expect(row1.rating).toBe(1420);
  expect(row2.id).toBe(2);
  expect(row2.rating).toBe(1400);
  expect(row3.id).toBe(3);
  expect(row3.rating).toBe(1380);
  expect(row4.id).toBe(10);
  expect(row4.rating).toBe(1390);
  expect(row5.id).toBe(20);
  expect(row5.rating).toBe(1410);
});

test('delete game 1', async () => {
  const { gid1 } = await prepare();

  await del('game', { id: gid1 });

  let rows = await query('SELECT * FROM game WHERE id = ?', [gid1]);
  expect(rows.length).toBe(0);

  rows = await query('SELECT * FROM person ORDER BY id');
  expect(rows.length).toBe(3);
  const [row1, row2, row3] = rows;
  expect(row1.id).toBe(1);
  expect(row1.rating).toBe(1420);
  expect(row2.id).toBe(2);
  expect(row2.rating).toBe(1400);
  expect(row3.id).toBe(3);
  expect(row3.rating).toBe(1380);
});

test('delete game 3+4', async () => {
  const { gid3, gid4 } = await prepare();

  await del('game', { id: gid3 });
  await del('game', { id: gid4 });

  let rows = await query('SELECT * FROM game WHERE id in (?)', [[gid3, gid4]]);
  expect(rows.length).toBe(0);

  rows = await query('SELECT * FROM person ORDER BY id');
  expect(rows.length).toBe(2);
  const [row1, row2] = rows;
  expect(row1.id).toBe(1);
  expect(row1.rating).toBe(1419);
  expect(row2.id).toBe(2);
  expect(row2.rating).toBe(1381);
});

test('update game 3+4', async () => {
  const { gid3, gid4 } = await prepare();

  await put('game', { id: gid3, l: 1, r: 4, lp: 11, rp: 8 });
  await put('game', { id: gid4, l: 2, r: 4, lp: 11, rp: 9 });

  let rows = await query('SELECT * FROM game WHERE id in (?)', [[gid3, gid4]]);
  expect(rows.length).toBe(2);
  let [row1, row2, row3] = rows;
  expect(row1.l).toBe(1);
  expect(row1.r).toBe(4);
  expect(row1.lp).toBe(11);
  expect(row1.rp).toBe(8);
  expect(row1.d).toBe(9);
  expect(row2.l).toBe(2);
  expect(row2.r).toBe(4);
  expect(row2.lp).toBe(11);
  expect(row2.rp).toBe(9);
  expect(row2.d).toBe(10);

  rows = await query('SELECT * FROM person ORDER BY id');
  expect(rows.length).toBe(3);
  [row1, row2, row3] = rows;
  expect(row1.id).toBe(1);
  expect(row1.rating).toBe(1428);
  expect(row2.id).toBe(2);
  expect(row2.rating).toBe(1391);
  expect(row3.id).toBe(4);
  expect(row3.rating).toBe(1381);
});
