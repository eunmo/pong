const { dml } = require('@eunmo/mysql');

function addGame(l, r, lp, rp, d) {
  return dml('INSERT INTO game (l, r, lp, rp, d) VALUES (?)', [
    [l, r, lp, rp, d],
  ]);
}

function editGame(id, l, r, lp, rp) {
  return dml('UPDATE game SET l = ?, r = ?, lp = ?, rp = ? WHERE id = ?', [
    l,
    r,
    lp,
    rp,
    id,
  ]);
}

function editGames(games) {
  const caseClause = games.map(([id, d]) => `WHEN ${id} THEN ${d}`).join(' ');
  const statement = `UPDATE game SET d = (CASE id ${caseClause} END) WHERE id in (?)`;
  const ids = games.map(([id]) => id);
  return dml(statement, [ids]);
}

function removeGame(id) {
  return dml('DELETE FROM game WHERE id = ?', [id]);
}

function upsertPersons(persons) {
  return dml(
    'INSERT INTO person (id, rating) VALUES ? ON DUPLICATE KEY UPDATE rating = VALUES(rating)',
    [persons]
  );
}

function removePersonsNotIn(ids) {
  return dml('DELETE FROM person WHERE id NOT IN (?)', [ids]);
}

module.exports = {
  addGame,
  editGame,
  editGames,
  removeGame,
  upsertPersons,
  removePersonsNotIn,
};
