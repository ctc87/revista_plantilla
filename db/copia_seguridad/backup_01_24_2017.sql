-- MySQL dump 10.13  Distrib 5.5.52, for Linux (x86_64)
--
-- Host: localhost    Database: tuperiod_revista
-- ------------------------------------------------------
-- Server version	5.5.52-cll

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `clientes`
--

DROP TABLE IF EXISTS `clientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `clientes` (
  `id_cliente` mediumint(9) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(200) DEFAULT NULL,
  `telefono` int(11) DEFAULT NULL,
  `mail` varchar(200) DEFAULT NULL,
  `web` varchar(1000) DEFAULT NULL,
  `id_municipio` mediumint(9) NOT NULL,
  `portada` tinyint(1) NOT NULL,
  PRIMARY KEY (`id_cliente`),
  KEY `id_municipio` (`id_municipio`)
) ENGINE=MyISAM AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clientes`
--

LOCK TABLES `clientes` WRITE;
/*!40000 ALTER TABLE `clientes` DISABLE KEYS */;
INSERT INTO `clientes` VALUES (1,'Bocatas Manolo',657658907,'Bocatas@manolo.com','http://www.bocatasmanolo.com',17,1),(2,'Ali-baba Kebab',678987645,'alibaba@gmail.com','http://www.alibaba.com',17,1),(3,'Cristaleria Sanchez Curbero',678985432,'cristaleria.sanchez.curbelo@gmail.com','http://www.cristaleriasanchez.com',17,1),(4,'Shacu',678987098,'shacu@shacu.com','http://www.shacu.tk',17,1),(5,'Imobiliaria Gonzalez',678698675,'imobiliaria.gonzalez@yahoo.es','http://www.imbiliariagonzalez.es',17,1),(6,'Modas maria',657654321,'modas.maria@gmail.com','http://www.modasMaria.com',17,1),(7,'Joyería el pato',654321567,'joyerias.pato@gmail.com','http://www.joyeriaselpato.com',17,1),(8,'Big cerrajeros',689706546,'Cerrajeros.big@gmail.com','http://www.cerrajerosbig.com',17,1),(9,'Mecánicos Fagioli',678908754,'Mfagoli@gmail.com','https://www.MecanicaFaigoli.com',17,1),(10,'Peluquería CrisMary',657902344,'peluCrisMary@gmail.com','http://www.peluqueriacrismary.com',17,1);
/*!40000 ALTER TABLE `clientes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `logos`
--

DROP TABLE IF EXISTS `logos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `logos` (
  `id_logo` mediumint(9) NOT NULL AUTO_INCREMENT,
  `ruta` varchar(500) DEFAULT NULL,
  `nombre_archivo` varchar(200) DEFAULT NULL,
  `extension` varchar(10) DEFAULT NULL,
  `tamanyo_formato` varchar(10) DEFAULT NULL,
  `id_cliente` mediumint(9) NOT NULL,
  PRIMARY KEY (`id_logo`),
  KEY `id_cliente` (`id_cliente`)
) ENGINE=MyISAM AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `logos`
--

LOCK TABLES `logos` WRITE;
/*!40000 ALTER TABLE `logos` DISABLE KEYS */;
INSERT INTO `logos` VALUES (1,'uploads/3588_bocadillos_para_una_tarde_de_toros.jpg','3588_bocadillos_para_una_tarde_de_toros.jpg','jpg','2x4',1),(2,'uploads/alibaba.JPG','alibaba.JPG','JPG','2x4',2),(3,'uploads/CRISTALERIA-SANCHEZ-CUBERO-Foto.jpg','CRISTALERIA-SANCHEZ-CUBERO-Foto.jpg','jpg','2x4',3),(4,'uploads/logoApp.png','logoApp.png','png','1x1',4),(5,'uploads/imobiliaria_gonzalez.PNG','imobiliaria_gonzalez.PNG','PNG','2x4',5),(6,'uploads/modas-marias.jpg','modas-marias.jpg','jpg','1x1',6),(7,'uploads/41329-joyeria_pato_porta_do_sol_13_no.jpg','41329-joyeria_pato_porta_do_sol_13_no.jpg','jpg','1x1',7),(8,'uploads/big_cerrajeros.jpg','big_cerrajeros.jpg','jpg','1x1',8),(9,'uploads/169697-servicio-mecanico-fagioli-banner.jpg','169697-servicio-mecanico-fagioli-banner.jpg','jpg','1x1',9),(10,'uploads/peluquería-crismary-en-el-mercado-del-puerto-de-la-cruz.jpg','peluquería-crismary-en-el-mercado-del-puerto-de-la-cruz.jpg','jpg','1x1',10);
/*!40000 ALTER TABLE `logos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `municipios`
--

DROP TABLE IF EXISTS `municipios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `municipios` (
  `id_municipio` mediumint(9) NOT NULL AUTO_INCREMENT,
  `id_zona` mediumint(9) NOT NULL,
  `nombre_municipio` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id_municipio`),
  KEY `id_zona` (`id_zona`)
) ENGINE=MyISAM AUTO_INCREMENT=32 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `municipios`
--

LOCK TABLES `municipios` WRITE;
/*!40000 ALTER TABLE `municipios` DISABLE KEYS */;
INSERT INTO `municipios` VALUES (1,3,'San Cristóbal de La Laguna'),(2,3,'Santa Cruz de Tenerife'),(3,3,'El Rosario'),(4,3,'Tegueste'),(5,2,'Adeje'),(6,2,'Granadilla de Abona'),(7,2,'Arafo'),(8,2,'Guía de Isora'),(9,2,'Arico'),(10,2,'Güímar'),(11,2,'Arona'),(12,2,'San Miguel de Abona'),(13,2,'Candelaria'),(14,2,'Santiago del Teide'),(15,2,'Fasnia'),(16,2,'Vilaflor'),(17,1,'Puerto de la Cruz'),(18,1,'San Juan de la Rambla'),(19,1,'Icod de los Vinos'),(20,1,'Buenavista del Norte'),(21,1,'La Guancha'),(22,1,'La Matanza de Acentejo'),(23,1,'Santa Úrsula'),(24,1,'La Orotava'),(25,1,'El Sauzal'),(26,1,'La Victoria de Acentejo	'),(27,1,'Tacoronte'),(28,1,'El Tanque'),(29,1,'Los Realejos'),(30,1,'Los Silos'),(31,1,'Garachico');
/*!40000 ALTER TABLE `municipios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `noticias`
--

DROP TABLE IF EXISTS `noticias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `noticias` (
  `id_noticia` mediumint(9) NOT NULL AUTO_INCREMENT,
  `fecha` date DEFAULT NULL,
  `fuente_nombre` varchar(500) DEFAULT NULL,
  `fuente_enclace` varchar(500) DEFAULT NULL,
  `titular` varchar(100) DEFAULT NULL,
  `contenido` varchar(11000) DEFAULT NULL,
  `ruta_foto` varchar(100) DEFAULT NULL,
  `id_municipio` mediumint(9) NOT NULL,
  `portada` tinyint(1) NOT NULL,
  PRIMARY KEY (`id_noticia`),
  KEY `id_municipio` (`id_municipio`)
) ENGINE=MyISAM AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `noticias`
--

LOCK TABLES `noticias` WRITE;
/*!40000 ALTER TABLE `noticias` DISABLE KEYS */;
INSERT INTO `noticias` VALUES (4,'2017-01-01','Cámara de Tenerife','https://www.camaratenerife.com/noticia.cfm?id=3663#.WG_e7szJy02','La Cámara ayudará a las empresas a dar sus primeros pasos en el exterior con un plan de exportación ','<div>\n<p><strong>Xpande y Xpande Digital son dos planes que tienen por objeto facilitar la internacionalizaci&oacute;n de las pymes y contribuir as&iacute; a aumentar la base exportadora espa&ntilde;ola. Estos se basan en la concesi&oacute;n de ayudas de hasta un 85% de la inversi&oacute;n y el asesoramiento</strong></p>\n<p><strong>A trav&eacute;s del programa Xpande, los t&eacute;cnicos de la C&aacute;mara de Comercio, ofrecen a las empresas asesoramiento individualizado para elaborar un plan de exportaci&oacute;n. Estos se encargan tambi&eacute;n de facilitar a las empresas las herramientas necesarias para consolidarse en el mercado objetivo elegid</strong></p>\n<p><strong>El programa Xpande Digital se dirige, espec&iacute;ficamente a aquellas pymes que desean fomentar y potenciar el marketing digital como herramienta b&aacute;sica para mejorar su posicionamiento en mercados internacionales</strong></p>\n</div>\n<div>La C&aacute;mara de Comercio de Santa Cruz de Tenerife apoyar&aacute;&nbsp; a las empresas que quieran dar sus primeros pasos en el exterior con asesoramiento especializado y ayudas econ&oacute;micas directas a trav&eacute;s de los programas , Xpande y Xpande Digital, que tienen como objetivo facilitar la internacionalizaci&oacute;n de las pymes y contribuir as&iacute; a aumentar la base exportadora canaria.\n<p>Estos programas est&aacute;n impulsados por la C&aacute;mara de Comercio de Espa&ntilde;a, y cofinanciados por el Fondo Europeo de Desarrollo Regional (FEDER). Tanto Xpande como Xpande Digital han sido concebidos para facilitar la salida al exterior de las empresas e incrementar as&iacute; la base exportadora espa&ntilde;ola. En definitiva, el objetivo es conseguir que un mayor n&uacute;mero de pymes empiece a vender en el exterior de manera regular.</p>\n<p><strong>&iquest;En qu&eacute; consisten?</strong></p>\n<p>A trav&eacute;s del programa Xpande, los t&eacute;cnicos de la C&aacute;mara de Comercio, ofrecen a las empresas asesoramiento individualizado para elaborar un plan de exportaci&oacute;n. Estos se encargan tambi&eacute;n de facilitar a las empresas las herramientas necesarias para consolidarse en el mercado objetivo elegido. Dicho diagn&oacute;stico personalizado est&aacute; dividido en dos fases:</p>\n<p>La primera de ellas se centra en el asesoramiento y se articula en torno a cuatro m&oacute;dulos principales: selecci&oacute;n de mercados, acceso al mercado, comunicaci&oacute;n y marketing y m&oacute;dulo econ&oacute;mico-financiero.</p>\n<p>En la segunda fase del programa se pondr&aacute; en marcha el proceso de internacionalizaci&oacute;n, con subvenciones de hasta un 85% para inversiones m&aacute;ximas de 9.000 euros .</p>\n<p>El programa Xpande Digital se dirige, espec&iacute;ficamente a aquellas pymes que desean fomentar y potenciar el marketing digital como herramienta b&aacute;sica para mejorar su posicionamiento en mercados internacionales. Este plan se divide tambi&eacute;n en dos etapas diferentes:</p>\n<p>En una primera fase, los t&eacute;cnicos de las c&aacute;maras se encargan de realizar un an&aacute;lisis pormenorizado de la empresa para desarrollar un informe de recomendaciones y un plan de acci&oacute;n en lo que respecta a su marketing digital internacional.</p>\n<p>En la segunda fase, se lleva a cabo la implantaci&oacute;n del plan elaborado previamente con subvenciones de hasta un 85% para inversiones m&aacute;ximas de 4.000 euros.</p>\n<p><strong>As&iacute; es la empresa Xpande</strong></p>\n<p>Atendiendo a los datos de ediciones anteriores, la C&aacute;mara asegura que el perfil de las empresas que se han acogido a este programa hasta la fecha responde a pymes de entre 0 y 9 trabajadores (66%) y que facturan menos de 500.000 euros (55%). Por sectores, destacan las empresas agroalimentarias (36%) seguidas de las industriales (31%), bienes de consumo (21%) y servicios (12%). En cuanto a los principales mercados a los que se dirigieron esas empresas, m&aacute;s del 50% son europeos, situ&aacute;ndose en primer lugar Francia, seguido de Alemania y Reino Unido. Estados Unidos ocup&oacute; la cuarta posici&oacute;n.</p>\n<p><strong>Otros programas</strong></p>\n<p>Adem&aacute;s de estas iniciativas, la C&aacute;mara cuenta con otros planes como el Programa Internacional de Promoci&oacute;n (PIP), dirigido igual que los anteriores a pymes espa&ntilde;olas que deseen iniciarse en la exportaci&oacute;n. Este funciona a trav&eacute;s de distintas actividades enfocadas a la promoci&oacute;n internacional y la sensibilizaci&oacute;n e informaci&oacute;n. As&iacute;, para ayudar a las peque&ntilde;as y medianas empresas a acercarse a otros mercados, las c&aacute;maras les facilitan la participaci&oacute;n en eventos como ferias, misiones comerciales, misiones exposici&oacute;n, encuentros empresariales, misiones inversas, visitas a ferias y otras actividades de promoci&oacute;n comercial internacional.</p>\n</div>','./uploads/noticias/banner_plan_de_expansion_internacional_para_pymes.jpg',17,0),(8,'2017-01-06','AYUNTAMIENTO PUERTO DE LA CRUZ','http://www.puertodelacruz.es/noticias/2017/01/05/mas-de-8-000-personas-disfrutaron-de-la-cabalgata-de-los-reyes-magos-de-oriente-del-puerto-de-la-cruz/','MÁS DE 8.000 PERSONAS DISFRUTARON DE LA CABALGATA DE LOS REYES MAGOS DE ORIENTE DEL PUERTO DE LA CRU','<p><strong>Puerto de la Cruz, a 06 de enero de 2017.-</strong> M&aacute;s de 8.000 personas se congregaron en el municipio para disfrutar de la cabalgata de <a href=\"http://ss.mm/\" data-saferedirecturl=\"https://www.google.com/url?hl=es&amp;q=http://SS.MM&amp;source=gmail&amp;ust=1483745412024000&amp;usg=AFQjCNHyj8CIkFJcOxwO9s_ia6R25mLPYg\">SS.MM</a>. los Reyes Magos de Oriente que, transcurri&oacute; con total normalidad y pudo realizar su recorrido habitual. Un recorrido que se caracteriz&oacute; por la ilusi&oacute;n y emoci&oacute;n que transmitieron los miles de ni&ntilde;os que ve&iacute;an pasar a Melchor, Gaspar y Baltasar en sus carrozas.</p>\n<div id=\"attachment_897\" class=\"wp-caption alignleft\"><img class=\"wp-image-897 size-medium\" src=\"http://www.puertodelacruz.es/sitecontent/uploads/2017/01/2017-01-05-PHOTO-00000170-300x200.jpg\" sizes=\"(max-width: 300px) 100vw, 300px\" srcset=\"http://www.puertodelacruz.es/sitecontent/uploads/2017/01/2017-01-05-PHOTO-00000170-300x200.jpg 300w, http://www.puertodelacruz.es/sitecontent/uploads/2017/01/2017-01-05-PHOTO-00000170-1024x683.jpg 1024w, http://www.puertodelacruz.es/sitecontent/uploads/2017/01/2017-01-05-PHOTO-00000170-1080x720.jpg 1080w, http://www.puertodelacruz.es/sitecontent/uploads/2017/01/2017-01-05-PHOTO-00000170.jpg 1500w\" alt=\"2017-01-05-photo-00000170\" width=\"300\" height=\"200\" />\n<p class=\"wp-caption-text\">Foto: Mois&eacute;s P&eacute;rez</p>\n</div>\n<p>El lugar de salida de sus Majestades fue el Castillo de San Felipe, donde fueron recibidos por miles de ni&ntilde;os emocionados al comprobar que los Reyes Magos de Oriente cumpl&iacute;an con su cita. El concejal del &Aacute;rea de Fiestas, Ruym&aacute;n Garc&iacute;a, acompa&ntilde;&oacute; a la comitiva en su recorrido.</p>\n<p>Paseo Luis Lavaggi, Calle San Felipe, Plaza del Charco, Calle La Marina, Calle Santo Domingo, hasta llegar a la Plaza de Europa, fue el recorrido de los Reyes y su extensa corte, compuesta por m&aacute;s de 300 personas, que una vez llegaron a la Plaza de Europa, fueron recibidos por el Coro Infantil del British School Tenerife, para posteriormente realizar la adoraci&oacute;n al Ni&ntilde;o Jes&uacute;s. Al finalizar, sus majestades pudieron dirigirse a los miles de ni&ntilde;os y ni&ntilde;as que desde primeras horas esperaban con ilusi&oacute;n ver a los Reyes desde el balc&oacute;n de las Casas Consistoriales, donde fueron recibidos por el Alcalde de la ciudad, Lope Afonso.</p>\n<div id=\"attachment_898\" class=\"wp-caption alignright\"><img class=\"wp-image-898 size-medium\" src=\"http://www.puertodelacruz.es/sitecontent/uploads/2017/01/2017-01-05-PHOTO-00000254-300x200.jpg\" sizes=\"(max-width: 300px) 100vw, 300px\" srcset=\"http://www.puertodelacruz.es/sitecontent/uploads/2017/01/2017-01-05-PHOTO-00000254-300x200.jpg 300w, http://www.puertodelacruz.es/sitecontent/uploads/2017/01/2017-01-05-PHOTO-00000254-1024x683.jpg 1024w, http://www.puertodelacruz.es/sitecontent/uploads/2017/01/2017-01-05-PHOTO-00000254-1080x720.jpg 1080w, http://www.puertodelacruz.es/sitecontent/uploads/2017/01/2017-01-05-PHOTO-00000254.jpg 1500w\" alt=\"2017-01-05-photo-00000254\" width=\"300\" height=\"200\" />\n<p class=\"wp-caption-text\">Foto: Mois&eacute;s P&eacute;rez</p>\n</div>\n<p>Por segundo a&ntilde;o consecutivo, y a trav&eacute;s de una petici&oacute;n de la Plataforma por un Puerto de la Cruz Accesible y Diverso, se acot&oacute; un espacio delante de la Iglesia de la Pe&ntilde;ita reservado para los ni&ntilde;os con movilidad reducida y diversidad funcional, lugar donde la comitiva hac&iacute;a un alto en el camino para saludarles de manera especial.</p>\n<p>Para el Alcalde portuense, Lope Afonso, la organizaci&oacute;n de la Cabalgata por parte de la Asociaci&oacute;n Ya Vienen los Reyes, &ldquo;estuvo a la altura de las grandes expectativas generadas, realizando un gran trabajo que es mejorado a&ntilde;o tras a&ntilde;o. Mis felicitaciones personales a todos los voluntarios de esta asociaci&oacute;n, a los dispositivos desplegados por la Polic&iacute;a Local, Polic&iacute;a Nacional, Protecci&oacute;n Civil y Cruz Roja, al &Aacute;rea de Fiestas, al personal municipal y a todos los que ayudaron &nbsp;de manera desinteresada para que todos los ni&ntilde;os del municipio pudieran ver cumplida su ilusi&oacute;n de ver de cerca a los Reyes Magos de Oriente.&rdquo;</p>\n<div id=\"attachment_899\" class=\"wp-caption alignleft\"><img class=\"wp-image-899 size-medium\" src=\"http://www.puertodelacruz.es/sitecontent/uploads/2017/01/DSCF7701-300x225.jpg\" sizes=\"(max-width: 300px) 100vw, 300px\" srcset=\"http://www.puertodelacruz.es/sitecontent/uploads/2017/01/DSCF7701-300x225.jpg 300w, http://www.puertodelacruz.es/sitecontent/uploads/2017/01/DSCF7701-1024x768.jpg 1024w, http://www.puertodelacruz.es/sitecontent/uploads/2017/01/DSCF7701-510x382.jpg 510w, http://www.puertodelacruz.es/sitecontent/uploads/2017/01/DSCF7701-1080x810.jpg 1080w\" alt=\"dscf7701\" width=\"300\" height=\"225\" />\n<p class=\"wp-caption-text\">El Alcalde y el Concejal de Fiestas se dirigen a los ni&ntilde;os desde el balc&oacute;n del Consistorio</p>\n</div>\n<p>Por su parte, el concejal del &Aacute;rea de Fiestas se mostr&oacute; muy satisfecho con la celebraci&oacute;n de la Cabalgata de Reyes, &ldquo;los ni&ntilde;os y ni&ntilde;as pudieron disfrutar un a&ntilde;o m&aacute;s de la m&aacute;gica visita de <a href=\"http://ss.mm/\" data-saferedirecturl=\"https://www.google.com/url?hl=es&amp;q=http://SS.MM&amp;source=gmail&amp;ust=1483745412024000&amp;usg=AFQjCNHyj8CIkFJcOxwO9s_ia6R25mLPYg\">SS.MM</a>. Los Reyes Magos de Oriente junto con toda su comitiva real, y ese ha sido nuestro objetivo fundamental.&nbsp; Mis m&aacute;s sinceras felicitaciones tanto al colectivo &ldquo;Ya Vienen los Reyes&rdquo; como a todas las personas implicadas en la organizaci&oacute;n del evento&rdquo;, subray&oacute; Ruym&aacute;n Garc&iacute;a.</p>\n<p>La Asociaci&oacute;n &ldquo;Ya Vienen los Reyes&rdquo; quiso sumarse a los felicitaciones&nbsp; manifestadas por la Corporaci&oacute;n Municipal, y resalt&oacute; a su vez el profundo agradecimiento &ldquo;a todos los voluntarios que, como cada a&ntilde;o, acuden a participar en la Cabalgata, a los conductores de las carrozas, a los voluntarios de la organizaci&oacute;n, a las empresas que nos han prestado su apoyo y por supuesto al p&uacute;blico que acudi&oacute; a ver a los Reyes Magos de Oriente. Nuestro trabajo es para todos ellos&rdquo;, concluy&oacute;.</p>\n<p>&nbsp;</p>\n','./uploads/noticias/cabalgata.jpg',17,1),(9,'2017-01-07','La Opinón','http://www.laopinion.es/tenerife/2017/01/06/municipio-cierra-ano-3412-parados/738124.html','Puerto de la Cruz cierra el año con 3.412 parados, la cifra más baja desde 2009','<p>uerto de la Cruz cerr&oacute; el a&ntilde;o con las mejores cifras de desempleo desde 2009. Seg&uacute;n datos del Observatorio Canario del Empleo y la Formaci&oacute;n Profesional (Obecan), el total de parados en el municipio norte&ntilde;o a final de 2016 es de 3.412 personas, 285 menos que en 2015, de los cuales 1.893 son mujeres y 1.519 hombres. Adem&aacute;s, la evoluci&oacute;n de las cifras de desempleados durante 2016 muestra una tendencia de descenso continuado en la ciudad desde septiembre de 2015.</p>\r\n<p>Estas cifras constatan un descenso significativo en el n&uacute;mero de parados registrados en las oficinas de empleo en relaci&oacute;n a los ejercicios pasados, con el a&ntilde;adido de que ese descenso se mantiene de forma regular y sin acusar de manera acentuada la estacionalidad en el sector tur&iacute;stico.</p>\r\n<p>Para el alcalde portuense, Lope Afonso, que Puerto de la Cruz sea capaz de mantener la tendencia positiva de creaci&oacute;n de empleo por un periodo tan prolongado es \"la mejor noticia que podemos dar a nuestros vecinos\". El primer mandatario valora estos datos alentadores que reflejan la mejor&iacute;a que est&aacute; experimentando la ciudad en el sector tur&iacute;stico, que sigue siendo \"el motor del crecimiento econ&oacute;mico del municipio y de las Islas\".</p>\r\n<p>\"La renovaci&oacute;n de la planta hotelera, gracias a instrumentos como el Plan de Modernizaci&oacute;n (PMM) elaborado por el Consorcio, las nuevas aperturas en el sector comercial, los proyectos futuros y, en general, el clima de estabilidad que se respira en la ciudad, nos hace confiar en que los datos de desempleo seguir&aacute;n mejorando paulatinamente\", subraya el regidor.</p>\r\n<p><strong>Turismo</strong></p>\r\n<p>Puerto de la Cruz cierra diciembre con la cifra total de 1.247 nuevos contratos. Seg&uacute;n el nuevo informe del Obecan, los sectores econ&oacute;micos donde se concentra el mayor n&uacute;mero de contratos generados durante el &uacute;ltimo mes del a&ntilde;o son los de la hosteler&iacute;a, con 748 nuevos contratos, liderando este sector la creaci&oacute;n de empleo en el municipio.</p>\r\n<p>Le sigue el sector del comercio, con 127 nuevos puestos de trabajo; la construcci&oacute;n, con 23; y finalmente, el resto de actividades que aporta 321 contratos. Por el otro lado, los sectores que menos trabajo han generado son los de menor peso en la actividad econ&oacute;mica de la ciudad, como son la agricultura y la industria con seis y 22 nuevos contratos respectivamente.</p>\r\n<p><strong>Formaci&oacute;n</strong></p>\r\n<p>Los datos del Obecan tambi&eacute;n reflejan el grado de formaci&oacute;n de los demandantes de empleo. En este sentido, el colectivo m&aacute;s numeroso en la ciudad tur&iacute;stica del norte de la Isla se corresponde con las personas con formaci&oacute;n Primaria y Secundaria con un total de 1.788 y 1.232 demandantes de empleo respectivamente.</p>\r\n<p>Por su parte, los parados con formaci&oacute;n universitaria representan el tercer colectivo que m&aacute;s demandantes de puestos de trabajo tiene el municipio tinerfe&ntilde;o con 221, y por &uacute;ltimo, los que tienen estudios de Formaci&oacute;n Profesional, con 170 personas. Los s&iacute;ntomas de mejor&iacute;a son claros.</p>\r\n<div class=\"bloqueclear\">&nbsp;</div>\r\n<div class=\"redes_pie\">&nbsp;</div>','./uploads/noticias/municipio-cierra.jpg',17,1);
/*!40000 ALTER TABLE `noticias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `nickname` varchar(200) NOT NULL,
  `email` varchar(200) NOT NULL,
  `password` varchar(200) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nickname` (`nickname`),
  UNIQUE KEY `email` (`email`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (0,'ctc87','carlos.troyano.carmona@gmail.com','$2a$10$l0YDSBzK0Do5sNL5BS.jwuhQ.9grvpTr8DTf.RFofl0WuLaaAqve2');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `zonas`
--

DROP TABLE IF EXISTS `zonas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `zonas` (
  `id_zona` mediumint(9) NOT NULL AUTO_INCREMENT,
  `nombre_zona` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id_zona`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `zonas`
--

LOCK TABLES `zonas` WRITE;
/*!40000 ALTER TABLE `zonas` DISABLE KEYS */;
INSERT INTO `zonas` VALUES (1,'Zona Norte'),(2,'Zona Sur'),(3,'Zona Metropolitana S/C-Laguna');
/*!40000 ALTER TABLE `zonas` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-01-24 18:15:52
