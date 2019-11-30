const gameFunctions = require('./main.js')

let rows = []
let fruit = []
let moveTime = 750
let gridSize = 25

module.exports = {
        startGame: (game) => {
        game.gameInterval = setInterval(() => handleEventInterval(game.players), moveTime)
    }
}

function handleEventInterval (players) {
    players.forEach(player => {
        let {snake} = player
        let newSnake = gameFunctions.snakeCycle(snake)
        console.log('cycle', snake)
    })
}