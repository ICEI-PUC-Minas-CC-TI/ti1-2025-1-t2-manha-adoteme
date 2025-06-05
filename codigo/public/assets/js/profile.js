async function carregarPerfil() {
  try {
    // Buscar todo o db.json (pois você tem /db que retorna o json completo)
    const response = await fetch('/db');
    if (!response.ok) throw new Error('Erro ao buscar db.json');

    const data = await response.json();

    // Pegar o usuário (aqui estou pegando o primeiro usuário do array)
    const usuario = data.users[0];

    if (!usuario) {
      console.error('Usuário não encontrado');
      return;
    }

    // Preencher dados do usuário na tela
    document.getElementById('fotoPerfil').src = usuario.fotoPerfil;
    document.getElementById('nome').textContent = usuario.nome;
    document.getElementById('email').textContent = usuario.email;
    document.getElementById('endereco').textContent = usuario.endereco;
    document.getElementById('celular').textContent = usuario.celular;
    document.getElementById('cpf').textContent = usuario.cpf;
    document.getElementById('nomeUsuario').textContent = usuario.nomeUsuario;

    // Filtrar pets do usuário comparando petIDs com pets do banco
    const meusPets = data.pets.filter(pet => usuario.petIDs.includes(Number(pet.id)));

    // Exibir pets
    const petsContainer = document.getElementById('petsContainer');
    petsContainer.innerHTML = ''; // limpa antes

    if (meusPets.length === 0) {
      petsContainer.textContent = 'Nenhum pet cadastrado.';
      return;
    }

    meusPets.forEach(pet => {
      const div = document.createElement('div');
      div.classList.add('pet-card');

      div.innerHTML = `
        <p><strong>Nome:</strong> ${pet.nome}</p>
        <p><strong>Espécie:</strong> ${pet.especie}</p>
        <p><strong>Raça:</strong> ${pet.raca}</p>
        <p><strong>Idade:</strong> ${pet.idade} anos</p>
        <p><strong>Sexo:</strong> ${pet.sexo}</p>
        <p><strong>Porte:</strong> ${pet.porte}</p>
        <p><strong>Peso:</strong> ${pet.peso} kg</p>
        <p><strong>Vacinado:</strong> ${pet.vacinado}</p>
        <p><strong>Vermifugado:</strong> ${pet.vermifugado}</p>
        <p><strong>Castrado:</strong> ${pet.castrado}</p>
        <p><strong>Condição:</strong> ${pet.condicao}</p>
        <p><strong>Temperamento:</strong> ${pet.temperamento}</p>
        <p><strong>Convive com crianças:</strong> ${pet.criancas}</p>
        <p><strong>Convive com outros pets:</strong> ${pet.outrosPets}</p>
        <p><strong>Localização:</strong> ${pet.localizacao}</p>
      `;

      petsContainer.appendChild(div);
    });

  } catch (error) {
    console.error('Erro ao carregar dados:', error);
  }
}

// Chama a função quando a página carregar
window.onload = carregarPerfil;
