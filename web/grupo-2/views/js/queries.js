const protocolo = 'http://'
const baseURL = 'localhost:3001'

async function buscarEventos(){
    const eventosEndpoint = '/eventos'
    const URLCompleta = `${protocolo}${baseURL}${eventosEndpoint}`
    
    axios.get(URLCompleta)
    .then((data, err) => {
        let newdata = data.data

        newdata.forEach(function(item) {
            var item = {
                nome: item.nome,
                dataHora: {
                    dataInicio: item.dataHora.dataInicio,
                    dataFim: item.dataHora.dataFim,
                    horarioInicio: item.dataHora.horarioInicio,
                    horarioFim: item.dataHora.horarioFim
                },
                image: {
                  data: item.image.data,
                  contentType: item.image.contentType
                },
                categoria: {
                    nome: item.categoria.nome
                } 
            }
            console.log(item)
            addHtml(item)
        })
    })

    // eventos.forEach(evento => {
    //     let dataInicio = evento.dataHora.dataInicio
    //     let dataInicioSeparada = dataInicio.split('-')
    //     dataInicio = `${dataInicioSeparada[2]}/${dataInicioSeparada[1]}`
    //     evento.dataHora.dataInicio = dataInicio

    //     let dataFim = evento.dataHora.dataFim
    //     let dataFimSeparada = dataInicio.split('-')
    //     dataFim = `${dataFimSeparada[2]}/${dataFimSeparada[1]}`
    //     evento.dataHora.dataFim = dataFim

    //     addHtml(evento)
    // })
}

function addHtml(evento){
    const eventoHtml = document.createElement('div')
    eventoHtml.classList.add('col-sm-4','evento-card')
    eventoHtml.dataset.eventoId = evento._id
    eventoHtml.dataset.eventoNome = evento.nome

    const imageSrc = `data:${evento.image.contentType};base64,${evento.image.data}`

    eventoHtml.innerHTML = `
        <div class="card">
            <img src="${imageSrc}" class="card-img-top" alt="Imagem do evento">
            <div class="card-body">
                <h5 class="card-title">${evento.nome}</h5>
                <h6 class="card-subtitle">${evento.dataHora.dataInicio} - ${evento.dataHora.horarioInicio}</h6>
                <p class="card-text">${evento.descricao}</p>
                <div class="categories">
                    <span class="card-link">${evento.categoria.nome}</span>
                </div>
            </div>
        </div>
    `
    eventoHtml.addEventListener('click', () => {
        window.location.href = `evento.html?id=${evento._id}`
    })

    const eventos = document.querySelector('#eventos-list-2')
    const row = document.createElement('div')
    row.classList.add('row')
    row.classList.add('eventos-carousel-3')
    eventos.appendChild(row)

    row.appendChild(eventoHtml)
}

async function carregarEvento(id){
    const meses = ["jan","fev","mar","abr","maio","jun","jul","ago","set","out","nov","dez"]

    const eventosEndpoint = `/evento/${id}`
    const URLCompletaEvento = `${protocolo}${baseURL}${eventosEndpoint}`
    const evento = (await axios.get(URLCompletaEvento)).data

    const titulo = document.querySelector('.event-title')
    titulo.innerHTML = evento.nome

    const descricao = document.querySelector('.event-description-text')
    descricao.innerHTML = evento.descricao

    const descricao1 = document.querySelector('.event-description-text1')
    descricao1.innerHTML = evento.descricao

    const ingresso = document.querySelector('.ticket-value')
    if(evento.ingresso.valor){
        ingresso.innerHTML = "R$" + evento.ingresso.valor + ",00"
    }else{
        ingresso.innerHTML = "R$0,00"
    }

    const datahora = document.querySelector('.event-date-time')
    let dataInicio = evento.dataInicio 
    let dataInicioSeparada = dataInicio.split('-')
    dataInicio = `${dataInicioSeparada[2]} de ${meses[parseInt(dataInicioSeparada[1]-1)]}. de ${dataInicioSeparada[0]}`
    
    evento.dataInicio = dataInicio

    datahora.innerHTML = evento.dataInicio + " | " + evento.horarioInicio + " às " + evento.horarioFim

    const local = document.querySelector('.event-location')
    local.innerHTML = evento.endereco.rua + ", " + evento.endereco.numero + " - " +evento.endereco.bairro + " - " + evento.endereco.estado

    const categoria = document.querySelector('.event-categories a')
    categoria.innerHTML = evento.categoria.nome

    const usuarioEndpoint = `/usuario/${evento.usuarioId}`
    const URLCompletaUsuario = `${protocolo}${baseURL}${usuarioEndpoint}`
    const usuario = (await axios.get(URLCompletaUsuario)).data
    console.log(usuario)
    const organizador = document.querySelector('.organizer-name')
    organizador.innerHTML = usuario.nome

    const telefone = document.querySelector('.telefone')
    telefone.innerHTML = usuario.telefone
    
}

