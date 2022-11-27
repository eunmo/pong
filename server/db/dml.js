const { dml } = require('@eunmo/mysql');

function addGame(l, r, lp, rp, d) {
  return dml('INSERT INTO game (l, r, lp, rp, d) VALUES (?)', [
    [l, r, lp, rp, d],
  ]);
}

function editGame(id, l, r, lp, rp, d) {
  return dml(
    'UPDATE game SET l = ?, r = ?, lp = ?, rp = ?, d = ? WHERE id = ?',
    [l, r, lp, rp, d, id]
  );
}

function removeGame(id) {
  return dml('DELETE FROM game WHERE id = ?', [id]);
}

function upsertPerson(id, rating) {
  return dml(
    'INSERT INTO person (id, rating) VALUES (?, ?) ON DUPLICATE KEY UPDATE rating = ?',
    [id, rating, rating]
  );
}

module.exports = { addGame, editGame, removeGame, upsertPerson };
