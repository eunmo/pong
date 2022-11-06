const request = require('supertest');
const { prepare, cleanup } = require('../db/mock');
const app = require('../app');

afterAll(async () => {
  await cleanup();
});

let gid1;
let gid2;
let gid3;
let gid4;
let date1;
let date2;

beforeAll(async () => {
  ({ gid1, gid2, gid3, gid4, date1, date2 } = await prepare());
});

async function get(url) {
  const { body, statusCode } = await request(app).get(url);
  expect(statusCode).toBe(200);
  return body;
}

test('get game by id', async () => {
  const body = await get(`/api/game/id/${gid1}`);
  expect(body.id).toBe(gid1);
});

test('get game by id', async () => {
  const body = await get(`/api/game/id/-1`);
  expect(body).toBe(null);
});

test('get game dates', async () => {
  const body = await get('/api/game/dates/');
  expect(body.length).toBe(2);
  expect(body.map(({ date }) => new Date(date))).toStrictEqual([date2, date1]);
});

test('get games by date', async () => {
  async function check(date, gids) {
    const dateString = date.toISOString().substring(0, 10);
    const { games } = await get(`/api/game/date/${dateString}`);
    expect(games.length).toBe(gids.length);
    expect(games.map(({ id }) => id).sort()).toStrictEqual(gids.sort());
  }

  await check(date1, [gid1]);
  await check(date2, [gid2, gid3, gid4]);
});

test('get games by pid', async () => {
  async function check(pid, gids) {
    const { games } = await get(`/api/game/person/${pid}`);
    expect(games.length).toBe(gids.length);
    expect(games.map(({ id }) => id).sort()).toStrictEqual(gids.sort());
  }

  await check(1, [gid1, gid2, gid3]);
  await check(2, [gid1, gid2, gid4]);
  await check(3, [gid3, gid4]);
});

test('get history', async () => {
  async function check(pid1, pid2, gids) {
    const { games } = await get(`/api/game/history/${pid1}/${pid2}`);
    expect(games.length).toBe(gids.length);
    expect(games.map(({ id }) => id).sort()).toStrictEqual(gids.sort());
  }

  await check(1, 2, [gid1, gid2]);
  await check(2, 1, [gid1, gid2]);
  await check(1, 3, [gid3]);
  await check(3, 1, [gid3]);
  await check(2, 3, [gid4]);
  await check(3, 2, [gid4]);
});
