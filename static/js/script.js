const animals = [
    { id: 1, species: "León", color: "Dorado" },
    { id: 2, species: "Jirafa", color: "Amarillo con manchas cafés" },
    { id: 3, species: "Pingüino", color: "Negro y blanco" },
];

const form = document.querySelector("#animal-form");
const speciesInput = document.querySelector("#species");
const colorInput = document.querySelector("#color");
const animalList = document.querySelector("#animal-list");
const animalCount = document.querySelector("#animal-count");
const emptyState = document.querySelector("#empty-state");
const saveButton = document.querySelector("#save-button");
const cancelButton = document.querySelector("#cancel-button");
const formMessage = document.querySelector("#form-message");

let editingAnimalId = null;
let nextAnimalId = animals.length + 1;

function renderAnimals() {
    animalList.replaceChildren();

    for (const animal of animals) {
        const row = document.createElement("tr");
        const speciesCell = document.createElement("td");
        const colorCell = document.createElement("td");
        const actionsCell = document.createElement("td");
        const actions = document.createElement("div");
        const editButton = document.createElement("button");
        const deleteButton = document.createElement("button");

        speciesCell.textContent = animal.species;
        colorCell.textContent = animal.color;
        actions.className = "row-actions";

        editButton.className = "button button-small button-secondary";
        editButton.type = "button";
        editButton.textContent = "Editar";
        editButton.setAttribute("aria-label", `Editar ${animal.species}`);
        editButton.addEventListener("click", () => startEditing(animal));

        deleteButton.className = "button button-small button-danger";
        deleteButton.type = "button";
        deleteButton.textContent = "Eliminar";
        deleteButton.setAttribute("aria-label", `Eliminar ${animal.species}`);
        deleteButton.addEventListener("click", () => deleteAnimal(animal.id));

        actions.append(editButton, deleteButton);
        actionsCell.append(actions);
        row.append(speciesCell, colorCell, actionsCell);
        animalList.append(row);
    }

    animalCount.textContent = `${animals.length} ${animals.length === 1 ? "animal" : "animales"}`;
    emptyState.hidden = animals.length > 0;
}

function startEditing(animal) {
    editingAnimalId = animal.id;
    speciesInput.value = animal.species;
    colorInput.value = animal.color;
    saveButton.textContent = "Guardar cambios";
    cancelButton.hidden = false;
    formMessage.textContent = `Editando: ${animal.species}`;
    speciesInput.focus();
}

function resetForm() {
    editingAnimalId = null;
    form.reset();
    saveButton.textContent = "Agregar animal";
    cancelButton.hidden = true;
}

function deleteAnimal(id) {
    const animalIndex = animals.findIndex((animal) => animal.id === id);

    if (animalIndex === -1) {
        return;
    }

    const [deletedAnimal] = animals.splice(animalIndex, 1);
    if (editingAnimalId === id) {
        resetForm();
    }
    formMessage.textContent = `${deletedAnimal.species} se eliminó de la lista.`;
    renderAnimals();
}

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const species = speciesInput.value.trim();
    const color = colorInput.value.trim();
    if (!species || !color) {
        formMessage.textContent = "Completa la especie y el color.";
        return;
    }

    if (editingAnimalId === null) {
        animals.push({ id: nextAnimalId++, species, color });
        formMessage.textContent = `${species} se agregó a la lista.`;
    } else {
        const animal = animals.find((item) => item.id === editingAnimalId);
        if (!animal) {
            formMessage.textContent = "No se encontró el animal que intentas editar.";
            resetForm();
            return;
        }

        animal.species = species;
        animal.color = color;
        formMessage.textContent = `Se actualizaron los datos de ${species}.`;
    }

    resetForm();
    renderAnimals();
});

cancelButton.addEventListener("click", () => {
    resetForm();
    formMessage.textContent = "Edición cancelada.";
});

renderAnimals();
