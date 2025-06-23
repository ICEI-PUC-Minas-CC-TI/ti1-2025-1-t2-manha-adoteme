
const API_BASE_URL = 'https://ti1-2025-1-t2-manha-adoteme-p1jd.onrender.com'; 
const API_URL = `${API_BASE_URL}/pets`; 
const API_USUARIOS_URL = `${API_BASE_URL}/usuarios`; 

const ADOPTION_REQUESTS_KEY = 'adoptionRequests'; // Chave para armazenar as solicitações no sessionStorage

// Variáveis globais para armazenar dados (preenchidas no DOMContentLoaded)
let currentAdoptionRequests = [];
let currentPetsDoUsuario = [];

// Funções auxiliares globais (definidas no window para serem acessíveis pelos botões)
window.updateAdoptionRequestStatus = async function(requestId, newStatus) {
    console.log(`[Minhas Adoções] Tentando atualizar status da solicitação ${requestId} para ${newStatus}`);
    const requestIndex = currentAdoptionRequests.findIndex(req => req.id === requestId);

    if (requestIndex !== -1) {
        currentAdoptionRequests[requestIndex].status = newStatus;
        sessionStorage.setItem(ADOPTION_REQUESTS_KEY, JSON.stringify(currentAdoptionRequests));
        
        // Exibe um alerta e re-renderiza para atualizar a UI
        alert(`Solicitação ${requestId} ${newStatus} com sucesso!`);
        renderAdoptionRequests(currentAdoptionRequests, currentPetsDoUsuario, usuarioLogado); // Renderiza novamente
    } else {
        console.error(`[Minhas Adoções] Solicitação não encontrada para atualização: ${requestId}`);
    }
};

window.removeAdoptionRequest = function(requestId) {
    console.log(`[Minhas Adoções] Tentando remover solicitação ${requestId}`);
    if (confirm('Tem certeza que deseja remover esta solicitação? Esta ação é irreversível.')) {
        currentAdoptionRequests = currentAdoptionRequests.filter(req => req.id !== requestId);
        sessionStorage.setItem(ADOPTION_REQUESTS_KEY, JSON.stringify(currentAdoptionRequests));
        
        alert('Solicitação removida com sucesso!');
        renderAdoptionRequests(currentAdoptionRequests, currentPetsDoUsuario, usuarioLogado); // Renderiza novamente
    }
};

window.displayAdotanteDetails = function(requestId) {
    console.log(`[Minhas Adoções] displayAdotanteDetails chamada para request ID: ${requestId}`);
    const request = currentAdoptionRequests.find(req => req.id === requestId);
    
    if (request) {
        // Captura os elementos do modal AQUI DENTRO, quando a função é chamada (garante que existem)
        const modalNomeCompleto = document.getElementById('modalNomeCompleto');
        const modalEmail = document.getElementById('modalEmail');
        const modalTelefone = document.getElementById('modalTelefone');
        const modalEndereco = document.getElementById('modalEndereco');
        const modalTipoMoradia = document.getElementById('modalTipoMoradia');
        const modalOutrosPets = document.getElementById('modalOutrosPets');
        const modalExperiencia = document.getElementById('modalExperiencia');
        const modalMotivoAdocao = document.getElementById('modalMotivoAdocao');

        // Preenche os elementos do modal (com verificações para robustez)
        if(modalNomeCompleto) modalNomeCompleto.textContent = request.adotanteNome || 'Não informado';
        if(modalEmail) modalEmail.textContent = request.adotanteEmail || 'Não informado';
        if(modalTelefone) modalTelefone.textContent = request.adotanteTelefone || 'Não informado';
        if(modalEndereco) modalEndereco.textContent = request.adotanteEndereco || 'Não informado';
        if(modalTipoMoradia) modalTipoMoradia.textContent = request.tipoMoradia || 'Não informado';
        if(modalOutrosPets) modalOutrosPets.textContent = request.outrosPets || 'Não informado';
        if(modalExperiencia) modalExperiencia.textContent = request.experiencia || 'Não informado';
        if(modalMotivoAdocao) modalMotivoAdocao.textContent = request.motivoAdocao || 'Não informado';
        
        console.log(`[Minhas Adoções] Dados do Adotante preenchidos no modal para: ${request.adotanteNome}`);

        // Abre o modal manualmente via JS (para garantir que funcione)
        try {
            const modalElement = document.getElementById('adotanteDetailsModal');
            if (modalElement) {
                var myModal = new bootstrap.Modal(modalElement);
                myModal.show();
                console.log('[Minhas Adoções] Modal aberto via JS.');
            } else {
                console.warn('[Minhas Adoções] Elemento do modal #adotanteDetailsModal não encontrado no DOM.');
            }
        } catch (e) {
            console.error('[Minhas Adoções] Erro ao tentar abrir o modal Bootstrap via JS:', e);
        }

    } else {
        console.error(`[Minhas Adoções] Solicitação não encontrada (${requestId}) para exibir detalhes.`);
    }
};

