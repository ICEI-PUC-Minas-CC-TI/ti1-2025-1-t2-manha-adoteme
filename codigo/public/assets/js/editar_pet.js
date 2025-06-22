

const API_BASE_URL = 'http://localhost:3000';
const API_PETS_URL = `${API_BASE_URL}/pets`;
const API_USUARIOS_URL = `${API_BASE_URL}/usuarios`;

let currentPetId = null;
let originalOwnerId = null; 

function displayMessage(mensagem, tipo = 'warning') {
    const msgDiv = document.getElementById('msg');
    if (msgDiv) {
        msgDiv.innerHTML = `<div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
            ${mensagem}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`;
    } else {
        console.error("displayMessage: Elemento #msg não encontrado no DOM.");
        alert(mensagem);
    }
}

function getPetIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

async function initEditPetPage() {
    const usuarioCorrenteJSON = sessionStorage.getItem('usuarioCorrente');
    if (!usuarioCorrenteJSON) {
        console.error('initEditPetPage: Nenhum usuário logado. Redirecionando.');
        window.location.href = '/modulos/login/login.html';
        return;
    }

    currentPetId = getPetIdFromUrl();
    if (!currentPetId) {
        console.error('initEditPetPage: ID do pet não encontrado na URL.');
        displayMessage('Erro: ID do pet não especificado na URL para edição.', 'danger');
        return;
    }

    await loadPetData(currentPetId);
}

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

        originalOwnerId = pet.ownerId; 

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
        
       
        document.getElementById('inputDescricao').value = pet.descricao || ''; 

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

async function savePetChanges(event) {
    event.preventDefault();

    if (!currentPetId) {
        displayMessage('Erro: ID do pet não encontrado para salvar alterações.', 'danger');
        return;
    }
    
    const updatedPet = {
        id: currentPetId, 
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
        imagem: document.getElementById('inputImagem').value,
        descricao: document.getElementById('inputDescricao').value 
    };

    if (originalOwnerId !== null) {
        updatedPet.ownerId = originalOwnerId;
    } else if (window.usuarioCorrente && window.usuarioCorrente.id) {
        updatedPet.ownerId = window.usuarioCorrente.id;
        console.warn('originalOwnerId não disponível, usando usuarioCorrente.id como fallback.');
    } else {
        displayMessage('Erro: Não foi possível determinar o proprietário do pet para salvar. Login necessário.', 'danger');
        console.error('savePetChanges: originalOwnerId e usuarioCorrente.id não disponíveis.');
        return;
    }

    try {
        const response = await fetch(`${API_PETS_URL}/${currentPetId}`, {
            method: 'PUT', 
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

async function deletePetConfirmed() {
    if (!currentPetId) {
        displayMessage('Erro: ID do pet não encontrado para exclusão.', 'danger');
        return;
    }

    if (!confirm(`Tem certeza que deseja excluir este pet (ID: ${currentPetId})?`)) {
        return;
    }

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

        const updatedUser = await updateUserResponse.json();
        sessionStorage.setItem('usuarioCorrente', JSON.stringify(updatedUser));

        window.location.href = '/modulos/meu-perfil/meu_perfil.html';

    } catch (error) {
        console.error('deletePetConfirmed: Erro ao excluir o pet:', error);
        displayMessage(`Erro ao excluir o pet: ${error.message}`, 'danger');
    }
}

window.onload = () => { 
    initEditPetPage(); 
    
    const formEditarPet = document.getElementById('formEditarPet');
    if (formEditarPet) {
        formEditarPet.addEventListener('submit', savePetChanges);
    } else {
        console.error("Elemento 'formEditarPet' não encontrado para adicionar event listener.");
    }

    const btnExcluirPet = document.getElementById('btnExcluirPet');
    if (btnExcluirPet) {
        btnExcluirPet.addEventListener('click', deletePetConfirmed);
    } else {
        console.warn("Elemento 'btnExcluirPet' não encontrado. Exclusão de pet pode não estar disponível.");
    }

    const inputImagem = document.getElementById('inputImagem');
    const imgPreview = document.getElementById('imgPreview');
    if (inputImagem && imgPreview) {
        inputImagem.addEventListener('input', function () {
            const imageUrl = this.value;
            if (imageUrl) {
                imgPreview.src = imageUrl;
                imgPreview.style.display = 'block';
            } else {
                imgPreview.src = '';
                imgPreview.style.display = 'none';
            }
        });
    }

    // Lógica para pré-visualização da imagem de descrição
    const inputDescricao = document.getElementById('inputDescricao'); // Certifique-se que este ID existe no HTML
    if (inputDescricao) {
  
    }
};