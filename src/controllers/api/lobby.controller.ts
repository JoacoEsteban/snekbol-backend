import store from '../../store'

export default {
  allocatePlayerInGame (player: Player) {
    const game = store.CONTROLLER.getNextGame()
    player.game = game
    game.addPlayer(player)

    return game
  }
}