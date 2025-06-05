async function buscarPets() {
  const nome = document.getElementById('nome').value.trim();
  const especie = document.getElementById('especie').value;
  const porte = document.getElementById('porte').value;
  const temperamento = document.getElementById('temperamento').value.trim();
  const castrado = document.getElementById('castrado').value;
  const vacinado = document.getElementById('vacinado').value;

  let url = 'http://localhost:3000/pets?';

  if (nome) url += `nome_like=${nome}&`;
  if (especie) url += `especie=${especie}&`;
  if (porte) url += `porte=${porte}&`;
  if (temperamento) url += `temperamento_like=${temperamento}&`;
  if (castrado) url += `castrado=${castrado}&`;
  if (vacinado) url += `vacinado=${vacinado}&`;

  const resposta = await fetch(url);
  const pets = await resposta.json();

  const resultadoDiv = document.getElementById('resultado');
  resultadoDiv.innerHTML = '';

  if (pets.length === 0) {
    resultadoDiv.innerHTML = '<p>Nenhum pet encontrado.</p>';
    return;
  }

  pets.forEach(pet => {
    const card = document.createElement('div');
    card.className = 'pet-card';
    card.innerHTML = `
      <h2>${pet.nome} (${pet.especie})</h2>
      <p><strong>Raça:</strong> ${pet.raca}</p>
      <p><strong>Idade:</strong> ${pet.idade} anos</p>
      <p><strong>Porte:</strong> ${pet.porte}</p>
      <p><strong>Temperamento:</strong> ${pet.temperamento}</p>
      <p><strong>Castrado:</strong> ${pet.castrado}</p>
      <p><strong>Vacinado:</strong> ${pet.vacinado}</p>
      <p><strong>Localização:</strong> ${pet.localizacao}</p>
    `;
    resultadoDiv.appendChild(card);
  });
}
