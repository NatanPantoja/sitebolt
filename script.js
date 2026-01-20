const API_URL = "http://localhost:3000";

// --- MÁSCARAS DE INPUT (UX) ---
const phoneInput = document.getElementById("phone");
const cpfInput = document.getElementById("cpf");

phoneInput.addEventListener("input", (e) => {
  let value = e.target.value.replace(/\D/g, "");
  if (value.length > 11) value = value.slice(0, 11);

  if (value.length > 10) {
    // Formato (99) 99999-9999
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

// --- ENVIO DO FORMULÁRIO ---
document.getElementById("paymentForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const btn = document.getElementById("btnPay");
  const msg = document.getElementById("statusMsg");

  // Animação de Carregando
  btn.disabled = true;
  btn.innerText = "Gerando Pix...";
  msg.innerText = "";
  msg.style.color = "#ccc";

  const data = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value, // Envia formatado mesmo, o backend limpa
    cpf: document.getElementById("cpf").value,
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
      msg.innerText = "Sucesso! Redirecionando para o pagamento...";

      // Redireciona para o Link do Mercado Pago
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
