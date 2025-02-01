# Contextualização
O projeto Divirtase.com consiste em uma Plataforma para divulgar e gerenciar eventos. Essa solução tem como objetivo permitir que os organizadores de eventos possam criar, gerenciar e divulgar seus eventos para o público alvo, e que os usuários consigam explorar seus interesses e conhecer lugares novos.

# Funcionalidades
- Criação e manutenção de eventos
- Exibição de eventos na Timeline
- Cadastro de usuários
- Integração com outros sistemas

# Tecnologias
As tecnologias usadas para o desenvolvimento são: Bootstrap e HTML/CSS para o Frontend e NodeJs mais o MongoDB para o Backend.

# Público alvo
- Organizadores de eventos
- Pessoas interessadas em experiências diversas

# Como executar o projeto
Primeiro, deve-se executar o arquivo docker compose para que os containers sejam gerados. Depois, deve-se acessar o container grupo-2-webserver. Em seguida, o usuário pode se cadastrar e cadastrar um evento, usando recursos de IA, o usuário pode gerar uma descrição com base no nome do evento e na categoria, clicando no botão "Gerar descrição". Após enviar o evento, a imagem será processada por outra inteligência artificial.
Para utilizar a função de gerar descrição, deve-se gerar uma chave api neste link: https://aistudio.google.com/apikey. E inseri-la na linha 49 do arquivo cadastro-evento.js
