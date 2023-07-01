const carrito = document.querySelector('#carrito')
const contenedorCarrito = document.querySelector('#lista-carrito tbody')
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito')
const listaCursos = document.querySelector('#lista-cursos')

let articulosCarrito = [] 



//? Funciones
const agregarCurso = (e) => {
    // Evita que vaya al id seleccionado (no tiene porque se usa de practica)
    e.preventDefault()
    // Verificando que el elemento sea el botón de agregar carrito
    if ( e.target.classList.contains('agregar-carrito') ){
        // e.target obtiene el botón seleccionado, pero se necesita el elemento padre por eso se usa parentElement
        const cursoSeleccionado = e.target.parentElement.parentElement
        leerDatosCurso(cursoSeleccionado) 
    }
}

//? Eliminar curso del carrito 
const eliminarCurso = (e) => {    
    if ( e.target.classList.contains('borrar-curso') ){
        const curso_id = e.target.getAttribute('data-id')

        // elimina del arreglo por medio del data_id
        articulosCarrito = articulosCarrito.filter( curso => curso.id !== curso_id )

        // Iterar sobre el carrito y mostrar su HTML
        carritoHTML()
    }
}


//? Lee el contenido del HTML al que se le dio click y se extrae la información
const leerDatosCurso = curso => {

    // Crear objeto con el contenido del curso actual
    const infoCurso = { 
        imagen: curso.querySelector('img').src,
        titulo: curso.querySelector('h4').textContent,
        precio: curso.querySelector('.precio span').textContent,
        id: curso.querySelector('a').getAttribute('data-id'),
        cantidad: 1  
    }

    // Revisa si un elemento ya existe en el carrito
    // Some permite recorrer arreglo de objetos y verificar si un elemento existe en el
    const existe = articulosCarrito.some( curso => curso.id === infoCurso.id )

    if ( existe ){
        // Actualizamos la cantidad
        const cursos = articulosCarrito.map( curso => {
            //Cuando el curso actual del carrito sea igual al curso que se intenta agregar
            if ( curso.id === infoCurso.id ){   
                // Actualizar cantidad
                curso.cantidad++
                return curso  // Se retorna para asignar el nuevo valor actualizdo            
            } else {
                return curso // Retorna los objetos que no son los duplicados
            }
        })

        // Se mandan los cursos actualizados o no 
        articulosCarrito = [ ...cursos ]
        
    } else {
        // Agrega elementos al arreglo de carrito
        articulosCarrito = [ ...articulosCarrito, infoCurso ]
    }

    carritoHTML()
}




//? Mostrar carrito en el HTML
const carritoHTML = () => {

    // Limpiar HTML para no mostrar la información duplicada
    limpiarHTML()

    // Recorre carrito y genera HTML 
    articulosCarrito.forEach( curso => {

        const { id, imagen, titulo, precio, cantidad } = curso
        
        const row = document.createElement('tr')
        
        // Construyendo tbody con la información del curso que se agrega
        row.innerHTML = `
            <td>
                <img src="${ imagen }" width="100" />
            </td>
            <td> ${ titulo } </td>
            <td> ${ precio } </td>
            <td> ${ cantidad } </td>
            <td>
                <a href="#" class="borrar-curso" data-id="${ id }" >X</a>
            </td>
        `

        // Agrega el HTML del carrito en el tbody
        contenedorCarrito.appendChild(row)
    })

    // Agrega el carrito de compras al storage
    sincronizarStorage()

}

//? Agregando información al localStorage
const sincronizarStorage = () => {
    localStorage.setItem('carrito', JSON.stringify(articulosCarrito))
}


//? Elimina los cursos del tbody
const limpiarHTML = () => {
    // Forma lenta 
    // contenedorCarrito.innerHTML = '';

    // Mejor forma
    // Si el contenedor del carrito tiene algún elemento dentro 
    while( contenedorCarrito.firstChild ){
        // Se eliminan la referencias del padre hacia el hijo
        // Eliminando el elemento primer hijo 
        contenedorCarrito.removeChild(contenedorCarrito.firstChild)
    }
}




//? Cargando eventos escuchadores
const cargarEventListeners = () => {

    // Cuando se agrega un curso presionando "Agregar al carrito"
    listaCursos.addEventListener('click', agregarCurso)

    // Elimina cursos del carrito
    carrito.addEventListener('click', eliminarCurso)


    // Muestra los cursos de localStorage
    document.addEventListener('DOMContentLoaded', () => {
        articulosCarrito = JSON.parse(localStorage.getItem('carrito')) || []
        carritoHTML()
    })


    // Vaciar el carrito
    vaciarCarritoBtn.addEventListener('click', () => {
        // Resetear carrito
        articulosCarrito = []
        
        // Se elimina todo el HTML
        limpiarHTML()
    })

}

cargarEventListeners()
