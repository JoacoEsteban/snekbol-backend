const Player = require('../classes/player.class')
const Game = require('../classes/game.class')

const CONTROLLER = {
  // ---------------------SETTERS---------------------
  newPlayer (name) {
    const player = new Player(global.uuid(), name, null, false)
    store.PLAYERS.push(player)
    return player
  },
  // ---------------------GETTERS---------------------
  getNextGame () {
    return store.GAMES.find(game => !game.flags.started) || (store.GAMES.push(new Game()) && global._.last(store.GAMES))
  },
  getPlayerById (id) {
    return store.PLAYERS.find(player => player.id === id) || null
  }
}

const store = {
  GAMES: [],
  PLAYERS: [],
  CONTROLLER
}

module.exports = store
