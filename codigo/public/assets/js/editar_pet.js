

const API_BASE_URL = 'http://localhost:3000';
const API_PETS_URL = `${API_BASE_URL}/pets`;
const API_USUARIOS_URL = `${API_BASE_URL}/usuarios`; // Para atualizar petIDs do usuário

let currentPetId = null; // Armazenará o ID do pet que está sendo editado

// Função para exibir mensagens de sucesso ou erro
function displayMessage(mensagem, tipo = 'warning') {
    const msgDiv = document.getElementById('msg');
    if (msgDiv) {
        msgDiv.innerHTML = `<div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
            ${mensagem}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`;
    } else {
        console.error("displayMessage: Elemento #msg não encontrado no DOM.");
        alert(mensagem); // Fallback para alerta se div de mensagem não existir
    }
}

// Função para obter o ID do pet da URL
function getPetIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// Função para verificar status de login e carregar dados do pet
async function initEditPetPage() {
    // Verifica se o usuário está logado
    const usuarioCorrenteJSON = sessionStorage.getItem('usuarioCorrente');
    if (!usuarioCorrenteJSON) {
        console.error('initEditPetPage: Nenhum usuário logado. Redirecionando.');
        window.location.href = '/modulos/login/login.html';
        return;
    }
    // A variável usuarioCorrente já é global via login.js

    currentPetId = getPetIdFromUrl();
    if (!currentPetId) {
        console.error('initEditPetPage: ID do pet não encontrado na URL.');
        displayMessage('Erro: ID do pet não especificado na URL para edição.', 'danger');
        return;
    }

    await loadPetData(currentPetId); // Carrega os dados do pet
}

// Função para carregar os dados do pet no formulário
async function loadPetData(petId) {
    try {
        const response = await fetch(`${API_PETS_URL}/${petId}`);
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error(`Pet com ID ${petId} não encontrado.`);
            }
            throw new Error(`Erro ao buscar dados do pet: ${response.status}`);
        }
        const pet = await response.json();

        // Preenche o formulário
        document.getElementById('inputId').value = pet.id;
        document.getElementById('inputNome').value = pet.nome || '';
        document.getElementById('inputEspecie').value = pet.especie || '';
        document.getElementById('inputRaca').value = pet.raca || '';
        document.getElementById('inputIdade').value = pet.idade || '';
        document.getElementById('inputSexo').value = pet.sexo || '';
        document.getElementById('inputPorte').value = pet.porte || '';
        document.getElementById('inputPeso').value = pet.peso || '';
        document.getElementById('inputVacinado').value = pet.vacinado || 'Não';
        document.getElementById('inputVermifugado').value = pet.vermifugado || 'Não';
        document.getElementById('inputCastrado').value = pet.castrado || 'Não';
        document.getElementById('inputCondicao').value = pet.condicao || '';
        document.getElementById('inputTemperamento').value = pet.temperamento || '';
        document.getElementById('inputCriancas').value = pet.criancas || 'Não';
        document.getElementById('inputOutrosPets').value = pet.outrosPets || 'Não';
        document.getElementById('inputLocalizacao').value = pet.localizacao || '';
        document.getElementById('inputImagem').value = pet.imagem || ''; 
        
        const imgPreview = document.getElementById('imgPreview');
        if (pet.imagem) {
            imgPreview.src = pet.imagem;
            imgPreview.style.display = 'block';
        } else {
            imgPreview.src = '';
            imgPreview.style.display = 'none';
        }
        
        displayMessage('Dados do pet carregados para edição.', 'info');
    } catch (error) {
        console.error('loadPetData: Erro ao carregar dados do pet:', error);
        displayMessage(`Erro ao carregar dados do pet: ${error.message}`, 'danger');
    }
}

