(function(AuxFunciones){
    // AuxFunciones.passport = require('passport');
    AuxFunciones.NUMERO_ANUNCIOS_1X1_FILA = 10;
    
    AuxFunciones.Explicaciones = {
        quienesSomos : " QUIENES SOMOS SOMOS Aenean feugiat in ante et blandit. Vestibulum posuere molestie risus, ac interdum magna porta non. Pellentesque rutrum fringilla elementum. Curabitur tincidunt porta lorem vitae accumsan.Aenean feugiat in ante et blandit. Vestibulum posuere molestie risus, ac interdum magna porta non.ac interdum magna porta non. Pellentesque rutrum fringilla elementum. Curabitur tincidunt porta lorem vitae accumsan",
        revista : " ESTE PRODUCTO Aenean feugiat in ante et blandit. Vestibulum posuere molestie risus, ac interdum magna porta non. Pellentesque rutrum fringilla elementum. Curabitur tincidunt porta lorem vitae accumsan.Aenean feugiat in ante et blandit. Vestibulum posuere molestie risus, ac interdum magna porta non.ac interdum magna porta non. Pellentesque rutrum fringilla elementum. Curabitur tincidunt porta lorem vitae accumsan"
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
