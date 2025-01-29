const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const pointSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Point'],
        required: true
    },
    coordinates: {
        type: [Number],
        required: true
    }
})

const categoriaSchema = new mongoose.Schema({ 
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

const eventoSchema = new mongoose.Schema({
    nome: String,
    descricao: String,
    image: {
        data: Buffer,
        contentType: String
    },
    dataHora: {
        dataInicio: String,
        dataFim: String,
        horarioInicio: String,
        horarioFim: String,
    },
    ingresso: {
        valor: Number,
        urlIngresso: String
    },
    endereco: {
        rua: String,
        bairro: String,
        numero: Number,
        estado: String,
        cidade: String,
        cep: String,
        complemento: String
    },
    local: {
        type: pointSchema,
        index: '2dsphere'
    },
    categoria: categoriaSchema,
    // usuarioId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Usuario'  
    // },
})

const EventoModel = mongoose.model('EventoModel', eventoSchema)
const UsuarioModel = mongoose.model('UsuarioModel', usuarioSchema)
const PointModel = mongoose.model('PointModel', pointSchema)
const CategoriaModel = mongoose.model('CategoriaModel', categoriaSchema)

module.exports = {
    EventoModel,
    UsuarioModel,
    PointModel,
    CategoriaModel
}
