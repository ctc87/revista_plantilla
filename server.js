var express    = require("express");
var interfaceDB = require('./baseDeDatos'); // gestión de la base de datos
var interfaceIMG = require('./imagenes'); // gestión de las imagenes
  
var app = express();

app.set('views', './views'); // carpeta de vistas
app.set('view engine', 'jade'); // libreria utilizada para las vistas
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// formulario de inserción de noticia con imagen
app.post('/uploadNoticiaImage', function(req, res) {
  interfaceIMG.upload(req, res, function (err) {
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
    interfaceIMG.guardarImagen(req.file.path, target_path, interfaceIMG.putAspectRatioThreeOnepointFive,
    function(){
        res.redirect("/config/noticias#insertar");
    },
    function(){
      res.render('error' + err);   // Manejar aqui error de escritura 
    });
  });
});

app.post('/uploadUserImage', function (req, res) {
  interfaceIMG.upload(req, res, function (err) {
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
    var funcionAspectRatio;
    if(req.body.tamnyo_add == '1x1') {
      funcionAspectRatio = interfaceIMG.putAspectRatioMiniumImageClient;
    } else if(req.body.tamnyo_add == '2x4') {
      funcionAspectRatio = interfaceIMG.putAspectRatioThreeOnepointFive; 
    }
    var target_path = './uploads/' + req.file.originalname; // nombre original del archivo
    interfaceIMG.guardarImagen(req.file.path, target_path, funcionAspectRatio,
    function(){
      res.redirect("/config/clientes#insertar");
    },
    function(){
      res.render('error' + err);   // Manejar aqui error de escritura 
    });
  });
});

/* MODIFICAR CLIENTES */
app.post('/config/modificarCliente', function (req, res) {
   interfaceIMG.upload(req, res, function (err) {
    if (err) {
        console.log("errir" , err)
        // MANEJAR AQUI ERROR extension tamaño
        // An error occurred when uploading
        return
    }
    var funcionAspectRatio;
    if(req.body.tamnyo_add == '1x1') {
      funcionAspectRatio = interfaceIMG.putAspectRatioMiniumImageClient;
    } else if(req.body.tamnyo_add == '2x4') {
      funcionAspectRatio = interfaceIMG.putAspectRatioThreeOnepointFive; 
    }
    interfaceDB.obtenerIdMunicipioNombre(req.body.municipio, function(){
      interfaceDB.modificarCliente(
        req.body.id_cliente, 
        req.body.name, 
        interfaceDB.objetoIds.id_municipio,
        req.body.telefono, 
        req.body.email, 
        req.body.web, 
        function(){
          if(req.file) {
            interfaceDB.obtenerIdClienteNombre(req.body.name, 
              function() {
                interfaceDB.modificarLogo(
                  'uploads/'+req.file.originalname, 
                  req.file.originalname, 
                  req.file.originalname.match(/\.(jpg|jpeg|png|gif)$/)[1],
                  req.body.tamnyo_add,
                  interfaceDB.objetoIds.id_cliente, 
                  function(){
                    // console.log("llegue"); // finalizada inserción                  
                  });
                  var target_path = './uploads/' + req.file.originalname; // nombre original del archivo
                  interfaceIMG.guardarImagen(req.file.path, target_path, funcionAspectRatio,
                  function(){
                    res.redirect("/config/clientes#insertar");
                  },
                  function(){
                    res.render('error' + err);   // Manejar aqui error de escritura 
                  });
              });
          } else {
            var originalImage = req.body.old_logo.replace("uploads/", "uploads/originalImages/");
            interfaceDB.modificarTamanyoLogo(req.body.tamnyo_add, req.body.id_cliente, function(){
              funcionAspectRatio('' + originalImage, '' + req.body.old_logo);
              res.redirect("/config/clientes#modificar");
            });
            // gestionar el error de falta de imagen
            // console.log(req.body)
          }
        });  
    });
  });
});

