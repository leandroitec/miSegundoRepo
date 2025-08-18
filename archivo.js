let libros = JSON.parse(localStorage.getItem('libros')) || [] ;  //lee el localstorage o array vacio si no hay

const hoy = new Date(); //saca la fecha actual de tu sistema
const anioActual = parseInt(hoy.getFullYear()); //extrae el año de new Date y lo convierte en int
console.log (hoy);
let editando = false;              //estado por defecto de editar
let indiceEditar = null;
let ordenAscendente = false;      //estado por defecto de ordenar


const agregarLibro = () => {           //validacion, agregar, editar, etc y localstorage
    const titulo = document.getElementById('titulo').value.trim();
    const autor = document.getElementById('autor').value.trim();
    const anio = document.getElementById('anio').value;
    const genero = document.getElementById('genero').value.trim();
    const errorAnio = document.getElementById("errorAnio");
    const errorTitulo = document.getElementById("errorTitulo");
    const cargaCorrecta = document.getElementById("cargaCorrecta");

    if (titulo !== '' && autor !== '' && anio !== '' && genero !== '') {      //comprobar campos NO vacios
        
        if (!(anio >= 1900 && anio <= anioActual)) {           // el año debe estar entre 1900 y año actual (lo pongo antes de editar para que valide duante edicion)
                errorAnio.innerText = `El año debe estar entre 1900 y ${anioActual}`;
                errorAnio.classList.add('error');             //le agrego al mensaje la clase error para css
                console.log("ERROR: entre 1900 y año actual");
                return;
            }
            if (editando) {                                                      //si estoy editando un libro (editando===true)
            libros[indiceEditar] = { titulo, autor, anio, genero };              //actualiza la lista con los imput modificados por indice
            editando = false;                                                    //se vuelve a poner en false para salir de editando
            indiceEditar = null;                                                 //limpia el indice para seleccionar nuevo libro si se necesita
            document.querySelector('button[type="submit"]').innerText = 'Agregar Libro';    //vuelve el texto del boton cambiado en la funcion a su estado original

        } else {
            const yaExiste = libros.some(libro =>                             //comprobar si ya existen indistinto de letras mayus o minus
                libro.titulo.toLowerCase() === titulo.toLowerCase() &&
                libro.autor.toLowerCase() === autor.toLowerCase()
            );
            if (yaExiste) {                                                   //mensaje si hay dos libros iguales
                errorTitulo.innerText = `El libro "${titulo}" del autor "${autor}" ya se encuentra cargado.`;
                errorTitulo.classList.add('error');                         //clase para css
                console.log ("ERROR: Libro Duplicado no cargado");
                return;
            }
            // Guardamos en nuestro array local libros que vamos creando
            console.log("nuevo libro: Titulo: ", titulo, "Autor: ", autor, "Año: ", anio, "Genero: ", genero);
            libros.push({ titulo, autor, anio, genero, leido: false});    //hace un push de los datos insertados
            cargaCorrecta.innerText = "Libro cargado correctamente";      //mensaje de carga correcta
            cargaCorrecta.classList.add('success');                       //clase para css
        }
        localStorage.setItem('libros', JSON.stringify(libros));    //guardamos en localstorage, reseteamos funciones y mensajes y vaciamos imputs
        renderizarLibros();
        mostrarResumen();
        actualizarSelectGenero();
        document.getElementById('titulo').value = ''
        document.getElementById('autor').value = ''
        document.getElementById('anio').value = ''
        document.getElementById('genero').value = ''
        document.getElementById('errorAnio').innerText = ''
        document.getElementById('errorTitulo').innerText = ''
        document.getElementById('cargaCorrecta').innerText = ''
    }
}

const filtrarLibros = () => {                   //barra de busqueda de libros
    const texto = document.getElementById('busqueda').value.toLowerCase();     //convertir a minusculas lo insertado en imput
    const librosFiltrados = libros.filter(libro => libro.titulo.toLowerCase().includes(texto));   //filtrar libros que contengan el texto insertado
    renderizarLibros(librosFiltrados);
}

const checkboxLeido = (index, estado) => {        //guardar checklist leidos en localstorage por indice
    libros[index].leido = estado;           // actualiza el estado
    localStorage.setItem('libros', JSON.stringify(libros)); // guarda en localStorage
    mostrarResumen();
}

const renderizarLibros = (lista = libros) => {     //recibe el listado de libros
    const tabla = document.getElementById('tablaLibros').querySelector('tbody');    //obtiene el tbody de la tabla con el id tablaLibros
    tabla.innerText = ''                                       //vacia la tabla antes de renderizar
    lista.forEach(libro => {
        const indexReal = libros.indexOf(libro);              //busca el index de cada libro
        const fila = document.createElement('tr');                //crea una fila nueva en blanco y la llena con todos sus elementos
        fila.innerHTML = `
            <td>${indexReal + 1}</td>    <!--crea id-->
            <td>${libro.titulo}</td>
            <td>${libro.autor}</td>
            <td>${libro.anio}</td>
            <td>${libro.genero}</td>
            <td>
                <input type="checkbox" ${libro.leido ? 'checked' : ''} onchange="checkboxLeido(${indexReal}, this.checked)" />
            </td>
            <td>
                <button class="editarBtn" onclick="editarLibro(${indexReal})">Editar</button>
                <button class="eliminarBtn" onclick="eliminarLibro(${indexReal})">Eliminar</button>
            </td>
        `
        //la parte ${libro.leido ? 'checked' : ''} es para que si el checkbox esta marcado es true y si no esta marcado es false
        tabla.appendChild(fila);    //inseta la nueva fila en la tabla
    });
}

