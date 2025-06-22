

const API_BASE_URL = 'http://localhost:3000'; // Base URL para seu json-server
const API_USUARIOS_URL = `${API_BASE_URL}/usuarios`; // Endpoint para usuários

let petIDsUsuario = []; // Armazenará os IDs de pets do usuário

async function carregarDadosParaEditar() {
    try {
        // Obtém o ID do usuário logado do sessionStorage
        const usuarioCorrenteJSON = sessionStorage.getItem('usuarioCorrente');
        if (!usuarioCorrenteJSON) {
            console.error('Nenhum usuário logado. Redirecionando para login.');
            window.location.href = '/modulos/login/login.html';
            return;
        }
        const usuarioCorrente = JSON.parse(usuarioCorrenteJSON);
        const userId = usuarioCorrente.id;

        if (!userId) {
            console.error('ID do usuário não encontrado no sessionStorage.');
            window.location.href = '/modulos/login/login.html';
            return;
        }

        // Faz a requisição para o perfil do usuário logado
        const response = await fetch(`${API_USUARIOS_URL}/${userId}`);
        if (!response.ok) {
            throw new Error(`Erro ao buscar perfil do usuário: ${response.status}`);
        }
        const usuario = await response.json();

        // Preenche o formulário com os dados do usuário
        petIDsUsuario = usuario.petIDs || []; // Salva os petIDs para não perdê-los na edição

        document.getElementById('nome').value = usuario.nome || '';
        document.getElementById('email').value = usuario.email || '';
        document.getElementById('endereco').value = usuario.endereco || '';
        document.getElementById('celular').value = usuario.celular || '';
        document.getElementById('cpf').value = usuario.cpf || '';
        document.getElementById('login').value = usuario.login || '';
        document.getElementById('fotoPerfil').value = usuario.fotoPerfil || '';
        document.getElementById('imgPreview').src = usuario.fotoPerfil || '';
        document.getElementById('imgPreview').style.display = usuario.fotoPerfil ? 'block' : 'none'; // Mostra/oculta a prévia
    } catch (err) {
        console.error('Erro ao carregar dados para edição:', err);
        alert('Erro ao carregar dados do perfil. Tente novamente mais tarde.');
    }
}

async function salvarAlteracoes(event) {
    event.preventDefault();

    // Obtém o ID do usuário logado novamente
    const usuarioCorrenteJSON = sessionStorage.getItem('usuarioCorrente');
    if (!usuarioCorrenteJSON) {
        alert('Sessão expirada. Faça login novamente.');
        window.location.href = '/modulos/login/login.html';
        return;
    }
    const usuarioCorrente = JSON.parse(usuarioCorrenteJSON);
    const userId = usuarioCorrente.id;

    if (!userId) {
        alert('ID do usuário não encontrado. Faça login novamente.');
        window.location.href = '/modulos/login/login.html';
        return;
    }

    // Cria o objeto com os dados editados do formulário
    const usuarioEditado = {
        // ID e senha não são alterados por esta tela, mas são importantes para o json-server
        id: userId, // Garante que o ID do usuário seja mantido
        senha: usuarioCorrente.senha, // Mantém a senha atual do usuário (não está no form)
        
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        endereco: document.getElementById('endereco').value,
        celular: document.getElementById('celular').value,
        cpf: document.getElementById('cpf').value,
        login: document.getElementById('login').value, // Alterado de nomeUsuario para login
        fotoPerfil: document.getElementById('fotoPerfil').value,
        petIDs: petIDsUsuario // Mantém os petIDs existentes
    };

    try {
        const response = await fetch(`${API_USUARIOS_URL}/${userId}`, {
            method: 'PUT', // Usa PUT para atualizar um recurso existente
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(usuarioEditado)
        });

        if (!response.ok) {
            // Tenta ler a mensagem de erro da resposta se houver
            const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
            throw new Error(`Erro ao salvar alterações: ${response.status} - ${errorData.message || response.statusText}`);
        }

        const data = await response.json();
        alert('Perfil atualizado com sucesso!');
        
        // Atualiza o usuarioCorrente no sessionStorage com os novos dados
        sessionStorage.setItem('usuarioCorrente', JSON.stringify(data));

        // Redireciona de volta para a página do perfil
        window.location.href = 'meu_perfil.html'; // Caminho relativo, pois estão na mesma pasta
    } catch (error) {
        console.error('Falha ao salvar o perfil:', error);
        alert('Falha ao salvar. Verifique o console para mais detalhes.');
    }
}

// Inicializa o carregamento dos dados e adiciona os event listeners
window.onload = () => {
    carregarDadosParaEditar();

    const form = document.getElementById('formEditarPerfil');
    form.addEventListener('submit', salvarAlteracoes);

    // Prévia da imagem ao digitar a URL
    document.getElementById('fotoPerfil').addEventListener('input', function () {
        const imgPreview = document.getElementById('imgPreview');
        if (this.value) {
            imgPreview.src = this.value;
            imgPreview.style.display = 'block';
        } else {
            imgPreview.src = '';
            imgPreview.style.display = 'none'; // Oculta se a URL for removida
        }
    });
};
