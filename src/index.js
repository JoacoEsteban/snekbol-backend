global._ = require('lodash')
global.uuid = require('uuid/v4');
const app = require('express')()
require('express-ws')(app)
let bodyParser = require('body-parser')
app.use(bodyParser.json()) // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })) // support encoded bodies

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS')
  next()
})

app.listen(5000, () => {
  console.log('App listening on port 5000')
})

require('./store')
require('./routes/index.routes')(app)