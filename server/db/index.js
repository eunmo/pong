const { addGame, editGame, removeGame } = require('./dml');
const {
  getGameDates,
  getGames,
  getGamesByDate,
  getGamesByPerson,
  getHistory,
} = require('./query');

module.exports = {
  addGame,
  editGame,
  removeGame,
  getGames,
  getGamesByPerson,
  getGamesByDate,
  getGameDates,
  getHistory,
};
