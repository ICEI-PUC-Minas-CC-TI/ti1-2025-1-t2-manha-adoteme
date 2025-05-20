
// Elementos DOM
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const filterToggle = document.getElementById('filter-toggle');
const filterContent = document.getElementById('filter-content');
const resultsContainer = document.getElementById('results-container');

// Banco de dados de pets
let petsDatabase = [];

// Carregar dados do arquivo db.json
async function loadPetsData() {
    try {
        resultsContainer.innerHTML = '<div class="loading">Carregando dados...</div>';
        
        const response = await fetch('db.json');
        
        if (!response.ok) {
            throw new Error('Não foi possível carregar os dados. Verifique se o arquivo db.json está disponível.');
        }
        
        const data = await response.json();
        petsDatabase = data.pets;
        
        // Realizar uma busca inicial para mostrar todos os pets
        searchPets();
    } catch (error) {
        resultsContainer.innerHTML = `
            <div class="error-message">
                <h3>Erro ao carregar dados</h3>
                <p>${error.message}</p>
                <p>Verifique se o arquivo db.json está no mesmo diretório que este arquivo HTML.</p>
            </div>
        `;
        console.error('Erro ao carregar dados:', error);
    }
}

// Listener para abrir/fechar os filtros
filterToggle.addEventListener('click', () => {
    filterContent.classList.toggle('active');
    filterToggle.querySelector('span:last-child').textContent = 
        filterContent.classList.contains('active') ? '-' : '+';
});

// Função para buscar pets com base nos filtros
function searchPets() {
    // Mostrar indicador de carregamento
    resultsContainer.innerHTML = '<div class="loading">Buscando pets...</div>';
    
    // Simular um pequeno atraso para parecer que está carregando
    setTimeout(() => {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        // Coletar os filtros selecionados
        const selectedEspecies = Array.from(document.querySelectorAll('.pet-especie:checked')).map(checkbox => checkbox.value);
        const selectedPortes = Array.from(document.querySelectorAll('.pet-porte:checked')).map(checkbox => checkbox.value);
        const selectedSexos = Array.from(document.querySelectorAll('.pet-sexo:checked')).map(checkbox => checkbox.value);
        const selectedStatus = Array.from(document.querySelectorAll('.pet-status:checked')).map(checkbox => checkbox.value);
        const selectedConvivencia = Array.from(document.querySelectorAll('.pet-convivencia:checked')).map(checkbox => checkbox.value);
        const selectedTemperamento = Array.from(document.querySelectorAll('.pet-temperamento:checked')).map(checkbox => checkbox.value);
        
        // Filtrar os pets com base nos termos de busca e filtros
        const filteredPets = petsDatabase.filter(pet => {
            // Verificar termo de busca
            const matchesSearch = searchTerm === '' || 
                pet.nome.toLowerCase().includes(searchTerm) || 
                pet.raca.toLowerCase().includes(searchTerm) ||
                pet.especie.toLowerCase().includes(searchTerm);
            
            // Verificar filtros
            const matchesEspecie = selectedEspecies.length === 0 || selectedEspecies.includes(pet.especie);
            const matchesPorte = selectedPortes.length === 0 || selectedPortes.includes(pet.porte);
            const matchesSexo = selectedSexos.length === 0 || selectedSexos.includes(pet.sexo);
            
            // Verificar status (vacinado, vermifugado, castrado)
            const matchesStatus = selectedStatus.length === 0 || selectedStatus.every(status => {
                return pet[status] === "Sim";
            });
            
            // Verificar convivência (crianças, outros pets)
            const matchesConvivencia = selectedConvivencia.length === 0 || selectedConvivencia.every(conv => {
                return pet[conv] === "Sim";
            });
            
            // Verificar temperamento
            const matchesTemperamento = selectedTemperamento.length === 0 || selectedTemperamento.includes(pet.temperamento);
            
            return matchesSearch && matchesEspecie && matchesPorte && matchesSexo && matchesStatus && matchesConvivencia && matchesTemperamento;
        });
        
        // Exibir os resultados
        displayResults(filteredPets);
    }, 300);
}
function displayResults(pets) {
    if (pets.length === 0) {
        resultsContainer.innerHTML = `
            <div class="no-results">
                <h3>Nenhum pet encontrado</h3>
                <p>Tente ajustar seus filtros ou termos de busca.</p>
            </div>
        `;
        return;
    }
    
    resultsContainer.innerHTML = '';
    
    pets.forEach(pet => {
        const petCard = document.createElement('div');
        petCard.className = 'pet-card';

        let especieIconClass = 'icon-paw';
        if (pet.especie === 'Cachorro') especieIconClass = 'icon-dog';
        if (pet.especie === 'Gato') especieIconClass = 'icon-cat';
        if (pet.especie === 'Coelho') especieIconClass = 'icon-rabbit';

        const tags = [];
        if (pet.vacinado === "Sim") tags.push('<span class="pet-tag tag-yes">Vacinado</span>');
        if (pet.vermifugado === "Sim") tags.push('<span class="pet-tag tag-yes">Vermifugado</span>');
        if (pet.castrado === "Sim") tags.push('<span class="pet-tag tag-yes">Castrado</span>');
        if (pet.criancas === "Sim") tags.push('<span class="pet-tag tag-yes">Bom com crianças</span>');
        if (pet.outros_pets === "Sim") tags.push('<span class="pet-tag tag-yes">Bom com outros pets</span>');

        petCard.innerHTML = `
            <div class="pet-info">
                <h3><i class="${especieIconClass}"></i> ${pet.nome}</h3>
                <p><strong>Raça:</strong> ${pet.raca}</p>
                <p><strong>Espécie:</strong> ${pet.especie}</p>
                <p><strong>Temperamento:</strong> ${pet.temperamento}</p>
                <div class="pet-tags">
                    ${tags.join('')}
                </div>
            </div>
        `;

        resultsContainer.appendChild(petCard);
    });
}