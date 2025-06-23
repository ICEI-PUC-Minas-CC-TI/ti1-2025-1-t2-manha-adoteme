
const API_BASE_URL = 'https://ti1-2025-1-t2-manha-adoteme-p1jd.onrender.com'; 

const API_PETS_URL = `${API_BASE_URL}/pets`;
const API_USUARIOS_URL = `${API_BASE_URL}/usuarios`;



// Função para exibir mensagens de sucesso ou erro
function displayMessage(mensagem, tipo = 'warning') { 
    console.log(`displayMessage: Exibindo mensagem - Tipo: ${tipo}, Mensagem: ${mensagem}`);
    const msgDiv = document.getElementById('msg');
    if (msgDiv) {
        msgDiv.innerHTML = `<div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
            ${mensagem}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`;
    } else {
        console.error("displayMessage: Elemento #msg não encontrado no DOM. Exibindo alerta padrão.");
        alert(mensagem); // Fallback para alerta se div de mensagem não existir
    }
}

// Função para limpar o formulário
function clearForm() {
    document.getElementById('form-pet').reset();
    document.getElementById('inputId').value = ''; // O ID do formulário de cadastro nunca será preenchido
    document.getElementById('btnInserir').style.display = 'inline'; // Botão 'Adicionar' visível
    document.getElementById('btnAlterar').style.display = 'none'; // Botão 'Editar' escondido nesta página
    
    const msgDiv = document.getElementById('msg');
    if (msgDiv) {
        msgDiv.innerHTML = ''; // Limpa o conteúdo da div #msg
    }
}

// --- Função Principal de Cadastro de Pet ---

async function createPet(pet) {
    console.log('createPet: Iniciando processo de cadastro do pet.');
    
    // Verifica se o usuário está logado usando window.usuarioCorrente
    if (!window.usuarioCorrente || !window.usuarioCorrente.id) { // Usar window.usuarioCorrente para ser explícito
        displayMessage('Você precisa estar logado para cadastrar um pet.', 'danger');
        console.error('createPet: Usuário não logado ou sem ID em window.usuarioCorrente.');
        return;
    }

    pet.ownerId = window.usuarioCorrente.id; // Associa o pet ao ID do usuário logado

    try {
        console.log('createPet: Enviando pet para a API (POST /pets):', pet);
        const response = await fetch(API_PETS_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pet),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido ao parsear resposta do POST' }));
            throw new Error(`Erro HTTP ao adicionar o pet (POST /pets): ${response.status} - ${errorData.message || response.statusText}`);
        }

        const newPet = await response.json();
        console.log('createPet: Pet cadastrado com sucesso no servidor:', newPet);
        
        displayMessage('Pet cadastrado com sucesso!', 'success'); // Mensagem de sucesso para o usuário
        
        clearForm(); // Limpa o formulário APÓS a mensagem ser exibida

        // Passo CRUCIAL: Atualiza o perfil do usuário para incluir o ID do novo pet
        console.log('createPet: Buscando perfil do usuário para atualizar petIDs (GET /usuarios/id)...');
        const userResponse = await fetch(`${API_USUARIOS_URL}/${window.usuarioCorrente.id}`); // Usar window.usuarioCorrente
        if (!userResponse.ok) {
            throw new Error(`Erro ao buscar usuário para atualização de petIDs (GET /usuarios/id): ${userResponse.status}`);
        }
        const user = await userResponse.json();
        console.log('createPet: Usuário atual antes de atualizar petIDs:', user);

        let currentPetIDs = Array.isArray(user.petIDs) ? user.petIDs : [];
        currentPetIDs = currentPetIDs.filter(id => id !== null && id !== undefined); 
        
        const newPetIdNumber = Number(newPet.id);
        if (!isNaN(newPetIdNumber) && !currentPetIDs.includes(newPetIdNumber)) {
            currentPetIDs.push(newPetIdNumber);
        } else {
            console.warn(`createPet: ID do novo pet (${newPet.id}) não é um número válido ou já existe. Não adicionado ao petIDs do usuário.`);
        }
        const updatedPetIDs = currentPetIDs;
        
        console.log('createPet: Enviando atualização de petIDs para o usuário (PATCH /usuarios/id):', updatedPetIDs);
        const updateUserResponse = await fetch(`${API_USUARIOS_URL}/${window.usuarioCorrente.id}`, {
            method: 'PATCH', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ petIDs: updatedPetIDs }),
        });

        if (!updateUserResponse.ok) {
            const errorData = await updateUserResponse.json().catch(() => ({ message: 'Erro desconhecido ao parsear resposta do PATCH' }));
            throw new Error(`Erro ao atualizar petIDs do usuário: ${updateUserResponse.status} - ${errorData.message || updateUserResponse.statusText}`);
        }
        
        const updatedUser = await updateUserResponse.json();
        sessionStorage.setItem('usuarioCorrente', JSON.stringify(updatedUser)); 
        console.log('createPet: petIDs do usuário atualizados no db.json e sessionStorage:', updatedUser);

        //Redirecionar para a página "Meu Perfil" após um pequeno delay para a mensagem ser lida
        setTimeout(() => { 
            window.location.href = '/modulos/meu-perfil/meu_perfil.html';
        }, 2500); // Redireciona após 2.5 segundos
        
    } catch (error) {
        console.error('createPet: Erro GERAL no processo de cadastro do pet:', error);
        displayMessage(`Erro ao adicionar o pet: ${error.message}. Verifique o console.`, 'danger');
    }
}


// Função para enviar o formulário (apenas inserir nesta página)
async function handleSubmit(event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    // Coleta todos os dados do formulário
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
        imagem: document.getElementById('inputFoto').value 
    };

    // Validação básica dos campos obrigatórios
    if (!pet.nome || !pet.especie) {
        displayMessage('Os campos Nome do Pet e Espécie são obrigatórios.', 'warning');
        return;
    }

    // Apenas cria o pet, pois esta página é só de cadastro
    await createPet(pet);
}

// --- Inicialização da Página ---

// Função para verificar o status de login ao carregar a página
async function checkLoginStatus() {
    console.log('checkLoginStatus: Verificando status de login para pets.js...');
    const usuarioCorrenteJSON = sessionStorage.getItem('usuarioCorrente');
    if (!usuarioCorrenteJSON) {
        console.log('checkLoginStatus: Usuário não logado. Redirecionando para página de login.');
        window.location.href = '/modulos/login/login.html';
        return;
    }
    window.usuarioCorrente = JSON.parse(usuarioCorrenteJSON); 
    console.log('checkLoginStatus: Usuário logado:', window.usuarioCorrente);
}

// Adiciona evento ao botão "Adicionar"
document.getElementById('btnInserir').addEventListener('click', handleSubmit);
// Os botões 'Alterar' e 'Limpar' não são mais usados para fluxo de edição principal nesta página
document.getElementById('btnAlterar').style.display = 'none'; // Esconde o botão 'Editar' no carregamento
document.getElementById('btnLimpar').addEventListener('click', clearForm);


// Verifica login ao carregar a página
document.addEventListener('DOMContentLoaded', checkLoginStatus);