const editarLibro = (index) => {     //funcion de editado (**ver si cambia genero, y checklist a false**)
    const libro = libros[index];       //busca el libro a editar segun el indicie y lo alamcena enla variable
    document.getElementById('titulo').value = libro.titulo         //mostrar los datos de ese indice en input para modificarlos
    document.getElementById('autor').value = libro.autor
    document.getElementById('anio').value = libro.anio
    document.querySelector('button[type="submit"]').innerText = 'Actualizar Libro'       //cambia texto del boton
    editando = true                 //esta variable indica que se esta en modo edicion
    indiceEditar = index             //guarda el indice para que edite esa parte
    mostrarResumen();
}

const eliminarLibro = (index) => {        //funcion de eliminar
    libros.splice(index, 1);         //elimina el libro segun el index (un libro de ese index especifico)
    localStorage.setItem('libros', JSON.stringify(libros));  //guarda cambios en localstorage
    renderizarLibros();
    mostrarResumen();
}

const ordenarPorAnio = () => {             //funcion de ordenar por año
    const librosOrdenados = [...libros].sort((a, b) => {       //copia la lista de libros en librosOrdenados y los ordena
        return ordenAscendente ? a.anio - b.anio : b.anio - a.anio  //if si ascendente es true de mayor a menor, viceversa
    });

    ordenAscendente = !ordenAscendente        //cambia el valor si se vuelve a llamar a la funcion (true a false)
    renderizarLibros(librosOrdenados);
}

const mostrarResumen = () => {           //Datos de libros
    const resumen = document.getElementById('resumenLibros')                   //el div resumen libro obtiene lo que muestra de aca

    if (libros.length === 0) {
        resumen.innerText = 'No existen libros cargados'    //mensaje si no hay librois cargados
        return;
    }
    const total = libros.length;               //total de libros
    const sumaAnios = libros.reduce((acum, libro) => acum + parseInt(libro.anio), 0);   //suma los años en un acumulador
    const promedio = Math.round(sumaAnios / total);   //promedio de años redondeado
    const posterioresA2010 = libros.filter(libro => libro.anio > 2010).length;   //numero de libros publicados despues del 2010
    const leidos = libros.filter(libro => libro.leido).length;     //cuenta libros marcados como leidos
    const noLeidos = libros.length - leidos;    //cuenta libros marcados como no leidos
    const libroNuevo = libros.reduce((nuevo, libro) => (libro.anio > nuevo.anio ? libro : nuevo), libros[0]);  //recorre la lista buscando el libro mas nuevo, if ternario
    const libroViejo = libros.reduce((nuevo, libro) => (libro.anio < nuevo.anio ? libro : nuevo), libros[0]);  //libro mas viejo
    //html para mostrar en web
    resumen.innerHTML = `
        <p>Total de libros: ${total}</p>
        <p>Promedio de año de publicación: ${promedio}</p>
        <p>Libros posteriores a 2010: ${posterioresA2010}</p>
        <p>Libro más nuevo: Titulo "${libroNuevo.titulo}" Año "${libroNuevo.anio}"</p>
        <p>Libro más viejo: Titulo "${libroViejo.titulo}" Año "${libroViejo.anio}"</p>
        <p>Total libros leidos: ${leidos}</p>
        <p>Total libros no leidos: ${noLeidos}</p>
    `
}

const actualizarSelectGenero = () => {    //Filtrar por Genero resultado lista
    const select = document.getElementById('filtroGenero');                //obtener valor select
    const generoUnicos = [...new Set(libros.map(libro => libro.genero))];    //variable con los generos en la lista sin repeticion

    select.innerHTML = `<option value="todos">Todos</option>`
    generoUnicos.forEach(genero => {                            //agregar opciones al select de la variable generounico
        const option = document.createElement("option");
        option.value = genero
        option.text = genero
        select.appendChild(option);
    })
}

const filtrarPorGenero = () => {  //Filtrar por genero funcion
    const genero = document.getElementById('filtroGenero').value                 //obtener valor del select

    if (genero === 'todos') {                                                   //en todos muestra todos los libros
        renderizarLibros();
    } else {
        const librosFiltrados = libros.filter(libro => libro.genero === genero)           //segun genero filtra y abajo renderiza
        renderizarLibros(librosFiltrados)
    }
}

const filtrarPorLeido = () => {     //Filtrar por Leido/noLeido funcion
    const estado = document.getElementById('filtroLeido').value;    //variable que obtiene valor select
    let librosFiltrados;     //true o false
    if (estado === 'leidos') {
        librosFiltrados = libros.filter(libro => libro.leido === true);   //leidos = leidos:true
    } else if (estado === 'noLeidos') {
        librosFiltrados = libros.filter(libro => libro.leido === false);    //noleidos = leidos:false
    } else {
        librosFiltrados = libros;  // "todos"
    }

    renderizarLibros(librosFiltrados);
};

document.addEventListener('DOMContentLoaded', () => {         //actualiza todos valores a por defecto
    renderizarLibros();
    mostrarResumen();
    actualizarSelectGenero();
    filtrarPorLeido();
    //localStorage.clear();         // **IMPORTANTE** Solo descomentar para borrar local storage y f5
})
