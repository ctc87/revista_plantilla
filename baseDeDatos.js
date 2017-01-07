(function(interfaceDB){
  
  interfaceDB.objetoIds = {
    id_cliente: "",
    id_zona: "",
    id_municipio: "",
    id_noticia: ""
  }
  
  interfaceDB.arrayClientes2x4 = [];
  interfaceDB.arrayClientes1x2 = [];
  interfaceDB.arrayClientes1x1 = [];
  interfaceDB.arrayNoticias = [];
  
  interfaceDB.resetArrays = function() {
    interfaceDB.arrayClientes2x4 = [];
    interfaceDB.arrayClientes1x2 = [];
    interfaceDB.arrayClientes1x1 = [];
    interfaceDB.arrayNoticias = [];
  }
  
  var mysql = require('mysql'); // librería mysql
  interfaceDB.objetoMenu = {"arrayMenu":[]};
  interfaceDB.connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'ctc87',
    password : '',
    database : 'revista'
  });

  /**
   * Conexión a la base de datos 
   */
  interfaceDB.connection.connect(function(err){
    if(!err) {
        console.log("Database is connected ... nn");    
    } else {
        console.log("Error connecting database ... nn");    
    }
  });
  

  /**
   * Crea un objeto para los menus para recorrelo desde la vista 
   */
  interfaceDB.crearObjetoMenu = function(callback) {
  interfaceDB.objetoMenu = {"arrayMenu":[]};
  var completed = false;
  var i = 0;
    interfaceDB.connection.query('SELECT * from zonas', function(err, rows, fields) {
      if (!err) {
        for (var key in rows) {
          i++;
          if(!(i<rows.length)) {
            completed = true;
          }
          var subObjetoMenu = { // estructura del objeto
            "zona":"",
            "municipios":[]
          };
          subObjetoMenu.zona = rows[key].nombre_zona;
          subObjetoMenu.municipios = crearArrayMunicipios(rows[key].id_zona, callback, completed);
          interfaceDB.objetoMenu.arrayMenu.push(subObjetoMenu);
        } 
      } else {
        console.log('Error en la consulta de zonas.');
      }
    });
  }
  
   /**
   * Crea un array con los municipios de la zona pasada por parámetro
   */
  var crearArrayMunicipios = function(id_zona, callback, completed) {
    var arrayMunicipios = [];
    var query = 'SELECT * from municipios where id_zona = ' + id_zona + ';';
    interfaceDB.connection.query(query, function(err, rows, fields) {
      // connection.end();
      if (!err) {
        for (var key in rows) {
          var municipio = {};
          municipio.nombre = rows[key].nombre_municipio
          municipio.id = rows[key].id_municipio
          arrayMunicipios.push(municipio);
        } 
        if(completed)
          callback();
      } else {
        console.log('Error en la consulta de municipios.');
      }
    });
    return arrayMunicipios;
  }
  
  function resumirNoticia(_noticia, _link) {
    var matching = _noticia.match(/\<p\>(.*)\<\/p\>/)
    return '<p>' + matching[1] + '<a href="' + _link + '"> Leer m&aacute;s...</a></p>';
  }
  
  interfaceDB.crearobjetoCuerpoNoticias = function(_id_municipio, _noResumen,  callback) {
    var query = 'Select * FROM `noticias` ' +  
    'where id_municipio = ' + _id_municipio + ';';
    var completed = false;
    var i = 0;
    interfaceDB.connection.query(query, function(err, rows, fields) {
      if (!err) {
        for(var key in rows) {
          i++;
          if(!(i<rows.length)) {
            completed = true;
          }
          var link = '/news?id_municipio=' + rows[key].id_municipio + '&id_noticia=' + rows[key].id_noticia;
          if(_noResumen.action) {
            var contenido = resumirNoticia(rows[key].contenido,link)
          } else {
            var contenido = _noResumen.id_noticia != rows[key].id_noticia ? resumirNoticia(rows[key].contenido,link) : rows[key].contenido;
          }
          interfaceDB.arrayNoticias.push({
            id_noticia: rows[key].id_noticia,
            id_municipio: rows[key].id_municipio,
            titular: rows[key].titular,
            fecha: rows[key].fecha,
            imagen: rows[key].ruta_foto,
            fuente_enclace: rows[key].fuente_enclace,
            fuente_nombre: rows[key].fuente_nombre,
            contenido: contenido
          });
        } 
        if(completed)
          callback();
      } else {
        console.log('Error en la consulta de noticias.');
      }
    });
  }
  
  interfaceDB.crearObjetoCuerpoMunicipio = function(_id_municipio, callback) {
    var completed = false;
    var i = 0;
    var query = 'Select clientes.id_cliente, clientes.nombre, logos.ruta, logos.tamanyo_formato From `clientes` inner join logos on ' +  
    'clientes.id_cliente = logos.id_cliente ' +
    'where id_municipio = ' + _id_municipio + ';';
     interfaceDB.connection.query(query, function(err, rows, fields) {
      if (!err) {
        for(var key in rows) {
          i++;
          if(!(i<rows.length)) {
            completed = true;
          }
        var arrayAux = [];
        
        if(rows[key].tamanyo_formato == "2x4")
          arrayAux = interfaceDB.arrayClientes2x4;
        else if(rows[key].tamanyo_formato == "1x2")
          arrayAux = interfaceDB.arrayClientes1x2;
        else if(rows[key].tamanyo_formato == "1x1")
          arrayAux = interfaceDB.arrayClientes1x1;
        
        arrayAux.push({
          id_cliente: rows[key].id_cliente,
          nombre: rows[key].nombre,
          logo: rows[key].ruta,
          emails:crearArrayMails(rows[key].id_cliente, completed, callback),
          telefonos:['605678678', '689907654']
        });
        }

      } else {
        console.log('Error en la consulta de clientes.');
      }
    });
    
  }
  
  
    var crearArrayMails = function(_id_cliente, completed, callback) {
    var arrayMails = [];
    var queryMails = 'Select mail from emails where id_cliente = ' + _id_cliente;
    interfaceDB.connection.query(queryMails, function(err, mails, fields) {
      if (!err) {
        for(var j = 0; j < mails.length; j++) {
          arrayMails.push(mails[j].mail)
        }
        if(completed) {
          callback();
          console.log('completed'); 
        }
      } else {
        console.log('Error en la obtención de los emails.');
      }
    });
    return arrayMails;
  }
  
  interfaceDB.crearObjetoCuerpoZona = function(_id_zona, callback) {
  }
  
  interfaceDB.insertarEmails = function(_emails, _id_cliente, callback) {
    var query = 'INSERT INTO `emails`(`id_cliente`, `mail`) VALUES ';
    for(var i = 0; i < _emails.length; i++) {
      if(i != _emails.length - 1)
        query += '('+ _id_cliente +', "'+ _emails[i] +'"), ';
      else 
        query += '('+ _id_cliente +', "'+ _emails[i] +'") ';
    }
     interfaceDB.connection.query(query, function(err, rows, fields) {
      if (!err) {
        callback();
      } else {
        console.log('Error en la insercion de los emails.');
      }
    });
  }
  
  
  interfaceDB.insertarCliente  = function(_nombre, _municipio, callback) {
    var query = 'INSERT INTO `clientes` (`nombre`, `id_municipio`) ' +  
      'VALUES ("' + _nombre + '",  ' + _municipio + ');';
    
     interfaceDB.connection.query(query, function(err, rows, fields) {
      if (!err) {
        callback();
      } else {
        console.log('Error en la insercion del cliente.');
      }
    });
    
  };
  
  interfaceDB.insertarNoticia = function(_titular, _contenido, _imagen, _enlaceFuente, _nombreFuente, _fecha, _municipio, callback) {
    var query = 'INSERT INTO `noticias`(`fecha`, `fuente_nombre`, `fuente_enclace`, `titular`, `contenido`, `ruta_foto`, `id_municipio`)' +
      ' VALUES ("' + _fecha + 
        '" , "' + _nombreFuente +
        '" , "' + _enlaceFuente + 
        '" , "' + _titular + 
        '" , \'' + _contenido + 
        '\' , "' + _imagen + 
        '" ,' + _municipio + ');'; 
    
    console.log('query not insert', query);
        
   interfaceDB.connection.query(query, function(err, rows, fields) {
      if (!err) {
        if(callback)
          callback();
      } else {
        console.log('Error en la insercion de la noticia.');
      }
    });
  }
  
  interfaceDB.insertarLogo = function(_ruta, _nombre_archivo, _extension, _tamanyo_formato, _id_cliente, callback) {
    var query = 'INSERT INTO `logos`(`ruta`, `nombre_archivo`, `extension`,`tamanyo_formato`, `id_cliente`)' +
      ' VALUES ("' + _ruta + 
        '" , "' + _nombre_archivo +
        '" , "' + _extension + 
        '" , "' + _tamanyo_formato + 
        '" ,' + _id_cliente + ');';
        
   interfaceDB.connection.query(query, function(err, rows, fields) {
      if (!err) {
        if(callback)
          callback();
      } else {
        console.log('Error en la insercion del logo.');
      }
    });
  }
  
  interfaceDB.obtenerIdClienteNombre = function(_nombre, callback) {
    var query = 'Select id_cliente From `clientes` where nombre = "' + _nombre + '";';
    
     interfaceDB.connection.query(query, function(err, rows, fields) {
      if (!err) {
        console.log("idecliente:  ",  rows)
        interfaceDB.objetoIds.id_cliente = rows[0].id_cliente;
        callback();
      } else {
        console.log('Error en obtener el id cliente.');
      }
    });
  }
  
  
  
  interfaceDB.obtenerIdMunicipioNombre = function(_nombre, callback) {
    var query = 'Select id_municipio From `municipios` where nombre_municipio = "' + _nombre + '";';
     interfaceDB.connection.query(query, function(err, rows, fields) {
      if (!err) {
        // console.log(rows[0].id_municipio);
        interfaceDB.objetoIds.id_municipio = rows[0].id_municipio;
        callback();
      } else {
        console.log('Error en obtener el id municipio.');
      }
    });
  };
  
  return interfaceDB;
})(typeof exports === "undefined" ? interfaceDB = {} : exports);