// Função para salvar as alterações do pet
async function savePetChanges(event) {
    event.preventDefault();

    if (!currentPetId) {
        displayMessage('Erro: ID do pet não encontrado para salvar alterações.', 'danger');
        return;
    }
    
    // Coleta todos os dados do formulário
    const updatedPet = {
        id: currentPetId, // Garante que o ID é mantido
        nome: document.getElementById('inputNome').value,
        especie: document.getElementById('inputEspecie').value,
        raca: document.getElementById('inputRaca').value,
        idade: document.getElementById('inputIdade').value,
        sexo: document.getElementById('inputSexo').value,
        porte: document.getElementById('inputPorte').value,
        peso: document.getElementById('inputPeso').value,
        vacinado: document.getElementById('inputVacinado').value,
        vermifugado: document.getElementById('inputVermifugado').value,
        castrado: document.getElementById('inputCastrado').value,
        condicao: document.getElementById('inputCondicao').value,
        temperamento: document.getElementById('inputTemperamento').value,
        criancas: document.getElementById('inputCriancas').value,
        outrosPets: document.getElementById('inputOutrosPets').value,
        localizacao: document.getElementById('inputLocalizacao').value,
        imagem: document.getElementById('inputImagem').value 
    };

    // Adicionar ownerId do usuário logado (se existir) para consistência no DB
    if (window.usuarioCorrente && window.usuarioCorrente.id) {
        updatedPet.ownerId = window.usuarioCorrente.id;
    }

    try {
        const response = await fetch(`${API_PETS_URL}/${currentPetId}`, {
            method: 'PUT', // PUT para atualizar o recurso completo
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedPet),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido ao parsear resposta PUT' }));
            throw new Error(`Erro ao salvar alterações: ${response.status} - ${errorData.message || response.statusText}`);
        }

        displayMessage('Pet atualizado com sucesso!', 'success');

    } catch (error) {
        console.error('savePetChanges: Erro ao salvar alterações do pet:', error);
        displayMessage(`Erro ao salvar alterações: ${error.message}`, 'danger');
    }
}

// Função para excluir o pet
async function deletePetConfirmed() {
    if (!currentPetId) {
        displayMessage('Erro: ID do pet não encontrado para exclusão.', 'danger');
        return;
    }

    if (!confirm(`Tem certeza que deseja excluir este pet (ID: ${currentPetId})?`)) {
        return;
    }

    // Verifica se o usuário está logado (para atualização de petIDs)
    if (!window.usuarioCorrente || !window.usuarioCorrente.id) {
        displayMessage('Erro: Você precisa estar logado para excluir um pet.', 'danger');
        return;
    }

    try {
        const response = await fetch(`${API_PETS_URL}/${currentPetId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`Erro ao excluir o pet: ${response.status}`);
        }

        displayMessage('Pet excluído com sucesso!', 'success');
        
        // Atualiza o perfil do usuário para remover o ID do pet
        const userResponse = await fetch(`${API_USUARIOS_URL}/${window.usuarioCorrente.id}`);
        if (!userResponse.ok) throw new Error(`Erro ao buscar usuário para remoção de petIDs: ${userResponse.status}`);
        const user = await userResponse.json();

        const updatedPetIDs = (user.petIDs || []).filter(id => id !== Number(currentPetId));
        
        const updateUserResponse = await fetch(`${API_USUARIOS_URL}/${window.usuarioCorrente.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ petIDs: updatedPetIDs }),
        });

        if (!updateUserResponse.ok) {
            throw new Error(`Erro ao remover petID do usuário: ${updateUserResponse.status}`);
        }

        // Atualiza o usuarioCorrente no sessionStorage
        const updatedUser = await updateUserResponse.json();
        sessionStorage.setItem('usuarioCorrente', JSON.stringify(updatedUser));

        // Redireciona de volta para a página de perfil após a exclusão
        window.location.href = '/modulos/meu-perfil/meu_perfil.html';

    } catch (error) {
        console.error('deletePetConfirmed: Erro ao excluir o pet:', error);
        displayMessage(`Erro ao excluir o pet: ${error.message}`, 'danger');
    }
}

// Inicialização da página e Event Listeners
window.onload = () => {
    initEditPetPage(); // Carrega dados do pet
    
    document.getElementById('formEditarPet').addEventListener('submit', savePetChanges);
    document.getElementById('btnExcluirPet').addEventListener('click', deletePetConfirmed);

    // Prévia da imagem ao digitar a URL
    document.getElementById('inputImagem').addEventListener('input', function () {
        const imgPreview = document.getElementById('imgPreview');
        if (this.value) {
            imgPreview.src = this.value;
            imgPreview.style.display = 'block';
        } else {
            imgPreview.src = '';
            imgPreview.style.display = 'none';
        }
    });
};
