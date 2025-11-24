document.getElementById("cadastroForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const nome = document.getElementById("nome").value;
    const sobrenome = document.getElementById("sobrenome").value;
    const email = document.getElementById("email").value;
    const dataNascimentoBr = document.getElementById("dataNascimento").value;
    const senha = document.getElementById("senha").value;
    const confirmaSenha = document.getElementById("confirma-senha").value;

    const dataNascimento = formatarDataParaISO(dataNascimentoBr);

        if (senha !== confirmaSenha) {
            document.getElementById("mensagem").textContent = "⚠️ As senhas digitadas não coincidem.";
            document.getElementById("mensagem").style.color = "red";
            return; // ❌ interrompe o envio
        }
    
           function formatarDataParaISO(dataBr) {
        // Espera formato "dd/mm/yyyy"
        const partes = dataBr.split('/');
        const dia = partes[0];
        const mes = partes[1];
        const ano = partes[2];
        return `${ano}-${mes}-${dia}`; // retorna "yyyy-mm-dd"
    }


    try {
        const response = await fetch("http://localhost:8080/usuario", { // ajuste a rota conforme seu Controller
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nome: nome,
                sobrenome: sobrenome,
                email: email,
                dataNascimento: dataNascimento,
                senha: senha
            })
        });

        if (response.ok) {
            const data = await response.json();
            document.getElementById("mensagem").textContent = "Cadastro realizado com sucesso!";
            document.getElementById("mensagem").style.color = "green";
            console.log("Usuário cadastrado:", data);
        } else {
            document.getElementById("mensagem").textContent = "Erro ao cadastrar usuário.";
            document.getElementById("mensagem").style.color = "red";
            console.error("Erro:", response.status);
        }
    } catch (error) {
        document.getElementById("mensagem").textContent = "Erro de conexão com o servidor.";
        document.getElementById("mensagem").style.color = "red";
        console.error("Erro de rede:", error);
    }
});


