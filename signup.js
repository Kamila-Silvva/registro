const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const cors = require("cors");

const app = express();
const port = 3000;

// Habilitando o CORS
app.use(cors());

// Configuração do body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Conexão com o banco de dados MySQL
const db = mysql.createConnection({
  host: "localhost",       // Altere para o host do seu servidor MySQL
  user: "root",            // Usuário do banco de dados
  password: "sua_senha",   // Senha do banco de dados
  database: "ong"          // Nome do banco de dados
});

// Conectando ao banco de dados
db.connect((err) => {
  if (err) {
    console.error("Erro ao conectar ao banco de dados:", err.message);
    process.exit(1); // Sai do processo se não conseguir conectar
  } else {
    console.log("Conectado ao banco de dados MySQL");
  }
});

// Endpoint para registrar um usuário
app.post("/register", (req, res) => {
  const { nome, email, senha } = req.body;

  // Verifica se o email já está cadastrado
  const emailCheckQuery = "SELECT * FROM usuarios WHERE email = ?";
  db.query(emailCheckQuery, [email], (err, results) => {
    if (err) {
      console.error("Erro ao verificar email:", err);
      return res.status(500).send("Erro ao verificar email");
    }

    if (results.length > 0) {
      return res.status(400).send("Email já cadastrado");
    }

    // Criptografa a senha antes de salvar no banco de dados
    bcrypt.hash(senha, 10, (err, hashedPassword) => {
      if (err) {
        console.error("Erro ao criptografar a senha:", err);
        return res.status(500).send("Erro ao criptografar a senha");
      }

      // Insere os dados no banco de dados
      const insertUserQuery = "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)";
      db.query(insertUserQuery, [nome, email, hashedPassword], (err) => {
        if (err) {
          console.error("Erro ao cadastrar usuário:", err);
          return res.status(500).send("Erro ao cadastrar usuário");
        } else {
          res.status(200).send("Usuário cadastrado com sucesso");
        }
      });
    });
  });
});

// Iniciando o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
