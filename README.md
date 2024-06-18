## Tecnologias 🖥️

Este projeto está utilizando as seguintes tecnologias:

- [Node.js](https://nodejs.org/en)
- [Puppeteer](https://pptr.dev/)
- [Readline-Sync](https://github.com/anseki/readline-sync)

## Descrição 📜

Esse projeto consiste em uma aplicação console que fornece informações dos elencos, próximas partidas e notícias referentes ao Corinthians. O sistema é inicializado, mostra as opções, o usuário escolhe e são mostradas as informações de acordo com essa opção.

Todas as informações são retiradas do site oficial do [Sport Club Corinthians Paulista](https://www.corinthians.com.br/). Para efetuar o acesso ao site é utilizado a biblioteca de web scrapping [Puppeteer](https://pptr.dev/) e os registros de input do usuário ficam por conta da lib [Readline-Sync](https://github.com/anseki/readline-sync).

## Como rodar esse projeto? 💿

<h3>Pré-requisitos</h3>

- [Git](https://git-scm.com/)
- [Github](https://github.com/)
- [Node.js](https://nodejs.org/en)

<h3>Clonagem</h3>

```bash
# clone o repositório
$ git clone https://github.com/bastosmatheus/bot-corinthians.git
```

<h3>Projeto</h3>

```bash
# depois de clonado, procure a pasta do projeto
$ cd bot-corinthians

# instale todas as dependências
$ npm install

# execute o projeto
$ npm run dev
```
