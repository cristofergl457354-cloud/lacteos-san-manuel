const formulario = document.querySelector('#formPedido');

const campoNombre = document.querySelector('#nombre');
const campoCorreo = document.querySelector('#correo');
const campoTelefono = document.querySelector('#telefono');
const campoZona = document.querySelector('#zona');
const campoComentarios = document.querySelector('#comentarios');

const campoProducto = document.querySelector('#producto');
const campoCantidad = document.querySelector('#cantidad');
const btnAgregar = document.querySelector('#btnAgregar');

const cuerpoLista = document.querySelector('#cuerpoLista');
const listaTarjetas = document.querySelector('#listaTarjetas');
const contenedorLista = document.querySelector('#contenedorLista');
const mensajeVacio = document.querySelector('#mensajeVacio');

const spanTotal = document.querySelector('#total');
const cajaUltimo = document.querySelector('#cajaUltimo');
const resumenPedido = document.querySelector('#resumenPedido');

const lista = [];

function marcarCampo(campo, esValido) {
  if (esValido === true) {
    campo.classList.remove('is-invalid');
    campo.classList.add('is-valid');
  } else {
    campo.classList.remove('is-valid');
    campo.classList.add('is-invalid');
  }
}

function quitarMarcas(campo) {
  campo.classList.remove('is-valid');
  campo.classList.remove('is-invalid');
}

function calcularTotal() {
  let total = 0;

  for (let i = 0; i < lista.length; i++) {
    total = total + (lista[i].precio * lista[i].cantidad);
  }

  return total;
}

function mostrarTotal() {
  spanTotal.textContent = calcularTotal().toFixed(2);
}

function dibujarLista() {
  cuerpoLista.innerHTML = '';
  listaTarjetas.innerHTML = '';

  if (lista.length === 0) {
    mensajeVacio.classList.remove('d-none');
    contenedorLista.classList.add('d-none');
  } else {
    mensajeVacio.classList.add('d-none');
    contenedorLista.classList.remove('d-none');
  }

  for (let i = 0; i < lista.length; i++) {
    const subtotal = lista[i].precio * lista[i].cantidad;

    const fila = document.createElement('tr');

    fila.innerHTML =
      '<td>' + lista[i].nombre + '</td>' +
      '<td>' + lista[i].cantidad + '</td>' +
      '<td>$' + subtotal.toFixed(2) + '</td>' +
      '<td class="text-end">' +
        '<button type="button" class="btn btn-sm btn-outline-danger btn-quitar" ' +
                'data-indice="' + i + '" title="Quitar">' +
          '<i class="fa-solid fa-trash"></i>' +
        '</button>' +
      '</td>';

    cuerpoLista.appendChild(fila);

    const tarjeta = document.createElement('div');
    tarjeta.className = 'tarjeta-item';

    tarjeta.innerHTML =
      '<div class="d-flex justify-content-between align-items-start">' +
        '<div>' +
          '<p class="mb-1 fw-semibold">' + lista[i].nombre + '</p>' +
          '<p class="mb-0 small text-muted">' +
            'Cantidad: ' + lista[i].cantidad + ' x $' + lista[i].precio.toFixed(2) +
          '</p>' +
        '</div>' +
        '<button type="button" class="btn btn-sm btn-outline-danger btn-quitar" ' +
                'data-indice="' + i + '" title="Quitar">' +
          '<i class="fa-solid fa-trash"></i>' +
        '</button>' +
      '</div>' +
      '<p class="mb-0 mt-2">Subtotal: <strong>$' + subtotal.toFixed(2) + '</strong></p>';

    listaTarjetas.appendChild(tarjeta);
  }

  const botonesQuitar = document.querySelectorAll('.btn-quitar');

  for (let i = 0; i < botonesQuitar.length; i++) {
    botonesQuitar[i].addEventListener('click', function () {
      const indice = Number(botonesQuitar[i].getAttribute('data-indice'));
      quitarProducto(indice);
    });
  }

  mostrarTotal();
}

function quitarProducto(indice) {
  lista.splice(indice, 1);
  dibujarLista();
}

