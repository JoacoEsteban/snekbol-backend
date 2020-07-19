const store = require('../../store')
const lobbyController = require('./lobby.controller')

module.exports = {
  handleLogin (req, res) {
    const player = store.CONTROLLER.newPlayer(req.body.name)
    lobbyController.allocatePlayerInGame(player)
    res.json(player.sendableInfo)
  }
}