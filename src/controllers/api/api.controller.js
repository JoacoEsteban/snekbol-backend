const store = require('../../store')
const lobbyController = require('./lobby.controller')

module.exports = {
  handleLogin (req, res) {
    const player = store.CONTROLLER.newPlayer(req.body.name)
    lobbyController.allocatePlayerInGame(player)
    const playerInfo = player.sendableInfo
    playerInfo.secret = player.secret
    res.json({ player: playerInfo })
    player.game.onPlayerConnected()
  }
}