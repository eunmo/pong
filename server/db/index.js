const { addGame, editGame, removeGame } = require('./dml');
const {
  getGameById,
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
  getGameById,
  getGameDates,
  getGames,
  getGamesByPerson,
  getGamesByDate,
  getHistory,
};
