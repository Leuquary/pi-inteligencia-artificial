const protocolo = 'http://'
const baseURL = 'localhost:3000'

const form = document.getElementById("form-evento")
form.addEventListener('submit', async function (event) {
    event.preventDefault()

    const form = event.target
    const formData = new FormData(form)

    try {
        const eventoEndpoint = '/evento'
        const URLCompleta = `${protocolo}${baseURL}${eventoEndpoint}`

        const resposta = (await axios.post(URLCompleta, formData, {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }))

        console.log(resposta)
        exibirAlerta("alert-evento","Evento cadastrado com sucesso!","alert-success")
    } catch (error) {
        console.log(error)
        exibirAlerta("alert-cadastro","Ocorreu um erro ao cadastrar evento","alert-danger")
    }
})

const file = document.getElementById('image')
const preview = document.querySelector('.preview')
const preview_img = document.querySelector('.preview-img')
file.addEventListener('change', function(event) {
    preview.style.display = "block"
    let reader = new FileReader()
    reader.onload = () => {
        preview_img.src = reader.result
    }
    reader.readAsDataURL(file.files[0])
})