import { v4 } from "uuid"
import { AllowedDirections } from "../typings"
import { Game } from "./game.class"
import { Snake } from "./snake.class"

export type PlayerFlags = {
  connected: boolean
  prepared: boolean
}

export interface PlayerSendableInfo {
  id: string
  secret?: string
  name: string
  game_id: string | null
  flags: PlayerFlags
  snake: Snake
}

export class Player {
  id: string
  secret: string
  name: string
  game: Game | null
  ws: WebSocket | null
  flags: PlayerFlags
  snake: Snake

  constructor(name: string, game?: Game, connected?: boolean, prepared?: boolean) {
    this.id = v4()
    this.secret = v4()
    this.name = name
    this.game = game || null
    this.ws = null
    this.flags = {
      connected: connected || false,
      prepared: prepared || false,
    }
    this.snake = new Snake(this)
  }

  get sendableInfo(): PlayerSendableInfo {
    return {
      id: this.id,
      name: this.name,
      game_id: (this.game?.id) || null,
      flags: this.flags,
      snake: this.snake,
    }
  }

  setWs(ws: WebSocket) {
    this.flags.connected = true
    this.ws = ws
    ws.onclose = () => this.onDisconnect()
  }

  imReady() {
    if (!this.game) throw new Error('PLAYER NOT IN GAME')

    this.flags.prepared = true
    this.flags.connected = true

    this.game.onPlayerReady()
    //  return ws.send('not all ready')
  }

  onDisconnect() {
    if (!this.game) throw new Error('PLAYER NOT IN GAME')

    console.log(`Player ${this.name} disconnected`)
    this.flags.connected = false
    this.game.onPlayerDisconnected()
  }

  // ---------------------GAME---------------------
  setDirection(direction: AllowedDirections) {
    this.snake.nextDirection = direction
  }
}