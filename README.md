# API de Séries

## Tema

API REST para cadastro e gerenciamento de séries, com persistência em banco de dados e frontend integrado.

## Objetivo

O objetivo deste projeto é desenvolver uma API REST utilizando ASP.NET Core e .NET 10, permitindo realizar operações de cadastro, consulta, atualização e exclusão de séries. Os dados são armazenados em um banco de dados SQLite, garantindo que permaneçam salvos mesmo após o encerramento da aplicação.

## Tecnologias utilizadas

- C#
- ASP.NET Core
- .NET 10
- Minimal API
- Entity Framework Core
- SQLite
- HTML, CSS e JavaScript
- Bruno para testes das requisições

## Requisitos

- .NET 10 SDK instalado
- Ferramenta Entity Framework Core CLI (`dotnet-ef`)

Para verificar a versão do .NET instalada:

```bash
dotnet --version
```

Caso ainda não tenha a ferramenta `dotnet-ef`, instale-a com:

```bash
dotnet tool install --global dotnet-ef
```

## Como executar o projeto

Abra o terminal na pasta do projeto:

```bash
cd ApiSeries
```

Restaure as dependências:

```bash
dotnet restore
```

Crie ou atualize o banco de dados utilizando as migrações:

```bash
dotnet ef database update
```

Execute a aplicação:

```bash
dotnet run --urls http://localhost:5094
```

A aplicação estará disponível em:

- **Frontend:** http://localhost:5094/
- **API:** http://localhost:5094/api/series

Para verificar se o projeto compila corretamente:

```bash
dotnet build
```

## Funcionalidades do frontend

A interface web permite:

- Listar as séries cadastradas;
- Cadastrar novas séries;
- Editar séries existentes;
- Excluir séries;
- Consultar os dados armazenados pela API.

O frontend utiliza HTML, CSS e JavaScript e se comunica com a API no mesmo endereço da aplicação.

## Endpoints

| Método | Rota | Descrição | Resposta |
|---|---|---|---|
| GET | `/api/series` | Lista todas as séries | 200 OK |
| GET | `/api/series/{id}` | Busca uma série pelo ID | 200 OK / 404 Not Found |
| POST | `/api/series` | Cadastra uma nova série | 201 Created |
| PUT | `/api/series/{id}` | Atualiza uma série existente | 200 OK / 404 Not Found |
| DELETE | `/api/series/{id}` | Exclui uma série | 204 No Content / 404 Not Found |

## Exemplo de POST

**Rota:**

```http
POST /api/series
```

**JSON enviado:**

```json
{
  "titulo": "Dark",
  "genero": "Ficção científica",
  "anoLancamento": 2017,
  "temporadas": 3
}
```

O ID é gerado automaticamente pelo banco de dados.

## Exemplo de PUT

**Rota:**

```http
PUT /api/series/1
```

**JSON enviado:**

```json
{
  "titulo": "Dark - Atualizada",
  "genero": "Ficção científica",
  "anoLancamento": 2017,
  "temporadas": 3
}
```

O ID informado na rota identifica a série que será atualizada.

## Armazenamento dos dados

Os dados são armazenados em um banco de dados SQLite, utilizando o Entity Framework Core para realizar as operações de persistência.

O arquivo `series.db` é criado localmente na pasta do projeto após a inicialização do banco de dados.

Diferentemente da versão anterior, os dados não são perdidos quando a aplicação é encerrada, pois ficam armazenados no banco de dados.

As migrações do Entity Framework Core estão disponíveis na pasta `Migrations`.

## DTOs

A API utiliza DTOs para representar e receber os dados das séries:

- `SerieDto`: representa uma série, incluindo seu ID.
- `SerieEntradaDto`: representa os dados recebidos no cadastro e na atualização, sem o campo ID.

## Testes com Bruno

Os testes das requisições foram realizados utilizando o Bruno.

A coleção está disponível na pasta:

```text
bruno/ApiSeries
```

A coleção contempla testes de:

- GET de todas as séries;
- GET por ID;
- POST;
- PUT;
- DELETE;
- GET após exclusão, verificando o retorno 404 para uma série inexistente.

## Vídeo de demonstração

[Assistir ao vídeo de demonstração](https://drive.google.com/file/d/1HWLbiJhG16j8qdhRmccUbPhTSbGbLiIL/view?usp=sharing)

## Autor

Ruhan da Silva Bolzan
