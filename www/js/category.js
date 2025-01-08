// Referencias a los elementos del DOM
const categoryName = document.getElementById('categoryName');
const sitesList = document.getElementById('sitesList');
const addSiteButton = document.getElementById('addSite');

// Obtiene el ID de la categoría desde la URL
const params = new URLSearchParams(window.location.search);
const categoryId = params.get('id');

// Carga los sitios de la categoría
async function loadSites() {
    try {
        const response = await fetch(`http://localhost:3000/categories/${categoryId}`);
        const sites = await response.json();

        categoryName.textContent = sites.categoryName; // Actualiza el nombre de la categoría
        sitesList.innerHTML = ''; // Limpia la lista

        sites.sites.forEach(site => {
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>Sitio:</strong> ${site.name}<br>
                <strong>Usuario:</strong> ${site.user}<br>
                <strong>Contraseña:</strong> ${site.password}<br>
                <strong>Descripción:</strong> ${site.description || 'Sin descripción'}<br>
            `;

            // Botón de eliminar
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Eliminar Sitio';
            deleteButton.addEventListener('click', () => deleteSite(site.id));

            // Botón de editar
            const editButton = document.createElement('button');
            editButton.textContent = 'Editar Sitio';
            editButton.addEventListener('click', () => editSite(site));

            li.appendChild(deleteButton);
            li.appendChild(editButton);
            sitesList.appendChild(li);
        });
    } catch (error) {
        console.error('Error al cargar los sitios:', error);
    }
}

// Función de editar 
async function editSite(site) {
    const newName = prompt('Introduce el nuevo nombre del sitio:', site.name);
    const newUser = prompt('Introduce el nuevo usuario:', site.user);
    const newPassword = prompt('Introduce la nueva contraseña:', site.password);
    const newDescription = prompt('Introduce la nueva descripción (opcional):', site.description);

    if (!newName || !newUser || !newPassword) {
        return alert('Los campos Nombre, Usuario y Contraseña son obligatorios.');
    }

    try {
        const response = await fetch(`http://localhost:3000/sites/${site.id}`, {
            method: 'PUT', // Cambia a PUT si el backend lo soporta
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: newName,
                user: newUser,
                password: newPassword,
                description: newDescription || '', // Si no hay descripción, enviamos una cadena vacía
            }),
        });

        if (response.ok) {
            alert('Sitio actualizado correctamente.');
            loadSites();
        } else {
            alert('Error al actualizar el sitio.');
        }
    } catch (error) {
        console.error('Error al actualizar el sitio:', error);
    }
}

//Función para generar contraseña segura (12 caracteres entre mayúsculas, minúsculas, números y raras)
function generateSecurePassword() {
    const length = 12; // Longitud de la contraseña
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+<>?';
    let password = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }

    return password;
}

// Añadir un nuevo sitio
addSiteButton.addEventListener('click', async () => {
    const siteName = prompt('Introduce el nombre del sitio:');
    const userName = prompt('Introduce el usuario:');

    // Preguntar si el usuario desea generar una contraseña
    let password = prompt(
        'Introduce la contraseña (o escribe "GENERAR" para crear una contraseña segura):'
    );

    if (password && password.toUpperCase() === 'GENERAR') {
        password = generateSecurePassword();
        alert(`Tu contraseña generada es: ${password}`);
    }

    const description = prompt('Introduce la descripción (opcional):');

    // Validación de los campos obligatorios (nombre, usuario, contraseña)
    if (!siteName || !userName || !password) {
        return alert('Los campos Nombre, Usuario y Contraseña son obligatorios.');
    }

    try {
        const response = await fetch(`http://localhost:3000/categories/${categoryId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: siteName,
                user: userName,
                password: password,
                description: description || '', // Si no hay descripción, enviamos una cadena vacía
            }),
        });

        if (response.ok) {
            alert('Sitio añadido correctamente.');
            loadSites();
        } else {
            alert('Error al añadir el sitio.');
        }
    } catch (error) {
        console.error('Error al añadir el sitio:', error);
    }
});


// Eliminar un sitio
async function deleteSite(id) {
    try {
        const response = await fetch(`http://localhost:3000/sites/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            alert('Sitio eliminado.');
            loadSites();
        } else {
            alert('Error al eliminar el sitio.');
        }
    } catch (error) {
        console.error('Error al eliminar el sitio:', error);
    }
}

// Botón para volver a la página principal
const backToIndexButton = document.getElementById('backToIndex');

backToIndexButton.addEventListener('click', () => {
    window.location.href = './index.html'; // Redirige a la página principal
});

// Inicializa la página
loadSites();
