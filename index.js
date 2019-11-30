const app = require('express')()
let expressWs = require('express-ws')(app)

app.ws('/echo', function(ws, req) {
    console.log('dou')
  ws.on('message', function(msg) {
    console.log('dousinho')
    ws.send(msg)
  })
})
app.listen(5000, () => {
    console.log('App listening on port 5000')
})

app.ws('/', function(ws, req) {
  ws.on('message', function(msg) {
    console.log(msg)
  })
})