const { addGame, editGame, removeGame } = require('./dml');
const {
  getGameDates,
  getGames,
  getGamesByDate,
  getGamesById,
  getGamesByPerson,
  getHistory,
} = require('./query');

module.exports = {
  addGame,
  editGame,
  removeGame,
  getGameDates,
  getGames,
  getGamesByDate,
  getGamesById,
  getGamesByPerson,
  getHistory,
};
