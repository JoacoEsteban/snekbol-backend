import store from '@/store'
import lobbyController from './lobby.controller'
import { Request, Response } from 'express'

export default {
  handleLogin (req: Request, res: Response) {
    const player = store.CONTROLLER.newPlayer(req.body.name)
    lobbyController.allocatePlayerInGame(player)
    const playerInfo = player.sendableInfo
    playerInfo.secret = player.secret
    res.json({ player: playerInfo })
    player.game?.onPlayerConnected()
  }
}