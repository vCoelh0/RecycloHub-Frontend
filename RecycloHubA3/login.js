document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault();

   const email = document.getElementById("email").value;
   const senha = document.getElementById("senha").value;

   try {
        const response = await fetch("http://localhost:8080/auth/login", { 
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include", // mantem a sessão de cookies
            body: JSON.stringify({     
                email: email,
                senha: senha
            })
        });

        if (response.ok) {
            const data = await response.json();
            document.getElementById("mensagem").textContent = 
            `Bem-vindo(a), ${data.nome}! Login realizado com sucesso.`;
            document.getElementById("mensagem").style.color = "green";

            //Redirecionar o usuario para a Home
            setTimeout(() => {
                window.location.href = "home.html";
            }, 1500);

        } else { 
            const erroTexto = await response.text();
            document.getElementById("mensagem").textContent =
                erroTexto || "Email ou senha invalidos.";
            document.getElementById("mensagem").style.color = "red";   
        }
    } catch(error){
        document.getElementById("mensagem").textContent =
            "Erro de conexão com o servidor.";
        document.getElementById("mensagem").style.color = "red";
    }
});