// Variável para o usuário logado (acessível por renderAdoptionRequests)
let usuarioLogado = null;

// Função que renderiza as solicitações na UI
function renderAdoptionRequests(adoptionRequestsToRender, petsOfCurrentUser, loggedInUser) {
    const solicitacoesEnviadasDiv = document.getElementById('solicitacoesEnviadas');
    const noSentRequestsP = document.getElementById('noSentRequests');
    const solicitacoesRecebidasSection = document.getElementById('solicitacoesRecebidasSection');
    const solicitacoesRecebidasDiv = document.getElementById('solicitacoesRecebidas');
    const noReceivedRequestsP = document.getElementById('noReceivedRequests');
    const solicitacoesEnviadasSection = document.getElementById('solicitacoesEnviadasSection');

    // --- Parte 1: Exibir Solicitações Enviadas pelo Usuário Logado ---
    const solicitacoesEnviadas = adoptionRequestsToRender.filter(req => req.adotanteEmail === loggedInUser.email);

    if (solicitacoesEnviadas.length > 0) {
        solicitacoesEnviadasDiv.innerHTML = solicitacoesEnviadas.map(req => `
            <div class="col-12 adoption-request-card status-${req.status.replace(/\s/g, '')}">
                <img src="${req.petImagem || 'https://via.placeholder.com/80'}" alt="${req.petNome}" class="img-fluid">
                <div class="flex-grow-1">
                    <h5>${req.petNome}</h5>
                    <p>Solicitado em: ${req.dataSolicitacao}</p>
                    <p>Status: <span class="status status-${req.status.replace(/\s/g, '')}">${req.status}</span></p>
                </div>
                <div class="action-buttons">
                    <button class="btn btn-danger btn-sm-custom btn-remove-request" data-request-id="${req.id}">
                        <i class="bi bi-trash-fill"></i> Remover
                    </button>
                </div>
            </div>
        `).join('');
        noSentRequestsP.style.display = 'none';
        solicitacoesEnviadasSection.style.display = 'block'; 
    } else {
        solicitacoesEnviadasDiv.innerHTML = ''; 
        noSentRequestsP.style.display = 'block';
        solicitacoesEnviadasSection.style.display = 'block'; 
    }

    // --- Parte 2: Exibir Solicitações Recebidas para os Pets do Usuário Logado ---
    if (petsOfCurrentUser.length > 0) {
        solicitacoesRecebidasSection.style.display = 'block';
        const petsIdsDoUsuario = petsOfCurrentUser.map(pet => pet.id);
        const solicitacoesRecebidas = adoptionRequestsToRender.filter(req => petsIdsDoUsuario.includes(req.petId));

        if (solicitacoesRecebidas.length > 0) {
            solicitacoesRecebidasDiv.innerHTML = solicitacoesRecebidas.map(req => `
                <div class="col-12 adoption-request-card status-${req.status.replace(/\s/g, '')}">
                    <img src="${req.petImagem || 'https://via.placeholder.com/80'}" alt="${req.petNome}" class="img-fluid">
                    <div class="flex-grow-1">
                        <h5>${req.petNome}</h5>
                        <p>Adotante: <strong>${req.adotanteNome}</strong></p>
                        <p>Solicitado em: ${req.dataSolicitacao}</p>
                        <p>Status: <span class="status status-${req.status.replace(/\s/g, '')}">${req.status}</span></p>
                    </div>
                    <div class="action-buttons">
                        <button class="btn btn-info btn-sm-custom btn-view-details" 
                            data-bs-toggle="modal" data-bs-target="#adotanteDetailsModal" 
                            data-request-id="${req.id}">
                            <i class="bi bi-info-circle-fill"></i> Detalhes
                        </button>
                        ${req.status === 'Pendente' ? `
                            <button class="btn btn-success btn-sm-custom btn-action-request" data-request-id="${req.id}" data-action="Aprovada">
                                <i class="bi bi-check-circle-fill"></i> Aceitar
                            </button>
                            <button class="btn btn-danger btn-sm-custom btn-action-request" data-request-id="${req.id}" data-action="Rejeitada">
                                <i class="bi bi-x-circle-fill"></i> Rejeitar
                            </button>
                        ` : ''}
                        <button class="btn btn-danger btn-sm-custom btn-remove-request" data-request-id="${req.id}">
                            <i class="bi bi-trash-fill"></i> Remover
                        </button>
                    </div>
                </div>
            `).join('');
            noReceivedRequestsP.style.display = 'none';

        } else {
            solicitacoesRecebidasDiv.innerHTML = '';
            noReceivedRequestsP.style.display = 'block';
        }

        // --- Adicionar event listeners APÓS a renderização ---
        // Para os botões Aceitar/Rejeitar
        document.querySelectorAll('.btn-action-request').forEach(button => {
            button.addEventListener('click', (event) => {
                const requestId = parseInt(event.target.closest('button').dataset.requestId);
                const action = event.target.closest('button').dataset.action;
                window.updateAdoptionRequestStatus(requestId, action); 
            });
        });

        // Para os botões "Detalhes"
        document.querySelectorAll('.btn-view-details').forEach(button => {
            button.addEventListener('click', (event) => {
                const requestId = parseInt(event.target.closest('button').dataset.requestId);
                window.displayAdotanteDetails(requestId);
            });
        });

    } else {
        solicitacoesRecebidasSection.style.display = 'none'; 
    }

    // Adicionar event listeners para os botões de remover (ambas as seções)
    document.querySelectorAll('.btn-remove-request').forEach(button => {
        button.addEventListener('click', (event) => {
            const requestId = parseInt(event.target.closest('button').dataset.requestId);
            window.removeAdoptionRequest(requestId);
        });
    });
}


