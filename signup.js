// signup.js
document.getElementById("signupForm").addEventListener("submit", function(event) {
  event.preventDefault();

  // Captura os dados do formulário
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  // Valida a confirmação de senha
  if (password !== confirmPassword) {
    alert("As senhas não coincidem. Tente novamente.");
    return;
  }

  // Valida a força da senha (mínimo de 8 caracteres, 1 letra maiúscula, 1 número e 1 caractere especial)
  const passwordStrength = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordStrength.test(password)) {
    alert("A senha deve ter pelo menos 8 caracteres, incluir uma letra maiúscula, um número e um caractere especial.");
    return;
  }

  // Envia os dados para o backend
  const data = {
    name: name,
    email: email,
    password: password,
  };

  // Exibe indicador de carregamento
  const loadingIndicator = document.getElementById('loading');
  loadingIndicator.style.display = 'block'; 

  fetch("http://localhost:3000/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Erro ao cadastrar. Verifique seus dados e tente novamente.');
      }
      return response.json();
    })
    .then((data) => {
      alert("Usuário cadastrado com sucesso!");
      window.location.href = "login.html"; // Redireciona para a página de login
    })
    .catch((error) => {
      console.error("Erro ao cadastrar:", error);
      alert(error.message); // Exibe a mensagem de erro para o usuário
    })
    .finally(() => {
      loadingIndicator.style.display = 'none'; // Oculta o indicador de carregamento
    });
});
