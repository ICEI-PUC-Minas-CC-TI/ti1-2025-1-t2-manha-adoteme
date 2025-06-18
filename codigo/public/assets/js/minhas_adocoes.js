// Constantes
const API_URL = 'http://localhost:3000/pets'; // A mesma URL da sua API de pets
const ADOPTION_REQUESTS_KEY = 'adoptionRequests'; // Chave para armazenar as solicitações no sessionStorage

document.addEventListener('DOMContentLoaded', async () => {
    const userNotLoggedInDiv = document.getElementById('userNotLoggedIn');
    const solicitacoesEnviadasSection = document.getElementById('solicitacoesEnviadasSection');
    const solicitacoesRecebidasSection = document.getElementById('solicitacoesRecebidasSection');
    const solicitacoesEnviadasDiv = document.getElementById('solicitacoesEnviadas');
    const solicitacoesRecebidasDiv = document.getElementById('solicitacoesRecebidas');
    const noSentRequestsP = document.getElementById('noSentRequests');
    const noReceivedRequestsP = document.getElementById('noReceivedRequests');

    const usuarioCorrenteJSON = sessionStorage.getItem('usuarioCorrente');
    let usuarioLogado = null;

    if (!usuarioCorrenteJSON) {
        // Usuário não logado, exibe a mensagem e esconde as seções
        userNotLoggedInDiv.style.display = 'block';
        solicitacoesEnviadasSection.style.display = 'none';
        solicitacoesRecebidasSection.style.display = 'none';
        return; // Sai da função
    }

    usuarioLogado = JSON.parse(usuarioCorrenteJSON);
    userNotLoggedInDiv.style.display = 'none'; // Esconde a mensagem de não logado

    // --- Parte 1: Buscar Pets do Usuário Logado para verificar se ele é um "dono de pet" ---
    let petsDoUsuario = [];
    try {
        const response = await fetch(API_URL); // Pega todos os pets da API
        if (!response.ok) throw new Error('Erro ao buscar pets.');
        const allPets = await response.json();
        // Filtra os pets que pertencem ao usuário logado
        // ATENÇÃO: Isso exige que seus dados de pet (no db.json) tenham um campo ownerId
        petsDoUsuario = allPets.filter(pet => pet.ownerId === usuarioLogado.id); 
        // Assumindo que o usuarioLogado tem um 'id'
        // Você precisará garantir que os pets no seu db.json tenham um ownerId correspondente aos IDs dos usuários.
    } catch (error) {
        console.error('Erro ao carregar pets para o usuário logado:', error);
        // Continua mesmo com erro, apenas as solicitações recebidas podem não funcionar
    }

    // --- Parte 2: Carregar todas as solicitações de adoção ---
    let adoptionRequests = JSON.parse(sessionStorage.getItem(ADOPTION_REQUESTS_KEY) || '[]');

    // --- Parte 3: Exibir Solicitações Enviadas pelo Usuário Logado ---
    const solicitacoesEnviadas = adoptionRequests.filter(req => req.adotanteEmail === usuarioLogado.email);
    // Assumindo que o email é único para identificar o adotante

    if (solicitacoesEnviadas.length > 0) {
        solicitacoesEnviadasDiv.innerHTML = solicitacoesEnviadas.map(req => `
            <div class="col-12 adoption-request-card status-${req.status.replace(/\s/g, '')}">
                <img src="${req.petImagem || 'https://via.placeholder.com/80'}" alt="${req.petNome}" class="img-fluid">
                <div>
                    <h5>${req.petNome}</h5>
                    <p>Solicitado em: ${req.dataSolicitacao}</p>
                    <p>Status: <span class="status status-${req.status.replace(/\s/g, '')}">${req.status}</span></p>
                </div>
            </div>
        `).join('');
        noSentRequestsP.style.display = 'none';
    } else {
        solicitacoesEnviadasDiv.innerHTML = ''; // Limpa qualquer conteúdo
        noSentRequestsP.style.display = 'block';
    }

    // --- Parte 4: Exibir Solicitações Recebidas para os Pets do Usuário Logado ---
    // Esta seção só é visível se o usuário tiver pets cadastrados
    if (petsDoUsuario.length > 0) {
        solicitacoesRecebidasSection.style.display = 'block';
        const petsIdsDoUsuario = petsDoUsuario.map(pet => pet.id);
        const solicitacoesRecebidas = adoptionRequests.filter(req => petsIdsDoUsuario.includes(req.petId));

        if (solicitacoesRecebidas.length > 0) {
            solicitacoesRecebidasDiv.innerHTML = solicitacoesRecebidas.map(req => `
                <div class="col-12 adoption-request-card status-${req.status.replace(/\s/g, '')}">
                    <img src="${req.petImagem || 'https://via.placeholder.com/80'}" alt="${req.petNome}" class="img-fluid">
                    <div>
                        <h5>${req.petNome}</h5>
                        <p>Adotante: <strong>${req.adotanteNome}</strong> (${req.adotanteEmail})</p>
                        <p>Solicitado em: ${req.dataSolicitacao}</p>
                        <p>Status: <span class="status status-${req.status.replace(/\s/g, '')}">${req.status}</span></p>
                        <p>Motivo da Adoção: ${req.motivoAdocao.substring(0, 100)}...</p>
                        ${req.status === 'Pendente' ? `
                            <div class="mt-2">
                                <button class="btn btn-success btn-sm me-2 btn-action-request" data-request-id="${req.id}" data-action="Aprovada">Aceitar</button>
                                <button class="btn btn-danger btn-sm btn-action-request" data-request-id="${req.id}" data-action="Rejeitada">Rejeitar</button>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `).join('');
            noReceivedRequestsP.style.display = 'none';

            // Adicionar event listeners para os botões Aceitar/Rejeitar
            document.querySelectorAll('.btn-action-request').forEach(button => {
                button.addEventListener('click', (event) => {
                    const requestId = parseInt(event.target.dataset.requestId);
                    const action = event.target.dataset.action;
                    updateAdoptionRequestStatus(requestId, action);
                });
            });

        } else {
            solicitacoesRecebidasDiv.innerHTML = '';
            noReceivedRequestsP.style.display = 'block';
        }
    } else {
        solicitacoesRecebidasSection.style.display = 'none'; // Esconde a seção se não houver pets do usuário
    }
});

// Função para atualizar o status da solicitação
function updateAdoptionRequestStatus(requestId, newStatus) {
    let adoptionRequests = JSON.parse(sessionStorage.getItem(ADOPTION_REQUESTS_KEY) || '[]');
    const requestIndex = adoptionRequests.findIndex(req => req.id === requestId);

    if (requestIndex !== -1) {
        adoptionRequests[requestIndex].status = newStatus;
        sessionStorage.setItem(ADOPTION_REQUESTS_KEY, JSON.stringify(adoptionRequests));
        alert(`Solicitação ${requestId} ${newStatus} com sucesso!`);
        // Recarrega a página ou re-renderiza as solicitações para mostrar a mudança de status
        location.reload(); 
    } else {
        console.error('Solicitação não encontrada:', requestId);
    }
}

