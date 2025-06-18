document.addEventListener("DOMContentLoaded", () => {
  const petsContainer = document.getElementById("pets-container");

  fetch("http://localhost:3000/pets")
    .then(response => response.json())
    .then(pets => {
      pets.slice(0, 6).forEach(pet => {
        const card = document.createElement("div");
        card.className = "col-md-6 col-lg-4";
        card.innerHTML = `
          <div class="card pet-card shadow-sm border-0 rounded-4 h-100">
            <img src="${pet.imagem}" class="card-img-top rounded-top-4 object-fit-cover" style="height: 250px;" alt="${pet.nome}">
            <div class="card-body">
              <h5 class="card-title fw-bold text-orange">${pet.nome}</h5>
              <p class="card-text text-muted mb-2">
                <i class="bi bi-geo-alt-fill text-warning"></i> ${pet.localizacao}
              </p>
              <p class="card-text text-muted">
                <i class="bi bi-info-circle-fill text-warning"></i> ${pet.descricao.length > 80 ? pet.descricao.substring(0, 80) + "..." : pet.descricao}
              </p>
              <a href="detalhes.html?id=${pet.id}" class="btn btn-warning w-100 fw-semibold mt-3">
                Ver detalhes
              </a>
            </div>
          </div>
        `;
        petsContainer.appendChild(card);
      });
    })
    .catch(error => {
      petsContainer.innerHTML = `<p class="text-danger text-center">Erro ao carregar pets. Tente novamente mais tarde.</p>`;
      console.error("Erro ao buscar pets:", error);
    });
});


