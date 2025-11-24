let toastShown = false;

function showToast(message, type = "success") {
  if (toastShown) return;
  toastShown = true;

  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.classList.add("toast", type === "success" ? "toast-success" : "toast-error");
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
    toastShown = false;
  }, 3000);
}


// ------------------------------------------
// ATUALIZAÇÃO DOS CARDS SUPERIORES (TEMPO REAL)
// ------------------------------------------
setInterval(() => {
  document.getElementById("usuarios").textContent = Math.floor(100 + Math.random() * 50);
  document.getElementById("reciclado").textContent = (3000 + Math.random() * 600).toFixed(0) + " kg";
  document.getElementById("pontos").textContent = Math.floor(5 + Math.random() * 10);
}, 5000);


// ------------------------------------------
// LOGOUT
// ------------------------------------------
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    try {
      const response = await fetch("http://localhost:8080/auth/logout", {
        method: "POST",
        credentials: "include"
      });

      if (response.ok) {
        localStorage.removeItem("usuarioLogado");
        localStorage.removeItem("perfilUsuario");
        window.location.href = "home.html";
      } else {
        showToast("Erro ao fazer logout.", "success");
      }
    } catch (error) {
      console.error("Erro ao desconectar:", error);
    }
  });
}


// ------------------------------------------
// CRIAR PONTO
// ------------------------------------------
document.addEventListener("DOMContentLoaded", () => {

  const btnCriar = document.getElementById("btnCriarPonto");

  btnCriar.addEventListener("click", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("nomePonto").value.trim();
    const capacidadeTotal = document.getElementById("capacidadeTotal").value.trim();
    const endereco = document.getElementById("endereco").value.trim();

    if (!nome || !capacidadeTotal || !endereco) {
      showToast("Preencha todos os campos antes de criar o ponto!", showToast);
      return;
    }

    const novoPonto = {
      nome,
      capacidadeTotal,
      endereco
    };

    try {
      const response = await fetch("http://localhost:8080/ponto-coleta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(novoPonto)
      });

      if (response.ok) {
        showToast("Ponto criado com sucesso!", "success");
        carregarPontosTabela();
      } else {
        showToast("Erro ao criar ponto."), error;
      }

    } catch (error) {
      console.error(error);
    showToast("Erro ao conectar com o servidor.", "error");
    }
  });
});


// ------------------------------------------
// CARREGAR LISTA DE PONTOS
// ------------------------------------------
document.addEventListener("DOMContentLoaded", carregarPontosTabela);

async function carregarPontosTabela() {
  try {
    const response = await fetch("http://localhost:8080/ponto-coleta", {
      method: "GET",
      credentials: "include"
    });

    if (!response.ok) throw new Error("Erro ao carregar pontos");

    const pontos = await response.json();
    atualizarTabela(pontos);

  } catch (error) {
    console.error("Erro ao carregar tabela:", error);
  }
}


// ------------------------------------------
// ATUALIZAR TABELA
// ------------------------------------------
function atualizarTabela(pontos) {
  const tabela = document.querySelector("#editarPonto table");

  tabela.querySelectorAll("tr:not(:first-child)").forEach(tr => tr.remove());

  pontos.forEach(p => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${p.nome}</td>
      <td>${p.endereco}</td>
      <td>Ativo</td>
      <td>${p.capacidadeTotal} kg</td>
      <td class="acoes">
          <img 
              src="./images/9d42ac21fb131d91686de1ff6ce15a1c6179ed1f.png" 
              class="btn-editar"
              data-id="${p.id}"
          />
          <img 
              src="./images/8936c67df27e5b4fc95fa08836a82c7d3a8f9333.png" 
              class="btn-deletar"
              data-id="${p.id}"
          />
      </td>
    `;

    tabela.appendChild(tr);
  });

  adicionarEventosDelete();
}



function showConfirmToast(message) {
  return new Promise((resolve) => {
    
    const toast = document.getElementById("toast-confirm");
    const msg = document.getElementById("toast-confirm-message");
    const btnYes = document.getElementById("toast-confirm-yes");
    const btnNo = document.getElementById("toast-confirm-no");

    msg.textContent = message;
    toast.classList.remove("hidden");

    const close = (result) => {
      toast.classList.add("hidden");
      resolve(result);
    };

    btnYes.onclick = () => close(true);
    btnNo.onclick = () => close(false);
  });
}


// ------------------------------------------
// DELETAR PONTO
// ------------------------------------------
async function deletarPonto(id) {

  const confirmar = await showConfirmToast("Deseja mesmo excluir este ponto?");

  if (!confirmar) return;

  try {
    const response = await fetch(`http://localhost:8080/ponto-coleta/${id}`, {
      method: "DELETE",
      credentials: "include"
    });

    if (response.ok) {
      showToast("Ponto removido com sucesso!", "success");
      carregarPontos(); // atualiza tabela
    } else {
      showToast("Erro ao excluir ponto!", "error");
    }

  } catch (error) {
    console.error(error);
    showToast("Erro ao conectar com o servidor!", "error");
  }
}



// ------------------------------------------
// VINCULAR CLIQUES DOS BOTÕES DELETAR
// ------------------------------------------
function adicionarEventosDelete() {
  const botoesDelete = document.querySelectorAll(".btn-deletar");

  botoesDelete.forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      deletarPonto(id);
    });
  });
}
