import { v4 } from "uuid"
import { coord, Nullable } from "../typings"
import { Player } from "./player.class"
import { Snake, snakeBodySegment } from "./snake.class"

export class Game {
  id: string
  flags: {
    started: boolean,
    ended: boolean,
  }
  players: Player[]
  fruit: coord | []
  gridSize: number
  gridEdge: number
  gameInterval: Nullable<NodeJS.Timeout>
  cycleTime: number
  gameInstance: GameInstance

  constructor(cycleTime?: number, players?: Player[], fruit?: coord, gridSize?: number) {
    this.id = v4()
    this.flags = {
      started: false,
      ended: false,
    }
    this.players = players || []
    this.fruit = fruit || []
    this.gridSize = gridSize || 25
    this.gridEdge = this.gridSize - 1
    this.gameInterval = null
    this.cycleTime = cycleTime || 150
    this.gameInstance = new GameInstance(this)
  }

  get sendableInfo() {
    return {
      id: this.id,
      flags: this.flags,
      fruit: this.fruit,
      gridSize: this.gridSize,
      players: this.players.map(p => p.sendableInfo)
    }
  }

  get isAvailableToJoin() {
    return !this.flags.started && !this.flags.ended
  }

  // ---------------------METHODS---------------------

  addPlayer(player: Player) {
    this.players.push(player)
    console.log('Player', player.name, 'connected to game', this.id)
  }
  removePlayer(player: Player) {
    this.players = this.players.filter(p => p !== player)
  }
  get connectedPlayers() {
    return this.players.filter(player => player.flags.connected)
  }
  // ---------------------GAME---------------------
  startGame() {
    this.flags.started = true
    this.gameInstance.startGame()
  }
  sendToPlayer(player: Player, data?: object) {
    if (!player.flags.connected) return

    let toSend: string = JSON.stringify(data || { game: this.sendableInfo })
    player.ws?.send(toSend)
  }
  sendToAllPlayers(data = {}) {
    data = JSON.stringify(global._.merge({ game: this.sendableInfo }, data))
    this.players.forEach(player => this.sendToPlayer(player, data))
  }
  // ---------------------EVENTS---------------------
  onPlayerReady() {
    const allReady = this.players.every(player => player.flags.prepared)
    allReady && this.startGame()
    return allReady
  }
  onPlayerConnected() {
    this.sendToAllPlayers()
  }
  onPlayerDisconnected() {
    this.gameInstance && this.gameInstance.areAllPlayersGone()
  }
  onSnakeDead(player: Player) {
    this.players = this.players.sort((a, b): number => {
      if (a === player) return 1
      if (b === player) return -1
      return 0
    })
  }
}


class GameInstance {
  parent: Game
  constructor(parent: Game) {
    this.parent = parent
  }

  get game() {
    return this.parent
  }

  positionSnakes() {
    this.game.players.forEach((player, index) => {
      // TODO position snakes
      player.snake = new Snake(player)
      player.snake.resetPosition()
    })
  }

  randomPosition(): coord {
    return [
      Math.floor(Math.random() * 1000) % this.game.gridSize,
      Math.floor(Math.random() * 1000) % this.game.gridSize
    ]
  }

  randomValidPosition() {
    let pos
    do {
      pos = this.randomPosition()
    } while (this.isColliding(pos))
    return pos
  }

  createFruit() {
    this.game.fruit = this.randomValidPosition()
  }

  removeFruit() {
    this.game.fruit = []
  }

  // ---------------------
  isColliding(pos: coord): boolean {
    return this.isOOB(pos) || this.isCollidingWithSnakes(pos)
  }

  isOOB(pos: coord): boolean {
    const max = this.game.gridEdge
    const Y = pos[0]
    const X = pos[1]
    return (Y < 0 || Y > max) || (X < 0 || X > max)
  }

  isCollidingWithSnakes(pos: coord) {
    return this.game.connectedPlayers.some(p => this.isCollidingWithSnake(p.snake, pos))
  }
  isCollidingWithSnake(snake: Snake, pos: coord) {
    const movePointer = (segment: snakeBodySegment) => {
      switch (segment.direction) {
        case 0:
          pointer[0] += segment._length
          break
        case 1:
          pointer[1] -= segment._length
          break
        case 2:
          pointer[0] -= segment._length
          break
        case 3:
          pointer[1] += segment._length
          break
      }
    }

    const pointer = [...snake.head]
    const body = snake.body

    return body.some((segment, i) => {
      const isY = pointer[0] === pos[0]
      const isX = pointer[1] === pos[1]

      if (isY && isX) return true

      if (isY) {
        if (segment.direction === 1) { if (pos[1] < pointer[1] && pos[1] > (pointer[1] - segment._length)) return true }
        else if (segment.direction === 3) { if (pos[1] > pointer[1] && pos[1] < (pointer[1] + segment._length)) return true }
      } else if (isX) {
        if (segment.direction === 0) { if (pos[0] > pointer[0] && pos[0] < (pointer[0] + segment._length)) return true }
        else if (segment.direction === 2) { if (pos[0] < pointer[0] && pos[0] > (pointer[0] - segment._length)) return true }
      }

      movePointer(segment)
    })
  }
  // ---------------------
  checkFruit(snake: Snake) {
    if (!(snake.head[0] === this.game.fruit[0] && snake.head[1] === this.game.fruit[1])) return
    this.eatFruit(snake)
    snake.grow()
  }

  eatFruit(snake: Snake) {
    snake.counter++
    // this.removeFruit()
    this.createFruit()
  }

  areAllPlayersGone() {
    if (this.game.players.some(player => player.flags.connected)) return
    console.log('All players disconnected')
    this.closeGame()
  }

  async closeGame() {
    try {
      this.game.gameInterval && clearInterval(this.game.gameInterval)
      this.game.flags.ended = true
      await this.game.sendToAllPlayers({ event: 'game-over' })
      console.log('Game Closed')
    } catch (error) {
      console.error('ERROR WHEN CLOSING GAME WITH ID ', this.game.id, error)
    }
  }

  gameCycle() {
    let alive = 0
    this.game.players.forEach(({ snake }) => {
      if (snake.flags.dead) return
      snake.move()
      if (snake.flags.dead) return
      this.checkFruit(snake)
      alive++
    })
    if (!alive) return this.closeGame()
    this.game.sendToAllPlayers()
  }


  startGame() {
    this.positionSnakes()
    this.createFruit()
    this.game.gameInterval = setInterval(() => this.gameCycle(), this.game.cycleTime)
  }
}