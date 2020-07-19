const store = require('../../store')
const Player = require('../../classes/player.class')
const Game = require('../../classes/game.class')

module.exports = {
  allocatePlayerInGame (player) {
    const game = store.CONTROLLER.getNextGame()
    player.game = game
    game.addPlayer(player)

    return game
  }
}