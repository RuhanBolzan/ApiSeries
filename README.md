# API de Séries

## Tema

API REST para cadastro e gerenciamento de séries.

## Objetivo

O objetivo deste projeto é desenvolver uma API REST utilizando ASP.NET Core e .NET 10, permitindo realizar operações de cadastro, consulta, atualização e exclusão de séries.

## Tecnologias utilizadas

- C#
- ASP.NET Core
- .NET 10
- Minimal API
- Bruno para testes das requisições

## Requisitos

- .NET 10 SDK instalado

Para verificar a versão do .NET instalada:

dotnet --version

## Como executar o projeto

Entre na pasta do projeto:

cd ApiSeries

Execute a aplicação:

dotnet run --urls http://localhost:5050

A API estará disponível em:

http://localhost:5050

Para verificar se o projeto está funcionando:

dotnet build

## Endpoints

| Método | Rota | Descrição | Resposta |
|---|---|---|---|
| GET | / | Verifica se a API está funcionando | 200 OK |
| GET | /api/series | Lista todas as séries | 200 OK |
| GET | /api/series/{id} | Busca uma série pelo ID | 200 OK / 404 Not Found |
| POST | /api/series | Cria uma nova série | 201 Created |
| PUT | /api/series/{id} | Atualiza uma série | 200 OK / 404 Not Found |
| DELETE | /api/series/{id} | Exclui uma série | 204 No Content / 404 Not Found |

## Exemplo de POST

Rota:

POST /api/series

JSON enviado:

{
  "titulo": "Breaking Bad",
  "genero": "Drama",
  "anoLancamento": 2008,
  "temporadas": 5
}

A API gera o ID automaticamente.

## Exemplo de PUT

Rota:

PUT /api/series/3

JSON enviado:

{
  "titulo": "Breaking Bad - Atualizada",
  "genero": "Drama",
  "anoLancamento": 2008,
  "temporadas": 5
}

## Armazenamento dos dados

Os dados desta API são armazenados apenas em memória utilizando uma List<SerieDto>.

Não é utilizado banco de dados ou Entity Framework.

Os dados são perdidos quando a aplicação é encerrada.

## DTOs

A API utiliza dois records:

- SerieDto: representa uma série completa, incluindo o ID.
- SerieEntradaDto: utilizado para entrada de dados no POST e PUT, sem o campo ID.

## Testes com Bruno

Os testes das requisições foram realizados utilizando o Bruno.

A Collection está disponível na pasta:

bruno/ApiSeries

A Collection contém os testes de:

- GET da raiz;
- GET de todas as séries;
- GET por ID;
- POST;
- PUT;
- DELETE;
- GET após exclusão, retornando 404.

## Vídeo da apresentação

## Vídeo de demonstração

[Assistir ao vídeo de demonstração](https://drive.google.com/file/d/1yp2JywLrh03hXQR6npiOjpRX1ExGKRAX/view?usp=sharing)

## Autor

Ruhan da Silva Bolzan