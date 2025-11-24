document.addEventListener("DOMContentLoaded", carregarRanking);

function carregarRanking() {
  const rankingList = document.getElementById("rankingList");
  rankingList.innerHTML = ""; // limpa a lista

  fetch("http://localhost:8080/ranking") 
    .then(response => {
      if (!response.ok) {
        throw new Error("Erro ao carregar ranking");
      }
      return response.json();
    })
    .then(usuarios => {
      if (!Array.isArray(usuarios)) return;

      usuarios.forEach((user, index) => {
        const li = document.createElement("li");
        li.classList.add("ranking-item");

        // Aplica destaque para o primeiro colocado
        if (index === 0) li.classList.add("top1");

        li.innerHTML = `
          <span>
            <span class="position">${index + 1}.</span>
            ${user.nomeUsuario}
          </span>
          <span>${user.pontosVerdes} pts</span>
        `;

        rankingList.appendChild(li);
      });
    })
    .catch(error => console.error("Erro no fetch do ranking:", error));
}
