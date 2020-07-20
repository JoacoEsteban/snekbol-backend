module.exports = class Game {
  constructor(id = global.uuid(), players, fruit, gridSize, cycleTime = 250) {
    this.id = id
    this.flags = {
      started: false
    }
    this.players = players || []
    this.fruit = fruit || []
    this.gridSize = gridSize || 25,
    this.gameInterval = null
    this.cycleTime = cycleTime
    this.gameInstance = new GameInstance(this)
  }

  get sendableInfo () {
    return {
      id: this.id,
      flags: this.flags,
      fruit: this.fruit,
      gridSize: this.gridSize,
      players: this.players.map(p => p.sendableInfo)
    }
  }

  // ---------------------METHODS---------------------

  addPlayer(player) {
    this.players.push(player)
  }
  removePlayer(player) {
    this.players = this.players.filter(p => p !== player)
  }

  // ---------------------GAME---------------------
  startGame () {
    this.flags.started = true
    this.gameInstance.startGame()
  }
  sendToAllPlayers (data = {}) {
    data = JSON.stringify(global._.merge({ game: this.sendableInfo }, data))
    this.players.forEach(player => this.sendToPlayer(player, data))
  }
  sendToPlayer (player, data = JSON.stringify({ game: this.sendableInfo })) {
    player.flags.connected && player.ws.send(data)
  }
  // ---------------------EVENTS---------------------
  onPlayerReady () {
    const allReady = this.players.every(player => player.flags.prepared)
    allReady && this.startGame()
    return allReady
  }
  onPlayerConnected () {
    this.sendToAllPlayers()
  }
  onPlayerDisconnected () {
    this.gameInstance && this.gameInstance.areAllPlayersGone()
  }
}


class GameInstance {
  constructor (parent) {
    this.parent = parent
  }

  get game () {
    return this.parent
  }

  positionSnakes () {
    this.game.players.forEach(({ snake }, index) => {
      // TODO position snakes
      snake.head = [0, 0]
    })
  }

  createFruit () {
    this.game.fruit[0] = Math.floor(Math.random() * 1000) % this.game.gridSize
    this.game.fruit[1] = Math.floor(Math.random() * 1000) % this.game.gridSize
  }

  removeFruit () {
    this.game.fruit = []
  }

  isColliding (snake) {
    // TODO make a pool with every cell that causes a collision and then compare to everyone
    // if (coords[0] - gridSize > 0 || coords[0] < 0 || coords[1] - gridSize > 0 || coords[1] < 0) return true
    // for (let i in snakeBody) {
    //     let part = snakeBody[i]
    //     if (coords[0] === part[0] && coords[1] === part[1]) return true
    // }
    return false
  }
  gameOver () {
    console.log('gameover')
  }
  checkFruit (snake) {
    if (!(snake.head[0] === this.game.fruit[0] && snake.head[1] === this.game.fruit[1])) return
    this.eatFruit(snake)
    snake.grow()
  }

  eatFruit (snake) {
    snake.counter++
    this.removeFruit()
    this.createFruit()
  }

  areAllPlayersGone () {
    if (this.game.players.some(player => player.flags.connected)) return
    console.log('All players disconnected')
    this.closeGame()
  }

  async closeGame () {
    clearInterval(this.game.gameInterval)
    try {
      await this.game.sendToAllPlayers({event: 'game-over'})
      console.log('Game Closed')
    } catch (error) {
      console.error('ERROR WHEN CLOSING GAME WITH ID ', this.game.id, error)
    }
  }

  gameCycle () {
    this.game.players.forEach(({snake}) => {
      snake.move()
      this.checkFruit(snake)
    })
    this.game.sendToAllPlayers()
  }


  startGame () {
    this.positionSnakes()
    this.createFruit()
    this.game.gameInterval = setInterval(() => this.gameCycle(), this.game.cycleTime)
  }
}