const API_URL = 'https://ti1-2025-1-t2-manha-adoteme-p1jd.onrender.com/pets';
const ADOPTION_REQUESTS_KEY = 'adoptionRequests';

document.addEventListener('DOMContentLoaded', async () => {
    const petInfoSummary = document.getElementById('petInfoSummary');
    const adoptionForm = document.getElementById('adoptionForm');
    const alertMessage = document.getElementById('alertMessage');
    const errorMessage = document.getElementById('errorMessage');

    let petId = null; // Variável para armazenar o ID do pet que será adotado

    // 1. Obter o ID do pet da URL e CONVERTER PARA NÚMERO
    const urlParams = new URLSearchParams(window.location.search);
    petId = parseInt(urlParams.get('petId'));

    if (isNaN(petId)) { // Verifica se a conversão resultou em "Not a Number"
        petInfoSummary.innerHTML = '<p class="text-danger">ID do pet inválido na URL.</p>';
        errorMessage.textContent = 'Não foi possível carregar o formulário: ID do pet ausente ou inválido.';
        errorMessage.style.display = 'block';
        if (adoptionForm) adoptionForm.style.display = 'none'; // Esconde o formulário se não houver ID
        return;
    }

    // 2. Buscar detalhes do pet e exibir no resumo
    try {
        const response = await fetch(`${API_URL}/${petId}`);
        if (!response.ok) throw new Error('Pet não encontrado.');
        const pet = await response.json();

        if (petInfoSummary) { // Adiciona verificação para petInfoSummary
            petInfoSummary.innerHTML = `
                <img src="${pet.imagem || 'https://via.placeholder.com/100'}" alt="${pet.nome}" class="img-fluid rounded">
                <div>
                    <p>Você está solicitando a adoção de:</p>
                    <h4><strong>${pet.nome}</strong> (${pet.especie}, ${pet.raca})</h4>
                    <p>Idade: ${pet.idade} anos | Porte: ${pet.porte} | Sexo: ${pet.sexo}</p>
                </div>
            `;
            // Armazenar detalhes do pet para usar depois (se necessário, como para a solicitação)
            petInfoSummary.dataset.petDetails = JSON.stringify(pet);
        }

    } catch (error) {
        if (petInfoSummary) petInfoSummary.innerHTML = '<p class="text-danger">Erro ao carregar detalhes do pet.</p>';
        if (errorMessage) {
            errorMessage.textContent = 'Erro ao carregar detalhes do pet. Por favor, tente novamente.';
            errorMessage.style.display = 'block';
        }
        if (adoptionForm) adoptionForm.style.display = 'none'; // Esconde o formulário em caso de erro
        console.error('Erro ao carregar detalhes do pet:', error);
        return;
    }

    // 3. Obter dados do usuário logado (adotante)
    const usuarioCorrenteJSON = sessionStorage.getItem('usuarioCorrente');
    let usuarioAdotante = null;

    if (usuarioCorrenteJSON) {
        usuarioAdotante = JSON.parse(usuarioCorrenteJSON);
        // Preencher campos do formulário automaticamente, se o usuário estiver logado
        if (document.getElementById('nomeCompleto')) document.getElementById('nomeCompleto').value = usuarioAdotante.nome || '';
        if (document.getElementById('email')) document.getElementById('email').value = usuarioAdotante.email || '';
        if (document.getElementById('telefone')) document.getElementById('telefone').value = usuarioAdotante.celular || ''; 
        if (document.getElementById('endereco')) document.getElementById('endereco').value = usuarioAdotante.endereco || '';
    } else {
        console.warn('Nenhum usuário logado. Preencha o formulário manualmente.');
    }

    // 4. Lidar com o envio do formulário
    if (adoptionForm) { // Verifica se o formulário existe
        adoptionForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Impede o envio padrão do formulário

            if (alertMessage) alertMessage.style.display = 'none';
            if (errorMessage) errorMessage.style.display = 'none';

            // Coletar dados do formulário
            const solicitacao = {
                id: Date.now(), // ID único para a solicitação (apenas para simulação)
                petId: petId,
                petNome: document.querySelector('#petInfoSummary h4 strong')?.textContent || 'Nome Indefinido', 
                petImagem: document.querySelector('#petInfoSummary img')?.src || 'https://via.placeholder.com/80', 
                
                // Dados do adotante - prioriza os campos do formulário preenchidos manualmente
                adotanteNome: document.getElementById('nomeCompleto')?.value || '',
                adotanteEmail: document.getElementById('email')?.value || '',
                adotanteTelefone: document.getElementById('telefone')?.value || '',
                adotanteEndereco: document.getElementById('endereco')?.value || '',
                
                tipoMoradia: document.getElementById('tipoMoradia')?.value || '',
                outrosPets: document.getElementById('outrosPets')?.value || '',
                experiencia: document.getElementById('experiencia')?.value || '',
                motivoAdocao: document.getElementById('motivoAdocao')?.value || '',
                
                dataSolicitacao: new Date().toISOString().split('T')[0], // Data atual (YYYY-MM-DD)
                status: 'Pendente', // Status inicial
            };

            // Simulação de salvamento da solicitação (usando sessionStorage)
            let adoptionRequests = JSON.parse(sessionStorage.getItem(ADOPTION_REQUESTS_KEY) || '[]');
            adoptionRequests.push(solicitacao);
            sessionStorage.setItem(ADOPTION_REQUESTS_KEY, JSON.stringify(adoptionRequests));

            // Feedback para o usuário
            if (alertMessage) alertMessage.style.display = 'block';
            adoptionForm.reset(); // Limpa o formulário


        });
    }
});
