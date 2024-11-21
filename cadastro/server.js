const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const cors = require("cors");  // Importando o middleware CORS

const app = express();
const port = 3000;

// Habilitando o CORS para todas as origens (você pode restringir a origens específicas, se necessário)
app.use(cors());

// Configuração do body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Conexão com o banco de dados SQLite
const db = new sqlite3.Database('users.db', (err) => {
  if (err) {
    console.error("Erro ao conectar ao banco de dados: ", err.message);
  } else {
    console.log("Conectado ao banco de dados");
  }
});

// Criando a tabela se ela não existir
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
  );
`;

db.run(createTableQuery, (err) => {
  if (err) {
    console.error("Erro ao criar a tabela: ", err.message);
  } else {
    console.log("Tabela 'users' criada ou já existe.");
  }
});

// Endpoint para registrar um usuário
app.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  // Verifica se o email já está cadastrado
  const emailCheckQuery = "SELECT * FROM users WHERE email = ?";
  db.get(emailCheckQuery, [email], (err, row) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Erro ao verificar email");
    }

    if (row) {
      return res.status(400).send("Email já cadastrado");
    }

    // Criptografa a senha antes de salvar no banco de dados
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Erro ao criptografar a senha");
      }

      // Query para inserir os dados no banco
      const query = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
      db.run(query, [name, email, hashedPassword], (err) => {
        if (err) {
          console.log(err);
          res.status(500).send("Erro ao cadastrar usuário");
        } else {
          res.status(200).send("Usuário cadastrado com sucesso");
        }
      });
    });
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
