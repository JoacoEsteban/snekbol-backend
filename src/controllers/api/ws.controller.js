const store = require("../../store")

module.exports = {
  handleMessage(ws, msg) {
    let { player_id, directive } = msg
    const player = store.CONTROLLER.getPlayerById(player_id)
    switch (directive) {
      case 'im-ready':
        player.imReady(ws)
        break
      case 'direction':
        player.setDirection(msg.direction)
        break
    }
  }
}