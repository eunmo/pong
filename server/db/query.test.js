const {
  getGameDates,
  getGames,
  getGamesByDate,
  getGamesById,
  getGamesByPerson,
  getHistory,
  getPersons,
  getAllPersons,
} = require('./query');
const { prepare, cleanup } = require('./mock');

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

test('get games', async () => {
  const rows = await getGames();
  expect(rows.length).toBe(4);
});

test('get game by id', async () => {
  async function check(gid) {
    const rows = await getGamesById(gid);
    expect(rows.length).toBe(1);
    const [row] = rows;
    expect(row.id).toBe(gid);
  }

  await check(gid1);
});

test('get games by person', async () => {
  async function check(pid, gids) {
    const rows = await getGamesByPerson(pid);
    expect(rows.map(({ id }) => id).sort()).toStrictEqual(gids.sort());
  }

  await check(1, [gid1, gid2, gid3]);
  await check(2, [gid1, gid2, gid4]);
  await check(3, [gid3, gid4]);
});

test('get games by date', async () => {
  async function check(date, gids) {
    const rows = await getGamesByDate(date);
    expect(rows.map(({ id }) => id).sort()).toStrictEqual(gids.sort());
  }

  await check(date1, [gid1]);
  await check(date2, [gid2, gid3, gid4]);
});

test('get game dates', async () => {
  const rows = await getGameDates();
  expect(rows.map(({ date }) => date)).toStrictEqual([date2, date1]);
});

test('get history', async () => {
  async function check(pid1, pid2, gids) {
    const rows = await getHistory(pid1, pid2);
    expect(rows.map(({ id }) => id).sort()).toStrictEqual(gids.sort());
  }

  await check(1, 2, [gid1, gid2]);
  await check(2, 1, [gid1, gid2]);
  await check(1, 3, [gid3]);
  await check(3, 1, [gid3]);
  await check(2, 3, [gid4]);
  await check(3, 2, [gid4]);
});
