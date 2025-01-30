const express = require('express')
const router = express.Router()
const path = __dirname + '/views/'
const app = express()

var bodyParser = require('body-parser')
app.set("view engine", "ejs")

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

router.use(function (req,_,next){
  console.log('/' + req.method)
  next()
})

router.get('/', function (_,res){
  res.sendFile(path + '/index.html')
})

app.use(express.static('views'))

app.use('/',router)

// const port = 8081
// app.listen(port, () => {
//   console.log(`Servidor rodando na porta ${port}`)
// })

var port = process.env.PORT || '8080'
app.listen(port, err => {
    if (err)
        throw err
    console.log('Server listening on port', port)
})

