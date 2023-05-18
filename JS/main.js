const productos = [
    { id: 1, nombre: 'Laptop Dell Modelo AnicronX1', precio: 22500 , imagen:'IMG/laptop.jpg'},
    { id: 2, nombre: 'Monitor Gamer Dell 27 pulgadas', precio: 6500 , imagen: 'IMG/monitor.jpg'},
    { id: 3, nombre: 'Impresora 3D Marca Genius', precio: 15000, imagen: 'IMG/impresora.jpg' },
    { id: 4, nombre: 'Setup de Desarrollo (Mesa y luces)', precio: 12200, imagen:'IMG/setup.jpg' },
    { id: 5, nombre: 'Camara HD Ultra', precio: 12500, imagen:'IMG/camara.jpeg' },
];

const productosSection = document.querySelector('.productos');
const listaCarrito = document.querySelector('.lista-carrito');
const vaciarCarritoBtn = document.querySelector('.vaciar-carrito');
const totalCompra = document.querySelector('.total-compra');
const imprimirTicketBtn = document.querySelector('.imprimir-ticket');
const ticketModal = document.getElementById('ticket-modal');
const ticketContent = document.querySelector('.modal-content');
const closeModal = document.querySelector('.close');

function renderProductos() {
    productos.forEach(producto => {
        const productoDiv = document.createElement('div');
        productoDiv.classList.add('producto');
        /* productoDiv.innerHTML =
            '<h3>' + producto.nombre + '</h3>' +
            '<p>' + producto.precio + '</p>' +
            '<button class="agregar-carrito" data-id=' + producto.id + ' >Agregar al Carrito</button>';

        productosSection.appendChild(productoDiv);*/
        const imagenProducto = document.createElement('img');
        imagenProducto.src=producto.imagen;
        imagenProducto.width=100;
        imagenProducto.height=100;
        imagenProducto.classList.add('zoom');

        productoDiv.appendChild(imagenProducto);

        const nombreProducto=document.createElement('h3');
        nombreProducto.textContent= producto.nombre;
        productoDiv.appendChild(nombreProducto);

        const precioProducto=document.createElement('p')
        precioProducto.textContent=producto.precio;
        productoDiv.appendChild(precioProducto);

        const botonAgregar = document.createElement('button')
        botonAgregar.textContent='agregar al carrito';
        botonAgregar.classList.add('agregar-carrito');
        botonAgregar.dataset.id = producto.id;
        productoDiv.appendChild(botonAgregar);

        productosSection.appendChild(productoDiv);

    })
}

function agregarAlCarrito(e) {
    if (e.target.classList.contains('agregar-carrito')) {
        const productoId = parseInt(e.target.dataset.id);
        const producto = productos.find(p => p.id === productoId);
        const carrito = getCarrito();
        const itemIndex = carrito.findIndex(item => item.id === productoId);

        if (itemIndex >= 0) {
            carrito[itemIndex].cantidad++;
        } else {
            carrito.push({
                ...producto,
                cantidad: 1,
            });
        }

        saveCarrito(carrito);
        renderCarrito();
    }
}

function getCarrito() {
    const carritoJSON = localStorage.getItem('carrito');
    return carritoJSON ? JSON.parse(carritoJSON) : [];
}

function saveCarrito(carrito) {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

function vaciarCarrito() {
    localStorage.removeItem('carrito');
    renderCarrito();
}

function calcularTotal(carrito) {
    let total = 0;
    carrito.forEach(item => {
        total += item.precio * item.cantidad;
    });
    return total;
}

function renderCarrito() {
    const carrito = getCarrito();
    listaCarrito.innerHTML = '';
    let total = 0;

    carrito.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.innerHTML =
            '<p>' + item.nombre + ' - ' + item.cantidad + ' - ' + item.precio * item.cantidad + '</p>';

        listaCarrito.appendChild(itemDiv);
        total += item.precio * item.cantidad;
    });

    totalCompra.innerHTML = 'Total Compra: ' + total;
}

function generarTicketHTML() {
    const carrito = getCarrito();
    let ticketHTML = 
        "<h1>Mi tienda online</h1>"+
        "<h2>Ticket de compra</h2>"+
        "<div class=ticket-items>";

    carrito.forEach(item => {
        ticketHTML += "<p> "+ item.nombre + " | " + item.cantidad + " | " + item.precio * item.cantidad + " </p>";
    });

    ticketHTML += "</div>" +
        "<p class=total-compra>Total: $ " + calcularTotal(carrito) + "</p>";

    return ticketHTML;
}

function mostrarTicketModal() {
    ticketContent.innerHTML = generarTicketHTML();
    ticketModal.style.display = 'block';
}

function cerrarTicketModal() {
    ticketModal.style.display = 'none';
}

imprimirTicketBtn.addEventListener('click', mostrarTicketModal);
closeModal.addEventListener('click', cerrarTicketModal);

// Cerrar la ventana modal al hacer clic fuera de ella
window.addEventListener('click', function (event) {
    if (event.target === ticketModal) {
        cerrarTicketModal();
    }
});

productosSection.addEventListener('click', agregarAlCarrito);
vaciarCarritoBtn.addEventListener('click', vaciarCarrito);

renderProductos();
renderCarrito();