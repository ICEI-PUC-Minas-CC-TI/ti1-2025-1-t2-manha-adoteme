const API_URL = 'http://localhost:3000/pets';
let petsCache = [];

// Função para buscar todos os pets da API
async function buscarPets() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Erro ao buscar pets');
    petsCache = await response.json();

    // Pré-preencher campo de busca se tiver parâmetro q na URL
    const urlParams = new URLSearchParams(window.location.search);
    const q = urlParams.get('q');
    if (q) {
      document.getElementById('searchInput').value = q;
    }

    mostrarPets(petsCache);
  } catch (error) {
    document.getElementById('petsList').textContent = 'Erro ao carregar pets.';
    console.error(error);
  }
}

// Função para mostrar lista de pets na tela
function mostrarPets(pets) {
  const petsList = document.getElementById('petsList');
  if (!pets || pets.length === 0) {
    petsList.innerHTML = '<p>Nenhum pet encontrado.</p>';
    return;
  }

  petsList.innerHTML = pets.map(pet => `
    <div class="pet-card">
      <img src="${pet.imagem}" alt="${pet.nome}" class="img-fluid rounded mb-2" style="max-height: 200px; object-fit: cover;">
      <h3>${pet.nome} (${pet.especie})</h3>
      <div class="pet-info">
        <p><strong>Raça:</strong> ${pet.raca}</p>
        <p><strong>Idade:</strong> ${pet.idade} anos</p>
        <p><strong>Porte:</strong> ${pet.porte}</p>
        <p><strong>Sexo:</strong> ${pet.sexo}</p>
      </div>
      <button class="btn-saiba-mais" data-id="${pet.id}">Saiba Mais</button>
    </div>
  `).join('');

  // Adiciona evento para os botões Saiba Mais
  document.querySelectorAll('.btn-saiba-mais').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      window.location.href = `../busca/detalhes.html?id=${id}`;
    });
  });
}

// Função para configurar os filtros e busca
function configurarFiltros() {
  const searchInput = document.getElementById('searchInput');
  const speciesFilter = document.getElementById('speciesFilter');
  const sizeFilter = document.getElementById('sizeFilter');
  const sexFilter = document.getElementById('sexFilter');
  const vaccinatedFilter = document.getElementById('vaccinatedFilter');

  function filtrar() {
    const nomeBusca = searchInput.value.toLowerCase();
    const especieBusca = speciesFilter.value;
    const porteBusca = sizeFilter.value;
    const sexoBusca = sexFilter.value;
    const vacinadoBusca = vaccinatedFilter.value;

    const petsFiltrados = petsCache.filter(pet => {
      const nomeMatch = pet.nome.toLowerCase().includes(nomeBusca);
      const especieMatch = !especieBusca || pet.especie === especieBusca;
      const porteMatch = !porteBusca || pet.porte === porteBusca;
      const sexoMatch = !sexoBusca || pet.sexo === sexoBusca;
      const vacinadoMatch = !vacinadoBusca || pet.vacinado === vacinadoBusca;

      return nomeMatch && especieMatch && porteMatch && sexoMatch && vacinadoMatch;
    });

    mostrarPets(petsFiltrados);
  }

  searchInput.addEventListener('input', filtrar);
  speciesFilter.addEventListener('change', filtrar);
  sizeFilter.addEventListener('change', filtrar);
  sexFilter.addEventListener('change', filtrar);
  vaccinatedFilter.addEventListener('change', filtrar);
}

// Função para carregar detalhes do pet na página detalhes.html
async function carregarDetalhesPet() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  if (!id) {
    document.getElementById('petDetails').textContent = 'ID do pet não informado.';
    return;
  }

  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error('Pet não encontrado');
    const pet = await response.json();

    const detalhesDiv = document.getElementById('petDetails');
    detalhesDiv.innerHTML = `
  <div class="d-flex flex-column flex-md-row gap-4 align-items-start">
    <img src="${pet.imagem}" alt="${pet.nome}" class="img-fluid rounded" style="max-width: 300px; height: auto; object-fit: cover;" />
    
    <div>
      <h2>${pet.nome} (${pet.especie})</h2>
      <p><strong>Raça:</strong> ${pet.raca}</p>
      <p><strong>Idade:</strong> ${pet.idade} anos</p>
      <p><strong>Sexo:</strong> ${pet.sexo}</p>
      <p><strong>Porte:</strong> ${pet.porte}</p>
      <p><strong>Peso:</strong> ${pet.peso} kg</p>
      <p><strong>Vacinado:</strong> ${pet.vacinado}</p>
      <p><strong>Castrado:</strong> ${pet.castrado}</p>
      <p><strong>Condição:</strong> ${pet.condicao}</p>
      <p><strong>Compatível com crianças:</strong> ${pet.criancas}</p>
      <p><strong>Compatível com outros pets:</strong> ${pet.outrosPets}</p>
      <p><strong>Localização:</strong> ${pet.localizacao}</p>
      <p><strong>Descrição:</strong> ${pet.descricao}</p>
    </div>
  </div>
`;

  } catch (error) {
    document.getElementById('petDetails').textContent = 'Erro ao carregar detalhes do pet.';
    console.error(error);
  }
}

// Função principal
function main() {
  if (document.getElementById('petsList')) {
    buscarPets();
    configurarFiltros();
  } else if (document.getElementById('petDetails')) {
    carregarDetalhesPet();
  }
}

window.addEventListener('DOMContentLoaded', main);