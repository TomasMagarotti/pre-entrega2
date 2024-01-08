class Producto {
    constructor(nombre, precioUnitario) {
        this.nombre = nombre;
        this.precioUnitario = precioUnitario;
        this.cantidad = 0;
    }

    agregarCantidad(cantidad) {
        this.cantidad += cantidad;
    }

    getCostoTotal() {
        return this.cantidad * this.precioUnitario;
    }
}

const precios = {
    "Manzana": 300,
    "Plátano": 450,
    "Naranja": 250,    
};

const imagenesProductos = {
    "Manzana": "multimedia/manzana_roja.jpg",
    "Plátano": "multimedia/platanos-de-canarias.jpg",
    "Naranja": "multimedia/naranja.jpg.webp",
    
    };

//Recuperar contenido de carrito desde local storage.
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

//Función para generar tarjetas dinámicas
const cargarProductos = () => {
    const divProductos = document.getElementById('productos');
    divProductos.innerHTML = '';
    //Obtener array de los nombres de los productos y se itera cada uno.
    Object.keys(precios).forEach((nombreProducto) => {
        const card = document.createElement('div')
        card.className = 'card col-md-4 mb-4';
        card.innerHTML = `
        <img src="${imagenesProductos[nombreProducto]}" class="card-img-top imagen-producto" alt="${nombreProducto}">

        <div class="card-body">

                <h5 class="card-title">${nombreProducto}</h5>
                <p class="card-text">$${precios[nombreProducto].toFixed(2)}</p>
                <input type="number" min="1" value="1" id="cantidad-${nombreProducto}" class="form-control mb-2">
                <button class="btn btn-primary" onclick="agregarAlCarrito('${nombreProducto}')">Agregar</button>
            </div>
        `;
        divProductos.appendChild(card);
    });
};
//Renderización del carrito
const actualizarCarritoDOM = () => {
    const listaCarrito = document.getElementById('listaCarrito')
    listaCarrito.innerHTML = '';
    carrito.forEach((producto, index) => {
        const li = document.createElement('li')
        li.className = 'list-group-item'
        li.textContent = `${producto.nombre} - ${producto.cantidad} x $${producto.precioUnitario.toFixed(2)}`;
        listaCarrito.appendChild(li);
    });
};
//Calcular total de la compra.
const actualizarTotalCompra = () => {
    const totalCompra = carrito.reduce((total, producto) => total + producto.getCostoTotal(), 0); //Se utiliza método definido en clase Producto.
    document.getElementById('totalCompra').textContent = totalCompra.toFixed(2);
};

const agregarAlCarrito = (nombreProducto) => {
    const cantidadInput = document.getElementById(`cantidad-${nombreProducto}`);
    const cantidad = parseInt(cantidadInput.value);

    if (cantidad > 0) {
        let productoEncontrado = carrito.find(p => p.nombre === nombreProducto);
        if (productoEncontrado) {
            productoEncontrado.agregarCantidad(cantidad); //se llama al método agregarCantidad si ya esta en el carrito.
        } else {
            const nuevoProducto = new Producto(nombreProducto, precios[nombreProducto]); // Se agrega producto si no está en el carrito-
            nuevoProducto.agregarCantidad(cantidad);
            carrito.push(nuevoProducto);
        }
        // Se actualiza localStorage y DOM para reflejar cambios.
        localStorage.setItem('carrito', JSON.stringify(carrito));
        actualizarCarritoDOM();
        actualizarTotalCompra();
    } else {
        alert('Por favor, ingrese una cantidad válida.');
    }
};


//Código para manejar evento click.
document.getElementById('finalizar').addEventListener('click', () => {
    if (carrito.length > 0) {
        alert('Compra finalizada con éxito.');
        carrito = [];
        localStorage.setItem('carrito', JSON.stringify(carrito));
        actualizarCarritoDOM();
        actualizarTotalCompra();
    } else {
        alert('Su carrito está vacío.');
    }
});

// Inicialización
cargarProductos();
actualizarCarritoDOM();
actualizarTotalCompra();
