const wsController = require('../controllers/api/ws.controller')
const apiController = require('../controllers/api/api.controller')

module.exports = app => {
  app.ws('/', function (ws, req) {
    ws.on('message', msg => wsController.handleMessage(ws, JSON.parse(msg)))
  })

  app.post('/login', apiController.handleLogin)
}