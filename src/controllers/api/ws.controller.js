const store = require("../../store")

const auth = (player, msg) => {
  const { player_secret } = msg
  return (player && player.secret) === player_secret
}

module.exports = {
  handleMessage(ws, msg) {
    const player = store.CONTROLLER.getPlayerById(msg.player_id)

    if (!auth(player, msg)) return
    switch (msg.directive) {
      case 'connect':
        player.setWs(ws)
        player.game.sendToPlayer(player)
        break
      case 'im-ready':
        player.imReady(ws)
        break
      case 'direction':
        player.setDirection(msg.direction)
        break
    }
  }
}