// Este arquivo: assets/js/pets.js

// URL da API JSONServer
const API_BASE_URL = 'http://localhost:3000';
const API_PETS_URL = `${API_BASE_URL}/pets`;
const API_USUARIOS_URL = `${API_BASE_URL}/usuarios`;

let usuarioCorrente = null; // Para armazenar o usuário logado

// --- Funções de Utilitário ---

// Função para exibir mensagens de sucesso ou erro (agora com tipo de alerta)
function displayMessage(mensagem, tipo = 'warning') { // tipo pode ser 'success', 'danger', 'warning', 'info'
    const msgDiv = document.getElementById('msg');
    msgDiv.innerHTML = `<div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
        ${mensagem}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`;
}

// Função para limpar o formulário
function clearForm() {
    document.getElementById('form-pet').reset();
    document.getElementById('inputId').value = ''; // Limpa o ID também
    document.getElementById('btnInserir').style.display = 'inline';
    document.getElementById('btnAlterar').style.display = 'none';
    displayMessage(''); // Limpa mensagens anteriores
}

// --- Funções CRUD ---

// Função para ler (exibir) todos os pets cadastrados
async function readPets() {
    try {
        const response = await fetch(API_PETS_URL);
        if (!response.ok) {
            throw new Error(`Erro ao buscar pets: ${response.status}`);
        }
        const pets = await response.json();
        const tableBody = document.getElementById('table-pets');
        tableBody.innerHTML = ''; // Limpa a tabela antes de preencher

        if (pets.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="10" class="text-center">Nenhum pet cadastrado ainda.</td></tr>';
            return;
        }

        pets.forEach(pet => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${pet.id}</td>
                <td>${pet.nome}</td>
                <td>${pet.especie}</td>
                <td>${pet.raca || '-'}</td>
                <td>${pet.idade || '-'}</td>
                <td>${pet.sexo || '-'}</td>
                <td>${pet.porte || '-'}</td>
                <td>${pet.localizacao || '-'}</td>
                <td>
                    ${pet.foto ? `<img src="${pet.foto}" alt="${pet.nome}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;">` : 'N/A'}
                </td>
                <td>
                    <button class="btn btn-editar btn-sm me-2" onclick="editPet(${pet.id})"><i class="bi bi-pencil-square"></i></button>
                    <button class="btn btn-excluir btn-sm" onclick="deletePet(${pet.id})"><i class="bi bi-trash"></i></button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Erro ao carregar os pets:', error);
        displayMessage('Erro ao carregar os pets.', 'danger');
    }
}

// Função para adicionar um novo pet
async function createPet(pet) {
    if (!usuarioCorrente || !usuarioCorrente.id) {
        displayMessage('Você precisa estar logado para cadastrar um pet.', 'danger');
        return;
    }

    pet.ownerId = usuarioCorrente.id; // Associa o pet ao usuário logado

    try {
        const response = await fetch(API_PETS_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pet),
        });

        if (!response.ok) {
            throw new Error(`Erro ao adicionar o pet: ${response.status}`);
        }

        const newPet = await response.json();
        displayMessage('Pet inserido com sucesso!', 'success');
        clearForm(); // Limpa o formulário
        await readPets(); // Recarrega a lista de pets

        // Agora, atualiza o perfil do usuário para incluir o ID do novo pet
        const userResponse = await fetch(`${API_USUARIOS_URL}/${usuarioCorrente.id}`);
        if (!userResponse.ok) throw new Error(`Erro ao buscar usuário para atualização de petIDs: ${userResponse.status}`);
        const user = await userResponse.json();

        const updatedPetIDs = [...(user.petIDs || []), Number(newPet.id)]; // Adiciona o novo ID
        
        const updateUserResponse = await fetch(`${API_USUARIOS_URL}/${usuarioCorrente.id}`, {
            method: 'PATCH', // Usamos PATCH para atualizar apenas uma parte do recurso
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ petIDs: updatedPetIDs }),
        });

        if (!updateUserResponse.ok) {
            throw new Error(`Erro ao atualizar petIDs do usuário: ${updateUserResponse.status}`);
        }
        
        // Atualiza o usuarioCorrente no sessionStorage para refletir o novo petID
        const updatedUser = await updateUserResponse.json();
        sessionStorage.setItem('usuarioCorrente', JSON.stringify(updatedUser));
        
    } catch (error) {
        console.error('Erro ao adicionar o pet:', error);
        displayMessage(`Erro ao adicionar o pet: ${error.message}`, 'danger');
    }
}

