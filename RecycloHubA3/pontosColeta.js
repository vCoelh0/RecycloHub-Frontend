let pontosCache = [];        // Todos os pontos carregados do backend
let filtroStatus = "Total";  // Estado atual do filtro (Total, Ativos, Manutenção)
let termoBusca = "";         // Texto digitado na busca
let swiper = null;           // Swiper será inicializado depois

document.addEventListener("DOMContentLoaded", async () => {
    configurarBusca();
    configurarFiltros();

    await carregarPontos();  // carrega e renderiza

    inicializarSwiper();     // inicializa o carrossel DEPOIS de carregar os cards
});

// ----------------------------------------------------------
// 1. Buscar pontos do backend
// ----------------------------------------------------------
async function carregarPontos() {
    try {
        const response = await fetch("http://localhost:8080/ponto-coleta", { credentials: "include" });
        if (!response.ok) throw new Error("Erro ao buscar pontos");

        pontosCache = await response.json();
        aplicarFiltros(); // já filtra e renderiza

    } catch (e) {
        console.error("Erro:", e);
    }
}

// ----------------------------------------------------------
// 2. Renderizar cards no Swiper
// ----------------------------------------------------------
function renderizarCards(lista) {
    const container = document.querySelector("#cardsPonto");
    if (!container) {
        console.warn("Elemento #cardsPonto não encontrado.");
        return;
    }

    container.innerHTML = ""; // limpa cards existentes

    lista.forEach(p => {
        const card = document.createElement("div");
        card.classList.add("swiper-slide"); // ESSENCIAL PARA O CARROSSEL FUNCIONAR

        card.innerHTML = `
            <div class="cardPonto">
                <h3>${p.nome}</h3>
                <p>${p.endereco}<br>${p.bairro || ""}</p>
                <p><strong>Capacidade</strong><br>Até ${p.capacidadeTotal}kg</p>

                <p class="status">
                    <span class="status-dot ativo"></span> Ativo
                </p>
            </div>
        `;

        container.appendChild(card);
    });

    // Atualiza o carrossel após adicionar os slides
    if (swiper) swiper.update();
}

// ----------------------------------------------------------
// 3. Configurar campo de busca
// ----------------------------------------------------------
function configurarBusca() {
    const input = document.querySelector(".search-bar input");
    if (!input) return;

    input.addEventListener("input", () => {
        termoBusca = input.value.toLowerCase();
        aplicarFiltros();
    });
}

// ----------------------------------------------------------
// 4. Configurar botões de filtro
// ----------------------------------------------------------
function configurarFiltros() {
    const botoes = document.querySelectorAll(".filter");
    if (!botoes) return;

    botoes.forEach(btn => {
        btn.addEventListener("click", () => {
            botoes.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            filtroStatus = btn.textContent.trim(); // Total, Ativos, Manutenção
            aplicarFiltros();
        });
    });
}

// ----------------------------------------------------------
// 5. Aplicar filtros combinados
// ----------------------------------------------------------
function aplicarFiltros() {
    let filtrados = [...pontosCache];

    //  Filtro de texto
    if (termoBusca.trim() !== "") {
        filtrados = filtrados.filter(p =>
            p.nome.toLowerCase().includes(termoBusca) ||
            p.endereco.toLowerCase().includes(termoBusca) ||
            (p.bairro && p.bairro.toLowerCase().includes(termoBusca))
        );
    }

    // 🔧 Filtro de status
    if (filtroStatus === "Manutenção") {
        filtrados = []; // ainda não há dados reais
    }

    renderizarCards(filtrados);
}

// ----------------------------------------------------------
// 6. Inicializar SWIPER depois que os cards foram carregados
// ----------------------------------------------------------
function inicializarSwiper() {
    swiper = new Swiper(".mySwiper", {
        slidesPerView: 3,
        spaceBetween: 20,
        loop: false,
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
    });
}
