// login.js
document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();
  
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
  
    const data = {
      email: email,
      password: password,
    };
  
    fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    .then((response) => response.json())
    .then((data) => {
      if (data.message === "Login bem-sucedido") {
        alert("Login realizado com sucesso!");
        window.location.href = "index.html";  // Redireciona para a página principal
      } else {
        alert(data.message);  // Exibe a mensagem de erro do servidor
      }
    })
    .catch((error) => {
      console.error("Erro ao tentar fazer login:", error);
      alert("Erro ao fazer login. Tente novamente.");
    });
  });
  