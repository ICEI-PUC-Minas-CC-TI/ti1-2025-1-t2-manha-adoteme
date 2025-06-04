document.addEventListener('DOMContentLoaded', () => {
  const usuarioLogadoId = 1; 
  const apiBaseUrl = 'http://localhost:3000'; 

  const btnAlterarPerfil = document.getElementById('btnAlterarPerfil');
  const campos = [
    'nomeUsuario', 'emailUsuario', 'enderecoUsuario',
    'celularUsuario', 'cpfUsuario', 'nomeUsuarioLogin', 'senhaUsuario'
  ];

  const profileImage = document.getElementById('profileImage');
  const inputFotoPerfil = document.getElementById('inputFotoPerfil');
  let novaFotoBase64 = null;

  // Carregar dados do backend (db.json via backend)
  fetch(`${apiBaseUrl}/db.json`)
    .then(res => res.json())
    .then(data => {
      const usuario = data.usuarios.find(u => u.id === usuarioLogadoId);
      if (!usuario) {
        alert('Usuário não encontrado');
        return;
      }
      preencherPerfil(usuario);

      const petsDoUsuario = data.pets.filter(pet => usuario.pets.includes(pet.id));
      preencherPets(petsDoUsuario);
    })
    .catch(err => console.error('Erro ao carregar dados:', err));

  // Preenche o formulário com os dados do usuário
  function preencherPerfil(usuario) {
    document.getElementById('nomeUsuario').value = usuario.nome;
    document.getElementById('emailUsuario').value = usuario.email;
    document.getElementById('enderecoUsuario').value = usuario.endereco;
    document.getElementById('celularUsuario').value = usuario.celular;
    document.getElementById('cpfUsuario').value = usuario.cpf;
    document.getElementById('nomeUsuarioLogin').value = usuario.nomeUsuario;
    document.getElementById('senhaUsuario').value = usuario.senha;
    profileImage.src = usuario.fotoPerfil;
  }

  // Renderiza os cards dos pets
  function preencherPets(pets) {
    const petsContainer = document.querySelector('.row.g-4');
    petsContainer.innerHTML = '';

    pets.forEach(pet => {
      const card = document.createElement('div');
      card.classList.add('col-md-4');
      card.innerHTML = `
        <div class="card h-100 shadow-sm">
          <img src="${pet.foto}" class="card-img-top" alt="Foto do pet ${pet.nome}" />
          <div class="card-body">
            <h5 class="card-title fw-bold">${pet.nome}</h5>
            <p class="card-text">Raça: ${pet.raca}</p>
            <p class="card-text">Idade: ${pet.idade}</p>
            <p class="card-text">Sexo: ${pet.sexo}</p>
          </div>
        </div>
      `;
      petsContainer.appendChild(card);
    });
  }

  // Foto de perfil: abrir seletor e salvar base64
  profileImage.addEventListener('click', () => inputFotoPerfil.click());

  inputFotoPerfil.addEventListener('change', () => {
    const file = inputFotoPerfil.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      novaFotoBase64 = reader.result;
      profileImage.src = novaFotoBase64;
    };
    reader.readAsDataURL(file);
  });

  // Botão alterar perfil: ativa edição ou salva no backend
  btnAlterarPerfil.addEventListener('click', () => {
    const estaEditando = btnAlterarPerfil.textContent === 'Salvar alterações';

    if (!estaEditando) {
      campos.forEach(id => {
        document.getElementById(id).removeAttribute('readonly');
      });
      btnAlterarPerfil.textContent = 'Salvar alterações';
    } else {
      // Montar objeto com dados atualizados
      const dadosAtualizados = {
        nome: document.getElementById('nomeUsuario').value,
        email: document.getElementById('emailUsuario').value,
        endereco: document.getElementById('enderecoUsuario').value,
        celular: document.getElementById('celularUsuario').value,
        cpf: document.getElementById('cpfUsuario').value,
        nomeUsuario: document.getElementById('nomeUsuarioLogin').value,
        senha: document.getElementById('senhaUsuario').value,
      };

      if (novaFotoBase64) dadosAtualizados.fotoPerfil = novaFotoBase64;

      fetch(`${apiBaseUrl}/usuario/${usuarioLogadoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosAtualizados),
      })
        .then(res => {
          if (!res.ok) throw new Error('Erro ao salvar usuário');
          return res.text();
        })
        .then(msg => {
          alert(msg);
          campos.forEach(id => {
            document.getElementById(id).setAttribute('readonly', 'readonly');
          });
          btnAlterarPerfil.textContent = 'Alterar perfil';
          novaFotoBase64 = null;
        })
        .catch(err => {
          alert('Erro: ' + err.message);
        });
    }
  });

  // Botão cadastrar pet só alerta por enquanto
  document.getElementById('btnCadastrarPet').addEventListener('click', () => {
    alert('Função cadastrar novo pet ainda não implementada.');
  });
});
