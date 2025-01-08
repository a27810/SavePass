// Referencias a los elementos del DOM
const categoriesList = document.getElementById('categoriesList');
const addCategoryButton = document.getElementById('addCategory');

// Carga las categorías al iniciar
async function loadCategories() {
    try {
        const response = await fetch('http://localhost:3000/categories');
        const categories = await response.json();

        categoriesList.innerHTML = ''; // Limpia la lista

        categories.forEach(category => {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center'; // Bootstrap
            li.textContent = category.name;

            const viewButton = document.createElement('button');
            viewButton.className = 'btn btn-info btn-sm'; // Bootstrap
            viewButton.textContent = 'Ver Sitios';
            viewButton.addEventListener('click', () => {
                window.location.href = `category.html?id=${category.id}`;
            });

            const deleteButton = document.createElement('button');
            deleteButton.className = 'btn btn-danger btn-sm'; // Bootstrap
            deleteButton.textContent = 'Eliminar Categoría';
            deleteButton.addEventListener('click', () => deleteCategory(category.id));

            li.appendChild(viewButton);
            li.appendChild(deleteButton);
            categoriesList.appendChild(li);
        });
    } catch (error) {
        console.error('Error al cargar las categorías:', error);
    }
}

// Añadir una nueva categoría
addCategoryButton.addEventListener('click', async () => {
    const categoryName = prompt('Introduce el nombre de la nueva categoría:');
    if (!categoryName) return;

    try {
        const response = await fetch('http://localhost:3000/categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: categoryName }),
        });

        if (response.ok) {
            alert('Categoría añadida correctamente.');
            loadCategories();
        } else {
            alert('Error al añadir la categoría.');
        }
    } catch (error) {
        console.error('Error al añadir la categoría:', error);
    }
});

// Eliminar una categoría
async function deleteCategory(id) {
    try {
        const response = await fetch(`http://localhost:3000/categories/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            alert('Categoría eliminada.');
            loadCategories();
        } else {
            alert('Error al eliminar la categoría.');
        }
    } catch (error) {
        console.error('Error al eliminar la categoría:', error);
    }
}

// Inicializa la página
loadCategories();

