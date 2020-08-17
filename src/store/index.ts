// import { Nullable } from "../typings"

// import Player from '../classes/player.class'
// import Game from '../classes/game.class'


interface StoreController {
  newPlayer: (name: string) => Player;
  createGame: () => Game;
  getNextGame: () => Game;
  getPlayerById: (id: string) => Nullable<Player>
}

const CONTROLLER: StoreController = {
  // ---------------------SETTERS---------------------
  newPlayer (name: string) {
    const player = new Player(name)
    store.PLAYERS.push(player)
    return player
  },
  // ---------------------CONTRUCTORS---------------------
  createGame (): Game {
    const game = store.GAMES.push(new Game()) && global._.last(store.GAMES)
    if (!game) throw new Error('ERROR CREATING GAME')
    return game
  },
  // ---------------------GETTERS---------------------
  getNextGame () {
    return store.GAMES.find(game => game.isAvailableToJoin) || this.createGame()
  },
  getPlayerById (id: string) {
    return store.PLAYERS.find(player => player.id === id) || null
  }
}

const store: {
  GAMES: Game[];
  PLAYERS: Player[];
  CONTROLLER: StoreController;
} = {
  GAMES: [],
  PLAYERS: [],
  CONTROLLER
}

export default store
