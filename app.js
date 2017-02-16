var express    = require("express");
var interfaceDB = require('./baseDeDatos'); // gestión de la base de datos
var interfaceIMG = require('./imagenes'); // gestión de las imagenes
var interfaceUSR = require('./loginUsers'); // gestión de los usuarios y login
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
var funAux = require('./funcionesAuxiliares') // funciones auxiliares
var app = express();

app.use(express.cookieParser());
app.use(express.session({
  secret: 'shhhhhhhhh',
  resave: true,
  saveUninitialized: true
}));

app.use(interfaceUSR.passport.initialize());
app.use(interfaceUSR.passport.session());

app.set('views', './views'); // carpeta de vistas
app.set('view engine', 'jade'); // libreria utilizada para las vistas
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

    



// Render the login template
app.get('/login',
  function(req, res){
    res.render('login', { env: process.env });
  });

// // Perform session logout and redirect to homepage
// app.get('/logout', function(req, res){
//   req.logout();
//   res.redirect('/');
// });

// Perform the final stage of authentication and redirect to '/user'
app.get('/callback',
  interfaceUSR.passport.authenticate('auth0', { failureRedirect: '/fail' }),
  function(req, res) {
    res.redirect(req.session.returnTo || '/config');
  });





// formulario de inserción de noticia con imagen
app.post('/config/uploadNoticiaImage', ensureLoggedIn, function(req, res, next) {
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
        req.body.portada,   
        req.body.portadaZona,   
        req.body.publirep, 
        function(){
          console.log("insertada noticia");
        });
    });
    interfaceIMG.guardarImagen(false, req.file.path, target_path, interfaceIMG.putAspectRatioThreeOnepointFive,
    function(){
      interfaceDB.crearObjetoNumAnunciosNoticias(interfaceDB.objetoIds.id_municipio, function(){
        console.log("uploadNoticiaImage");
        interfaceDB.datosIniciales(interfaceDB.objetoIds.id_municipio);
        res.redirect("/config/noticias#insertar");
      });
    },
    function(){
      res.render('error' + err);   // Manejar aqui error de escritura 
    });
  });
});

app.post('/uploadUserImage', ensureLoggedIn, function (req, res, next) {
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
    var extension = req.file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)[1];
    interfaceDB.obtenerIdMunicipioNombre(req.body.municipio, function(){
      interfaceDB.insertarCliente(
        req.body.name, 
        interfaceDB.objetoIds.id_municipio,
        req.body.telefono, 
        req.body.email, 
        req.body.web,
        req.body.portada,  
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
                interfaceDB.crearObjetoNumAnunciosNoticias(interfaceDB.objetoIds.id_municipio, function() {
                  console.log("uploadUserImage");
                  interfaceDB.datosIniciales(interfaceDB.objetoIds.id_municipio);               
                });
              });
          });
        });    
    });
    var funcionAspectRatio;
    if(req.body.tamnyo_add == '1x1' || req.body.tamnyo_add == '1x2') {
      funcionAspectRatio = interfaceIMG.putAspectRatioMiniumImageClient;
    } else if(req.body.tamnyo_add == '2x4') {
      funcionAspectRatio = interfaceIMG.putAspectRatioThreeOnepointFive; 
    }
    var target_path = './uploads/' + req.file.originalname; // nombre original del archivo
    interfaceIMG.guardarImagen(true, req.file.path, target_path, funcionAspectRatio,
    function(){
      res.redirect("/config/clientes#insertar");
    },
    function(){
      res.render('error' + err);   // Manejar aqui error de escritura 
    });
  });
});

/* MODIFICAR CLIENTES */
app.post('/config/modificarCliente', ensureLoggedIn, function (req, res, next) {
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
        req.body.portada,  
        function(){
          if(req.file) {
            interfaceDB.obtenerIdClienteNombre(req.body.name, 
              function() {
                interfaceDB.modificarLogo(
                  'uploads/'+req.file.originalname, 
                  req.file.originalname, 
                  req.file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)[1],
                  req.body.tamnyo_add,
                  interfaceDB.objetoIds.id_cliente, 
                  function(){
                    // console.log("llegue"); // finalizada inserción                  
                  });
                  var target_path = './uploads/' + req.file.originalname; // nombre original del archivo
                  interfaceIMG.guardarImagen(true, req.file.path, target_path, funcionAspectRatio,
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
              interfaceDB.crearObjetoNumAnunciosNoticias(interfaceDB.objetoIds.id_municipio, function(){
                console.log('modificarCliente');
                interfaceDB.datosIniciales(interfaceDB.objetoIds.id_municipio);
                res.redirect("/config/clientes#modificar");
              });
            });
            // gestionar el error de falta de imagen
            // console.log(req.body)
          }
        });  
    });
  });
});

