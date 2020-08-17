import store from '../../store'

const auth = (player: Player, msg: any): boolean => {
  const { player_secret } = msg
  return !!(player && player.secret && player.secret === player_secret)
}

export default {
  handleMessage(ws: WebSocket, msg: WsMessage) {
    const player = msg.player_id && store.CONTROLLER.getPlayerById(msg.player_id)

    if (!(player && auth(player, msg))) return

    switch (msg.directive) {
      case AllowedDirectives.CONNECT:
        player.setWs(ws)
        player.game?.sendToPlayer(player)
        break
      case AllowedDirectives.IM_READY:
        player.imReady()
        break
      case AllowedDirectives.DIRECTION:
        msg.direction && player.setDirection(msg.direction)
        break
    }
  }
}