(function(interfaceDB){
  
  /** ATRIBUTOS DE LA CALSE */
  interfaceDB.objetoIds = {
    id_cliente: "",
    id_zona: "",
    id_municipio: "",
    id_noticia: ""
  }
  
  interfaceDB.numero = {};
  
  interfaceDB.arrayClientes = [];
  interfaceDB.arrayClientes2x4 = [];
  interfaceDB.arrayClientes1x2 = [];
  interfaceDB.arrayClientes1x1 = [];
  interfaceDB.arrayNoticias = [];
  
  /** RESETEO DE LOS ARRAYS */
  interfaceDB.resetArrays = function() {
    interfaceDB.arrayClientes = [];
    interfaceDB.arrayClientes2x4 = [];
    interfaceDB.arrayClientes1x2 = [];
    interfaceDB.arrayClientes1x1 = [];
    interfaceDB.arrayNoticias = [];
  }
  
/*******************CONEXION*******************/

  /** DATOS PARA CONEXION A LA BASE DE DATOS */
  var mysql = require('mysql'); // librería mysql
  interfaceDB.objetoMenu = {"arrayMenu":[]};
  interfaceDB.connection = mysql.createConnection({
    host     : '54.77.215.141',
    user     : 'tuperiod_revista',
    password : 'Dbz111187?',
    database : 'tuperiod_revista'
  });

/** CONEXION A LA BASE DE DATOS */

  interfaceDB.connection.connect(function(err){
    if(!err) {
        console.log("Database is connected ... nn" );    
    } else {
        console.log("Error connecting database ... nn" + err);    
    }
  });
  
/*******************RECUPERACIÓN DE DATOS*******************/

  /** RECUPERACIÓN DE DATOS ZONAS  
   *  Crea un objeto para los menus para recorrelo desde la vista con JADE 
   */
  interfaceDB.crearObjetoMenu = function(_agrupado, _menu, callback) {
    interfaceDB.objetoMenu = {"arrayMenu":[]};
    var completed = false;
    var i = 0;
    var query = _menu ? 'SELECT * FROM `zonas` INNER JOIN `municipios` ON zonas.id_zona = municipios.id_zona INNER JOIN clientes ON municipios.id_municipio = clientes.id_municipio GROUP BY zonas.id_zona;' : 'SELECT * from zonas';
    interfaceDB.connection.query(query, function(err, rows, fields) {
      if (!err) {
        for (var key in rows) {
          i++;
          if(!(i<rows.length)) {
            completed = true;
          }
          var subObjetoMenu = { // estructura del objeto
            "zona":"",
            "id_zona":"", 
            "municipios":[]
          };
          subObjetoMenu.zona = rows[key].nombre_zona;
          subObjetoMenu.id_zona = rows[key].id_zona;
          if(_agrupado)
            subObjetoMenu.municipios = crearArrayMunicipiosMenu(rows[key].id_zona, callback, completed, _menu);
          else
            subObjetoMenu.municipios = crearArrayMunicipios(rows[key].id_zona, callback, completed);
          interfaceDB.objetoMenu.arrayMenu.push(subObjetoMenu);
        } 
      } else {
        console.log('Error en la consulta de zonas.');
      }
    });
  }
  
  /** RECUPERACIÓN DE DATOS MUNICIPIOS  
   * Crea un array con los municipios de la zona pasada por parámetro agrupados de 5 en 5
   */    
  var crearArrayMunicipiosMenu = function(id_zona, callback, completed, _menu) {
    var arrayOfArrays = [];
    var query = _menu ? 'SELECT * FROM `municipios` INNER JOIN clientes ON municipios.id_municipio = clientes.id_municipio where id_zona = ' + id_zona + ' GROUP BY municipios.id_municipio;' : 'SELECT * from municipios where id_zona = ' + id_zona + ';';
    interfaceDB.connection.query(query, function(err, rows, fields) {
      // connection.end();
      if (!err) {
        var i = 0;
        var arrayMunicipios = [];
        for (var key in rows) {
          var municipio = {};
          municipio.nombre = rows[key].nombre_municipio
          municipio.id = rows[key].id_municipio
          arrayMunicipios.push(municipio);
          i++;
          if(i % 5 == 0 || i == rows.length) {
            arrayOfArrays.push(arrayMunicipios);
            arrayMunicipios = [];
          }
        } 
        if(completed)
          callback();
      } else {
        console.log('Error en la consulta de municipios.');
      }
    });
    return arrayOfArrays;
  }
  
  /** RECUPERACIÓN DE DATOS MUNICIPIOS  
   * Crea un array con los municipios de la zona pasada por parámetro
   */    
  var crearArrayMunicipios = function(id_zona, callback, completed) {
    var arrayMunicipios = [];
    var query = 'SELECT * from municipios where id_zona = ' + id_zona + ';';
    interfaceDB.connection.query(query, function(err, rows, fields) {
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
  /** Resumir una noticias   
   * Resume una noticia para moestrar solo su resumen en JADE.
   */   
  function resumirNoticia(_noticia, _link) {
    var matching = _noticia.match(/\<p(?:\s*class\=".*"\s*)?\>(.*)\<\/p\>/)
    return   matching ? '<p>' + matching[1] + '<a href="' + _link + '"> Leer m&aacute;s...</a></p>' : '<a href="' + _link + '"> Leer m&aacute;s...</a>';
  }
  
  
  /** RECUPERACIÓN DE DATOS NOTICIAS  
   * Crea un objeto con las noticias de un municipio determinado
   * --------------------> FALTA CAMBIAR PARA HACERLO POR ZONAS CON LA MISMA FUNCIÓN
   */    
  interfaceDB.crearobjetoCuerpoNoticias = function(_id, _noResumen,  callback) {
    var where;
    if(_id.id_zona) {
      where = 'inner join municipios on noticias.id_municipio = municipios.id_municipio where id_zona = ' + _id.id_zona + ';';
    } else if (_id.id_municipio) {
      where = 'where id_municipio = ' + _id.id_municipio + ';';
    }
    var query = 'Select * FROM `noticias` ' +  where;
    var completed = false;
    var i = 0;
    interfaceDB.connection.query(query, function(err, rows, fields) {
      if (!err) {
        if(rows.length < 1) {
          callback();
        }
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
            portada: rows[key].portada,
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
  
  /** RECUPERACIÓN DE DATOS NOTICIAS  
   * Crea un objeto con todas las noticias
   */    
  interfaceDB.crearObjetoTodasNoticias = function(_portada, _order, callback) {
    var query = 'Select * FROM `noticias` inner join `municipios` on noticias.id_municipio = municipios.id_municipio ';
    query += _portada ? 'where portada=true ' : ' ';
    query += 'ORDER BY ' + _order + ';';
    var completed = false;
    var i = 0;
    interfaceDB.connection.query(query, function(err, rows, fields) {
      if (!err) {
        if(rows.length < 1) {
          callback();
        }
        if(!_portada) {
          for(var key in rows) {
            i++;
            if(!(i<rows.length)) {
              completed = true;
            }
            interfaceDB.arrayNoticias.push({
              id_noticia: rows[key].id_noticia,
              id_municipio: rows[key].nombre_municipio,
              titular: rows[key].titular,
              fecha: rows[key].fecha,
              imagen: rows[key].ruta_foto,
              fuente_enclace: rows[key].fuente_enclace,
              fuente_nombre: rows[key].fuente_nombre,
              portada: rows[key].portada,
              contenido: rows[key].contenido
            });
          } 
        } else {
          for(var key in rows) {
            i++;
            if(!(i<rows.length)) {
              completed = true;
            }
            var link = '/news?id_municipio=' + rows[key].id_municipio + '&id_noticia=' + rows[key].id_noticia;
            var contenido = resumirNoticia(rows[key].contenido,link)
            interfaceDB.arrayNoticias.push({
              id_noticia: rows[key].id_noticia,
              id_municipio: rows[key].id_municipio,
              titular: rows[key].titular,
              fecha: rows[key].fecha,
              imagen: rows[key].ruta_foto,
              fuente_enclace: rows[key].fuente_enclace,
              fuente_nombre: rows[key].fuente_nombre,
              portada: rows[key].portada,
              contenido: contenido
            });
          } 
        }
        if(completed)
          callback();
      } else {
        console.log('Error en la consulta de todas noticias.');
      }
    });
  }
  
  /** RECUPERACIÓN DE DATOS CLIENTES  
   * Crea un objeto con tods los clientes para el backend
   */  
    interfaceDB.crearObjetoTodosClientesOrdenado = function(_portada, _order, callback) {
    var i = 0;
    var query = 'Select clientes.id_cliente, clientes.portada, municipios.nombre_municipio, clientes.nombre, clientes.mail, clientes.telefono, clientes.web, logos.ruta, logos.tamanyo_formato ' +
    'From `clientes` inner join logos on ' +  
    'clientes.id_cliente = logos.id_cliente ' +
    'inner join `municipios` on clientes.id_municipio = municipios.id_municipio ';
    query += _portada ? ' where clientes.portada = true ' : ' ';
    query += 'ORDER BY ' + _order + ';';
     interfaceDB.connection.query(query, function(err, rows, fields) {
      if (!err) {
        if(rows.length < 1) {
          callback();
        }
        if(!_portada) {
          for(var key in rows) {
            i++;
            interfaceDB.arrayClientes.push({
              id_cliente: rows[key].id_cliente,
              id_municipio: rows[key].nombre_municipio,
              nombre: rows[key].nombre,
              logo: rows[key].ruta,
              formato: rows[key].tamanyo_formato,
              mail: rows[key].mail,
              telefono: rows[key].telefono,
              portada: rows[key].portada,
              web: rows[key].web
            });
            if(!(i<rows.length)) {
              callback();
            }
          
          }
        } else {
          for(var key in rows) {
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
            mail: rows[key].mail,
            telefono: rows[key].telefono,
            portada: rows[key].portada,
            web: rows[key].web
          });
            i++;
            if(!(i<rows.length)) {
              callback();
            }
          }
        }

      } else {
        console.log('Error en la consulta de clientes para su listado en backend.');
      }
    });
    
  }
  
  /** RECUPERACIÓN DE DATOS CLIENTES 
   * Crea un objeto con tdos los clientes clasificados por sus tamaños de ADS
   * --------------------> FALTA CAMBIAR PARA HACERLO POR ZONAS CON LA MISMA FUNCIÓN
   */   
  interfaceDB.crearObjetoCuerpoMunicipio = function(_id, callback) {
    var completed = false;
    var i = 0;
    var where;
    if(_id.id_zona) {
      where = 'inner join municipios on clientes.id_municipio = municipios.id_municipio where id_zona = ' + _id.id_zona + ';';
    } else if (_id.id_municipio) {
      where = 'where id_municipio = ' + _id.id_municipio + ';';
    }
    var query = 'Select clientes.id_cliente, clientes.nombre, clientes.portada, clientes.mail, clientes.telefono, clientes.web, logos.ruta, logos.tamanyo_formato From `clientes` inner join logos on ' +  
    'clientes.id_cliente = logos.id_cliente ' + where;
     interfaceDB.connection.query(query, function(err, rows, fields) {
      if (!err) {
        if(rows.length < 1) {
          callback();
        }
        for(var key in rows) {
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
          mail: rows[key].mail,
          telefono: rows[key].telefono,
          portada: rows[key].portada,
          web: rows[key].web
        });
          i++;
          if(!(i<rows.length)) {
            callback();
          }
        }

      } else {
        console.log('Error en la consulta de clientes.');
      }
    });
    
  }

  
  interfaceDB.crearObjetoCuerpoZona = function(_id_zona, callback) {
  }
  
  /** RECUPERACIÓN DE DATOS CLIENTE
   * obtiene el id de un cliente a partir de su nombre
   */     
  interfaceDB.obtenerIdClienteNombre = function(_nombre, callback) {
    var query = 'Select id_cliente From `clientes` where nombre = "' + _nombre + '";';
    
     interfaceDB.connection.query(query, function(err, rows, fields) {
      if (!err) {
        interfaceDB.objetoIds.id_cliente = rows[0].id_cliente;
        callback();
      } else {
        console.log('Error en obtener el id cliente.');
      }
    });
  }
  
  /** RECUPERACIÓN DE DATOS CLIENTE
   * obtiene el id de un cliente a partir de su link uy su id municipio
   */     
  interfaceDB.obtenerIdClienteInicial = function(_web, _id_municipio, callback) {
    var query = 'Select id_cliente From `clientes` where web = "' + _web + '" and id_municipio = ' + _id_municipio + ';';
    
     interfaceDB.connection.query(query, function(err, rows, fields) {
      if (!err) {
        interfaceDB.objetoIds.id_cliente = rows[0].id_cliente;
        callback();
      } else {
        console.log('Error en obtener el id cliente.');
      }
    });
  }

  /** RECUPERACIÓN DE DATOS MUNICIPIO
   * obtiene el id de un municipio a partir de su nombre
   */   
  interfaceDB.obtenerIdMunicipioNombre = function(_nombre, callback) {
    var query = 'Select id_municipio From `municipios` where nombre_municipio = "' + _nombre + '";';
    interfaceDB.connection.query(query, function(err, rows, fields) {
      if (!err) {
        interfaceDB.objetoIds.id_municipio = rows[0].id_municipio;
        callback();
      } else {
        console.log('Error en obtener el id municipio.');
      }
    });
  };
  
/*******************INSERCIÓN DE DATOS*******************/

 /** FUNCION PARA INSERTAR DATOS INICIALES
  * Inserta datos iniciales
  * 
  */
  interfaceDB.datosIniciales = function(_id_municipio) {
    if(interfaceDB.numero.anuncios.de1x1 <= 0) {
      interfaceDB.insertarClienteInicial("1x1", _id_municipio, function(){
          if(interfaceDB.numero.anuncios.de1x2 <= 0){
             interfaceDB.insertarClienteInicial("1x2", _id_municipio, function(){
              if(interfaceDB.numero.anuncios.de2x4 <= 0) {
                interfaceDB.insertarClienteInicial("2x4", _id_municipio, function(){
                  // console.log("ins");
                });
              }
             });
          } else {
            if(interfaceDB.numero.anuncios.de2x4 <= 0) {
              interfaceDB.insertarClienteInicial("2x4", _id_municipio, function(){
                // console.log("ins");
              });
            }
          }
        })
    } else {
      if(interfaceDB.numero.anuncios.de1x2 <= 0){
         interfaceDB.insertarClienteInicial("1x2", _id_municipio, function(){
          if(interfaceDB.numero.anuncios.de2x4 <= 0) {
            interfaceDB.insertarClienteInicial("2x4", _id_municipio, function(){
              // console.log("ins");
            });
          }
         });
      } else {
        if(interfaceDB.numero.anuncios.de2x4 <= 0) {
          interfaceDB.insertarClienteInicial("2x4", _id_municipio, function(){
            // console.log("ins");
          });
        }
      }
    }
    
    if(interfaceDB.numero.noticias <= 0) {
      console.log("not menor que 0")
      interfaceDB.insertarNoticia(
        "Tú Publi Reportaje Aquí",
        '<p>Contrata tu publireportaje para anunciarte en este sitio.</p>' ,
        "./uploads/noticias/publirreportaje.jpg",
        "#",
        "publireportaje",
        "2017-02-05 23:15",
        _id_municipio,
        false,
        function() {
          // console.log("insertada noticia inicial");
        }
      );
    }
  }
  
  /** INSERTAR CLIENTE INICIAL
   * Inserta un cliente inicial de prueba de tamaño t
   */ 
    interfaceDB.insertarClienteInicial  = function(_t, _id_municipio, callback) {
      interfaceDB.insertarCliente(" ", _id_municipio, 666666666, "email@email.com", "#", false, function(){
        interfaceDB.obtenerIdClienteInicial("#", _id_municipio, function(){
          interfaceDB.insertarLogo('uploads/anuncia_aqui.png', "anuncia_aqui.png", "png", _t, interfaceDB.objetoIds.id_cliente, callback)
        });
      }); 
    }
    
  /** CREAR OBJETO NUM NOTICIAS Y ANUNCIOS 
   * Funcion que crea el objeto con el numero de anuncios y noticias de un municipio
   *  
   */
  
  interfaceDB.crearObjetoNumAnunciosNoticias = function(_id_municipio, callback) {
    interfaceDB.numero.anuncios = {};
    var queryAnunciosBase = 'SELECT COUNT( clientes.id_cliente ) AS num ' +
    'FROM  `clientes`' + 
    'INNER JOIN  `logos` ON clientes.id_cliente = logos.id_cliente ' +
    'WHERE clientes.id_municipio =' + _id_municipio +
    ' AND logos.tamanyo_formato = '; 
    
    var queryNoticias = 'SELECT COUNT( id_noticia ) AS num ' +
    'FROM noticias ' +
    'WHERE id_municipio = ' + _id_municipio;
    console.log(queryAnunciosBase + "'2x4';");
    interfaceDB.connection.query(queryAnunciosBase + "'2x4';", function(err, rows, fields) {
      if (!err) {
        interfaceDB.numero.anuncios.de2x4 = rows[0].num;
          interfaceDB.connection.query(queryAnunciosBase + "'1x2';", function(err, rows, fields) {
            if (!err) {
              interfaceDB.numero.anuncios.de1x2 = rows[0].num;
                interfaceDB.connection.query(queryAnunciosBase + "'1x1';", function(err, rows, fields) {
                  if (!err) {
                    interfaceDB.numero.anuncios.de1x1 = rows[0].num;
                        interfaceDB.connection.query(queryNoticias, function(err, rows, fields) {
                          if (!err) {
                            interfaceDB.numero.noticias = rows[0].num
                            // console.log('contado');
                            console.log(interfaceDB.numero);
                            callback();
                          } else {
                            console.log('Error contando noticias.');
                          }
                        });
                  } else {
                    console.log('Error contando anuncis 1x1.');
                  }
                });
            } else {
              console.log('Error contando anuncis 1x2.');
            }
          });
      } else {
        console.log('Error contando anuncis 2x4.');
      }
    });
    
  }
  


  /** INSERCIÓN DE DATOS CLIENTES  
   *  Inserta un cliente nuevo
   */  
  interfaceDB.insertarCliente  = function(_nombre, _municipio, _telefono, _mail, _web, _portada, callback) {
    var query = 'INSERT INTO `clientes` (`nombre`, `id_municipio`, `telefono`, `mail`, `web`, `portada`) ' +  
      'VALUES ("'  + _nombre + 
              '",' + _municipio + 
              ',' + _telefono + 
              ',"' + _mail +  
              '","' + _web + 
              '",' + _portada + ');';
    interfaceDB.connection.query(query, function(err, rows, fields) {
      if (!err) {
        callback();
      } else {
        console.log('Error en la insercion del cliente.');
      }
    });
    
  };
  
  /** INSERCIÓN DE DATOS NOTICIAS  
   *  Inserta una noticia nueva
   */    
  interfaceDB.insertarNoticia = function(_titular, _contenido, _imagen, _enlaceFuente, _nombreFuente, _fecha, _municipio, _portada, callback) {
    _titular = _titular.replace(/\"/g, '\\\"');
    _contenido = _contenido.replace(/\'/g, '\\\'');
    var query = 'INSERT INTO `noticias`(`fecha`, `fuente_nombre`, `fuente_enclace`, `titular`, `contenido`, `ruta_foto`, `id_municipio`, `portada`)' +
      ' VALUES ("' + _fecha + 
        '" , "' + _nombreFuente +
        '" , "' + _enlaceFuente + 
        '" , "' + _titular + 
        '" , \'' + _contenido + 
        '\' , "' + _imagen + 
        '" ,' + _municipio + 
        ' ,' + _portada + ');'; 
    interfaceDB.connection.query(query, function(err, rows, fields) {
      if (!err) {
        if(callback)
          callback();
      } else {
        console.log('Error en la insercion de la noticia.');
      }
    });
  }
  
  /** INSERCIÓN DE DATOS LOGOS  
   *  Inserta información del logo de un cliente nuevo
   */    
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
  
/*******************MODIFICACIÓN DE DATOS*******************/
  /** MODICACIÓN DE DATOS CLIENTE  
   *  Modifica información de un cliente pasado como id
   */ 
  interfaceDB.modificarCliente  = function(_id_cliente, _nombre, _municipio, _telefono, _mail, _web, _portada, callback) {
     var query = 'UPDATE `clientes` SET ' +  
      'nombre = "'  + _nombre + 
      '", id_municipio = ' + _municipio + 
      ', telefono = ' + _telefono + 
      ', mail = "' + _mail + 
      '", web = "' + _web + 
      '" WHERE id_cliente = ' +  _id_cliente   + ';';
      
    interfaceDB.connection.query(query, function(err, rows, fields) {
      if (!err) {
        callback();
      } else {
        console.log('Error en la modificación del cliente.');
      }
    });
  }
  
  /** MODICACIÓN DE DATOS LOGOS  
   *  modifica la información del logo de un cliente pasado como id
   */    
  interfaceDB.modificarLogo = function(_ruta, _nombre_archivo, _extension, _tamanyo_formato, _id_cliente, callback) {
    var query = 'UPDATE `logos` SET ' +
        'ruta = "' + _ruta + 
        '" , nombre_archivo = "' + _nombre_archivo +
        '" , extension = "' + _extension + 
        '" , tamanyo_formato = "' + _tamanyo_formato + 
        '" WHERE id_cliente = ' + _id_cliente + ' ;';
        
    interfaceDB.connection.query(query, function(err, rows, fields) {
      if (!err) {
        if(callback)
          callback();
      } else {
        console.log('Error en la modificación del logo.');
      }
    });
  }  
  
  /** MODICACIÓN DE DATOS LOGOS  
   *  modifica la el tamaño del formato del logo de un cliente pasado como id
   */    
  interfaceDB.modificarTamanyoLogo = function(_tamanyo_formato, _id_cliente, callback) {
    var query = 'UPDATE `logos` SET ' +
        ' tamanyo_formato = "' + _tamanyo_formato + 
        '" WHERE id_cliente = ' + _id_cliente + ' ;';
    interfaceDB.connection.query(query, function(err, rows, fields) {
      if (!err) {
        if(callback)
          callback();
      } else {
        console.log('Error en la modificación del tamaño del formato del logo.');
      }
    });
  }
  
  /** MODIFICAR DE DATOS NOTICIAS  
   *  Modifica una noticia pasada como id
   */    
  interfaceDB.modificarNoticia = function(_id_noticia, _titular, _contenido, _imagen, _enlaceFuente, _nombreFuente, _fecha, _municipio, _portada, callback) {
    var query = 'UPDATE `noticias` SET ' +
      ' fecha = "' + _fecha + 
        '" , fuente_nombre = "' + _nombreFuente +
        '" , fuente_enclace = "' + _enlaceFuente + 
        '" , titular = "' + _titular + 
        '" , contenido = \'' +  _contenido +
        '\' , ruta_foto = "' + _imagen + 
        '" , id_municipio = ' + _municipio + 
        '" , porta = ' + _portada + 
        ' WHERE id_noticia =  ' + _id_noticia + ';'; 
    // console.log(query)
    interfaceDB.connection.query(query, function(err, rows, fields) {
      if (!err) {
        if(callback)
          callback();
      } else {
        console.log('Error en la modificación de la noticia.');
      }
    });
  }
  
/*******************ELIMINACIÓN DE DATOS*******************/
  /** ELIMINACIÓN DE DATOS CLIENTE  
   *  Elimina toda información de un cliente pasado como id
   */ 
  interfaceDB.eliminarCliente = function(_id_cliente, callback) {
    var query = 'DELETE FROM `clientes` WHERE id_cliente = ' + _id_cliente + ' ;';
    interfaceDB.connection.query(query, function(err, rows, fields) {
      if (!err) {
        if(callback)
          callback();
      } else {
        console.log('Error en la eliminación del cliente.');
      }
    });
  }
  
  /** ELIMINACIÓN DE DATOS LOGO  
   *  Elimina toda información del logo de un cliente pasado como id
   */ 
  interfaceDB.eliminarLogo = function(_id_cliente, callback) {
    var query = 'DELETE FROM `logos` WHERE id_cliente = ' + _id_cliente + ' ;';
    interfaceDB.connection.query(query, function(err, rows, fields) {
      if (!err) {
        if(callback)
          callback();
      } else {
        console.log('Error en la eliminación del logo.');
      }
    });
  }
  
  /** ELIMINACIÓN DE DATOS NOTICA  
   *  Elimina toda información del logo de un cliente pasado como id
   */ 
  interfaceDB.eliminarNoticia = function(_id_noticia, callback) {
    var query = 'DELETE FROM `noticias` WHERE id_noticia = ' + _id_noticia + ' ;';
    interfaceDB.connection.query(query, function(err, rows, fields) {
      if (!err) {
        if(callback)
          callback();
      } else {
        console.log('Error en la eliminación de la noticia.');
      }
    });
  }
  
  return interfaceDB;
})(typeof exports === "undefined" ? interfaceDB = {} : exports);
