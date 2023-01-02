# Book Store

## INFO

Já existe um funcionário e um cliente registado.

Funcionário:
- Email: francisco@admin.com
- Pass: ert12345

Cliente:
- Email: luisousa2002@gmail.com
- Pass: ert12345

Se o cliente for criado no lado do backOffice, para aceder ao site tem de se registar outra vez com o mesmo email para continuar com os seus pontos.

Relativamente ao pagamento atraves da API Stripe, como está em modo teste é só aceite 1 cartão, os dados a colocar são:
- Email: O que quiser
- Numero do cartão: 

## Installation

Client Side and Server Side
```bash
npm install
```

Obs: Se no lado do servidor apararecer algum erro sobre o http-errors, basta usar o codigo abaixo:
```bash
npm install http-errors
```

## Configuration

```bash
Client Port: 4200
Server Port: 3000
```

## Running the app

```bash
# Client and Server
$ npm start
```

