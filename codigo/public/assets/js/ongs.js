const URL = 'http://localhost:3000/ongs';

function displayMessage(msg, type = 'warning') {
  document.getElementById('msg').innerHTML =
    `<div class="alert alert-${type}">${msg}</div>`;
  setTimeout(() => {
    document.getElementById('msg').innerHTML = '';
  }, 3000);
}

function getFormData() {
  return {
    nome: document.getElementById('inputNome').value,
    telefone: document.getElementById('inputTelefone').value,
    email: document.getElementById('inputEmail').value,
    cidade: document.getElementById('inputCidade').value,
    categoria: document.getElementById('inputCategoria').value,
    website: document.getElementById('inputSite').value,
    responsavel: document.getElementById('inputResponsavel').value,
    cnpj: document.getElementById('inputCnpj').value,
    fundacao: document.getElementById('inputFundacao').value,
    descricao: document.getElementById('inputDescricao').value
  };
}

function preencherTabela(ongs) {
  const tbody = document.getElementById('table-contatos');
  tbody.innerHTML = '';
  ongs.forEach(ong => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${ong.id}</td>
      <td>${ong.nome}</td>
      <td>${ong.telefone}</td>
      <td>${ong.email}</td>
      <td>${ong.cidade}</td>
      <td>${ong.categoria}</td>
      <td>${ong.site}</td>`;
    tr.onclick = () => preencherFormulario(ong);
    tbody.appendChild(tr);
  });
}

function preencherFormulario(ong) {
  document.getElementById('inputId').value = ong.id;
  document.getElementById('inputNome').value = ong.nome;
  document.getElementById('inputTelefone').value = ong.telefone;
  document.getElementById('inputEmail').value = ong.email;
  document.getElementById('inputCidade').value = ong.cidade;
  document.getElementById('inputCategoria').value = ong.categoria;
  document.getElementById('inputSite').value = ong.website;
  document.getElementById('inputResponsavel').value = ong.responsavel;
  document.getElementById('inputCnpj').value = ong.cnpj;
  document.getElementById('inputFundacao').value = ong.fundacao;
  document.getElementById('inputDescricao').value = ong.descricao;
}

function limparFormulario() {
  document.getElementById('form-ong').reset();
  document.getElementById('inputId').value = '';
}

async function listarONGs() {
  const res = await fetch(URL);
  const data = await res.json();
  const cidade = document.getElementById('filtro_cidade')?.value;
  const categoria = document.getElementById('filtro_categoria')?.value;
  const filtrados = data.filter(ong =>
    (!cidade || ong.cidade === cidade) &&
    (!categoria || ong.categoria === categoria)
  );
  preencherTabela(filtrados);
}

async function inserirONG() {
  const ong = getFormData();
  const res = await fetch(URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ong)
  });
  if (res.ok) {
    displayMessage("ONG cadastrada com sucesso!", "success");
    limparFormulario();
    listarONGs();
  }
}

async function alterarONG() {
  const id = document.getElementById('inputId').value;
  if (!id) return displayMessage("Selecione uma ONG para alterar");
  const ong = getFormData();
  const res = await fetch(`${URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ong)
  });
  if (res.ok) {
    displayMessage("ONG atualizada com sucesso!", "success");
    limparFormulario();
    listarONGs();
  }
}

async function excluirONG() {
  const id = document.getElementById('inputId').value;
  if (!id) return displayMessage("Selecione uma ONG para excluir");
  const res = await fetch(`${URL}/${id}`, { method: 'DELETE' });
  if (res.ok) {
    displayMessage("ONG excluída com sucesso!", "success");
    limparFormulario();
    listarONGs();
  }
}

// Eventos
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('btnInsert')) {
    listarONGs();
    document.getElementById('btnInsert').onclick = inserirONG;
    document.getElementById('btnUpdate').onclick = alterarONG;
    document.getElementById('btnDelete').onclick = excluirONG;
    document.getElementById('btnClear').onclick = limparFormulario;
  }
  if (document.getElementById('filtro_cidade')) {
    document.getElementById('filtro_cidade').onchange = listarONGs;
    document.getElementById('filtro_categoria').onchange = listarONGs;
    listarONGs();
  }
});