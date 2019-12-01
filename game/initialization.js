const gameFunctions = require('./main.js')

let rows = []
let fruit = []
let moveTime = 100
let gridSize = 25

module.exports = {
  startGame: (game) => {
    let instance = gameFunctions.game(game)
    instance.game.gameInterval = setInterval(instance.gameCycle, moveTime)
  }
}