/* MODIFICAR NOTICIAS */
app.post('/config/modificarNoticia', ensureLoggedIn, function (req, res, next) {
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
      interfaceIMG.guardarImagen(false, req.file.path, target_path, interfaceIMG.putAspectRatioThreeOnepointFive,
        function(){}, function(){
          res.render('error' + err);   // Manejar aqui error de escritura 
      });
    } else {
      target_path = req.body.old_logo;
    }
    interfaceDB.obtenerIdMunicipioNombre(req.body.municipio, function(){
      interfaceDB.modificarNoticia(
        req.body.id_noticia,
        req.body.titular, 
        req.body.contenido, 
        target_path, 
        req.body.fuenteEnlace, 
        req.body.fuenteNombre, 
        req.body.fecha, 
        interfaceDB.objetoIds.id_municipio,
        req.body.portada,  
        req.body.portadaZona,  
        req.body.publirep,  
        function(){
          interfaceDB.crearObjetoNumAnunciosNoticias(interfaceDB.objetoIds.id_municipio, function(){
            console.log('modificarNoticia');
            interfaceDB.datosIniciales(interfaceDB.objetoIds.id_municipio);
            res.redirect("/config/noticias#modificar");
        });
      });  
    });
  });
});

app.get('/config/borrarCliente', ensureLoggedIn, function (req, res, next) {
  interfaceDB.eliminarLogo(req.query.id_cliente, function(){
    interfaceDB.eliminarCliente(req.query.id_cliente, function(){
      interfaceIMG.borrarImagen(req.query.img.replace("uploads/", "uploads/originalImages/"));
      interfaceIMG.borrarImagen(req.query.img);
      res.redirect("/config/clientes#modificar");
    });
  }); 
});

app.get('/config/borrarNoticia', ensureLoggedIn, function (req, res, next) {
  interfaceDB.eliminarNoticia(req.query.id_noticia, function(){
    interfaceIMG.borrarImagen(req.query.img);
    res.redirect("/config/noticias#modificar");
  });
});

