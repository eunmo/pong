const { dml } = require('@eunmo/mysql');

function addGame(l, r, lp, rp, d) {
  return dml('INSERT INTO game (l, r, lp, rp, d) VALUES (?)', [
    [l, r, lp, rp, d],
  ]);
}

function editGame(id, l, r, lp, rp, d) {
  const sql = `\
UPDATE game
SET l = ?, r = ?, lp = ?, rp = ?, d = ?
WHERE id = ?`;
  return dml(sql, [l, r, lp, rp, d, id]);
}

function removeGame(id) {
  return dml('DELETE FROM game WHERE id = ?', [id]);
}

function updatePersonRating(id, rating) {
  return dml('UPDATE person SET rating = ? WHERE id = ?', [rating, id]);
}

module.exports = { addGame, editGame, removeGame, updatePersonRating };
