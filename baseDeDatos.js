(function(interfaceDB){
  
  interfaceDB.objetoIds = {
    id_cliente: "",
    id_zona: "",
    id_municipio: ""
  }
  
  interfaceDB.arrayClientes = [];
  
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
  

  
  interfaceDB.crearObjetoCuerpoMunicipio = function(_id_municipio, callback) {
    var completed = false;
    var i = 0;
    var query = 'Select clientes.id_cliente, clientes.nombre, logos.ruta From `clientes` inner join logos on ' +  
    'clientes.id_cliente = logos.id_cliente ' +
    'where id_municipio = ' + _id_municipio + ';';
    // console.log(query);
     interfaceDB.connection.query(query, function(err, rows, fields) {
      if (!err) {
        for(var key in rows) {
          console.log("iter")
          i++;
          if(!(i<rows.length)) {
            completed = true;
          }
        interfaceDB.arrayClientes.push({
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
    var query = 'INSERT INTO `clientes` (`nombre`, `id_zona`, `id_municipio`) ' +  
      'VALUES ("' + _nombre + '", 1 ,  ' + _municipio + ');';
    
     interfaceDB.connection.query(query, function(err, rows, fields) {
      if (!err) {
        callback();
      } else {
        console.log('Error en la insercion del cliente.');
      }
    });
    
  };
  
  interfaceDB.insertarLogo = function(_ruta, _nombre_archivo, _extension, _id_cliente, callback) {
    var query = 'INSERT INTO `logos`(`ruta`, `nombre_archivo`, `extension`, `id_cliente`)' +
      ' VALUES ("' + _ruta + 
        '" , "' + _nombre_archivo +
        '" , "' + _extension + 
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
    console.log(query)
     interfaceDB.connection.query(query, function(err, rows, fields) {
      if (!err) {
        console.log(rows[0].id_municipio);
        interfaceDB.objetoIds.id_municipio = rows[0].id_municipio;
        callback();
      } else {
        console.log('Error en obtener el id municipio.');
      }
    });
  };
  
  return interfaceDB;
})(typeof exports === "undefined" ? interfaceDB = {} : exports);
