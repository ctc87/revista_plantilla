-- Borramos la base de datos si existe
DROP DATABASE IF EXISTS revista;
-- creamos la base de datos
create DATABASE revista;

USE revista;




create table zonas (
    id_zona MEDIUMINT NOT NULL AUTO_INCREMENT,
    nombre_zona VARCHAR(200), 
    PRIMARY KEY (id_zona)
);


create table municipios(
    id_municipio MEDIUMINT NOT NULL AUTO_INCREMENT,
    id_zona MEDIUMINT NOT NULL,
    PRIMARY KEY (id_municipio),
    FOREIGN KEY (id_zona) REFERENCES zonas(id_zona)
);

create table clientes (
    id_cliente MEDIUMINT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(200),
    PRIMARY KEY (id_cliente),
    id_zona MEDIUMINT NOT NULL, -- solo en desarrollo
    id_municipio MEDIUMINT NOT NULL,
    FOREIGN KEY (id_zona) REFERENCES zonas(id_zona),
    FOREIGN KEY (id_municipio) REFERENCES municipios(id_municipio)
);

create table telefonos (
    id_telefono MEDIUMINT NOT NULL AUTO_INCREMENT,
    id_cliente MEDIUMINT NOT NULL,
    PRIMARY KEY (id_telefono),
    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente)
);

create table emails(
    id_mail MEDIUMINT NOT NULL AUTO_INCREMENT,
    id_cliente MEDIUMINT NOT NULL,
    PRIMARY KEY (id_mail),
    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente)
);

create table logos(
    id_logo MEDIUMINT NOT NULL AUTO_INCREMENT,
    ruta VARCHAR(500),
    nombre_archivo VARCHAR(200),
    extension VARCHAR(10),
    id_cliente MEDIUMINT NOT NULL,
    PRIMARY KEY (id_logo),
    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente)
);