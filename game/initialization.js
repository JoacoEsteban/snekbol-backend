const gameFunctions = require('./main.js')

let rows = []
let fruit = []
let moveTime = 250
let gridSize = 25

module.exports = {
  startGame: (game) => {
    let instance = new gameFunctions.game(game)
    game.started = true
    instance.game.gameInterval = setInterval(instance.gameCycle, moveTime)
    return instance
  }
}