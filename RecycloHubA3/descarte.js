flatpickr("input[type='date']", {
  dateFormat: "d/m/Y",
  locale: "pt",
});

document.addEventListener("DOMContentLoaded", async () => {
  const selectPonto = document.getElementById("pontoColetaSelect");
  const form = document.querySelector(".descartar-form form"); // seleciona o form

  // 🔹 1. Buscar pontos de coleta e preencher o select
   try {
    const response = await fetch("http://localhost:8080/ponto-coleta", {
      credentials: "include"
    });

    if (!response.ok) throw new Error("Erro ao buscar pontos de coleta");
    const pontos = await response.json();

    pontos.forEach(p => {
      const option = document.createElement("option");
      option.value = p.id;
      option.textContent = `${p.id} - ${p.nome} (${p.endereco})`;
      selectPonto.appendChild(option);
    });
  } catch (err) {
    console.error("Erro ao carregar pontos:", err);
  }

//conversão de data
function formatarDataParaISO(dataBr) {
  if (!dataBr) return null; // evita erro de split em vazio
  const partes = dataBr.split('/');
  if (partes.length !== 3) return null;
  const [dia, mes, ano] = partes;
  return `${ano}-${mes}-${dia}`;
}
// const dataBruta = document.getElementById("data").value;
// const dataISO = formatarDataParaISO(dataBruta) || new Date().toISOString().split("T")[0];


  // 🔹 2. Enviar o descarte
 form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Pega o valor do campo de data (vem como "dd/mm/yyyy")
  const dataBruta = document.getElementById("data").value;

  // Converte para formato ISO ("yyyy-mm-dd")
  const dataISO = formatarDataParaISO(dataBruta);

  const data = {
    idPontoColeta: parseInt(selectPonto.value),
    tipoResiduo: document.getElementById("objeto").value,
    quantidade: parseInt(document.getElementById("quantidade").value),
    dataHora: dataISO
  };

  try {
    const response = await fetch("http://localhost:8080/descarte", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data)
    });

    if (!response.ok) throw new Error("Erro ao registrar descarte");

    showToast("✅ Descarte registrado com sucesso!", "success");
    form.reset();
    selectPonto.selectedIndex = 0;

  } catch (error) {
    console.error("Erro ao enviar descarte:", error);
    showToast("❌ Você precisa estar logado para realizar um descarte. Verifique os dados e tente novamente." , "error");
  }
});
});
