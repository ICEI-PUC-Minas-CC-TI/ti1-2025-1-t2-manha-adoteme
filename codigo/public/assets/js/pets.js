// URL da API JSONServer
const apiUrl = 'http://localhost:3000/pets';

// Função para exibir mensagens de sucesso ou erro
function displayMessage(mensagem) {
    const msg = document.getElementById('msg');
    msg.innerHTML = '<div class="alert alert-warning">' + mensagem + '</div>';
}

// Função para ler (exibir) todos os pets cadastrados
function readPets() {
    axios.get(apiUrl)
        .then(response => {
            const pets = response.data;
            const tableBody = document.getElementById('table-pets');
            tableBody.innerHTML = ''; 

            pets.forEach(pet => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${pet.id}</td>
                    <td>${pet.nome}</td>
                    <td>${pet.especie}</td>
                    <td>${pet.raca}</td>
                    <td>${pet.idade}</td>
                    <td>${pet.sexo}</td>
                    <td>${pet.porte}</td>
                    <td>${pet.localizacao}</td>
                    <td>
                        <button class="btn btn-warning" onclick="editPet(${pet.id})">Editar</button>
                        <button class="btn btn-danger" onclick="deletePet(${pet.id})">Excluir</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar os pets:', error);
            displayMessage('Erro ao carregar os pets');
        });
}

// Função para adicionar um novo pet
function createPet(pet) {
    axios.post(apiUrl, pet)
        .then(response => {
            displayMessage('Pet inserido com sucesso!');
            readPets(); 
        })
        .catch(error => {
            console.error('Erro ao adicionar o pet:', error);
            displayMessage('Erro ao adicionar o pet');
        });
}

// Função para atualizar um pet
function updatePet(id, pet) {
    axios.put(`${apiUrl}/${id}`, pet)
        .then(response => {
            displayMessage('Pet atualizado com sucesso!');
            readPets(); 
        })
        .catch(error => {
            console.error('Erro ao atualizar o pet:', error);
            displayMessage('Erro ao atualizar o pet');
        });
}

// Função para excluir um pet
function deletePet(id) {
    axios.delete(`${apiUrl}/${id}`)
        .then(response => {
            displayMessage('Pet excluído com sucesso!');
            readPets(); 
        })
        .catch(error => {
            console.error('Erro ao excluir o pet:', error);
            displayMessage('Erro ao excluir o pet');
        });
}

// Função para preencher o formulário com as informações do pet a ser editado
function editPet(id) {
    axios.get(`${apiUrl}/${id}`)
        .then(response => {
            const pet = response.data;
            document.getElementById('inputId').value = pet.id;
            document.getElementById('inputNome').value = pet.nome;
            document.getElementById('inputEspecie').value = pet.especie;
            document.getElementById('inputRaca').value = pet.raca;
            document.getElementById('inputIdade').value = pet.idade;
            document.getElementById('inputSexo').value = pet.sexo;
            document.getElementById('inputPorte').value = pet.porte;
            document.getElementById('inputPeso').value = pet.peso;
            document.getElementById('inputVacinado').value = pet.vacinado;
            document.getElementById('inputVermifugado').value = pet.vermifugado;
            document.getElementById('inputCastrado').value = pet.castrado;
            document.getElementById('inputCondicao').value = pet.condicao;
            document.getElementById('inputTemperamento').value = pet.temperamento;
            document.getElementById('inputCriancas').value = pet.criancas;
            document.getElementById('inputOutrosPets').value = pet.outrosPets;
            document.getElementById('inputCidade').value = pet.localizacao;

            // Muda o texto do botão de Inserir para Alterar
            document.getElementById('btnInserir').style.display = 'none';
            document.getElementById('btnAlterar').style.display = 'inline';
        })
        .catch(error => {
            console.error('Erro ao carregar o pet para edição:', error);
            displayMessage('Erro ao carregar o pet para edição');
        });
}

// Função para enviar o formulário (inserir ou atualizar)
function handleSubmit(event) {
    event.preventDefault();

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
        localizacao: document.getElementById('inputCidade').value
    };

    const petId = document.getElementById('inputId').value;

    if (petId) {
        // Se houver ID, faz uma atualização
        updatePet(petId, pet);
    } else {
        // Se não houver ID, cria um novo pet
        createPet(pet);
    }

    // Limpa o formulário
    document.getElementById('form-pet').reset();
    document.getElementById('btnInserir').style.display = 'inline';
    document.getElementById('btnAlterar').style.display = 'none';
}

// Adiciona eventos aos botões de ações
document.getElementById('btnInserir').addEventListener('click', handleSubmit);
document.getElementById('btnAlterar').addEventListener('click', handleSubmit);

// Carrega a lista de pets ao carregar a página
document.addEventListener('DOMContentLoaded', readPets);
