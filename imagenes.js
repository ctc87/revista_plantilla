(function(interfaceIMG){
  
    var fs = require('fs'); // manejo sistea de ficheros
    var multer  = require('multer'); // subida de archivos al servidor
    var lwip = require("lwip");
    
    /* configuración de la subida de archivos para imagenes */
    // FALTA GESTIONAR EL TAMAÑO
    interfaceIMG.upload = multer({
      dest:'uploads/',
      inMemory: true, 
      fileFilter: function (req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Solo se aceptan imagnes como subida'));
        }
        cb(null, true);
      }
    }).single('file');
    
    
    interfaceIMG.putAspectRatioThreeOnepointFive = function(_orignial_img, _modified_img) {
      // manipualción de imagenes
        lwip.open(_orignial_img, function(err, image){
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
              .writeFile(_modified_img, function(err){
                // check err...
                // done.
              });
            } else {
              console.log('error en abrir la imagen', err);
            }
        });  
    }
    
    interfaceIMG.putAspectRatioMiniumImageClient = function(_orignial_img, _modified_img) {
      // manicpualción de imagenes
      
        lwip.open(_orignial_img, function(err, image){
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
              .writeFile(_modified_img, function(err){
                // check err...
                // done.
              });
            } else {
              console.log('error en abrir la imagen', err);
            }
        });  
    }

    interfaceIMG.guardarImagenOriginal = function(_tmp_path, _target_path, callback, errorCallback) {
        _target_path = _target_path.replace("./uploads/", "./uploads/originalImages/");
        var src = fs.createReadStream(_tmp_path); // creamos un buffer de lectura del archivo temporal subido
        var dest = fs.createWriteStream(_target_path); // fijamos un archivo de destino
        src.pipe(dest); // conectamos mediante una tuberia el buffer de entrada con el archivo de destino
        src.on('end', function() { // terminada lectura del archivo
          callback();
        });
        src.on('error', function(err) {
          errorCallback();
        }); 
    }
    
    interfaceIMG.guardarImagen = function(_tmp_path, _target_path, aspectRatioFunction, callback, errorCallback) {
        var src = fs.createReadStream(_tmp_path); // creamos un buffer de lectura del archivo temporal subido
        var dest = fs.createWriteStream(_target_path); // fijamos un archivo de destino
        src.pipe(dest); // conectamos mediante una tuberia el buffer de entrada con el archivo de destino
        src.on('end', function() { // terminada lectura del archivo
            interfaceIMG.guardarImagenOriginal(_tmp_path, _target_path, function(){
                fs.unlink(_tmp_path) // borramos temporal
                aspectRatioFunction(_target_path, _target_path);
                callback(); 
            } , function() {
                errorCallback();
            });
        });
        src.on('error', function(err) {
            errorCallback();
        });
    }
  
  return interfaceIMG;
})(typeof exports === "undefined" ? interfaceIMG = {} : exports);