function agregarProducto() {
  const precio = Number(campoProducto.value);
  const cantidad = Number(campoCantidad.value);

  if (precio === 0) {
    marcarCampo(campoProducto, false);
    Swal.fire({
      title: 'Falta el producto',
      text: 'Elige un producto de la lista antes de agregarlo.',
      icon: 'warning',
      confirmButtonColor: '#C58940'
    });
    return;
  }

  if (cantidad < 1 || isNaN(cantidad)) {
    marcarCampo(campoCantidad, false);
    Swal.fire({
      title: 'Cantidad incorrecta',
      text: 'La cantidad debe ser 1 o más.',
      icon: 'warning',
      confirmButtonColor: '#C58940'
    });
    return;
  }

  marcarCampo(campoProducto, true);
  marcarCampo(campoCantidad, true);

  const textoOpcion = campoProducto.options[campoProducto.selectedIndex].text;
  const nombre = textoOpcion.split(' - ')[0];

  let yaExiste = false;

  for (let i = 0; i < lista.length; i++) {
    if (lista[i].nombre === nombre) {
      lista[i].cantidad = lista[i].cantidad + cantidad;
      yaExiste = true;
    }
  }

  if (yaExiste === false) {
    lista.push({ nombre: nombre, precio: precio, cantidad: cantidad });
  }

  dibujarLista();

  campoProducto.value = '';
  campoCantidad.value = 1;
  quitarMarcas(campoProducto);
  quitarMarcas(campoCantidad);
}

btnAgregar.addEventListener('click', agregarProducto);

function correoValido(correo) {

  const tieneArroba = correo.includes('@');
  const tienePunto = correo.includes('.');
  return tieneArroba && tienePunto;
}

function telefonoValido(telefono) {

  return /^[0-9]{10}$/.test(telefono);
}

function guardarPedido(pedido) {
  localStorage.setItem('ultimoPedido', JSON.stringify(pedido));
}

function mostrarUltimoPedido() {
  const guardado = localStorage.getItem('ultimoPedido');

  if (guardado === null) {
    cajaUltimo.classList.add('d-none');
    return;
  }

  const pedido = JSON.parse(guardado);

  if (!pedido.productos) {
    cajaUltimo.classList.add('d-none');
    return;
  }

  let piezas = 0;

  for (let i = 0; i < pedido.productos.length; i++) {
    piezas = piezas + pedido.productos[i].cantidad;
  }

  resumenPedido.textContent =
    piezas + ' artículo(s) | Zona: ' + pedido.zona +
    ' | Total: $' + pedido.total.toFixed(2) + ' MXN';

  cajaUltimo.classList.remove('d-none');
}

function limpiarMarcas() {
  const campos = [
    campoNombre,
    campoCorreo,
    campoTelefono,
    campoZona,
    campoProducto,
    campoCantidad
  ];

  for (let i = 0; i < campos.length; i++) {
    quitarMarcas(campos[i]);
  }
}

formulario.addEventListener('submit', function (evento) {
  evento.preventDefault();

  const nombre = campoNombre.value.trim();
  const correo = campoCorreo.value.trim();
  const telefono = campoTelefono.value.trim();
  const zona = campoZona.value;

  let todoBien = true;

  if (nombre === '') {
    marcarCampo(campoNombre, false);
    todoBien = false;
  } else {
    marcarCampo(campoNombre, true);
  }

  if (correo === '' || correoValido(correo) === false) {
    marcarCampo(campoCorreo, false);
    todoBien = false;
  } else {
    marcarCampo(campoCorreo, true);
  }

  if (telefono === '' || telefonoValido(telefono) === false) {
    marcarCampo(campoTelefono, false);
    todoBien = false;
  } else {
    marcarCampo(campoTelefono, true);
  }

  if (zona === '') {
    marcarCampo(campoZona, false);
    todoBien = false;
  } else {
    marcarCampo(campoZona, true);
  }

  if (lista.length === 0) {
    todoBien = false;
  }

  if (todoBien === false) {
    if (lista.length === 0) {
      Swal.fire({
        title: 'Falta tu pedido',
        text: 'Agrega al menos un producto a la lista.',
        icon: 'warning',
        confirmButtonColor: '#C58940'
      });
    } else {
      Swal.fire({
        title: 'Revisa el formulario',
        text: 'Falta algún dato o hay un campo incorrecto.',
        icon: 'warning',
        confirmButtonColor: '#C58940'
      });
    }
    return;
  }

  const pedido = {
    nombre: nombre,
    correo: correo,
    telefono: telefono,
    zona: zona,
    comentarios: campoComentarios.value.trim(),
    productos: lista,
    total: calcularTotal()
  };

  guardarPedido(pedido);

  Swal.fire({
    title: '¡Pedido enviado!',
    html: 'Gracias ' + nombre + '.<br>Total a pagar: $' + pedido.total.toFixed(2) + ' MXN',
    icon: 'success',
    confirmButtonColor: '#C58940'
  });

  formulario.reset();

  lista.length = 0;
  dibujarLista();
  limpiarMarcas();
  mostrarUltimoPedido();
});

dibujarLista();
mostrarUltimoPedido();
