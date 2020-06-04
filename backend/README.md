<p align="center">
  <img src="../.github/nodejs.png" width=200 />
</>

# ❕Instalação e configuração:

Instalação

# Conceitos - Back-End:

## 👾 API:

_Application Programming Interface_ (Interface de Programação de Aplicativos) é uma forma que servir dados e informações para aplicações _Front-End_, onde o usuário poderá ver esses dados.

Nesse projeto, utilizamos o conceito _RESTful_, que significa que as informações que seram disponibilizadas para os clientes (_Web_ ou _Mobile_) serão enviadas através de **rotas** e um "linguagem" que ambos lados conhecham, o _JSON_ (JavaScript Object Notation).

Você poderá ser essas **rotas** clicando [aqui](./src/routes.ts).

## 🔀 Rotas:

São os caminhos do nosso _Back-End_, onde disponibilizaremos as informações para o _Front-End_.

### Tipos de rotas:

#### _GET_:

O cliente irá acessar uma rota do tipo _GET_ quando ele quiser buscar um ou mais dados do _Back-End_.

#### _POST_:

O cliente irá acessar uma rota do tipo _POST_ quando ele quiser adicionar alguma nova informação no _Back-End_.

#### _PUT_:

O cliente irá acessar uma rota do tipo _PUT_ quando o mesmo quiser atualizar ou alterar uma informação já existente no _Back-End_.

#### _DELETE_:

O cliente irá acessar uma rota do tipo _DELETE_ no caso de deletar uma informação já existe no _Back-End_.

### Parâmetros gerais das rotas:

- **Request**: Nesse parâmetro, estão todas as informações do cliente que está fazendo a **requisição** para o _Back-End_.

- **Response**: Nesse parâmetro, estão as informações que o _Back-End_ pode devolver para o cliente.

- **Request Param**: Parâmetros que vem na própria **rota** e representam um **único** dado. EX:

  ```
  http://localhost:3333/users/:id
  ```

  Tendo acesso aos _Request Params_:

  ```javascript
  const params = request.params;
  ```

- **Query Param**: Parâmetros que vem na própria e geralmente opcionais. Servem para filtros, paginação, ect;

  ```
  http://localhost:3333/users?search=on
  ```

  Tendo acesso aos _Query Params_:

  ```javascript
  const query = request.query;
  ```

- **Request Body**: Parâmetros para criação/atualização de informações.

  Tendo acesso aos _Request Body_:

  ```javascript
  const body = request.body;
  ```

## Bancos de dados:

### 🤝 Bancos de dados relacioais:

- Definem relacionamentos entre as entidades na aplicação.
- Tipos de bancos de dados relacioanis:
  - MySQL, SQLite, PostgreSQL, Oracle, Micrisoft SQL Server.
- Mais utilizado no mercado.

- **Opções para banco de dados relacionais**:

  - Usando a linguagem SQL.

  ```sql
  SELECT * FROM users;
  ```

  - Query builder:

  ```javascript
  table('users').select('*').where('...');
  ```

#### Para ver as configurações do banco de dados desse projeto, clique [aqui](./src/database/connection.ts).

#### Para conhecer o Query Builder usado nesse projeto, clique [aqui](http://knexjs.org/)

### 🤚 Bancos de dados não relacionais:

- Não definem relacionamentos entre as entidades do projeto.
- Tipos de bancos de dados não relacionais:
  - MongoDB, CounchDB, Redis, etc.

## Definindo a aplicação:

### 👬 Entidades da aplicação:

<details>
 <summary>collection_points</summary>

- Locais para coleta do lixo.
- Campos da tabela _collection_points_:
  - image
  - name
  - email
  - whatsapp
  - latitude
  - longitude
  - city
  - uf
  </details>

<details>
 <summary>items</summary>

- Items que serão coletados.
- Campos da tabela _Items_:
    - title
    - image
</details>

<details>
 <summary>point_items</summary>

- Tabela de relação entre as entidades Collection Points e Items.
- Campos da tabela _point_items_:
    - point_id
    - item_id
</details>

### 🔥 Funcionalidades:

- [x] Cadastro de ponto de coleta.
- [x] Listagem de itens de coleta.
- [x] Listagem de pontos de coleta - Filtro por estado, cidade - Filtro por itens.
- [x] Listar um ponto de coleta específico.

---

Feito com ❤ por João Pedro Araújo. [Veja meu Linkedin!](https://www.linkedin.com/in/joaopedroasz/)
