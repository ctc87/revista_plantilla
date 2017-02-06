(function(interfaceIMG){
  
    var fs = require('fs'); // manejo sistea de ficheros
    var multer  = require('multer'); // subida de archivos al servidor
    var Jimp = require("jimp");
    /* configuración de la subida de archivos para imagenes */
    // FALTA GESTIONAR EL TAMAÑO
    interfaceIMG.upload = multer({
      dest:'uploads/',
      inMemory: true, 
      fileFilter: function (req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
            return cb(new Error('Solo se aceptan imagnes como subida'));
        }
        cb(null, true);
      }
    }).single('file');
    
    
    interfaceIMG.putAspectRatioThreeOnepointFive = function(_orignial_img, _modified_img) {
        Jimp.read(_orignial_img, function(err, image){
          if(!err) {
            var w = image.bitmap.width;
            var h = image.bitmap.height;
            var newH = (w / 3) * 1.5;
            this.contain(w, newH).write(_modified_img);
          } else {
            console.log('error en abrir la imagen', err);
          }
        });  
    }
    
    interfaceIMG.putAspectRatioMiniumImageClient = function(_orignial_img, _modified_img) {
        Jimp.read(_orignial_img, function(err, image){
          if(!err) {
            var w = image.bitmap.width;
            var h = image.bitmap.height;
            var newH = (w / 683) * 384;
            this.contain(w, newH).write(_modified_img);
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
    
    interfaceIMG.guardarImagen = function(_original, _tmp_path, _target_path, aspectRatioFunction, callback, errorCallback) {
        var src = fs.createReadStream(_tmp_path); // creamos un buffer de lectura del archivo temporal subido
        var dest = fs.createWriteStream(_target_path); // fijamos un archivo de destino
        src.pipe(dest); // conectamos mediante una tuberia el buffer de entrada con el archivo de destino
        src.on('end', function() { // terminada lectura del archivo
            if(_original) {
              interfaceIMG.guardarImagenOriginal(_tmp_path, _target_path, function(){
                   interfaceIMG.borrarImagen(_tmp_path); // borramos temporal
                  aspectRatioFunction(_target_path, _target_path);
                  callback(); 
              } , function() {
                  errorCallback();
              });
            } else {
              interfaceIMG.borrarImagen(_tmp_path); // borramos temporal
              aspectRatioFunction(_target_path, _target_path);
              callback();
            }
        });
        src.on('error', function(err) {
            errorCallback();
        });
    }
    
    interfaceIMG.borrarImagen = function(_img_path) {
      if(_img_path != 'uploads/originalImages/anuncia_aqui.png' && _img_path != 'uploads/anuncia_aqui.png' && _img_path != './uploads/noticias/publirreportaje.jpg') {
        console.log("borrando " + _img_path);
        fs.unlink(_img_path);
      } else  {
        console.log("no se borra " + _img_path ) 
      }
    }
  
  return interfaceIMG;
})(typeof exports === "undefined" ? interfaceIMG = {} : exports);
