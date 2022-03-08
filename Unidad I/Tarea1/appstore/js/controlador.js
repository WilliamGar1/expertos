const indexedDB = window.indexedDB;

let db;

const req = indexedDB.open('appstore', 1);

req.onsuccess = () => {
    db = req.result;
    console.log('OPEN');

    categorias.forEach(categoria => {
        actualizar(categoria);
    });

    mostrarTodas();
}

req.onupgradeneeded = (e) => {
    db = e.target.result;
    console.log('CREATE', db);

    const coleccion = db.createObjectStore('categorias', {
        keyPath: 'nombreCategoria'
    });

    categorias.forEach(categoria => {
        coleccion.add(categoria);
    });
}

req.onerror = (err) => {
    console.log('Error', err);
}

const agregar = (data) => {
    const transaccion = db.transaction(['categorias'], 'readwrite');

    const coleccionObjetos = transaccion.objectStore('categorias');

    const req = coleccionObjetos.add(data);
}


const obtener = (clave) => {
    const transaccion = db.transaction(['categorias'], 'readonly');

    const coleccionObjetos = transaccion.objectStore('categorias');

    const req = coleccionObjetos.get(clave);

    req.onsuccess = (e) => {
        document.getElementById('apps').innerHTML = '';
        generarAplicaciones(e.target.result.aplicaciones, e.target.result.nombreCategoria);
    }
}

/* Creo que me equivoqué de carrera :v */

const mostrarTodas = () => {
    const transaccion = db.transaction(['categorias'], 'readonly');

    const coleccionObjetos = transaccion.objectStore('categorias');

    const req = coleccionObjetos.openCursor();

    document.getElementById('apps').innerHTML = '';

    req.onsuccess = (e) => {

        const cursor = e.target.result;

        if (cursor) {
            generarAplicaciones(cursor.value.aplicaciones, cursor.value.nombreCategoria)
            e.target.result.continue();
        } else {
            //console.log('No hay categorias en la lista');
        }
    }
}

const generarAplicaciones = (data, categoria) => {
    data.forEach(app => {
        let estrellas = '';

        for (let i = 0; i < app.calificacion; i++) {
            estrellas += '<i class="fas fa-star"></i>'
        }

        for (let i = 0; i < 5 - app.calificacion; i++) {
            estrellas += '<i class="far fa-star"></i>'
        }

        var row = document.getElementById('apps');
        row.innerHTML +=
            `<div class="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2">
            <div class="card apps" onclick="abrirModal('${app.codigo}', '${categoria}');">
                <img src=${app.icono} alt="...">
                <div class="card-body">
                    <h5 class="card-title">${app.nombre}</h5>
                    <p class="card-text">${app.desarrollador}</p>
                    <div>
                        ${estrellas}
                    </div>
                </div>
            </div>
            <br>
        </div>`;
    })
}

const actualizar = (clave) => {

    const transaccion = db.transaction(['categorias'], 'readwrite');

    const coleccionObjetos = transaccion.objectStore('categorias');

    const req = coleccionObjetos.put(clave);

}

//Codigo para generar información de categorias y almacenarlas en un arreglo.
var categorias = [];

