/*verificando se usuário está cadastrado */
const criar_evento = document.querySelector('.button-criar-evento')
const entrar = document.querySelector('.button-entrar')
const cadastrar = document.querySelector('.button-cadastrar')
const usuario = localStorage.getItem("Usuario")

const icon_cadastrar = document.querySelector('.icon-cadastrar')
const sair = document.querySelector('.button-sair')

function verificarUsuario(){
    if(usuario){
        criar_evento.style.display = "block"
        entrar.style.display = "none"
        cadastrar.style.display = "none"
    }else{
        icon_cadastrar.style.display = "none"
        sair.style.display = "none"
    }
}

/*overlay do perfil */
const overlay = document.querySelector('.overlay-options')
let ligado = false

function exibirOverlay(){
    if(!ligado){
        overlay.style.display = "block"
        ligado = true
    }else{
        overlay.style.display = "none"
        ligado = false
    }
}

icon_cadastrar.addEventListener('click', () => {
    exibirOverlay()
})

/*saindo da conta */
sair.addEventListener('click', () => {
    localStorage.clear()
    window.location.href="index.html"
    console.log('funcionou')
})