async function cadastrarUsuario() {
    let nomeInput = document.querySelector('#nomeCadastroInput')
    let nomeUsuarioInput = document.querySelector('#usuarioCadastroInput')
    let emailInput = document.querySelector('#emailCadastroInput')
    let senhaInput = document.querySelector('#senhaCadastroInput')
    let telefoneInput = document.querySelector('#telefoneCadastroInput')
    let cpfInput = document.querySelector('#cpfCadastroInput')

    let nome = nomeInput.value;
    let nomeUsuario = nomeUsuarioInput.value;
    let email = emailInput.value;
    let senha = senhaInput.value;
    let telefone = telefoneInput.value;
    let cpf = cpfInput.value;

    try {
        const cadastroEndpoint = '/cadastro'
        const URLCompleta = `${protocolo}${baseURL}${cadastroEndpoint}`

        const usuario = (await axios.post(URLCompleta, {
                    nome,
                    nomeUsuario,
                    email,
                    senha,
                    telefone,
                    cpf
                }
            )
        ).data

        localStorage.setItem("Usuario",JSON.stringify(usuario))
        console.log(localStorage.getItem("Usuario"))

        nomeUsuarioInput.value = ""
        senhaInput.value = ""
        emailInput.value = ""
        cpfInput.value = ""

        console.log(usuario);
        exibirAlerta("alert-cadastro","Usuário cadastrado com sucesso!","alert-success")
    }
    catch (error) {
        console.log(error);
        exibirAlerta("alert-cadastro","Ocorreu um erro ao cadastrar usuário","alert-danger")
    }
}

const fazerLogin = async () => {
    let emailLoginInput = document.querySelector('#emailLoginInput')
    let senhaLoginInput = document.querySelector('#senhaLoginInput')

    let email = emailLoginInput.value
    let senha = senhaLoginInput.value

    try {
        const loginEndpoint = '/login'
        const URLCompleta = `${protocolo}${baseURL}${loginEndpoint}`
        const resposta = (await axios.post(URLCompleta, {
                    email: email,
                    senha: senha
                }
            )   
        ).data

        console.log(resposta.usuario)
        localStorage.setItem("Usuario",JSON.stringify(resposta.usuario))
        console.log(localStorage.getItem("Usuario"))

        emailLoginInput.value=""
        senhaLoginInput.value=""
        alert("Bem-vindo!")
        window.location.href = "index.html"

        console.log(divAlerta)
    }catch (error) {
        exibirAlerta("alert-login","Ocorreu um erro ao fazer login","alert-danger")
        console.log(error)
    }
}

function exibirAlerta(id, alerta, classe){
    let divAlerta = document.getElementById(id)
    console.log(divAlerta)
    divAlerta.style.display = "block"
    divAlerta.classList.add(classe) 
    divAlerta.innerHTML = alerta
}

