var express    = require("express");
var interfaceDB = require('./baseDeDatos'); // gestión de la base de datos
var interfaceIMG = require('./imagenes'); // gestión de las imagenes
var fs = require('fs'); // manejo sistea de ficheros
var multer  = require('multer'); // subida de archivos al servidor
var lwip = require("lwip");

/* configuración de la subida de archivos para imagenes */
// FALTA GESTIONAR EL TAMAÑO
var upload = multer({
  dest:'uploads/',
  inMemory: true, 
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Solo se aceptan imagnes como subida'));
    }
    cb(null, true);
  }
}).single('file');


function putAspectRatioThreeOnepointFive(img_name) {
  // manicpualción de imagenes
  
lwip.open(img_name, function(err, image){
  if(!err) {
    var w = image.width();
    var h = image.height();
    // var newW = 400;
    // var divisior = w / newW;
    var newH = (w / 3) * 1.5;
    // console.log(newW, newH);
    // check err...
    // define a batch of manipulations and save to disk as JPEG:
    image.batch()
      // .resize(newW, newH)          // scale to 75%
      // .rotate(45, 'white')  // rotate 45degs clockwise (white fill)
      .crop(w, newH)       // crop a 200X200 square from center
      .writeFile(img_name, function(err){
        // check err...
        // done.
      });
    } else {
      console.log('error en abrir la imagen', err);
    }
});  
}

function putAspectRatioMiniumImageClient(img_name) {
  // manicpualción de imagenes
  
lwip.open(img_name, function(err, image){
  if(!err) {
    var w = image.width();
    var h = image.height();
    // var newW = 400;
    // var divisior = w / newW;
    var newH = (w / 683) * 384;
    // console.log(newW, newH);
    // check err...
    // define a batch of manipulations and save to disk as JPEG:
    image.batch()
      // .resize(newW, newH)          // scale to 75%
      // .rotate(45, 'white')  // rotate 45degs clockwise (white fill)
      .crop(w, newH)       // crop a 200X200 square from center
      .writeFile(img_name, function(err){
        // check err...
        // done.
      });
    } else {
      console.log('error en abrir la imagen', err);
    }
});  
}


  
var app = express();

app.set('views', './views'); // carpeta de vistas
app.set('view engine', 'jade'); // libreria utilizada para las vistas
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));



// formulario de inserción de noticia con imagen
app.post('/uploadNoticiaImage', function(req, res) {
  upload(req, res, function (err) {
    if (err) {
        console.log("error" , err)
        // MANEJAR AQUI ERROR extension tamaño
        // An error occurred when uploading
        return
    }
    if(!req.file) {
    // gestionar el error de falta de imagen
    return
    }
    var target_path = './uploads/noticias/' + req.file.originalname; // nombre original del archivo
    interfaceDB.obtenerIdMunicipioNombre(req.body.municipio, function(){
      interfaceDB.insertarNoticia(
        req.body.titular, 
        req.body.contenido, 
        target_path, 
        req.body.fuenteEnlace, 
        req.body.fuenteNombre, 
        req.body.fecha, 
        interfaceDB.objetoIds.id_municipio, 
        function(){
          console.log("insertada noticia");
        });
    });
    var tmp_path = req.file.path; // path temporal del archivo
    var src = fs.createReadStream(tmp_path); // creamos un buffer de lectura del archivo temporal subido
    var dest = fs.createWriteStream(target_path); // fijamos un archivo de destino
    src.pipe(dest); // conectamos mediante una tuberia el buffer de entrada con el archivo de destino
    src.on('end', function() { // terminada lectura del archivo
      fs.unlink(tmp_path) // borramos temporal
      putAspectRatioThreeOnepointFive(target_path); // cambiamos el aspect ratio
      res.redirect("/config/noticias#insertar");
    });
    src.on('error', function(err) {
      res.render('error' + err);   // Manejar aqui error de escritura 
    });
  });
});

app.post('/uploadUserImage', function (req, res) {
  upload(req, res, function (err) {
    if (err) {
        console.log("errir" , err)
        // MANEJAR AQUI ERROR extension tamaño
        // An error occurred when uploading
        return
    }
   if(!req.file) {
     // gestionar el error de falta de imagen
    // console.log(req.body)
     return
   }
    var extension = req.file.originalname.match(/\.(jpg|jpeg|png|gif)$/)[1];
    interfaceDB.obtenerIdMunicipioNombre(req.body.municipio, function(){
      interfaceDB.insertarCliente(
        req.body.name, 
        interfaceDB.objetoIds.id_municipio,
        req.body.telefono, 
        req.body.email, 
        req.body.web, 
        function() {
        interfaceDB.obtenerIdClienteNombre(req.body.name, 
          function() {
            interfaceDB.insertarLogo(
              'uploads/'+req.file.originalname, 
              req.file.originalname, 
              extension,
              req.body.tamnyo_add,
              interfaceDB.objetoIds.id_cliente, 
              function(){
                // console.log("llegue"); // finalizada inserción                  
              });
          });
        });    
    });
     
    var tmp_path = req.file.path; // path temporal del archivo
    var target_path = './uploads/' + req.file.originalname; // nombre original del archivo
    var src = fs.createReadStream(tmp_path); // creamos un buffer de lectura del archivo temporal subido
    var dest = fs.createWriteStream(target_path); // fijamos un archivo de destino
    src.pipe(dest); // conectamos mediante una tuberia el buffer de entrada con el archivo de destino
    src.on('end', function() { // terminada lectura del archivo
      fs.unlink(tmp_path) // borramos temporal
      // cambiamos el aspect ratio
      if(req.body.tamnyo_add == '1x1') {
        putAspectRatioMiniumImageClient(target_path);
      } else if(req.body.tamnyo_add == '2x4') {
        putAspectRatioThreeOnepointFive(target_path); 
      }
      res.redirect("/config/clientes#insertar");
    });
    src.on('error', function(err) {
      res.render('error' + err);   // Manejar aqui error de escritura 
    }); 
  });
});

