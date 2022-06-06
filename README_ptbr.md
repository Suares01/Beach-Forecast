<div id="top"></div>

<h1 align="center">API de surfe para obter previsões</h1>

Português | [English](./README.md)

>Este projeto foi feito para fins de aprendizado, portanto possui algumas limitações que serão explicadas.

Essa é uma API para obter previsões de suas praias favoritas. Você pode cadastrar as praias com sua latitude e longitude, e pronto, você receberá as previsões de suas praias cadastradas.

<details>
  <summary>Tabela de conteúdo</summary>
  <ol>
    <li><a href="#funcionalidades">Funcionalidades</a></li>
    <li><a href="#construido-com">Construido com</a></li>
    <li><a href="#rotas">Rotas</a></li>
    <li><a href="#licenca">Licença</a></li>
    <li><a href="#contato">Contato</a></li>
  </ol>
</details>

---

<div id="limitacoes"></div>

<p align="right">(<a href="#top">Voltar ao topo</a>)</p>

## Funcionalidades

- [x] Cadastro e login de usuário
- [x] Cadastro de praias
- [x] Algoritmo de classificação de previsões
- [x] Privisões para praias cadastradas por usuário

<p align="right">(<a href="#top">Voltar ao topo</a>)</p>

## Construido com

- Node.js
- TypeScript
- Mongoose
- Express
- jest/supertest

<p align="right">(<a href="#top">Voltar ao topo</a>)</p>

## Rotas

O endpoint base da API é https://forecast.up.railway.app/, para mais informações e testar as rotas veja a documentação [aqui](https://forecast.up.railway.app/docs/).

**/users**: Esta rota é responsável pela criação do usuário. Você deve enviar o **nome**,**e-mail** e **senha** no corpo da solicitação. Você recebe um objeto com id de usuário, nome e email.

**/users/authenticate**: Esta rota é responsável pela autenticação do usuário. Você deve enviar ao usuário **e-mail** e **senha** no corpo da solicitação. Você recebe um objeto com o token de usuário, este token contém um objeto com id de usuário, nome e email.

**/users/me**: Esta rota é responsável por decodificar o token do usuário e retornar as informações do usuário dentro do token. Você precisa enviar o token no campo **x-access-token** no cabeçalho da solicitação.

**/praias**: Esta rota é responsável por criar as praias do usuário. Os campos mais importantes são **lat** (latitude) e **lng** (longitude), latitude e longitude são a forma de localizar a praia e fazer previsões para aquela região. Encontrar a latitude e longitude da sua praia é fácil, uma simples busca resolve.

**/forecast**: Esta é a rota principal da API, responsável por retornar as previsões das próximas 24 horas com sua classificação (0 a 5).

<p align="right">(<a href="#top">Voltar ao topo</a>)</p>

<div id="licenca"></div>

## Licença

Distribuído sob a licença MIT. Consulte `LICENSE` para obter mais informações.

<p align="right">(<a href="#top">Voltar ao topo</a>)</p>

## Contato

Lucas Suares - suares_silva.01@hotmail.com

<p align="right">(<a href="#top">back to top</a>)</p>

---

<p align="center">Copyright © 2022 Lucas Suares</p>
