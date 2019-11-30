const gameFunctions = require('./main.js')

let rows = []
let fruit = []
let moveTime = 750
let gridSize = 25

module.exports = {
        startGame: (game) => {
        game.gameInterval = setInterval(() => handleEventInterval(game), moveTime)
    }
}

function handleEventInterval (game) {
    let newSnake = gameFunctions.gameCycle(game)
    console.log('cycle')
}