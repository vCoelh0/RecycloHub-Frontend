let toastShown = false; // impede múltiplos toasts ao mesmo tempo

function showToast(message, type = "success") {
  if (toastShown) return;
  toastShown = true;

  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.classList.add('toast');
  toast.classList.add(type === "success" ? "toast-success" : "toast-error");
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
    toastShown = false; // permite novas mensagens
  }, 3000);
}

async function verificarSessao() {
  try {
    const response = await fetch("http://localhost:8080/auth/usuario-logado", {
      method: "GET",
      credentials: "include"
    });

    if (response.ok) {
      const usuario = await response.json();

      loginBtn.style.display = "none";
      logoutBtn.style.display = "inline-block";

      localStorage.setItem("usuarioLogado", "true");

      console.log("Usuário logado:", usuario);
      return true;
    } else {
      loginBtn.style.display = "inline-block";
      logoutBtn.style.display = "none";

      localStorage.removeItem("usuarioLogado");
      return false;
    }

  } catch (error) {
    console.error("Erro ao verificar login:", error);
    return false;
  }
}

let loginBtn;
let logoutBtn;
let modal;
let closeModal;
let mensagem;
let loginForm;


window.addEventListener("load", () => {

loginBtn = document.getElementById("open-login");
  logoutBtn = document.getElementById("logoutBtn");
  modal = document.getElementById("login-modal");
  closeModal = document.querySelector(".close");
  mensagem = document.getElementById("mensagem");
  loginForm = document.getElementById("loginForm");

verificarSessao();

// Abre o modal
loginBtn.addEventListener("click", () => {
  modal.style.display = "flex";
});

// Fecha o modal
closeModal.addEventListener("click", () => {
  modal.style.display = "none";
});

// Fecha modal clicando fora dele
window.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});


document.getElementById("btn").addEventListener("click", () => {
  const alvo = document.getElementById("descarte");
  const yOffset = -230;
  const y = alvo.getBoundingClientRect().top + window.pageYOffset + yOffset;

  window.scrollTo({ top: y, behavior: "smooth" });
});

document.getElementById("linkPontos").addEventListener("click", () => {
  const alvo = document.getElementById("pontos");
  const yOffset = -50;
  const y = alvo.getBoundingClientRect().top + window.pageYOffset + yOffset;

  window.scrollTo({ top: y, behavior: "smooth" });
});


document.getElementById("linkDescarte").addEventListener("click", () => {
  const alvo = document.getElementById("descarte");
  const yOffset = -230;
  const y = alvo.getBoundingClientRect().top + window.pageYOffset + yOffset;

  window.scrollTo({ top: y, behavior: "smooth" });
});


document.getElementById("linkRanking").addEventListener("click", () => {
  const alvo = document.getElementById("ranking");
  const yOffset = -50; 
  const y = alvo.getBoundingClientRect().top + window.pageYOffset + yOffset;

  window.scrollTo({ top: y, behavior: "smooth" });
});

const scrollTopBtn = document.getElementById('scrollTopBtn');
const footer = document.getElementById('footer');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const footerTop = footer.getBoundingClientRect().top + window.scrollY;
  const windowHeight = window.innerHeight;

  // Mostrar botão quando rolar mais de 300px
  if (scrollY > 300) {
    scrollTopBtn.style.display = 'flex';
  } else {
    scrollTopBtn.style.display = 'none';
  }

  // Evitar que o botão fique sobre o footer
  const distanceFromBottom = footerTop - scrollY - windowHeight;
  if (distanceFromBottom < 20) { // margem de 20px
    scrollTopBtn.style.bottom = `${20 + Math.abs(distanceFromBottom)}px`;
  } else {
    scrollTopBtn.style.bottom = '30px'; // posição normal
  }
});

// Scroll suave para o topo
scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// const isLoggedIn = false; // substituir com verificação real        --(REMOVER)--
const formDescarte = document.querySelector('#descarte form');


formDescarte.addEventListener('submit', function(e) {
  e.preventDefault(); // sempre previne envio para controlar validações

  // Verifica se todos os campos estão preenchidos
  const endereco = document.getElementById('endereco').value.trim();
  const data = document.getElementById('data').value.trim();
  const objeto = document.getElementById('objeto').value.trim();
  const quantidade = document.getElementById('quantidade').value.trim();

  const logado = localStorage.getItem("usuarioLogado") === "true";
  if (!logado) {
    showToast('Você precisa estar logado para registrar um descarte!');
    // opcional: abrir modal de login
    return;
  }

  if (!endereco || !data || !objeto || !quantidade) {
    showToast('Preencha todos os campos para realizar o descarte!');
    return;
  }

  // Se passou nas validações, você pode enviar o formulário
  // formDescarte.submit();
  showToast('Descarte registrado com sucesso!');
});

//Abrir modal de Login
const links = document.querySelectorAll('.nav-menu a');

            links.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault(); // Evita comportamento padrão (pular para o topo)
                links.forEach(el => el.classList.remove('active')); // Remove de todos
                this.classList.add('active'); // Adiciona ao clicado
                });
                });

// ========================= ALTERAR BOTÃO DE LOGIN PARA LOGOU APÓS LOGADO =========================


// ---- Login ----

  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha }),
        credentials: "include"
      });

      if (response.ok) {

        const usuario = await response.json();

        mensagem.textContent = "Login realizado com sucesso!";
        mensagem.style.color = "green";

        setTimeout(() => {
          modal.style.display = "none";
          mensagem.textContent = "";

          loginBtn.style.display = "none";
          logoutBtn.style.display = "inline-block";

          localStorage.setItem("usuarioLogado", "true");
          localStorage.setItem("perfilUsuario", usuario.perfil);

          // REDIRECIONAMENTO CORRIGIDO (location)
          if (usuario.perfil === "ADMIN") {
            window.location.href = "admin.html";
          } else {
            window.location.href = "home.html";
          }

        }, 1000);

      } else {
        mensagem.textContent = "Email ou senha incorretos!";
        mensagem.style.color = "red";
      }

    } catch (error) {
      console.error("Erro ao fazer login:", error);
      mensagem.textContent = "Erro ao conectar com o servidor.";
      mensagem.style.color = "red";
    }
  });



// ---- Logout ----
logoutBtn.addEventListener("click", async () => {
  try {
    const response = await fetch("http://localhost:8080/auth/logout", {
      method: "POST",
      credentials: "include"
    });

    if (response.ok) {
      localStorage.removeItem("usuarioLogado");

      loginBtn.style.display = "inline-block";
      logoutBtn.style.display = "none";

      // showToast só funciona se descarte.js tiver sido carregado
      if (typeof showToast === "function") {
        showToast("Logout realizado com sucesso!", "success");
      }

      // Redireciona para home
      window.location.href = "home.html";

    } else {
      if (typeof showToast === "function") {
        showToast("Erro ao fazer logout.", "error");
      }
    }

  } catch (error) {
    console.error("Erro ao desconectar:", error);
  }
});


// ---- Verifica estado ao carregar a página ----
window.addEventListener("load", () => {
  const logado = localStorage.getItem("usuarioLogado");

  if (logado === "true") {
    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";
  } else {
    loginBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";
  }
});


});

