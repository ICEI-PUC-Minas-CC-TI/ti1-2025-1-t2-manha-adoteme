
const LOGIN_URL = "/modulos/login/login.html";
let RETURN_URL = "/index.html";
const API_URL = 'https://ti1-2025-1-t2-manha-adoteme-p1jd.onrender.com/usuarios';


// Objeto para o banco de dados de usuários baseado em JSON
var db_usuarios = []; // Inicializado como array vazio

// Objeto para o usuário corrente
var usuarioCorrente = {};

// Inicializa a aplicação de Login
function initLoginApp () {
    console.log("initLoginApp: Iniciando LoginApp...");
    let pagina = window.location.pathname;
    if (pagina.endsWith(LOGIN_URL)) { // Usando endsWith para ser mais robusto
        console.log("initLoginApp: Estamos na página de login.");
        // Se a página atual é a de login, configura a URL de retorno
        let returnURL = sessionStorage.getItem('returnURL');
        RETURN_URL = returnURL || RETURN_URL; // Usa a URL salva ou a padrão
        console.log("initLoginApp: RETURN_URL configurada para:", RETURN_URL);
        
        // Inicializa banco de dados de usuários
        carregarUsuarios(() => {
            console.log('initLoginApp: Usuários carregados para a página de login...');
        });
    } else {
        console.log("initLoginApp: Não estamos na página de login. Salvando URL atual.");
        // Se não é a página de login, salva a URL atual como retorno e verifica o usuário logado
        sessionStorage.setItem('returnURL', pagina);
        RETURN_URL = pagina;

        // INICIALIZA USUARIOCORRENTE A PARTIR DE DADOS NO LOCAL STORAGE, CASO EXISTA
        let usuarioCorrenteJSON = sessionStorage.getItem('usuarioCorrente');
        if (usuarioCorrenteJSON) {
            usuarioCorrente = JSON.parse(usuarioCorrenteJSON);
            console.log("initLoginApp: Usuário corrente carregado do sessionStorage:", usuarioCorrente);
        } else {
            console.log("initLoginApp: Nenhum usuário corrente no sessionStorage. Redirecionando para LOGIN_URL.");
        }

        // REGISTRA LISTENER PARA O EVENTO DE CARREGAMENTO DA PÁGINA PARA ATUALIZAR INFORMAÇÕES DO USUÁRIO
        document.addEventListener('DOMContentLoaded', function () {
            console.log("initLoginApp: DOMContentLoaded acionado. Verificando userInfo.");
            showUserInfo('userInfo');
        });
    }
};

// Função para carregar usuários da API
function carregarUsuarios(callback) {
    console.log("carregarUsuarios: Buscando usuários da API:", API_URL);
    fetch(API_URL)
    .then(response => {
        console.log("carregarUsuarios: Resposta da API de usuários:", response);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        db_usuarios = data; // Armazena os usuários carregados
        console.log("carregarUsuarios: Usuários carregados com sucesso. Total:", db_usuarios.length);
        if (callback) callback();
    })
    .catch(error => {
        console.error('carregarUsuarios: Erro ao ler usuários via API JSONServer:', error);
        alert("Erro ao ler usuários. Verifique se o json-server está rodando."); // Use alert ou uma mensagem na UI
    });
}

// Verifica se o login do usuário está ok e, se positivo, direciona para a página inicial
async function loginUser (login, senha) {
    console.log("loginUser: Tentando login para:", login);
    // Garante que os usuários estejam carregados antes de tentar o login
    if (db_usuarios.length === 0) {
        console.log("loginUser: db_usuarios vazio, carregando...");
        await new Promise(resolve => carregarUsuarios(resolve)); // Espera carregar os usuários
    }
    console.log("loginUser: db_usuarios populado. Verificando credenciais.");

    for (var i = 0; i < db_usuarios.length; i++) {
        var usuario = db_usuarios[i];
        if (login == usuario.login && senha == usuario.senha) {
            console.log("loginUser: Credenciais encontradas para:", usuario.login);
            usuarioCorrente.id = usuario.id;
            usuarioCorrente.login = usuario.login;
            usuarioCorrente.email = usuario.email;
            usuarioCorrente.nome = usuario.nome;
            usuarioCorrente.senha = usuario.senha; // Salvar senha no sessionStorage (para PATCH)

            sessionStorage.setItem ('usuarioCorrente', JSON.stringify (usuarioCorrente));
            console.log("loginUser: usuarioCorrente salvo no sessionStorage:", usuarioCorrente);
            return true;
        }
    }

    console.log("loginUser: Usuário ou senha não encontrados.");
    return false;
}

// Apaga os dados do usuário corrente no sessionStorage
function logoutUser () {
    console.log("logoutUser: Fazendo logout.");
    sessionStorage.removeItem ('usuarioCorrente');
    window.location = LOGIN_URL;
}

// Função para adicionar um novo usuário 
async function addUser (nome, login, senha, email, endereco, celular, cpf, fotoPerfil) { 
    console.log("addUser: Tentando adicionar novo usuário:", login);

    let usuario = { 
        "login": login, 
        "senha": senha, 
        "nome": nome, 
        "email": email,
        "endereco": endereco,
        "celular": celular,
        "cpf": cpf,
        "fotoPerfil": fotoPerfil,
        "petIDs": [] 
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(usuario),
        });

        console.log("addUser: Resposta da API ao adicionar usuário:", response);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
            throw new Error(`HTTP error! status: ${response.status} - ${errorData.message || response.statusText}`);
        }
        const data = await response.json();
        db_usuarios.push(data); // Adiciona o novo usuário na variável db_usuarios em memória
        console.log("addUser: Usuário inserido com sucesso:", data);
    } catch (error) {
        console.error('addUser: Erro ao inserir usuário via API JSONServer:', error);
        throw error; // Propaga o erro
    }
}

// Função para exibir informações do usuário na UI (se houver um elemento com o ID fornecido)
function showUserInfo (element) {
    var elemUser = document.getElementById(element);
    if (elemUser) {
        if (usuarioCorrente && usuarioCorrente.nome) {
            elemUser.innerHTML = `${usuarioCorrente.nome} (${usuarioCorrente.login}) 
                                <a href="#" onclick="logoutUser()">❌</a>`; // Usar href="#" para acessibilidade
            console.log("showUserInfo: Informações do usuário exibidas.");
        } else {
            elemUser.innerHTML = ''; // Limpa se não houver usuário corrente
            console.log("showUserInfo: Nenhum usuário corrente para exibir.");
        }
    } else {
        console.log("showUserInfo: Elemento '"+ element +"' não encontrado.");
    }
}

// Inicializa as estruturas utilizadas pelo LoginApp
initLoginApp ();
