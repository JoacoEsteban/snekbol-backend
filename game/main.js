
function createCells (gridSize) {
    for (let i = 0; i < gridSize; i++) {
        let rowObj = {
            cells: []
        }
        rows.push(rowObj)

        for (let o = 0; o < gridSize; o++) {
            rows[i].cells.push(cell)
        }
    }
}

function createFruit() {
    fruit[0] = Math.floor(Math.random() * 1000) % gridSize
    fruit[1] = Math.floor(Math.random() * 1000) % gridSize
}
function removeFruit(game) {
    game.fruit = []
}

function moveSnake (snake) {
    let goTo = snake.nextDirection

    switch (goTo) {
        case 0:
            if (snake.prevDirection === 2) goTo = snake.prevDirection
            break
        case 1:
            if (snake.prevDirection === 3) goTo = snake.prevDirection
            break
        case 2:
            if (snake.prevDirection === 0) goTo = snake.prevDirection
            break
        case 3:
            if (snake.prevDirection === 1) goTo = snake.prevDirection
            break
        default:
            goTo = snake.prevDirection
            break
    }

    let newPos = [...snake.head]
    switch (goTo) {
        case 0:
            newPos[0]--
            break
        case 1:
            newPos[1]++
            break
        case 2:
            newPos[0]++
            break
        case 3:
            newPos[1]--
            break
    }
    if (isColliding(snake)) return gameOver(snake)

    snake.head = newPos
    snake.nextDirection = null
    snake.prevDirection = goTo
    checkFruit(snake)
}

function isColliding (snake) {
    // TODO make a pull with every cell that causes a collision and then compare to everyone
    // if (coords[0] - gridSize > 0 || coords[0] < 0 || coords[1] - gridSize > 0 || coords[1] < 0) return true
    // for (let i in snakeBody) {
    //     let part = snakeBody[i]
    //     if (coords[0] === part[0] && coords[1] === part[1]) return true
    // }
    return false
}
function gameOver () {
    console.log('gameover')
}
function checkFruit (snake) {
    if (snake.head[0] === fruit[0] && snake.head[1] === fruit[1]) {
        eatFruit(snake)
        growSnake(snake)
    }
}

function growSnake (snake) {
    let newCell = snake.body.length > 0 ? [...(_.last(snake.body))] : snake.head
    switch (snake.prevDirection) {
        case 0:
            newCell[0]--
            break
        case 1:
            newCell[1]--
            break
        case 2:
            newCell[0]++
            break
        case 3:
            newCell[1]++
            break
    }
    snake.body.push(newCell)
}

function eatFruit (snake) {
    snake.counter++
    removeFruit()
    createFruit()
}

module.exports = {
    initialize: (gridSize) => {
        createCells(gridSize)
        createFruit()
    },
    gameCycle: (game) => {
        game.players.forEach(player => {
            moveSnake(player.snake)
        })
    }
}