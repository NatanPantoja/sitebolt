const API_URL = "https://bolt-financeiro.squareweb.app"; // Tire a barra do final se tiver

// ... (Mantenha as máscaras de phoneInput e cpfInput IGUAIS, não mudei nada lá) ...
const phoneInput = document.getElementById("phone");
const cpfInput = document.getElementById("cpf");

// (Cole suas máscaras antigas aqui...)
phoneInput.addEventListener("input", (e) => {
  let value = e.target.value.replace(/\D/g, "");
  if (value.length > 11) value = value.slice(0, 11);
  if (value.length > 10) {
    value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3");
  } else if (value.length > 5) {
    value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3");
  } else if (value.length > 2) {
    value = value.replace(/^(\d{2})(\d{0,5}).*/, "($1) $2");
  }
  e.target.value = value;
});

cpfInput.addEventListener("input", (e) => {
  let value = e.target.value.replace(/\D/g, "");
  if (value.length > 11) value = value.slice(0, 11);
  value = value.replace(/(\d{3})(\d)/, "$1.$2");
  value = value.replace(/(\d{3})(\d)/, "$1.$2");
  value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  e.target.value = value;
});

// 👇 NOVO: LÓGICA VISUAL DA SELEÇÃO DE PLANO 👇
const planRadios = document.querySelectorAll('input[name="planType"]');
planRadios.forEach((radio) => {
  radio.addEventListener("change", (e) => {
    // Remove 'active' de todos
    document
      .querySelectorAll(".plan-card")
      .forEach((card) => card.classList.remove("active"));
    // Adiciona 'active' no pai do input selecionado
    e.target.closest(".plan-card").classList.add("active");
  });
});
// 👆 FIM DA LÓGICA VISUAL

// --- ENVIO DO FORMULÁRIO ---
document.getElementById("paymentForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const btn = document.getElementById("btnPay");
  const msg = document.getElementById("statusMsg");

  // Pega o plano selecionado
  const selectedPlan = document.querySelector(
    'input[name="planType"]:checked',
  ).value;

  btn.disabled = true;
  btn.innerText = "Gerando Pix...";
  msg.innerText = "";
  msg.style.color = "#ccc";

  const data = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    cpf: document.getElementById("cpf").value,
    planType: selectedPlan, // <--- ENVIANDO A ESCOLHA PRO BACKEND
  };

  try {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok) {
      msg.style.color = "#22c55e";
      msg.innerText = "Sucesso! Redirecionando...";

      setTimeout(() => {
        window.location.href = result.paymentUrl;
      }, 1000);
    } else {
      throw new Error(result.error || "Erro ao processar.");
    }
  } catch (error) {
    console.error(error);
    msg.style.color = "#ef4444";
    msg.innerText = "Erro: " + error.message;
    btn.disabled = false;
    btn.innerText = "TENTAR NOVAMENTE";
  }
});
