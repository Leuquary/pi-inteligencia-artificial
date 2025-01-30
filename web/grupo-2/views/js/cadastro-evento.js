const protocolo = 'http://'
const baseURL = 'localhost:3001'

const resposta = fetch('http://localhost:3001/eventos', {
    method: 'GET'
})

// const form = document.getElementById("form-evento")
// form.addEventListener('submit', async function (event) {
//     event.preventDefault()

//     const form = event.target
//     const formData = new FormData(form)

//     try {
//         const eventoEndpoint = '/eventos'
//         const URLCompleta = `${protocolo}${baseURL}${eventoEndpoint}`

//         const resposta = (await axios.post(URLCompleta, formData, {
//             method: 'POST'
//         }))

//         console.log(resposta)
//         // exibirAlerta("alert-evento","Evento cadastrado com sucesso!","alert-success")
//     } catch (error) {
//         console.log(error)
//         // exibirAlerta("alert-cadastro","Ocorreu um erro ao cadastrar evento","alert-danger")
//     }
// })

// /*fazer o upload aparecer*/
// const file = document.getElementById('image')
// const preview = document.querySelector('.preview')
// const preview_img = document.querySelector('.preview-img')

// file.addEventListener('change', function(event) {
//     preview.style.display = "block"
//     let reader = new FileReader()
//     reader.onload = () => {
//         preview_img.src = reader.result
//     }
//     reader.readAsDataURL(file.files[0])
// })

// function exibirAlerta(id, alerta, classe){
//     let divAlerta = document.getElementById(id)
//     console.log(divAlerta)
//     divAlerta.style.display = "block"
//     divAlerta.classList.add(classe) 
//     divAlerta.innerHTML = alerta
// }