(() => {
    //Este arreglo es para generar textos de prueba
    let textosDePrueba = [
        "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolore, modi!",
        "Quos numquam neque animi ex facilis nesciunt enim id molestiae.",
        "Quaerat quod qui molestiae sequi, sint aliquam omnis quos voluptas?",
        "Non impedit illum eligendi voluptas. Delectus nisi neque aspernatur asperiores.",
        "Ducimus, repellendus voluptate quo veritatis tempora recusandae dolorem optio illum."
    ]

    //Genera dinamicamente los JSON de prueba para esta evaluacion,
    //Primer ciclo para las categorias y segundo ciclo para las apps de cada categoria


    let contador = 1;
    for (let i = 0; i < 5; i++) {//Generar 5 categorias
        let categoria = {
            nombreCategoria: "Categoria " + i,
            descripcion: textosDePrueba[Math.floor(Math.random() * (5 - 1))],
            aplicaciones: []
        };
        for (let j = 0; j < 10; j++) {//Generar 10 apps por categoria
            let aplicacion = {
                codigo: contador,
                nombre: "App " + contador,
                descripcion: textosDePrueba[Math.floor(Math.random() * (5 - 1))],
                icono: `img/app-icons/${contador}.webp`,
                instalada: contador % 3 == 0 ? true : false,
                app: "app/demo.apk",
                calificacion: Math.floor(Math.random() * (5 - 1)) + 1,
                descargas: 1000,
                desarrollador: `Desarrollador ${(i + 1) * (j + 1)}`,
                imagenes: ["img/app-screenshots/1.webp", "img/app-screenshots/2.webp", "img/app-screenshots/3.webp"],
                comentarios: [
                    { comentario: textosDePrueba[Math.floor(Math.random() * (5 - 1))], calificacion: Math.floor(Math.random() * (5 - 1)) + 1, fecha: "12/12/2012", usuario: "Juan" },
                    { comentario: textosDePrueba[Math.floor(Math.random() * (5 - 1))], calificacion: Math.floor(Math.random() * (5 - 1)) + 1, fecha: "12/12/2012", usuario: "Pedro" },
                    { comentario: textosDePrueba[Math.floor(Math.random() * (5 - 1))], calificacion: Math.floor(Math.random() * (5 - 1)) + 1, fecha: "12/12/2012", usuario: "Maria" },
                ]
            };
            contador++;
            categoria.aplicaciones.push(aplicacion);
        }
        categorias.push(categoria);
    }

    console.log(categorias);
    //llenar()
})();

for (let i = 0; i < 5; i++) {
    document.getElementById('categoria').innerHTML +=
        `<option value="Categoria ${i}">Categoria ${i}</option>`;
}

const cargarAplicaciones = () => {

    //console.log("Cargar aplicaciones de la categoria: ", $("#categoria").val());

    if ($("#categoria").val() == 1) {
        mostrarTodas();
    } else {
        obtener($("#categoria").val());
    }
}

const eliminar = (id, categoria) => {
    const transaccion = db.transaction(['categorias'], 'readwrite');

    const coleccionObjetos = transaccion.objectStore('categorias');

    const req = coleccionObjetos.get(categoria);

    req.onsuccess = (e) => {
        let cat = e.target.result;

        let indice = 0;

        for (let i = 0; i < cat.aplicaciones.length; i++) {
            let cod = cat.aplicaciones[i].codigo;
            console.log(cod);
            if (cod == id) {
                indice = i;
            }
        }

        cat.aplicaciones.splice(indice, 1)

        actualizar(cat);

        //obtener2()

        obtener(categoria);
    }
}

const obtener2 = () => {
    const transaccion = db.transaction(['categorias'], 'readonly');

    const coleccionObjetos = transaccion.objectStore('categorias');

    const req = coleccionObjetos.openCursor();


    req.onsuccess = (e) => {
        const cursor = e.target.result;

        if (cursor) {
            console.log(cursor.value);
            cursor.continue();
        }
    }
}

const abrirModal2 = () => {
    $('#nuevaAppModal').modal('show');
}

const guardar = (categoria) => {
    const transaccion = db.transaction(['categorias'], 'readonly');

    const coleccionObjetos = transaccion.objectStore('categorias');

    const req = coleccionObjetos.get(categoria);

    req.onsuccess = e => {
        const cat = e.target.result;
        let a = 0;
        cat.aplicaciones.forEach(app => {
            a = app.codigo;
        });

        let aplicacion = {
            codigo: document.getElementById('nombreApp').value,
            nombre: document.getElementById('nombreApp').value,
            descripcion: document.getElementById('descripcion').value,
            icono: `img/meme.jpg`,
            instalada: a + 1 % 3 == 0 ? true : false,
            app: "app/demo.apk",
            calificacion: document.getElementById('calificacion').value,
            descargas: 1000,
            desarrollador: document.getElementById('desarrollador').value,
            imagenes: [],
            comentarios: []
        }

        cat.aplicaciones.push(aplicacion);

        //console.log(cat.aplicaciones)
        actualizar(cat)

        obtener(categoria);
    }

    
}

