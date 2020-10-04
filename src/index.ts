import express, { Application, Request, Response } from 'express'

import lodash from 'lodash'

global._ = lodash

const app: Application = express()
require('express-ws')(app)

const morgan = require('morgan')
const bodyParser = require('body-parser')

app.use(bodyParser.json()) // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })) // support encoded bodies
app.use(morgan('dev'))

app.use((req: Request, res: Response, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS')
  next()
})

app.listen(process.env.PORT || 5000, () => {
  console.log('App listening on port 5000')
})

require('./store')
require('./routes/index.routes')(app)