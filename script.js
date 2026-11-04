
const veredas = [
    "Piedra del Sol",
    "Granja del Cucharo",
    "Vueltas",
    "Congual",
    "Capellanía",
    "Centro",
    "Santa Cruz",
    "Meseta",
    "Hortensias",
    "Alto",
    "Rehoya",
    "Llano Grande",
    "Bosque",
    "Garcés"
];

const categorias = {
    gastronomia: "Gastronomía",
    patrimonio: "Patrimonio histórico-cultural",
    emprendimientos: "Emprendimientos"
};

const posiciones = [
    [18, 22], [36, 16], [55, 17], [73, 22],
    [28, 39], [50, 43], [70, 40], [84, 48],
    [17, 61], [37, 63], [57, 62], [76, 68],
    [31, 82], [62, 84]
];

const posiblesRutasMapa = [
    "./mapa-pinchote.png",
    "./mapa-pinchote.jpg",
    "./mapa-pinchote.jpeg",
    "./mapa-pinchote.webp",
    "./mapa-pinchote.PNG",
    "./mapa-pinchote.JPG",
    "./imagenes/mapa-pinchote.png",
    "./imagenes/mapa-pinchote.jpg",
    "./imagenes/mapa-pinchote.jpeg",
    "./imagenes/mapa-pinchote.webp"
];

let veredaActual = "Centro";
let categoriaActual = "gastronomia";
let contenidos = {};

try {
    contenidos = JSON.parse(
        localStorage.getItem("contenidosTuristicosPinchote")
    ) || {};
} catch (error) {
    contenidos = {};
}

function iniciar() {
    crearListaVeredas();
    crearMarcadores();
    llenarSelector();
    configurarCategorias();
    configurarEditor();
    configurarImagenMapa();
    seleccionarVereda("Centro");
}

function configurarImagenMapa() {
    const imagen = document.getElementById("imagen-mapa");
    const error = document.getElementById("error-mapa");
    let indice = 0;

    error.hidden = true;

    function probarSiguienteRuta() {
        if (indice >= posiblesRutasMapa.length) {
            imagen.style.display = "none";
            error.hidden = false;
            error.textContent =
                "No encontramos el mapa. Revisa que el archivo esté en la carpeta principal o en imagenes y que su nombre y extensión sean correctos.";
            return;
        }

        imagen.style.display = "block";
        imagen.src = posiblesRutasMapa[indice];
        indice++;
    }

    imagen.onload = () => {
        error.hidden = true;
        imagen.style.display = "block";
    };

    imagen.onerror = () => {
        probarSiguienteRuta();
    };

    probarSiguienteRuta();
}

function crearListaVeredas() {
    const lista = document.getElementById("lista-veredas");
    lista.innerHTML = "";

    veredas.forEach((vereda, indice) => {
        const boton = document.createElement("button");
        boton.className = "vereda-item";

        const numero = document.createElement("span");
        numero.className = "numero-vereda";
        numero.textContent = indice + 1;

        const nombre = document.createElement("span");
        nombre.textContent = vereda;

        boton.append(numero, nombre);

        boton.addEventListener("click", () => {
            seleccionarVereda(vereda);
        });

        lista.appendChild(boton);
    });
}

function crearMarcadores() {
    const contenedor = document.getElementById("marcadores-mapa");
    contenedor.innerHTML = "";

    veredas.forEach((vereda, indice) => {
        const marcador = document.createElement("button");
        marcador.className = "marcador";
        marcador.textContent = indice + 1;
        marcador.style.left = posiciones[indice][0] + "%";
        marcador.style.top = posiciones[indice][1] + "%";
        marcador.title = vereda;
        marcador.setAttribute("aria-label", vereda);

        marcador.addEventListener("click", () => {
            seleccionarVereda(vereda);
        });

        contenedor.appendChild(marcador);
    });
}

function llenarSelector() {
    const selector = document.getElementById("editor-vereda");
    selector.innerHTML = "";

    veredas.forEach(vereda => {
        const opcion = document.createElement("option");
        opcion.value = vereda;
        opcion.textContent = vereda;
        selector.appendChild(opcion);
    });
}

function seleccionarVereda(vereda) {
    veredaActual = vereda;

    document.getElementById("nombre-vereda").textContent = vereda;

    document.getElementById("descripcion-vereda").textContent =
        vereda === "Centro"
            ? "Conoce el corazón de Pinchote, sus espacios representativos, su patrimonio y las tradiciones que hacen parte de su identidad."
            : "Explora esta vereda y descubre sus lugares, tradiciones y emprendimientos. La información está pendiente de recopilación y verificación con la comunidad.";

    document.getElementById("editor-vereda").value = vereda;

    document.querySelectorAll(".vereda-item").forEach(boton => {
        const nombre = boton.querySelectorAll("span")[1].textContent;
        boton.classList.toggle("activo", nombre === vereda);
    });

    document.querySelectorAll(".marcador").forEach((marcador, indice) => {
        marcador.classList.toggle("activo", veredas[indice] === vereda);
    });

    mostrarGaleria();
}

function configurarCategorias() {
    document.querySelectorAll(".categoria").forEach(boton => {
        boton.addEventListener("click", () => {
            categoriaActual = boton.dataset.categoria;

            document.querySelectorAll(".categoria").forEach(item => {
                item.classList.remove("activa");
            });

            boton.classList.add("activa");
            mostrarGaleria();
        });
    });
}