/* MODIFICAR CLIENTES */
app.get('/config/modificarCliente', function (req, res) {
   upload(req, res, function (err) {
    var imagen
    if (err) {
        console.log("errir" , err)
        // MANEJAR AQUI ERROR extension tamaño
        // An error occurred when uploading
        return
    }
   if(!req.file) {
     // gestionar el error de falta de imagen
    // console.log(req.body)
     return
   }
    var extension = req.file.originalname.match(/\.(jpg|jpeg|png|gif)$/)[1];
    interfaceDB.obtenerIdMunicipioNombre(req.body.municipio, function(){
      interfaceDB.insertarCliente(
        req.body.name, 
        interfaceDB.objetoIds.id_municipio,
        req.body.telefono, 
        req.body.email, 
        req.body.web, 
        function() {
        interfaceDB.obtenerIdClienteNombre(req.body.name, 
          function() {
            interfaceDB.insertarLogo(
              'uploads/'+req.file.originalname, 
              req.file.originalname, 
              extension,
              req.body.tamnyo_add,
              interfaceDB.objetoIds.id_cliente, 
              function(){
                // console.log("llegue"); // finalizada inserción                  
              });
          });
        });    
    });
     
    var tmp_path = req.file.path; // path temporal del archivo
    var target_path = './uploads/' + req.file.originalname; // nombre original del archivo
    var src = fs.createReadStream(tmp_path); // creamos un buffer de lectura del archivo temporal subido
    var dest = fs.createWriteStream(target_path); // fijamos un archivo de destino
    src.pipe(dest); // conectamos mediante una tuberia el buffer de entrada con el archivo de destino
    src.on('end', function() { // terminada lectura del archivo
      fs.unlink(tmp_path) // borramos temporal
      // cambiamos el aspect ratio
      if(req.body.tamnyo_add == '1x1') {
        putAspectRatioMiniumImageClient(target_path);
      } else if(req.body.tamnyo_add == '2x4') {
        putAspectRatioThreeOnepointFive(target_path); 
      }
      res.redirect("/config/clientes#insertar");
    });
    src.on('error', function(err) {
      res.render('error' + err);   // Manejar aqui error de escritura 
    }); 
  });
});



/** BACKEND falta configurar inicio de sesion */
app.get('/config/clientes', function (req, res) {
  interfaceDB.resetArrays();
   var order = req.query.ordenar ? req.query.ordenar : "id_cliente";
   interfaceDB.crearObjetoMenu(function() {
      interfaceDB.crearObjetoTodosClientesOrdenado(order, function() {
        var objectShow = {}
        objectShow.clients = interfaceDB.arrayClientes;
        if(req.query.id_cliente) {
          interfaceDB.arrayClientes.forEach(function(item) {
            if(item.id_cliente == req.query.id_cliente)
              objectShow.ClienteModificar = item;
          });
        }
        objectShow.menu = interfaceDB.objetoMenu;
        res.render('backendClientes', objectShow);
      });
    }); // creamos objeto menu
});



/** BACKEND falta configurar el inicio de sesion */
app.get('/config', function (req, res) {
   interfaceDB.crearObjetoMenu(function() {
    var objectShow = {}
    objectShow.menu = interfaceDB.objetoMenu;
      res.render('indexBackend', objectShow);
    }); // creamos objeto menu
});

// PORTADA falta definir la estructura para los elementos de portada en la BD y renderizarla con jade
app.get("/",function(req,res){
    interfaceDB.crearObjetoMenu(function() {
    var objectShow = {}
    objectShow.menu = interfaceDB.objetoMenu;
      res.render('index', objectShow);
    }); // creamos objeto menu
});

app.get('/show', function(req, res) {
  interfaceDB.resetArrays();
  interfaceDB.crearObjetoMenu(function() {
    var objectShow = {}
    objectShow.menu = interfaceDB.objetoMenu;
    interfaceDB.crearObjetoCuerpoMunicipio(req.query.id, function(){
      interfaceDB.crearobjetoCuerpoNoticias(req.query.id, {action:true}, function(){
        objectShow.clients2x4 = interfaceDB.arrayClientes2x4;
        objectShow.clients1x1 = interfaceDB.arrayClientes1x1;
        objectShow.clients1x2 = interfaceDB.arrayClientes1x2;
        objectShow.noticias = interfaceDB.arrayNoticias;
        res.render('indexSearch', objectShow);
      })
    });
  }); // creamos objeto menu
});

app.get('/news', function(req, res) {
  interfaceDB.resetArrays();
  interfaceDB.crearObjetoMenu(function() {
    var objectShow = {}
    objectShow.menu = interfaceDB.objetoMenu;
    objectShow.municipio = req.query.id_municipio
    objectShow.id_noticia = req.query.id_noticia
    interfaceDB.crearObjetoCuerpoMunicipio(req.query.id_municipio, function(){
      interfaceDB.crearobjetoCuerpoNoticias(req.query.id_municipio, {action:false, id_noticia:objectShow.id_noticia}, function(){
        objectShow.clients2x4 = interfaceDB.arrayClientes2x4;
        objectShow.clients1x1 = interfaceDB.arrayClientes1x1;
        objectShow.clients1x2 = interfaceDB.arrayClientes1x2;
        objectShow.noticias = interfaceDB.arrayNoticias;
        res.render('indexNews', objectShow);
      })
    });
  }); // creamos objeto menu
});


var port = 8081;

app.listen(port, function () {
  console.log('Example app listening on port ' + port +'!');
});




