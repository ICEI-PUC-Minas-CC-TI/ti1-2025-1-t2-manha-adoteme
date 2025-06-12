// Este arquivo: assets/js/meu_perfil.js

const API_BASE_URL = 'http://localhost:3000'; // Base URL para seu json-server
const API_USUARIOS_URL = `${API_BASE_URL}/usuarios`;
const API_PETS_URL = `${API_BASE_URL}/pets`;

async function carregarPerfil() {
    try {
        // Obtém o ID do usuário logado do sessionStorage
        const usuarioCorrenteJSON = sessionStorage.getItem('usuarioCorrente');
        if (!usuarioCorrenteJSON) {
            console.error('Nenhum usuário logado. Redirecionando para login.');
            window.location.href = '/modulos/login/login.html'; // Garante o redirecionamento se não logado
            return;
        }
        const usuarioCorrente = JSON.parse(usuarioCorrenteJSON);
        const userId = usuarioCorrente.id; // <-- Ponto crucial: pega o ID do usuário logado

        if (!userId) {
            console.error('ID do usuário não encontrado no sessionStorage.');
            window.location.href = '/modulos/login/login.html';
            return;
        }

        // 1. Carregar dados do usuário logado usando o ID específico
        const userResponse = await fetch(`${API_USUARIOS_URL}/${userId}`); // <-- Ponto crucial: requisita APENAS o usuário com esse ID
        if (!userResponse.ok) {
            throw new Error(`Erro ao buscar perfil do usuário: ${userResponse.status}`);
        }
        const usuario = await userResponse.json();

        // 2. Preencher informações do perfil
        document.getElementById('fotoPerfil').src = usuario.fotoPerfil || 'https://via.placeholder.com/100'; // Fallback para foto
        document.getElementById('nome').textContent = usuario.nome || 'Não informado';
        document.getElementById('email').textContent = usuario.email || 'Não informado';
        document.getElementById('endereco').textContent = usuario.endereco || 'Não informado';
        document.getElementById('celular').textContent = usuario.celular || 'Não informado';
        document.getElementById('cpf').textContent = usuario.cpf || 'Não informado';
        document.getElementById('login').textContent = usuario.login || 'Não informado'; // Alterado de nomeUsuario para login

        // 3. Carregar e exibir os pets do usuário
        const petsResponse = await fetch(API_PETS_URL);
        if (!petsResponse.ok) {
            throw new Error(`Erro ao buscar pets: ${petsResponse.status}`);
        }
        const todosPets = await petsResponse.json();

        // Filtra os pets que pertencem ao usuário logado
        const meusPets = todosPets.filter(pet => (usuario.petIDs || []).includes(Number(pet.id)));
        const petsContainer = document.getElementById('petsContainer');
        petsContainer.innerHTML = ''; // Limpa o conteúdo existente

        if (meusPets.length === 0) {
            petsContainer.innerHTML = '<div class="col-12"><p>Nenhum pet cadastrado para adoção por você.</p></div>';
            return;
        }

        meusPets.forEach(pet => {
            const div = document.createElement('div');
            div.className = 'col-md-6 col-lg-4 mb-4'; // Colunas para layout responsivo com Bootstrap
            div.innerHTML = `
                <div class="card pet-card h-100"> <img src="${pet.foto}" class="card-img-top" alt="Foto do pet ${pet.nome}" style="height: 180px; object-fit: cover;" />
                    <div class="card-body">
                        <h5 class="card-title">${pet.nome}</h5>
                        <p class="card-text">${pet.especie} - ${pet.raca}</p>
                        <button class="btn btn-sm btn-info me-2">Ver Detalhes</button>
                        <button class="btn btn-sm btn-secondary">Editar Pet</button>
                    </div>
                </div>
            `;
            petsContainer.appendChild(div);
        });

    } catch (error) {
        console.error('Erro ao carregar dados do perfil:', error);
        // Exibe uma mensagem de erro na UI, caso ocorra um problema
        document.getElementById('petsContainer').innerHTML = '<div class="col-12"><p class="text-danger">Erro ao carregar informações do perfil ou pets. Verifique o console.</p></div>';
    }
}

// Quando a página carregar, chama a função para carregar o perfil
window.onload = carregarPerfil;

// Event listener para o botão "Editar Perfil"
document.getElementById("btnEditarPerfil").addEventListener("click", () => {
    // Redireciona para a página de edição de perfil
    window.location.href = "editar_perfil.html"; // Caminho relativo, pois estão na mesma pasta
});

// Event listener para o botão "Cadastrar novo pet" (apenas um placeholder)
document.getElementById("btnCadastrarPet").addEventListener("click", () => {
    alert("Funcionalidade de cadastrar novo pet ainda não implementada!");
    // window.location.href = "cadastrar_pet.html"; // Exemplo de redirecionamento futuro
});