// O bloco DOMContentLoaded principal da página
document.addEventListener('DOMContentLoaded', async () => {
    // Declarações dos elementos da UI
    const userNotLoggedInDiv = document.getElementById('userNotLoggedIn');
    const solicitacoesEnviadasSection = document.getElementById('solicitacoesEnviadasSection');
    const solicitacoesRecebidasSection = document.getElementById('solicitacoesRecebidasSection');
    const solicitacoesEnviadasDiv = document.getElementById('solicitacoesEnviadas');
    const solicitacoesRecebidasDiv = document.getElementById('solicitacoesRecebidas');
    const noSentRequestsP = document.getElementById('noSentRequests');
    const noReceivedRequestsP = document.getElementById('noReceivedRequests');

    const usuarioCorrenteJSON = sessionStorage.getItem('usuarioCorrente');
    
    // Define a variável usuarioLogado no escopo global deste DOMContentLoaded
    // para que renderAdoptionRequests e outras funções a vejam
    usuarioLogado = null; 

    if (!usuarioCorrenteJSON) {
        userNotLoggedInDiv.style.display = 'block';
        solicitacoesEnviadasSection.style.display = 'none';
        solicitacoesRecebidasSection.style.display = 'none';
        console.warn('[Minhas Adoções] Nenhum usuário logado. Exibindo mensagem de não logado.');
        return; // Sai da função, não tenta buscar dados
    }

    usuarioLogado = JSON.parse(usuarioCorrenteJSON);
    userNotLoggedInDiv.style.display = 'none';
    console.log('[Minhas Adoções] Usuário logado:', usuarioLogado);

    // 1. Carregar todos os pets e filtrar os do usuário logado
    console.log(`[Minhas Adoções] Tentando buscar pets de: ${API_URL}`);
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            console.error(`[Minhas Adoções] Erro HTTP ao buscar pets: ${response.status} - ${response.statusText}`);
            throw new Error(`Erro ao buscar pets (HTTP ${response.status})`);
        }
        const allPets = await response.json();
        currentPetsDoUsuario = allPets.filter(pet => pet.ownerId === parseInt(usuarioLogado.id)); 
        console.log("[Minhas Adoções] Pets do usuário logado:", currentPetsDoUsuario);
    } catch (error) {
        console.error('[Minhas Adoções] Erro ao carregar pets:', error);
        // Exiba uma mensagem de erro na UI se desejar
        solicitacoesRecebidasDiv.innerHTML = `<p class="alert alert-danger text-center">Erro ao carregar seus pets. Verifique a conexão com a API.</p>`;
        solicitacoesRecebidasSection.style.display = 'block';
    }

    // 2. Carregar todas as solicitações de adoção
    console.log(`[Minhas Adoções] Carregando solicitações de adoção do sessionStorage.`);
    currentAdoptionRequests = JSON.parse(sessionStorage.getItem(ADOPTION_REQUESTS_KEY) || '[]');
    console.log("[Minhas Adoções] Solicitações de adoção carregadas (inicial):", currentAdoptionRequests);

    // --- Chamada inicial para renderizar as solicitações com os dados carregados ---
    renderAdoptionRequests(currentAdoptionRequests, currentPetsDoUsuario, usuarioLogado);
});
