const { dml, query, cleanup } = require('@eunmo/mysql');
const { addGame } = require('./dml');

async function prepare() {
  await dml('TRUNCATE TABLE game');

  const { insertId: gid1 } = await addGame(1, 2, 11, 6, 10);
  const { insertId: gid2 } = await addGame(1, 2, 11, 7, 10);
  const { insertId: gid3 } = await addGame(1, 3, 11, 8, 10);
  const { insertId: gid4 } = await addGame(2, 3, 11, 9, 10);

  await dml('UPDATE game SET time = "2022-03-31 21:01:02" WHERE id = ?', [
    gid1,
  ]);
  await dml('UPDATE game SET time = "2022-04-01 21:03:04" WHERE id = ?', [
    gid2,
  ]);
  await dml('UPDATE game SET time = "2022-04-01 21:05:06" WHERE id = ?', [
    gid3,
  ]);
  await dml('UPDATE game SET time = "2022-04-01 21:07:06" WHERE id = ?', [
    gid4,
  ]);

  const [{ gameDate: date1 }] = await query(
    'SELECT DATE(time) as gameDate FROM game WHERE id = ?',
    [gid1]
  );
  const [{ gameDate: date2 }] = await query(
    'SELECT DATE(time) as gameDate FROM game WHERE id = ?',
    [gid2]
  );

  return { gid1, gid2, gid3, gid4, date1, date2 };
}

module.exports = { prepare, cleanup };
