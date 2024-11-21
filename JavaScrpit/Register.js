document.getElementById("signupForm").addEventListener("submit", function(event) {
    event.preventDefault();  // Previne o envio do formulário para não recarregar a página

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

    // Valida o formato do email
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
        alert("Por favor, insira um email válido.");
        return;
    }

    // Envia os dados de cadastro para o backend
    const userData = {
        name: name,
        email: email,
        password: password,
        confirmPassword: confirmPassword
    };

    fetch("http://localhost:3000/register", {  // URL do backend (ajuste conforme necessário)
        method: "POST",
        headers: {
            "Content-Type": "application/json",  // Defina o tipo de conteúdo como JSON
        },
        body: JSON.stringify(userData)  // Envia os dados no corpo da requisição
    })
    .then(response => response.json())  // Espera a resposta do servidor
    .then(data => {
        if (data.message === "Usuário cadastrado com sucesso") {
            alert("Usuário cadastrado com sucesso!");
            window.location.href = "login.html";  // Redireciona para a página de login após o sucesso
        } else {
            alert(data.message);  // Exibe mensagem de erro se houver
        }
    })
    .catch(error => {
        console.error("Erro ao enviar dados para o servidor:", error);
        alert("Ocorreu um erro. Tente novamente.");
    });
});
