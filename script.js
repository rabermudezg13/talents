document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('talentoForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const talento = {
            nombre: document.getElementById('nombre').value,
            id: document.getElementById('id').value,
            telefono: document.getElementById('telefono').value,
            email: document.getElementById('email').value,
            pasos: document.getElementById('pasos').value,
            fecha: new Date().toISOString()
        };
        
        // Guardar en localStorage
        let talentos = JSON.parse(localStorage.getItem('talentos') || '[]');
        talentos.push(talento);
        localStorage.setItem('talentos', JSON.stringify(talentos));
        
        alert('Talento agregado exitosamente');
        form.reset();
        consultarTalentos();
    });

    // Cargar talentos al inicio
    consultarTalentos();
});

function consultarTalentos() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const talentos = JSON.parse(localStorage.getItem('talentos') || '[]');
    const resultadosDiv = document.getElementById('resultados');
    
    resultadosDiv.innerHTML = '';
    
    const talentosFiltrados = talentos.filter(talento => 
        talento.nombre.toLowerCase().includes(searchTerm) ||
        talento.id.toLowerCase().includes(searchTerm)
    );
    
    if (talentosFiltrados.length === 0) {
        resultadosDiv.innerHTML = '<p class="no-results">No se encontraron resultados</p>';
        return;
    }

    talentosFiltrados.forEach(talento => {
        const card = document.createElement('div');
        card.className = 'talento-card';
        card.innerHTML = `
            <h3>${talento.nombre}</h3>
            <p><strong>ID:</strong> ${talento.id}</p>
            <p><strong>Teléfono:</strong> ${talento.telefono}</p>
            <p><strong>Email:</strong> ${talento.email}</p>
            <p><strong>Pasos Faltantes:</strong></p>
            <p>${talento.pasos}</p>
            <button onclick="eliminarTalento('${talento.id}')" class="delete-btn">
                Eliminar
            </button>
        `;
        resultadosDiv.appendChild(card);
    });
}

function eliminarTalento(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este talento?')) {
        let talentos = JSON.parse(localStorage.getItem('talentos') || '[]');
        talentos = talentos.filter(t => t.id !== id);
        localStorage.setItem('talentos', JSON.stringify(talentos));
        consultarTalentos();
    }
}
