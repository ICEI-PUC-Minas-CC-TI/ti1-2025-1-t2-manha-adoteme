

const API_BASE_URL = 'https://ti1-2025-1-t2-manha-adoteme-p1jd.onrender.com'; 
const API_USUARIOS_URL = `${API_BASE_URL}/usuarios`;
const API_PETS_URL = `${API_BASE_URL}/pets`;

async function carregarPerfil() {
    console.log("carregarPerfil: Iniciando...");
    try {
        const usuarioCorrenteJSON = sessionStorage.getItem('usuarioCorrente');
        console.log("carregarPerfil: usuarioCorrenteJSON do sessionStorage:", usuarioCorrenteJSON);

        if (!usuarioCorrenteJSON) {
            console.error('carregarPerfil: Nenhum usuário logado. Redirecionando para login.');
            window.location.href = '/modulos/login/login.html';
            return;
        }

        // Atribuir diretamente à propriedade global do objeto window
        window.usuarioCorrente = JSON.parse(usuarioCorrenteJSON);
        console.log("carregarPerfil: window.usuarioCorrente parseado:", window.usuarioCorrente);
        const userId = window.usuarioCorrente.id; // Usar window.usuarioCorrente
        console.log("carregarPerfil: userId obtido:", userId);

        if (!userId) {
            console.error('carregarPerfil: ID do usuário não encontrado no sessionStorage. Redirecionando para login.');
            window.location.href = '/modulos/login/login.html';
            return;
        }

        console.log(`carregarPerfil: Buscando dados do usuário com ID: ${userId}`);
        const userResponse = await fetch(`${API_USUARIOS_URL}/${userId}`);
        console.log("carregarPerfil: Resposta da busca de usuário:", userResponse);

        if (!userResponse.ok) {
            console.error(`carregarPerfil: Erro HTTP ao buscar perfil: ${userResponse.status} - ${userResponse.statusText}`);
            throw new Error(`Erro ao buscar perfil do usuário: ${userResponse.status}`);
        }
        const usuario = await userResponse.json();
        console.log("carregarPerfil: Dados do usuário carregados:", usuario);

        // Preencher informações do perfil
        document.getElementById('fotoPerfil').src = usuario.fotoPerfil || 'https://via.placeholder.com/100';
        document.getElementById('nome').textContent = usuario.nome || 'Não informado';
        document.getElementById('email').textContent = usuario.email || 'Não informado';
        document.getElementById('endereco').textContent = usuario.endereco || 'Não informado';
        document.getElementById('celular').textContent = usuario.celular || 'Não informado';
        document.getElementById('cpf').textContent = usuario.cpf || 'Não informado';
        document.getElementById('login').textContent = usuario.login || 'Não informado';
        console.log("carregarPerfil: Informações do perfil preenchidas.");

        // Carregar e exibir os pets do usuário
        console.log("carregarPerfil: Buscando TODOS os pets da API...");
        const petsResponse = await fetch(API_PETS_URL);
        console.log("carregarPerfil: Resposta da busca de todos os pets:", petsResponse);

        if (!petsResponse.ok) {
            throw new Error(`Erro ao buscar todos os pets: ${petsResponse.status}`);
        }
        const todosPets = await petsResponse.json();
        console.log("carregarPerfil: TODOS os pets carregados:", todosPets);
        console.log("carregarPerfil: petIDs do usuário logado:", usuario.petIDs);
        // Filtra os pets que pertencem ao usuário logado
        const meusPets = todosPets.filter(pet => {
            const isAssociated = (usuario.petIDs || []).includes(Number(pet.id)); // Certifica que pet.id é Number
            const isOwner = (pet.ownerId && pet.ownerId === usuario.id); //Verifica se o ownerId do pet bate com o userId
            
            console.log(`Pet ID: ${pet.id}, Nome: ${pet.nome}, pet.ownerId: ${pet.ownerId}, usuario.id: ${usuario.id}, Associado (petIDs): ${isAssociated}, Proprietário (ownerId): ${isOwner}`); // LOG DETALHADO
            
            return isAssociated && isOwner; // Ambos devem ser verdadeiros
        });
        
        console.log("carregarPerfil: Meus Pets FILTRADOS FINALMENTE:", meusPets);

        const petsContainer = document.getElementById('petsContainer');
        petsContainer.innerHTML = '';

        if (meusPets.length === 0) {
            petsContainer.innerHTML = '<div class="col-12"><p>Nenhum pet cadastrado para adoção por você.</p></div>';
            console.log("carregarPerfil: Nenhum pet do usuário encontrado após filtragem.");
            return;
        }

        meusPets.forEach(pet => {
            const div = document.createElement('div');
            div.className = 'col-md-6 col-lg-4 mb-4';
            div.innerHTML = `
                <div class="card pet-card h-100">
                    <img src="${pet.imagem}" class="card-img-top" alt="Foto do pet ${pet.nome}" style="height: 180px; object-fit: cover;" />
                    <div class="card-body">
                        <h5 class="card-title">${pet.nome}</h5>
                        <p class="card-text">
                            ${pet.especie} - ${pet.raca}<br>
                            Idade: ${pet.idade} ano(s)
                        </p>
<a href="/modulos/meu-perfil/editar_pet.html?id=${pet.id}" class="btn btn-sm btn-custom-orange me-2">Editar Pet</a>
                        <button class="btn btn-sm btn-danger" onclick="confirmDeletePet(${pet.id}, '${pet.nome}')">Excluir Pet</button>
                    </div>
                </div>
            `;
            petsContainer.appendChild(div);
        });
        console.log("carregarPerfil: Pets do usuário preenchidos na tela.");

    } catch (error) {
        console.error('carregarPerfil: Erro GERAL ao carregar dados do perfil:', error);
        document.getElementById('petsContainer').innerHTML = '<div class="col-12"><p class="text-danger">Erro ao carregar informações do perfil ou pets. Verifique o console para mais detalhes.</p></div>';
    }
}

// Funções para deletar pet (copiada e adaptada de pets.js)
async function confirmDeletePet(petId, petNome) {
    if (!window.usuarioCorrente || !window.usuarioCorrente.id) {
        alert('Erro: Você precisa estar logado para excluir um pet.');
        return;
    }
    if (confirm(`Tem certeza que deseja excluir o pet ${petNome} (ID: ${petId})?`)) {
        try {
            const response = await fetch(`${API_PETS_URL}/${petId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`Erro ao excluir o pet: ${response.status}`);
            }

            alert('Pet excluído com sucesso!');
            
            // Atualiza o perfil do usuário para remover o ID do pet
            const userResponse = await fetch(`${API_USUARIOS_URL}/${window.usuarioCorrente.id}`); 
            if (!userResponse.ok) throw new Error(`Erro ao buscar usuário para remoção de petIDs: ${userResponse.status}`);
            const user = await userResponse.json();

            const updatedPetIDs = (user.petIDs || []).filter(id => id !== Number(petId));
            
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

            // Recarrega o perfil para atualizar a lista de pets
            carregarPerfil();

        } catch (error) {
            console.error('Erro ao excluir o pet:', error);
            alert(`Erro ao excluir o pet: ${error.message}`);
        }
    }
}

// Quando a página carregar, chama a função para carregar o perfil
window.onload = carregarPerfil;

// Event listener para o botão "Editar Perfil"
document.getElementById("btnEditarPerfil").addEventListener("click", () => {
    console.log("Botão Editar Perfil clicado. Redirecionando...");
    window.location.href = "editar_perfil.html";
});


