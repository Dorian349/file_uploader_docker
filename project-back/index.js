const express = require('express')
const app = express()

app.get('/', function (req, res) {
  console.log("gg");
  res.send('Hello World')
})

app.get('/app', function (req, res) {
  console.log("gggggg")
})

console.log("STARTED");

app.listen(6000)