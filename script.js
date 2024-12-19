document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('talentoForm');
    
    // Establecer fecha mínima como hoy para la fecha de visita
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('fechaVisita').min = today;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const talento = {
            nombre: document.getElementById('nombre').value,
            id: document.getElementById('id').value,
            telefono: document.getElementById('telefono').value,
            email: document.getElementById('email').value,
            fechaVisita: document.getElementById('fechaVisita').value,
            pasos: document.getElementById('pasos').value,
            fechaRegistro: new Date().toISOString()
        };
        
        // Guardar en localStorage
        let talentos = JSON.parse(localStorage.getItem('talentos') || '[]');
        talentos.push(talento);
        localStorage.setItem('talentos', JSON.stringify(talentos));
        
        alert('Talento agregado exitosamente');
        form.reset();
        consultarTalentos();
    });
});

function mostrarFormulario() {
    document.getElementById('formSection').style.display = 'block';
    document.getElementById('searchSection').style.display = 'none';
    document.getElementById('dataframeSection').style.display = 'none';
}

function mostrarBusqueda() {
    document.getElementById('formSection').style.display = 'none';
    document.getElementById('searchSection').style.display = 'block';
    document.getElementById('dataframeSection').style.display = 'none';
    consultarTalentos();
}

function mostrarDataframe() {
    document.getElementById('formSection').style.display = 'none';
    document.getElementById('searchSection').style.display = 'none';
    document.getElementById('dataframeSection').style.display = 'block';
    actualizarDataframe();
}

function actualizarDataframe() {
    const talentos = JSON.parse(localStorage.getItem('talentos') || '[]');
    const tbody = document.getElementById('dataframeBody');
    tbody.innerHTML = '';

    talentos.sort((a, b) => new Date(a.fechaVisita) - new Date(b.fechaVisita))
           .forEach(talento => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${talento.nombre}</td>
            <td>${talento.id}</td>
            <td>${talento.telefono}</td>
            <td>${talento.email}</td>
            <td>${formatDate(talento.fechaVisita)}</td>
            <td>${talento.pasos}</td>
            <td>
                <button onclick="eliminarTalento('${talento.id}')" class="delete-btn">
                    Eliminar
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

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
            <p><strong>Fecha de Visita:</strong> ${formatDate(talento.fechaVisita)}</p>
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
        actualizarDataframe();
    }
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
}
