(function(AuxFunciones){
    // AuxFunciones.passport = require('passport');
    AuxFunciones.NUMERO_ANUNCIOS_1X1_FILA = 10;
    
    AuxFunciones.Explicaciones = {
        quienesSomos : "<p>Nuestra guía empresarial pretende servir de trampolín al comercio en general, " +
        "tanto a escala provincial (Santa Cruz de Tenerife) como municipal, proporcionando espacios de " +
        "encuentro para pequeños y medianos empresarios. Para ello, la Revista Digital de este 'hosting' " +
        "les ofrece la posibilidad de conocerse e intercambiar experiencias y productos. La idea es " +
        "potenciar la visibilidad de los negocios y la mutua colaboración entre empresas de diversos " +
        "sectores. La revista tiene periodicidad mensual y el espacio concedido dentro de ella a cada " +
        "negocio está redireccionado a una página web ubicada en la portada de la plataforma internacional " + 
        "<a href='tuislaenunclick.com'>tuislaenunclick.com</a>.</p>" +
        "<p>Para evitar competencia entre negocios de un mismo sector, nuestra guía empresarial no aloja a dos " +
        "negocios del mismo tipo dentro de una misma zona. El criterio de selección de las empresas de cada sector " + 
        "corre a cargo de nuestro equipo de profesionales. A escala provincial, la guía tendrá un máximo de 750 " +
        "miembros, pertenecientes a todos los sectores comerciales posibles, no estando incluidos los negocios " +
        "de Hostelería, que contarán con su propia Revista Digital. También, la guía incluye un servicio de " +
        "noticias actualizado diariamente y relacionado con el espacio donde los negocios desarrollan su actividad. " + 
        "Además, quienes formen parte de esta guía empresarial contarán con asistencia legal y técnica gratuita, " +
        "tanto telefónica como presencial.<p>"
    };
    
    AuxFunciones.partirArrayClientes1x1 = function(_array1x1, _arrayNoticias) { // obtenemos A 
        var arrayDeArrays = [];
        var objetoNoticasPublicidad = {};
        for(var i = 0; i < _array1x1.length; i++) {
            if(i % this.NUMERO_ANUNCIOS_1X1_FILA == 0) {
                var arrayActual = [];
                var objetoNoticasPublicidad = {};
                objetoNoticasPublicidad.anuncios = arrayActual;
                arrayDeArrays.push(objetoNoticasPublicidad);
            }
            arrayActual.push(_array1x1[i]);
        }
        if(_arrayNoticias.length <= arrayDeArrays.length)
            return this.menosNoticasQueClientes(_arrayNoticias.length, _array1x1, _arrayNoticias);
        return this.dosNoticiaPorTiraDeAnuncios(arrayDeArrays, _arrayNoticias);
        
    };
    
    
    
    
    /** Parte los anuncios en sub arrays para colocar un array de anuncios bajo cada noticia el ultimo se lleva el resto */
    AuxFunciones.menosNoticasQueClientes = function(_numNoticias, _arrayClientes, _arrayNoticias) {
        console.log("num noticias" + _numNoticias)
        var arrayDeArrays = [];
        var objetoNoticasPublicidad = {};
        var numAnunciosPorArray = Math.floor(_arrayClientes.length / _numNoticias);
        for(var i = 0; i < _arrayClientes.length; i++) {
            if(i % numAnunciosPorArray == 0 && i / numAnunciosPorArray < _numNoticias) {
                var arrayActual = [];
                var objetoNoticasPublicidad = {};
                objetoNoticasPublicidad.anuncios = arrayActual;
                arrayDeArrays.push(objetoNoticasPublicidad);
            }
            arrayActual.push(_arrayClientes[i]);
        }
        return this.unaNoticiaPorTiraDeAnuncios(arrayDeArrays, _arrayNoticias);
    }
    
  
    AuxFunciones.unaNoticiaPorTiraDeAnuncios = function(_arrayAnunciosNoticias, _arrayNoticias) {
        for(var i = 0; i < _arrayAnunciosNoticias.length; i++) {
            var array = [];
            array.push(_arrayNoticias[i])
            _arrayAnunciosNoticias[i].noticias = array;
        }
        return _arrayAnunciosNoticias;
    }
    
    AuxFunciones.dosNoticiaPorTiraDeAnuncios = function(_arrayAnunciosNoticias, _arrayNoticias) { 
        var noticiasContador = 0;
        for(var i = 0; i < _arrayAnunciosNoticias.length; i++) {
            var array = [];
            array.push(_arrayNoticias[noticiasContador++]);
            array.push(_arrayNoticias[noticiasContador++]);
            _arrayAnunciosNoticias[i].noticias = array;
        }
        var array = [];
        while(noticiasContador < _arrayNoticias.length)
            array.push(_arrayNoticias[noticiasContador++]);
        _arrayAnunciosNoticias[i] = {};
        _arrayAnunciosNoticias[i].noticias = array;
        return _arrayAnunciosNoticias;
    }
    
    return AuxFunciones;
})(typeof exports === "undefined" ? AuxFunciones = {} : exports);
