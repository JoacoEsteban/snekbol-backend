const _ = require('lodash')
const uuid = require('uuid/v4');
const app = require('express')()
const { startGame } = require('./game/initialization')
let expressWs = require('express-ws')(app)
let bodyParser = require('body-parser')
app.use(bodyParser.json()) // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })) // support encoded bodies

let players = []
let games = []

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS')
  next()
})

app.listen(5000, () => {
  console.log('App listening on port 5000')
})

app.ws('/', function (ws, req) {
  ws.on('message', function (msg) {
    msg = JSON.parse(msg)
    let { player_id, directive } = msg
    switch (directive) {
      case 'im-ready':
        let { game_id } = msg
        console.log('GAME', game_id)
        let currentGame = games.find(game => game.id === game_id)
        let playerReady = currentGame.players.find(player => player.id === player_id)
        playerReady.prepared = true
        playerReady.isConnected = true
        playerReady.ws = ws
        ws.on('close', () => {
          console.log(`Player ${playerReady.name} disconnected`)
          playerReady.isConnected = false
          currentGame.process.areAllPlayersGone()
        })

        if (currentGame.players.some(player => player.prepared === false)) return ws.send('not all ready')
        startGame(currentGame)
        break
      case 'direction':
        let { direction } = msg
        let game = players.find(player => player.id === player_id).game
        let player = game.players.find(player => player.id === player_id)
        player.snake.nextDirection = direction
        break
    }
  })
})

app.post('/login', (req, res) => {
  console.log(req.body)
  let game = games.find(game => !game.started)
  if (!game) {
    let lastGame = _.last(games)
    let id = !lastGame ? 1 : lastGame.id + 1

    game = {
      id,
      started: false,
      players: [],
      fruit: [],
      gridSize: 25,
      gameInterval: null
    }
    games.push(game)
  }

  let lastPlayer = _.last(game.players)
  let id = uuid()
  let newPlayer = {
    id,
    game_id: game.id,
    name: req.body.name,
    prepared: false,
    snake: {
      head: [0, 0],
      body: [],
      nextDirection: null,
      prevDirection: 1,
      counter: 0
    }
  }
  console.log('new player', id)
  players.push({
    id,
    game
  })
  game.players.push(newPlayer)
  res.json(newPlayer)
})
