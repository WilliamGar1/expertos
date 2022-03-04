//Codigo para generar información de categorias y almacenarlas en un arreglo.
var categorias = [];
(()=>{
  //Este arreglo es para generar textos de prueba
  let textosDePrueba=[
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolore, modi!",
      "Quos numquam neque animi ex facilis nesciunt enim id molestiae.",
      "Quaerat quod qui molestiae sequi, sint aliquam omnis quos voluptas?",
      "Non impedit illum eligendi voluptas. Delectus nisi neque aspernatur asperiores.",
      "Ducimus, repellendus voluptate quo veritatis tempora recusandae dolorem optio illum."
  ]
  
  //Genera dinamicamente los JSON de prueba para esta evaluacion,
  //Primer ciclo para las categorias y segundo ciclo para las apps de cada categoria

  
  let contador = 1;
  for (let i=0;i<5;i++){//Generar 5 categorias
      let categoria = {
          nombreCategoria:"Categoria "+i,
          descripcion:textosDePrueba[Math.floor(Math.random() * (5 - 1))],
          aplicaciones:[]
      };
      for (let j=0;j<10;j++){//Generar 10 apps por categoria
          let aplicacion = {
              codigo:contador,
              nombre:"App "+contador,
              descripcion:textosDePrueba[Math.floor(Math.random() * (5 - 1))],
              icono:`img/app-icons/${contador}.webp`,
              instalada:contador%3==0?true:false,
              app:"app/demo.apk",
              calificacion:Math.floor(Math.random() * (5 - 1)) + 1,
              descargas:1000,
              desarrollador:`Desarrollador ${(i+1)*(j+1)}`,
              imagenes:["img/app-screenshots/1.webp","img/app-screenshots/2.webp","img/app-screenshots/3.webp"],
              comentarios:[
                  {comentario:textosDePrueba[Math.floor(Math.random() * (5 - 1))],calificacion:Math.floor(Math.random() * (5 - 1)) + 1,fecha:"12/12/2012",usuario:"Juan"},
                  {comentario:textosDePrueba[Math.floor(Math.random() * (5 - 1))],calificacion:Math.floor(Math.random() * (5 - 1)) + 1,fecha:"12/12/2012",usuario:"Pedro"},
                  {comentario:textosDePrueba[Math.floor(Math.random() * (5 - 1))],calificacion:Math.floor(Math.random() * (5 - 1)) + 1,fecha:"12/12/2012",usuario:"Maria"},
              ]
          };
          contador++;
          categoria.aplicaciones.push(aplicacion);
      }
      categorias.push(categoria);
  }
  
  console.log(categorias);
})();


const indexedDB = window.indexedDB;

let db;

const conexion = indexedDB.open('appstore', 1);

conexion.onsuccess = () =>{
    deb = conexion.result;
    console.log('base de datos abierta', db);
}

conexion.onupgradeneeded = (e) =>{
    db = e.target.result;
    console.log('Base de datos creada', db);

    const coleccion = db.createObjectStore('categorias', {
        keyPath: 'clave'
    });
}

conexion.onerror = (err) =>{
    console.log('Error', err);
}

const agregar = () => {

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