// Função para atualizar um pet
async function updatePet(id, pet) {
    try {
        const response = await fetch(`${API_PETS_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pet),
        });

        if (!response.ok) {
            throw new Error(`Erro ao atualizar o pet: ${response.status}`);
        }

        displayMessage('Pet atualizado com sucesso!', 'success');
        clearForm();
        readPets();
    } catch (error) {
        console.error('Erro ao atualizar o pet:', error);
        displayMessage(`Erro ao atualizar o pet: ${error.message}`, 'danger');
    }
}

// Função para excluir um pet
async function deletePet(id) {
    if (!confirm('Tem certeza que deseja excluir este pet?')) {
        return;
    }

    try {
        const response = await fetch(`${API_PETS_URL}/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`Erro ao excluir o pet: ${response.status}`);
        }

        displayMessage('Pet excluído com sucesso!', 'success');
        readPets();

        // Agora, remove o ID do pet do perfil do usuário
        const userResponse = await fetch(`${API_USUARIOS_URL}/${usuarioCorrente.id}`);
        if (!userResponse.ok) throw new Error(`Erro ao buscar usuário para remoção de petIDs: ${userResponse.status}`);
        const user = await userResponse.json();

        const updatedPetIDs = (user.petIDs || []).filter(petId => petId !== Number(id));
        
        const updateUserResponse = await fetch(`${API_USUARIOS_URL}/${usuarioCorrente.id}`, {
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

    } catch (error) {
        console.error('Erro ao excluir o pet:', error);
        displayMessage(`Erro ao excluir o pet: ${error.message}`, 'danger');
    }
}

// Função para preencher o formulário com as informações do pet a ser editado
async function editPet(id) {
    try {
        const response = await fetch(`${API_PETS_URL}/${id}`);
        if (!response.ok) {
            throw new Error(`Erro ao carregar o pet para edição: ${response.status}`);
        }
        const pet = await response.json();

        document.getElementById('inputId').value = pet.id;
        document.getElementById('inputNome').value = pet.nome;
        document.getElementById('inputEspecie').value = pet.especie;
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
        document.getElementById('inputFoto').value = pet.foto || ''; // Preenche o campo da foto

        // Altera a visibilidade dos botões
        document.getElementById('btnInserir').style.display = 'none';
        document.getElementById('btnAlterar').style.display = 'inline-block'; // Use inline-block para btn

        displayMessage(''); // Limpa mensagens de alerta ao editar
    } catch (error) {
        console.error('Erro ao carregar o pet para edição:', error);
        displayMessage(`Erro ao carregar o pet para edição: ${error.message}`, 'danger');
    }
}

// --- Manipulação de Eventos e Inicialização ---

// Função para enviar o formulário (inserir ou atualizar)
async function handleSubmit(event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    const pet = {
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
        foto: document.getElementById('inputFoto').value // Pega a URL da foto
    };

    // Validação básica dos campos obrigatórios
    if (!pet.nome || !pet.especie) {
        displayMessage('Os campos Nome do Pet e Espécie são obrigatórios.', 'warning');
        return;
    }

    const petId = document.getElementById('inputId').value;

    if (petId) {
        await updatePet(petId, pet); // Se houver ID, faz uma atualização
    } else {
        await createPet(pet); // Se não houver ID, cria um novo pet
    }
}

// Função para verificar o status de login ao carregar a página
async function checkLoginStatus() {
    const usuarioCorrenteJSON = sessionStorage.getItem('usuarioCorrente');
    if (!usuarioCorrenteJSON) {
        // Se não há usuário logado, redireciona para a página de login
        window.location.href = '/modulos/login/login.html';
        return;
    }
    usuarioCorrente = JSON.parse(usuarioCorrenteJSON); // Armazena o usuário logado
    readPets(); // Carrega os pets após confirmar o login
}

// Adiciona eventos aos botões de ações
document.getElementById('btnInserir').addEventListener('click', handleSubmit);
document.getElementById('btnAlterar').addEventListener('click', handleSubmit);
document.getElementById('btnLimpar').addEventListener('click', clearForm); // Evento para botão Limpar

// Carrega a lista de pets e verifica login ao carregar a página
document.addEventListener('DOMContentLoaded', checkLoginStatus); // Chama a função que verifica login e depois carrega pets