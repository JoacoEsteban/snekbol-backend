const _ = require('lodash')
const uuid = require('uuid/v4');
const app = require('express')()
const {startGame} = require('./game/initialization')
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

app.ws('/', function(ws, req) {
  ws.on('message', function(msg) {
    let { player_id, direction } = JSON.parse(msg)
    let game = players.find(player => player.id === player_id).game
    let player = game.players.find(player => player.id === player_id)
    player.snake.nextDirection = direction
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

// TODO change this into ws
app.post('/im-ready', (req, res) => {
  let game = games.find(game => game.id === req.body.game_id)
  game.players.find(player => player.id === req.body.player_id).prepared = true

  if (game.players.some(player => player.prepared === false)) return res.send('not all ready')
  startGame(game)
})