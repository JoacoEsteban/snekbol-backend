const _ = require('lodash')

module.exports = {
  game: function (instance) {
    this.game = instance
    instance.process = this
    this.createFruit = () => {
      this.game.fruit[0] = Math.floor(Math.random() * 1000) % this.game.gridSize
      this.game.fruit[1] = Math.floor(Math.random() * 1000) % this.game.gridSize
    },
      this.removeFruit = () => {
        this.game.fruit = []
      },
      this.moveSnake = (snake) => {
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
        if (this.isColliding(snake)) return this.gameOver(snake)

        snake.body = [snake.head, ...snake.body]
        snake.body.pop()
        snake.head = newPos
        snake.nextDirection = null
        snake.prevDirection = goTo
        this.checkFruit(snake)
      },
      this.isColliding = (snake) => {
        // TODO make a pull with every cell that causes a collision and then compare to everyone
        // if (coords[0] - gridSize > 0 || coords[0] < 0 || coords[1] - gridSize > 0 || coords[1] < 0) return true
        // for (let i in snakeBody) {
        //     let part = snakeBody[i]
        //     if (coords[0] === part[0] && coords[1] === part[1]) return true
        // }
        return false
      },
      this.gameOver = () => {
        console.log('gameover')
      },
      this.checkFruit = (snake) => {
        if (snake.head[0] === this.game.fruit[0] && snake.head[1] === this.game.fruit[1]) {
          this.eatFruit(snake)
          this.growSnake(snake)
        }
      },
      this.growSnake = (snake) => {
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
      },
      this.eatFruit = (snake) => {
        snake.counter++
        this.removeFruit()
        this.createFruit()
      },
      this.areAllPlayersGone = () => {
        if (this.game.players.some(player => player.isConnected)) return
        console.log('All players disconnected')
        this.closeGame()
      },
      this.closeGame = async () => {
        clearInterval(this.game.gameInterval)
        try {

          await this.sendToAllPlayers({
            event: 'game-over',
            players: this.game.players.map(p => {
              return {
                ...p,
                ws: undefined
              }
            })
          })
          console.log('Game Closed')
        } catch (error) {
          console.error('ERROR WHEN CLOSING GAME WITH ID ', this.game.id, error)
        }
      },
      this.gameCycle = () => {
        this.game.players.forEach(player => {
          this.moveSnake(player.snake)
        })
        let toSend = {
          ...this.game,
          players: this.game.players.map(p => {
            return {
              ...p,
              ws: undefined
            }
          }),
          process: undefined,
          gameInterval: undefined
        }
        this.sendToAllPlayers(toSend)
      }
    this.sendToAllPlayers = (data) => {
      this.game.players.forEach(player => {
        if (!player.isConnected) return
        player.ws.send(JSON.stringify(data))
      })
    }
    this.createFruit()
    return this
  }
}