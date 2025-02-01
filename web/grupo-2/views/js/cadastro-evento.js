const protocolo = 'http://'
const baseURL = 'localhost:3000'

const form = document.getElementById("form-evento")
form.addEventListener('submit', async function (event) {
    event.preventDefault()

    const form = event.target
    const formData = new FormData(form)

    try {
        const eventoEndpoint = '/eventos'
        const URLCompleta = `${protocolo}${baseURL}${eventoEndpoint}`

        const resposta = (await axios.post(URLCompleta, formData, {
            method: 'POST'
        }))
        console.log(resposta)
        exibirAlerta("alert-evento","Evento cadastrado com sucesso!","alert-success")
    } catch (error) {
        console.log(error)
        exibirAlerta("alert-cadastro","Ocorreu um erro ao cadastrar evento","alert-danger")
    }
})

/*fazer o upload aparecer*/
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

function exibirAlerta(id, alerta, classe){
    let divAlerta = document.getElementById(id)
    console.log(divAlerta)
    divAlerta.style.display = "block"
    divAlerta.classList.add(classe) 
    divAlerta.innerHTML = alerta
}


const GEMINI_KEY = "AIzaSyDOUPAW5g1QeSES72fG_I7iyHg4UCoi0ws";
  
async function geminiDescricao(nome, categoria) {
    try {
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
            {
                contents: [
                    {
                        role: "user",
                        parts: [
                            {
                                text: `Apresente uma descrição criativa e chamativa com base no nome: "${nome}" do evento e na categoria "${categoria}". Não precisa utilizar caracteres especiais no texto, como #, **, etc.`
                            }
                        ]
                    }
                ]
            },
            {
                headers: { "Content-Type": "application/json" }
            }
        );
  
        console.log("API Response:", response.data);
  
        const descricao = response.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  
        return descricao || "Descrição não gerada";
    } catch (error) {
        console.error("Erro ao gerar a descrição do evento:", error.response?.data || error.message);
        return "";
    }
}
  
async function gerarDescricao() {
    const nome = document.getElementById("nome").value;
    const categoria = document.getElementById("categoria").value;
    const descricao = document.getElementById("descricao");
  
    if (!nome || !categoria) {
        alert("Preencha o nome e a categoria do evento antes de gerar a sua descrição.");
        return;
    }
  
    descricao.value = "Gerando descrição..."; 
    const novaDescricao = await geminiDescricao(nome, categoria);
      
    if (novaDescricao) {
        descricao.value = novaDescricao;  
    } else {
        descricao.value = ""; 
        alert("Erro ao gerar uma descrição para este evento.");
    }
}

document.getElementById("btnGerarDescricao").addEventListener("click", gerarDescricao);