const { dml } = require('@eunmo/mysql');

function addGame(l, r, lp, rp) {
  return dml('INSERT INTO game (l, r, lp, rp) VALUES (?)', [[l, r, lp, rp]]);
}

function editGame(id, l, r, lp, rp) {
  const sql = 'UPDATE game SET l = ?, r = ?, lp = ?, rp = ? WHERE id = ?';
  return dml(sql, [l, r, lp, rp, id]);
}

function removeGame(id) {
  return dml('DELETE FROM game WHERE id = ?', [id]);
}

module.exports = { addGame, editGame, removeGame };
