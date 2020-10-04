import { Application } from 'express-ws'

import wsController from '../controllers/api/ws.controller'
import apiController from '../controllers/api/api.controller'

module.exports = (app: Application) => {
  app.ws('/', function (ws, req) {
    ws.on('message', msg => wsController.handleMessage(ws as any, JSON.parse(msg.toString())))
  })

  app.post('/login', apiController.handleLogin)
  app.get('/ping', (req, res) => res.status(200).send())
}