function obtenerContenido() {
    if (!contenidos[veredaActual]) {
        contenidos[veredaActual] = {
            gastronomia: [],
            patrimonio: [],
            emprendimientos: []
        };
    }

    return contenidos[veredaActual];
}

function mostrarGaleria() {
    const galeria = document.getElementById("galeria-fotos");
    const datos = obtenerContenido();
    const elementos = datos[categoriaActual] || [];

    galeria.innerHTML = "";

    if (elementos.length === 0) {
        const mensaje = document.createElement("p");
        mensaje.className = "mensaje-vacio";
        mensaje.textContent =
            "Todavía no hay contenido agregado en esta categoría para " +
            veredaActual +
            ". Puedes añadir información y fotografías desde el editor.";

        galeria.appendChild(mensaje);
        return;
    }

    elementos.forEach((elemento, indice) => {
        const tarjeta = document.createElement("article");
        tarjeta.className = "tarjeta";

        (elemento.fotos || []).forEach(foto => {
            const imagen = document.createElement("img");
            imagen.src = foto;
            imagen.alt = elemento.titulo;
            tarjeta.appendChild(imagen);
        });

        const contenido = document.createElement("div");
        contenido.className = "tarjeta-contenido";

        const titulo = document.createElement("h3");
        titulo.textContent = elemento.titulo;

        const descripcion = document.createElement("p");
        descripcion.textContent = elemento.descripcion;

        const eliminar = document.createElement("button");
        eliminar.className = "eliminar-contenido";
        eliminar.textContent = "Eliminar contenido";
        eliminar.addEventListener("click", () => {
            eliminarContenido(indice);
        });

        contenido.append(titulo, descripcion, eliminar);
        tarjeta.appendChild(contenido);
        galeria.appendChild(tarjeta);
    });
}

function configurarEditor() {
    document.getElementById("guardar-contenido")
        .addEventListener("click", guardarContenido);

    document.getElementById("editor-vereda")
        .addEventListener("change", evento => {
            document.getElementById("mensaje-editor").textContent =
                "Estás editando: " + evento.target.value;
        });
}

async function guardarContenido() {
    const vereda = document.getElementById("editor-vereda").value;
    const categoria = document.getElementById("editor-categoria").value;
    const titulo = document.getElementById("editor-titulo").value.trim();
    const descripcion = document.getElementById("editor-descripcion").value.trim();
    const archivos = Array.from(
        document.getElementById("editor-fotos").files
    );

    const mensaje = document.getElementById("mensaje-editor");

    if (!titulo || !descripcion) {
        mensaje.textContent = "Escribe el nombre y la descripción antes de guardar.";
        return;
    }

    const fotos = [];

    try {
        for (const archivo of archivos) {
            if (archivo.type.startsWith("image/")) {
                fotos.push(await comprimirImagen(archivo));
            }
        }
    } catch (error) {
        mensaje.textContent = "No se pudieron procesar las fotografías.";
        return;
    }

    if (!contenidos[vereda]) {
        contenidos[vereda] = {
            gastronomia: [],
            patrimonio: [],
            emprendimientos: []
        };
    }

    contenidos[vereda][categoria].push({
        titulo,
        descripcion,
        fotos
    });

    if (!guardarEnNavegador()) return;

    document.getElementById("editor-titulo").value = "";
    document.getElementById("editor-descripcion").value = "";
    document.getElementById("editor-fotos").value = "";

    categoriaActual = categoria;

    document.querySelectorAll(".categoria").forEach(boton => {
        boton.classList.toggle(
            "activa",
            boton.dataset.categoria === categoria
        );
    });

    seleccionarVereda(vereda);
    mensaje.textContent = "¡Contenido guardado correctamente!";
}

function comprimirImagen(archivo) {
    return new Promise((resolve, reject) => {
        const lector = new FileReader();

        lector.onload = () => {
            const imagen = new Image();

            imagen.onload = () => {
                const maximo = 1200;
                const escala = Math.min(
                    1,
                    maximo / Math.max(imagen.width, imagen.height)
                );

                const canvas = document.createElement("canvas");
                canvas.width = Math.round(imagen.width * escala);
                canvas.height = Math.round(imagen.height * escala);

                const contexto = canvas.getContext("2d");
                contexto.drawImage(
                    imagen,
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );

                resolve(canvas.toDataURL("image/jpeg", 0.78));
            };

            imagen.onerror = reject;
            imagen.src = lector.result;
        };

        lector.onerror = reject;
        lector.readAsDataURL(archivo);
    });
}

function guardarEnNavegador() {
    try {
        localStorage.setItem(
            "contenidosTuristicosPinchote",
            JSON.stringify(contenidos)
        );
        return true;
    } catch (error) {
        alert("No se pudo guardar. Puede que las fotografías sean demasiado grandes.");
        return false;
    }
}

function eliminarContenido(indice) {
    if (!confirm("¿Deseas eliminar este contenido?")) return;

    const datos = obtenerContenido();
    datos[categoriaActual].splice(indice, 1);

    guardarEnNavegador();
    mostrarGaleria();
}

document.getElementById("exportar-datos").addEventListener("click", () => {
    const archivo = new Blob(
        [JSON.stringify(contenidos, null, 2)],
        { type: "application/json" }
    );

    const enlace = document.createElement("a");
    enlace.href = URL.createObjectURL(archivo);
    enlace.download = "respaldo-turistico-pinchote.json";
    enlace.click();

    URL.revokeObjectURL(enlace.href);
});

iniciar();
