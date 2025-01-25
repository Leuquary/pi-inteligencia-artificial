const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const router = express.Router()
const axios = require('axios')

const path = __dirname + '/views/';

const app = express()

var corsOptions = {
  origin: 'https://kit.fontawesome.com/e2a2c1e4a6.js',
  optionsSuccesStatus: 200
}

app.use(cors(corsOptions))

router.use(function (req,res,next){
  console.log('/' + req.method);
  next();
})

router.get('/', function (req,res){
  res.sendFile(path + '/index.html');
})

app.use(express.static('views'));

app.use('/',router);

const port = 8080;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`)
});

