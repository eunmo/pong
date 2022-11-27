const { query } = require('@eunmo/mysql');

function getGames() {
  return query('SELECT * FROM game');
}

function getGamesById(id) {
  return query('SELECT * FROM game WHERE id = ?', [id]);
}

function getGamesByPerson(id) {
  return query('SELECT * FROM game WHERE l = ? OR r = ?', [id, id]);
}

function getGamesByDate(date) {
  return query('SELECT * FROM game WHERE date(time) = ?', [date]);
}

function getGameDates() {
  return query(
    'SELECT distinct(date(time)) as date FROM game ORDER BY date DESC'
  );
}

function getHistory(id1, id2) {
  return query(
    'SELECT * FROM game WHERE (l = ? AND r = ?) OR (l = ? AND r = ?)',
    [id1, id2, id2, id1]
  );
}

function getPersons(ids) {
  return query('SELECT * FROM person WHERE id in ?', ids);
}

module.exports = {
  getGameDates,
  getGames,
  getGamesByDate,
  getGamesById,
  getGamesByPerson,
  getHistory,
  getPersons,
};
