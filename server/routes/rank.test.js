const { dml, query, cleanup } = require('@eunmo/mysql');
const request = require('supertest');
const app = require('../app');

afterAll(async () => {
  await cleanup();
});

beforeAll(async () => {
  await dml('TRUNCATE TABLE person');
  await dml('INSERT INTO person VALUES (1, 1500), (2, 1400), (3, 1300)');
});

async function get(url) {
  const { body, statusCode } = await request(app).get(url);
  expect(statusCode).toBe(200);
  return body;
}

test('get rank', async () => {
  const ratings = await get('/api/rank');

  expect(ratings.length).toBe(3);

  const ratingMap = Object.fromEntries(
    ratings.map(({ id, rating }) => [id, rating])
  );
  expect(ratingMap[1]).toBe(1500);
  expect(ratingMap[2]).toBe(1400);
  expect(ratingMap[3]).toBe(1300);
});
