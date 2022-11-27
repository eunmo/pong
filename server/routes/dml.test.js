const { dml, query, cleanup } = require('@eunmo/mysql');
const request = require('supertest');
const app = require('../app');
const { prepare } = require('../db/mock');

afterAll(async () => {
  await cleanup();
});

beforeEach(async () => {
  await dml('TRUNCATE TABLE game');
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

  const rows = await query('SELECT * FROM game');
  expect(rows.length).toBe(1);

  const [row] = rows;
  expect(row.l).toBe(l);
  expect(row.r).toBe(r);
  expect(row.lp).toBe(lp);
  expect(row.rp).toBe(rp);
  expect(row.d).toBe(10);
});

test('update game', async () => {
  const { gid1 } = await prepare();

  const [l, r, lp, rp] = [10, 20, 1, 11];
  await put('game', { id: gid1, l, r, lp, rp });

  const rows = await query('SELECT * FROM game WHERE id = ?', [gid1]);
  expect(rows.length).toBe(1);

  const [row] = rows;
  expect(row.l).toBe(l);
  expect(row.r).toBe(r);
  expect(row.lp).toBe(lp);
  expect(row.rp).toBe(rp);
  expect(row.d).toBe(10);
});

test('delete game', async () => {
  const { gid1 } = await prepare();

  await del('game', { id: gid1 });

  const rows = await query('SELECT * FROM game WHERE id = ?', [gid1]);
  expect(rows.length).toBe(0);
});
