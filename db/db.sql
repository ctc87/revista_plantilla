-- Borramos la base de datos si existe
DROP DATABASE IF EXISTS revista;
-- creamos la base de datos
CREATE DATABASE revista CHARACTER SET utf8 COLLATE=utf8_spanish_ci;

USE revista;



create table zonas (
    id_zona MEDIUMINT NOT NULL AUTO_INCREMENT,
    nombre_zona VARCHAR(200), 
    PRIMARY KEY (id_zona)
);


create table municipios (
    id_municipio MEDIUMINT NOT NULL AUTO_INCREMENT,
    id_zona MEDIUMINT NOT NULL,
    nombre_municipio VARCHAR(200),
    PRIMARY KEY (id_municipio),
    FOREIGN KEY (id_zona) REFERENCES zonas(id_zona)
);

create table clientes (
    id_cliente MEDIUMINT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(200),
    PRIMARY KEY (id_cliente),
    id_municipio MEDIUMINT NOT NULL,
    FOREIGN KEY (id_municipio) REFERENCES municipios(id_municipio)
);

create table telefonos (
    telefono varchar(20),
    id_cliente MEDIUMINT NOT NULL,
    PRIMARY KEY (telefono),
    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente)
);

create table emails(
    mail VARCHAR(200),
    id_cliente MEDIUMINT NOT NULL,
    PRIMARY KEY (mail),
    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente)
);

create table logos(
    id_logo MEDIUMINT NOT NULL AUTO_INCREMENT,
    ruta VARCHAR(500),
    nombre_archivo VARCHAR(200),
    extension VARCHAR(10),
    tamanyo_formato VARCHAR(10),
    id_cliente MEDIUMINT NOT NULL,
    PRIMARY KEY (id_logo),
    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente)
);

create table noticias(
    id_noticia MEDIUMINT NOT NULL AUTO_INCREMENT,
    fecha DATE,
    fuente_nombre VARCHAR(500),
    fuente_enclace varchar(500),
    titular VARCHAR(100),
    contenido VARCHAR(5000),
    ruta_foto VARCHAR(100),
    id_municipio MEDIUMINT NOT NULL,
    PRIMARY KEY (id_noticia),
    FOREIGN KEY (id_municipio) REFERENCES municipios(id_municipio)
);
