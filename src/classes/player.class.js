const Snake = require('./snake.class')

module.exports = class Player {
  constructor(name, game, connected, prepared) {
    this.id = global.uuid()
    this.secret = global.uuid()
    this.name = name
    this.game = game
    this.ws = null
    this.flags = {
      connected: connected || false,
      prepared: prepared || false,
    }
    this.snake = new Snake()
  }

  get sendableInfo () {
    return {
      id: this.id,
      name: this.name,
      game_id: this.game.id,
      flags: this.flags,
      snake: this.snake,
    }
  }

  setWs (ws) {
    this.flags.connected = true
    this.ws = ws
    ws.on('close', () => this.onDisconnect())
  }

  imReady () {
    this.flags.prepared = true
    this.flags.connected = true

    this.game.onPlayerReady()
    //  return ws.send('not all ready')
  }

  onDisconnect () {
    console.log(`Player ${this.name} disconnected`)
    this.flags.connected = false
    this.game.onPlayerDisconnected(this)
  }

  // ---------------------GAME---------------------
  setDirection (direction) {
    this.snake.nextDirection = direction
  }
}