var express    = require("express");
var interfaceDB = require('./baseDeDatos'); // gestión de la base de datos
var fs = require('fs'); // manejo sistea de ficheros
var multer  = require('multer'); // subida de archivos al servidor

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
  
  
var app = express();

app.set('views', './views'); // carpeta de vistas
app.set('view engine', 'jade'); // libreria utilizada para las vistas
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// formulario subida imagen, hay que gestionar la subida de tods los datos
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
     console.log(req.body)
     return
   }
    var extension = req.file.originalname.match(/\.(jpg|jpeg|png|gif)$/)[1];
    interfaceDB.obtenerIdMunicipioNombre(req.body.municipio, function(){
        interfaceDB.insertarCliente(req.body.name, interfaceDB.objetoIds.id_municipio ,
        function() {
          interfaceDB.obtenerIdClienteNombre(req.body.name, function() {
              interfaceDB.insertarEmails(req.body.mails, interfaceDB.objetoIds.id_cliente, 
              function() {
                interfaceDB.insertarLogo(
                  'uploads/'+req.file.originalname, 
                  req.file.originalname, 
                  extension, 
                  interfaceDB.objetoIds.id_cliente, 
                  function(){
                    console.log("llegue")                  
                  });
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
      interfaceDB.crearObjetoMenu(function() {
      var objectShow = {}
      objectShow.menu = interfaceDB.objetoMenu;
        res.render('indexBackend', objectShow);
      }); // creamos objeto menu
    });
    src.on('error', function(err) {
      res.render('error' + err);   // Manejar aqui error de escritura 
    }); 
  });
});

/** BACKEND falta configurar los estilos  y el inicio de sesion */
app.get('/config', function (req, res) {
   interfaceDB.crearObjetoMenu(function() {
    var objectShow = {}
    objectShow.menu = interfaceDB.objetoMenu;
      console.log(objectShow.menu)
      res.render('indexBackend', objectShow);
    }); // creamos objeto menu
});

app.get('/res', function (req, res) {
  res.render('index', { title: 'Hey', message: 'Hello there!'});
});

app.get("/",function(req,res){
    interfaceDB.crearObjetoMenu(function() {
    var objectShow = {}
    objectShow.menu = interfaceDB.objetoMenu;
      res.render('index', objectShow);
    }); // creamos objeto menu
    // console.log(interfaceDB.objetoMenu);
});

app.get('/show', function(req, res) {
  interfaceDB.arrayClientes = [];
  interfaceDB.crearObjetoMenu(function() {
    var objectShow = {}
    objectShow.menu = interfaceDB.objetoMenu;
    objectShow.municipio = req.query.municipio
    interfaceDB.crearObjetoCuerpoMunicipio(req.query.id, function(){
      console.log(interfaceDB.arrayClientes);
      objectShow.clients = interfaceDB.arrayClientes;
      res.render('indexSearch', objectShow);
    });
  }); // creamos objeto menu
});

var port = 8081;

app.listen(port, function () {
  console.log('Example app listening on port ' + port +'!');
});