const abrirModal = (clave, categoria) => {

    $('#ventanaModal').modal('show');

    const transaccion = db.transaction(['categorias'], 'readonly');

    const coleccionObjetos = transaccion.objectStore('categorias');

    const req = coleccionObjetos.openCursor();

    document.getElementById('cardModal').innerHTML = '';

    req.onsuccess = (e) => {

        const cursor = e.target.result;

        if (cursor) {
            cursor.value.aplicaciones.forEach(app => {
                let estrellas = '';

                for (let i = 0; i < app.calificacion; i++) {
                    estrellas += '<i class="fas fa-star"></i>'
                }

                for (let i = 0; i < 5 - app.calificacion; i++) {
                    estrellas += '<i class="far fa-star"></i>'
                }
                if (app.codigo == clave) {
                    document.getElementById('cardModal').innerHTML +=
                        `<div class="col-12">
                        <div class="row no-gutters">
                            <div class="col-md-4">
                                <img src="img/app-icons/${clave}.webp" class="card-img" alt="...">
                            </div>
                            <div class="col-md-8">
                                <div class="card-body">
                                    <h5 class="card-title">${app.nombre}</h5>
                                    <small class="text-muted">${app.desarrollador}</small>
                                    <p class="card-text">${app.descripcion}</p>
                                </div>
                            </div>
                        </div>
                        <hr>
                    </div>`
                    if (app.calificacion >= 3) {
                        document.getElementById('cardModal').innerHTML +=
                            `<div class="col-12">
                            <p class="text-center" style="color: green;">
                                ${estrellas}
                            </p>
                            <hr>
                        </div>`;
                    } else {
                        document.getElementById('cardModal').innerHTML +=
                            `<div class="col-12">
                            <p class="text-center" style="color: red;">
                                ${estrellas}
                            </p>
                            <hr>
                        </div>`
                    }

                    app.comentarios.forEach(coment => {
                        document.getElementById('cardModal').innerHTML +=
                            `<div class="col-12">
                        <div class="media">
                            <div class="user mr-3"></div>
                            <div class="media-body">
                                <h5 class="mt-0">${coment.usuario}</h5>
                                ${coment.comentario}
                            </div>
                        </div>
                        <hr>
                    </div>`;
                    });

                    document.getElementById('modalFooter').innerHTML =
                        `<button type="button" class="btn btn-danger" data-dismiss="modal" onclick="eliminar('${app.codigo}', '${categoria}')">Eliminar</button>
                        <button type="button" class="btn btn-primary" id="boton"></button>`

                    if (app.instalada == true) {
                        document.getElementById('boton').innerHTML = 'Instalada';
                    } else {
                        document.getElementById('boton').innerHTML = 'Instalar';
                    }
                }
            });

            cursor.continue();
        } else {
            //console.log('No hay categorias en la lista');
        }
    }
}



/*var aplicaciones = [];

var localStorage = window.localStorage;

if (localStorage.getItem('aplicaciones') == null){
    localStorage.setItem('aplicaciones', JSON.stringify(aplicaciones));
}else{
    aplicaciones = JSON.parse(localStorage.getItem('aplicaciones'));
}


for (let i=1; i<=50; i++){
    document.getElementById('listaImagenes').innerHTML +=
        `<option value="img/app-icons/${i}.webp">Imagen ${i}</option>`;
}

var generarAplicaciones = () => {
    document.getElementById('apps').innerHTML = '';
    aplicaciones.forEach(app => {
        let estrellas = '';

        for (let i = 0; i < app.calificacion; i++) {
            estrellas += '<i class="fas fa-star"></i>'            
        }

        for (let i = 0; i < 5 - app.calificacion; i++) {
            estrellas += '<i class="far fa-star"></i>'            
        }

        var row = document.getElementById('apps');
        row.innerHTML +=
        `<div class="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2">
            <div class="card">
                <img src=${app.urlImage} alt="...">
                <div class="card-body">
                    <h5 class="card-title">${app.nombreAplicacion}</h5>
                    <p class="card-text">Desarrollador: ${app.desarrollador}</p>
                    <div>
                        ${estrellas}
                    </div>
                </div>
            </div>
        </div>`;
    });
    
}

generarAplicaciones();

var guardar = () => {
    const app = {
        nombreAplicacion: document.getElementById('nombreApp').value,
        urlImage: document.getElementById('listaImagenes').value,
        desarrollador: document.getElementById('desarrollador').value,
        calificacion: document.getElementById('calificacion').value
    }

    console.log(app);

    aplicaciones.push(app);

    localStorage.setItem('aplicaciones', JSON.stringify(aplicaciones))

    generarAplicaciones();

    console.log(aplicaciones);

    $('#exampleModal').modal('hide');
}*/