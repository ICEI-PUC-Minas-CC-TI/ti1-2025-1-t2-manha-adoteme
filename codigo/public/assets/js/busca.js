const API_URL = 'http://localhost:3000/pets'; // Mude para o endpoint correto do seu JSON Server
let petsCache = [];

// Função para buscar todos os pets da API
async function buscarPets() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Erro ao buscar pets');
    petsCache = await response.json();
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
      window.location.href = `detalhes.html?id=${id}`;
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
      <h2>${pet.nome} (${pet.especie})</h2>
      <p><strong>Raça:</strong> ${pet.raca}</p>
      <p><strong>Idade:</strong> ${pet.idade} anos</p>
      <p><strong>Sexo:</strong> ${pet.sexo}</p>
      <p><strong>Porte:</strong> ${pet.porte}</p>
      <p><strong>Peso:</strong> ${pet.peso} kg</p>
      <p><strong>Vacinado:</strong> ${pet.vacinado}</p>
      <p><strong>Vermifugado:</strong> ${pet.vermifugado}</p>
      <p><strong>Castrado:</strong> ${pet.castrado}</p>
      <p><strong>Condição:</strong> ${pet.condicao}</p>
      <p><strong>Temperamento:</strong> ${pet.temperamento}</p>
      <p><strong>Compatível com crianças:</strong> ${pet.criancas}</p>
      <p><strong>Compatível com outros pets:</strong> ${pet.outrosPets}</p>
      <p><strong>Localização:</strong> ${pet.localizacao}</p>
    `;
  } catch (error) {
    document.getElementById('petDetails').textContent = 'Erro ao carregar detalhes do pet.';
    console.error(error);
  }
}

// Função principal para decidir o que carregar
function main() {
  if (document.getElementById('petsList')) {
    buscarPets();
    configurarFiltros();
  } else if (document.getElementById('petDetails')) {
    carregarDetalhesPet();
  }
}

// Chama a função main quando a página carregar
window.addEventListener('DOMContentLoaded', main);
