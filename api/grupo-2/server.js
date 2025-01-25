const express = require('express')
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = express()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const uniqueValidator = require('mongoose-unique-validator')

const port = 3000
dotenv.config()
const uri = process.env.MONGODB_URL

app.use(express.json())
app.use(cors())

/*Schemas*/
const PointSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Point'],
        required: true
    },
    coordinates: {
        type: [Number],
        required: true
    }
});

const Categoria = new mongoose.Schema({ 
    nome: String,
    descricao: String
})

const usuarioSchema = new mongoose.Schema({
    nomeUsuario: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    nome: {
        type: String,
        required: true,
    },
    senha: {
        type: String,
        required: true,
    },
    telefone: {
        type: String,
    },
    cpf: {
        type: String,
        required: true,
        unique: true
    },
    logo_url: {
        type: String
    }
})

usuarioSchema.plugin(uniqueValidator)
const Usuario = new mongoose.model('Usuario', usuarioSchema)

const Evento = new mongoose.model('Evento', mongoose.Schema({
    nome: String,
    descricao: String,
    usuarioId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'  
    },
    url_banner: String,
    dataInicio: String,
    dataFim: String,
    horarioInicio: String,
    horarioFim: String,
    ingresso: {
        valor: Number,
        urlIngresso: String
    },
    endereco: {
        rua: String,
        numero: Number,
        bairro: String,
        estado: String,
        cep: String,
        complemento: String
    },
    local: {
        type: PointSchema,
        // required: true,
        index: '2dsphere'
    },
    categoria: Categoria,
    dataCriacao: Date
}))

/*Requisições*/
app.get('/',async(_,res) => {
    res.send("Olá mundo")
})

app.get('/eventos', async(req, res) => {
    const eventos = await Evento.find().sort({ data: -1 }).limit(3)
    res.status(201).json(eventos)
})

app.get('/evento/:id', async(req, res) => {
    console.log(req.params.id)
    try {
        const evento = await Evento.findById(req.params.id)
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
        const usuario = await Usuario.findById(req.params.id)
        if (!usuario) {
            return res.status(404).send("Usuario não encontrado");
        }
        return res.status(201).json(usuario)
    } catch (error){
        res.status(500).send(error)
    }
})

app.post('/evento', async(req, res) => {
    const nome = req.body.nome
    const descricao = req.body.descricao
    const usuario = req.body.usuario
    const banner = req.body.banner
    const dataInicio = req.body.dataInicio
    const dataFim = req.body.dataFim
    const horarioInicio = req.body.horarioInicio
    const horarioFim = req.body.horarioFim
    const ingresso = req.body.ingresso
    const endereco = req.body.endereco
    const categoria = req.body.categoria

    const evento = new Evento({
        nome: nome,
        descricao: descricao,
        usuarioId: usuario._id,
        banner: banner,
        dataInicio: dataInicio,
        dataFim: dataFim,
        horarioInicio: horarioInicio,
        horarioFim: horarioFim,
        ingresso: ingresso,
        endereco: endereco,
        categoria: categoria
    })

    const eventoSalvo = await evento.save()
    res.status(201).json(eventoSalvo)
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
        const usuario = new Usuario({
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

        const usuario = await Usuario.findOne({
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

async function conectarAoMongo() {
    await mongoose.connect(uri, {})
}

app.listen(port, () => {
    try {
        conectarAoMongo()
        console.log(`Servidor rodando na port ${port}`)
    } catch (error) {
        console.log("Erro", error)
    }
})