/* MODIFICAR NOTICIAS */
app.post('/config/modificarNoticia', function (req, res) {
   interfaceIMG.upload(req, res, function (err) {
    if (err) {
        console.log("errir" , err)
        // MANEJAR AQUI ERROR extension tamaño
        // An error occurred when uploading
        return
    }
    var target_path;
    if(req.file) {
      target_path = './uploads/noticias/' + req.file.originalname; // nombre original del archivo
    } else {
      target_path = req.body.old_logo;
    }
    /*** MODIFICAR LA PARTE DE LA IMAGEN Y LA MODIFICACIÖN */
    interfaceDB.obtenerIdMunicipioNombre(req.body.municipio, function(){
      interfaceDB.modificarNoticia(
        req.body.titular, 
        req.body.contenido, 
        target_path, 
        req.body.fuenteEnlace, 
        req.body.fuenteNombre, 
        req.body.fecha, 
        interfaceDB.objetoIds.id_municipio, 
        function(){
          if(req.file) {
            interfaceDB.obtenerIdClienteNombre(req.body.name, 
              function() {
                interfaceDB.modificarLogo(
                  'uploads/'+req.file.originalname, 
                  req.file.originalname, 
                  req.file.originalname.match(/\.(jpg|jpeg|png|gif)$/)[1],
                  req.body.tamnyo_add,
                  interfaceDB.objetoIds.id_cliente, 
                  function(){
                    // console.log("llegue"); // finalizada inserción                  
                  });
                  var target_path = './uploads/' + req.file.originalname; // nombre original del archivo
                  interfaceIMG.guardarImagen(req.file.path, target_path, interfaceIMG.putAspectRatioThreeOnepointFive,
                  function(){
                    res.redirect("/config/noticas#insertar");
                  },
                  function(){
                    res.render('error' + err);   // Manejar aqui error de escritura 
                  });
              });
          } else {
            var originalImage = req.body.old_logo.replace("uploads/", "uploads/originalImages/");
            interfaceDB.modificarTamanyoLogo(req.body.tamnyo_add, req.body.id_cliente, function(){
              interfaceIMG.putAspectRatioThreeOnepointFive('' + originalImage, '' + req.body.old_logo);
              res.redirect("/config/noticias#modificar");
            });
            // gestionar el error de falta de imagen
            // console.log(req.body)
          }
        });  
    });
  });
});

app.get('/config/borrarCliente', function (req, res) {
  interfaceDB.eliminarLogo(req.query.id_cliente, function(){
    interfaceDB.eliminarCliente(req.query.id_cliente, function(){
      interfaceIMG.borrarImagen(req.query.img.replace("uploads/", "uploads/originalImages/"));
      interfaceIMG.borrarImagen(req.query.img);
      res.redirect("/config/clientes#modificar");
    });
  }); 
});

/** BACKEND falta configurar inicio de sesion */
app.get('/config/clientes', function (req, res) {
  interfaceDB.resetArrays();
   var order = req.query.ordenar ? req.query.ordenar : "id_cliente";
   interfaceDB.crearObjetoMenu(false, function() {
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

/** BACKEND falta configurar inicio de sesion */
app.get('/config/noticias', function (req, res) {
  interfaceDB.resetArrays();
   var order = req.query.ordenar ? req.query.ordenar : "id_noticia";
   interfaceDB.crearObjetoMenu(false, function() {
      interfaceDB.crearObjetoTodasNoticias(order, function() {
        var objectShow = {}
        objectShow.noticias = interfaceDB.arrayNoticias;
        if(req.query.id_noticia) {
          interfaceDB.arrayNoticias.forEach(function(item) {
            if(item.id_noticia == req.query.id_noticia)
              objectShow.noticiaModificar = item;
          });
        }
        objectShow.menu = interfaceDB.objetoMenu;
        res.render('backendNoticias', objectShow);
      });
    }); // creamos objeto menu
});


/** BACKEND falta configurar el inicio de sesion */
app.get('/config', function (req, res) {
   interfaceDB.crearObjetoMenu(false, function() {
    var objectShow = {}
    objectShow.menu = interfaceDB.objetoMenu;
      res.render('indexBackend', objectShow);
    }); // creamos objeto menu
});

// PORTADA falta definir la estructura para los elementos de portada en la BD y renderizarla con jade
app.get("/",function(req,res){
    interfaceDB.crearObjetoMenu(true, function() {
    var objectShow = {}
    objectShow.menu = interfaceDB.objetoMenu
      res.render('index', objectShow);
    }); // creamos objeto menu
});

app.get('/show', function(req, res) {
  interfaceDB.resetArrays();
  interfaceDB.crearObjetoMenu(true, function() {
    var objectShow = {};
    objectShow.menu = interfaceDB.objetoMenu;
    interfaceDB.crearObjetoCuerpoMunicipio(req.query.id, function(){
      interfaceDB.crearobjetoCuerpoNoticias(req.query.id, {action:true}, function(){
        objectShow.clients2x4 = interfaceDB.arrayClientes2x4;
        objectShow.clients1x1 = interfaceDB.arrayClientes1x1;
        objectShow.clients1x2 = interfaceDB.arrayClientes1x2;
        objectShow.noticias = interfaceDB.arrayNoticias;
        res.render('indexSearch', objectShow);
      });
    });
  }); // creamos objeto menu
});

app.get('/news', function(req, res) {
  interfaceDB.resetArrays();
  interfaceDB.crearObjetoMenu(true, function() {
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
      });
    });
  }); // creamos objeto menu
});


var port = 8081;

app.listen(port, function () {
  console.log('Example app listening on port ' + port +'!');
});