/** BACKEND falta configurar inicio de sesion */
app.get('/config/clientes', ensureLoggedIn, function (req, res, next) {
  interfaceDB.resetArrays();
   var order = req.query.ordenar ? req.query.ordenar : "id_cliente";
   interfaceDB.crearObjetoMenu(false, false, function() {
      interfaceDB.crearObjetoTodosClientesOrdenado(false, order, function() {
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

app.get('/config/noticias', ensureLoggedIn, function (req, res, next) {
  interfaceDB.resetArrays();
   var order = req.query.ordenar ? req.query.ordenar : "id_noticia";
   interfaceDB.crearObjetoMenu(false, false, function() {
      interfaceDB.crearObjetoTodasNoticias(false, order, function() {
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


app.get('/config/activarDesactivarNoticia', ensureLoggedIn, function (req, res, next) {
  interfaceDB.activarDesactivarNoticia(req.query.id_noticia, req.query.activar, function(){
    res.redirect("/config/noticias#modificar");  
  });
});

app.get('/config/activarDesactivarCliente', ensureLoggedIn, function (req, res, next) {
  interfaceDB.activarDesactivarCliente(req.query.id_cliente, req.query.activar, function(){
    res.redirect("/config/clientes#modificar");  
  });
});

app.get('/config', ensureLoggedIn, function (req, res, next) {
   interfaceDB.crearObjetoMenu(false, false,  function() {
    var objectShow = {}
    objectShow.menu = interfaceDB.objetoMenu;
      res.render('indexBackend', objectShow);
    }); // creamos objeto menu
});

// PORTADA falta definir la estructura para los elementos de portada en la BD y renderizarla con jade
app.get("/",function(req,res){
  
      // interfaceDB.crearObjetoNumAnunciosNoticias(3, function(){
      //   interfaceDB.datosIniciales(3);
      // });
  interfaceDB.resetArrays();
  interfaceDB.crearObjetoMenu(true, true, function() {
    var objectShow = {};
    objectShow.menu = interfaceDB.objetoMenu;
    interfaceDB.crearObjetoTodosClientesOrdenado(true, 'id_cliente',  function(){
      interfaceDB.crearObjetoTodasNoticias(true, 'id_noticia', function(){
        objectShow.clients2x4 = interfaceDB.arrayClientes2x4;
        // objectShow.clients1x1 = interfaceDB.arrayClientes1x1;
        objectShow.clients1x2 = interfaceDB.arrayClientes1x2;
        objectShow.noticias = interfaceDB.arrayNoticias;
        console.log("noticias /");
        console.log(objectShow.arrayNoticias);
        objectShow.clients1x1Noticias = funAux.partirArrayClientes1x1(interfaceDB.arrayClientes1x1, interfaceDB.arrayNoticias);
        objectShow.publireportaje = interfaceDB.publireportaje;
        res.render('indexSearch2', objectShow);
      });
    });
  }); // creamos objeto menu
});

app.get('/show', function(req, res) {
  interfaceDB.resetArrays();
  interfaceDB.crearObjetoMenu(true, true, function() {
    var objectShow = {};
    objectShow.menu = interfaceDB.objetoMenu;
    interfaceDB.crearObjetoCuerpoMunicipio({id_municipio : req.query.id}, function(){
      interfaceDB.crearobjetoCuerpoNoticias({id_municipio:req.query.id}, {action:true}, function(){
        objectShow.clients2x4 = interfaceDB.arrayClientes2x4;
        // objectShow.clients1x1 = interfaceDB.arrayClientes1x1;
        objectShow.clients1x2 = interfaceDB.arrayClientes1x2;
        objectShow.noticias = interfaceDB.arrayNoticias;
        console.log("noticias /show");
        console.log(objectShow.arrayNoticias);
        objectShow.clients1x1Noticias = funAux.partirArrayClientes1x1(interfaceDB.arrayClientes1x1, interfaceDB.arrayNoticias);
        objectShow.publireportaje = interfaceDB.publireportaje;
        res.render('indexSearch2', objectShow);
      });
    });
  }); // creamos objeto menu
});

app.get('/showZona', function(req, res) {
  interfaceDB.resetArrays();
  interfaceDB.crearObjetoMenu(true, true, function() {
    var objectShow = {};
    objectShow.menu = interfaceDB.objetoMenu;
    interfaceDB.crearObjetoCuerpoMunicipio({id_zona : req.query.id}, function(){
      interfaceDB.crearobjetoCuerpoNoticias({id_zona:req.query.id}, {action:true}, function(){
        objectShow.clients2x4 = interfaceDB.arrayClientes2x4;
        // objectShow.clients1x1 = interfaceDB.arrayClientes1x1;
        objectShow.clients1x2 = interfaceDB.arrayClientes1x2;
        objectShow.noticias = interfaceDB.arrayNoticias;
        console.log("noticias /showZona");
        console.log(objectShow.arrayNoticias);
        objectShow.clients1x1Noticias = funAux.partirArrayClientes1x1(interfaceDB.arrayClientes1x1, interfaceDB.arrayNoticias);
        objectShow.publireportaje = interfaceDB.publireportaje;
        res.render('indexSearch2', objectShow);
      });
    });
  }); // creamos objeto menu
});




app.get('/quienesSomos', function(req, res) {
  interfaceDB.resetArrays();
  interfaceDB.crearObjetoMenu(true, true, function() {
    var objectShow = {};
    objectShow.menu = interfaceDB.objetoMenu;
    objectShow.titulo = "¿Quiénes somos?";
    objectShow.contenido = funAux.Explicaciones.quienesSomos;
    res.render('explicacion', objectShow);
  }); // creamos objeto menu
});



app.get('/news', function(req, res) {
  interfaceDB.resetArrays();
  interfaceDB.crearObjetoMenu(true, true, function() {
    var objectShow = {}
    objectShow.menu = interfaceDB.objetoMenu;
    objectShow.municipio = req.query.id_municipio
    objectShow.id_noticia = req.query.id_noticia
    interfaceDB.crearObjetoCuerpoMunicipio({id_municipio: req.query.id_municipio}, function(){
      interfaceDB.crearobjetoCuerpoNoticias(
        {id_municipio : req.query.id_municipio},
        {action:false, id_noticia:objectShow.id_noticia}, 
        function(){
          objectShow.clients2x4 = interfaceDB.arrayClientes2x4;
          objectShow.clients1x1 = interfaceDB.arrayClientes1x1;
          objectShow.clients1x2 = interfaceDB.arrayClientes1x2;
          objectShow.noticias = interfaceDB.arrayNoticias.slice();
          console.log( interfaceDB.arrayNoticias.length)
          interfaceDB.arrayNoticias.shift();
          // interfaceDB.arrayNoticias.shift();
          console.log( interfaceDB.arrayNoticias.length)
          objectShow.clients1x1Noticias = funAux.partirArrayClientes1x1(interfaceDB.arrayClientes1x1, interfaceDB.arrayNoticias);
          console.log(objectShow.clients1x1Noticias)
          res.render('indexNews', objectShow);
        });
    });
  }); // creamos objeto menu
});


var port = 8081;

app.listen(port, function () {
  console.log('Example app listening on port ' + port +'!');
});




