const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const app = express()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
dotenv.config()

const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')
app.set("view engine", "ejs")
const axios = require('axios')

const { EventoModel, UsuarioModel, ImageModel } = require('./models.js')

mongoose.connect(process.env.MONGODB_URL)
.then(console.log("DB Connected"))

app.use(express.json())
app.use(cors())

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const multer = require('multer')

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
})

const upload = multer({
    storage: storage,
    limits: { fileSize: 100000000 }, 
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    }
}).single('image')

function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
  
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: Images only! (jpeg, jpg, png, gif)');
    }
}

app.get('/',async(_,res) => {
    res.send("Olá mundo")
})

app.get('/evento/:id', async(req, res) => {
    console.log(req.params.id)
    try {
        const evento = await EventoModel.findById(req.params.id)
        if (!evento) {
            return res.status(404).send("Evento não encontrado");
        }
        return res.status(201).json(evento)
    } catch (error){
        res.status(500).send(error)
    }
})

app.get('/usuario/:id', async(req, res) => {
    console.log(req.params.id)
    try {
        const usuario = await UsuarioModel.findById(req.params.id)
        if (!usuario) {
            return res.status(404).send("Usuario não encontrado");
        }
        return res.status(201).json(usuario)
    } catch (error){
        res.status(500).send(error)
    }
})

app.post('/eventos', async(req, res) => {
    upload(req, res, (err) => {
        if(err){
            res.send(err)
        }else{
            if(!req.file){
                return res.status(400).status({ error: 'Nenhum arquivo enviado!' })
            }
            salvarImagemEvento(req,res)
            // res.redirect('http://localhost:8000/')
            res.send('Imagem processada')
        }
    })
})

async function salvarEvento(req) {
    try {
        const evento = new EventoModel({
            nome: req.body.nome,
            descricao: req.body.descricao,
            image: {
                data: fs.readFileSync(caminhoImagem),
                contentType: 'image/png'
            },
            dataHora: {
                dataInicio: req.body.dataInicio,
                dataFim: req.body.dataFim,
                horarioInicio: req.body.horarioInicio,
                horarioFim: req.body.horarioFim
            },
            ingresso: {
                valor: req.body.valor,
                urlIngresso: req.body.urlIngresso
            },
            endereco: {
                rua: req.body.rua,
                bairro: req.body.bairro,
                numero: req.body.numero,
                estado: req.body.estado,
                cidade: req.body.cidade,
                cep: req.body.cep,
                complemento: req.body.complemento
            },
            categoria: {
                nome: req.body.categoria
            }
        })

        const resposta = await evento.save()
        return resposta
    } catch (error) {
        console.log(error)
        throw error
    }   
}

async function salvarImagemEvento(req,res) {
    const caminhoImagem = path.join(__dirname + '/uploads/' + req.file.filename)
    const imagemProcessada = await processarImagem(caminhoImagem)
    const evento = await salvarEvento(req)

    let id = evento.id
    var obj = {
        eventoId: id,
        desc: imagemProcessada,
        img: {
            data: fs.readFileSync(caminhoImagem),
            contentType: 'image/png'
        }
    }

    ImageModel.create(obj)
    .then((data) => {
        console.log(data)
    })
    .catch((err) => {
        res.send(err)
    })
}

async function processarImagem(caminhoImagem) {
    const formData = new FormData()
    formData.append("image_file",fs.createReadStream(caminhoImagem))
    try {
        const headers = formData.getHeaders?.() ?? { 'Content-Type': 'multipart/form-data' }
        const response = await axios.post('http://backend-image:9001/imagens', formData, {
            headers: headers
        })
        return response
    } catch (error) {
        console.log(error)
        return false
    }
}

app.get('/eventos/recentes', async(req, res) => {
    const eventos = await EventoModel.find().sort({ data: -1 }).limit(3)
    res.status(201).json(eventos)
})

app.get('/eventos', async(req, res) => {
    EventoModel.find({})
    .then((data, err) => {
        let retorno = []
        data.forEach(function(item) {
            var item = {
                nome: item.nome,
                descricao: item.descricao,
                dataHora: {
                    dataInicio: item.dataHora.dataInicio,
                    dataFim: item.dataHora.dataFim,
                    horarioInicio: item.dataHora.horarioInicio,
                    horarioFim: item.dataHora.horarioFim
                },
                image: {
                    data: item.image.data.toString('base64'),
                    contentType: item.image.contentType
                },
                categoria: {
                    nome: item.categoria.nome
                }
            }
            retorno.push(item)
        })

        console.log(JSON.stringify(retorno))
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(retorno))
    })
})

app.post('/cadastro', async(req, res) => {
    try {
        const nome = req.body.nome
        const nomeUsuario = req.body.nomeUsuario
        const email = req.body.email
        const senha = req.body.senha
        const telefone = req.body.telefone
        const cpf = req.body.cpf
        
        const cryptografada = await bcrypt.hash(senha, 10)
        const usuario = new UsuarioModel({
            nome: nome,
            nomeUsuario: nomeUsuario,
            email: email,
            senha: cryptografada,
            telefone: telefone,
            cpf: cpf
        })

        const usuarioSalvo = await usuario.save()
        res.status(201).json(usuarioSalvo)

    }catch(error){
        console.log(error)
        res.status(409).send("Erro ao cadastrar usuário")
    }
})

app.post('/login', async(req, res) => {
    try{
        const email = req.body.email
        const senha = req.body.senha

        const usuario = await model.UsuarioModel.findOne({
            email: email
        })

        if(!usuario){
            return res.status(401).json({ mensagem: "Email inválido" })
        }

        const verificacaoSenha = await bcrypt.compare(senha, usuario.senha)
        if(!verificacaoSenha){
            return res.status(401).json({ mensagem: "Senha inválida" })        
        }

        const token = jwt.sign({ email: email },
            'chave-secreta', { expiresIn: '1h'}
        )
        res.status(200).json({ token: token, usuario: usuario })
        
    }catch(error){
        console.log(error)
        res.status(409).send("Erro ao fazer login")
    }
})

var port = process.env.PORT || '3001'
app.listen(port, err => {
    if (err)
        throw err
    console.log('Server listening on port', port)
})