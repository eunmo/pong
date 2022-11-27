const {
  addGame,
  editGame,
  editGames,
  removeGame,
  upsertPersons,
  removePersonsNotIn,
} = require('./dml');
const {
  getGameDates,
  getGames,
  getGamesByDate,
  getGamesById,
  getGamesByPerson,
  getHistory,
  getPersons,
} = require('./query');

module.exports = {
  addGame,
  editGame,
  editGames,
  removeGame,
  upsertPersons,
  removePersonsNotIn,
  getGameDates,
  getGames,
  getGamesByDate,
  getGamesById,
  getGamesByPerson,
  getHistory,
  getPersons,
};
