/** Module dependencies. */
  var express = require('express'), 
      jsdom = require('jsdom'),
      fs = require('fs'), 
      request = require('request'), 
      url = require('url'), 
      app = module.exports = express.createServer(),
      routes = require('./routes');

// Configuration

  app.configure(function(){
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(require('stylus').middleware({ src: __dirname + '/public' }));
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
  });

  app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  });

  app.configure('production', function(){
    app.use(express.errorHandler());
  });

// Routes

  app.get('/', routes.index);

  app.get('/reporte/:estado', function(req, res){
    var uri = 'http://publicidadoficial.com.mx/' + req.params.estado;
    request({uri: uri}, 
      function(err, response, body){
        var self = this;
        self.items = new Array();
   
        if(err && response.statusCode !== 200){console.log('Request error.');}
        jsdom.env(
          { html: body, scripts: ['http://code.jquery.com/jquery-1.6.min.js'] }, 
          function(err, window){
            var $ = window.jQuery;

            var data = {};
              data.img_estrellas = $('div#estrellas').attr('style').split("url('")[1].split("')")[0];

              gasto_temp = $('#gastoPerCapita p span img').attr('src');
              data.gasto_percapita = (gasto_temp)? "¿?" : $('#gastoPerCapita #bigMoney').text();
  
              data.gasto_anios = [];
              objeto = { 'concepto':'', '2010':'2010', '2011':'2011'};
              data.gasto_anios.push(objeto);

              $('#tablaGasto .tableRow').each(function(){
                  concepto = $(this).children('.tableLabel').text();
                  val_2010 = $(this).children('.tableValue:first').text();
                  val_2011 = $(this).children('.tableValue:last').text();
  
                  objeto = { 'concepto':concepto, '2010': val_2010, '2011': val_2011};
                  data.gasto_anios.push(objeto);
              });

              data.cronologia = [];
              $('.entry-content span, .entry-content em').each(function(){
                if($(this).text() != ""){
                  item = {"texto": $(this).text(), "tipo": this.nodeName.toLowerCase()};
                  data.cronologia.push(item);
                }
              });

              data.fechas = []; data.gastos = [];
              $('#tablaMoney tr:first td').each(function(){ data.fechas.push( $(this).text() );  });
              $('#tablaMoney tr:last td').each(function(){  data.gastos.push( $(this).text() );  });
              
              data.archivo_tipo_medio = $('div#archivoTipoMedio').text(),

              data.pleca_verde = $('div.plecaVerde').text(), 

              data.enlaces = [];
              $('#wrapLinks p').each(function(){  data.enlaces.push( $(this).text() ); });

              data.gasto_intenet_texto = $('div#gastoIntenetTexto').text();
            
            function parse_html(data){

              // [{ 'concepto':'', '2010':'', '2011':''}, { 'concepto':'', '2010':'', '2011':''}]
              var filas_gastos = "";
              for (d in data.gasto_anios){
                  ga = data.gasto_anios[d];
                  filas_gastos += "<tr>";
                  filas_gastos +=   "<td>" + ga['concepto'] + "<td>";
                  filas_gastos +=   "<td>" + ga['2010'] + "<td>";
                  filas_gastos +=   "<td>" + ga['2011'] + "<td>";
                  filas_gastos += "</tr>";
              }

              // [{ 'concepto':'', '2011':''}, { 'concepto':'', '2011':''}]
              var cronologia = "<ul>";
              for (c in data.cronologia){
                  cron = data.cronologia[c];

                  if(cron.tipo == 'em'){
                    cronologia += "<em>" + cron.texto + "</em>";
                  }else{
                    cronologia += "<li>" + cron.texto + "</li>";
                  }
              }
              cronologia += "</ul>";

              var html  = "<div id='go_home'>";
                  html += "  <img src='/images/mapa.png' />";
                  html += "  <label> volver al mapa </label>";
                  html += "</div>";
                  html += "<div id='balance'>";
                  html +=   "<div id ='resumen'>";
                  html +=     "<div>";
                  html +=       "<h2>Transparencia y acceso a la Información</h2>";
                  html +=       "<img id='calificacion' src='" + data.img_estrellas + "' />";
                  html +=     "</div>";
                  html +=     "<div>";
                  html +=       "<h2>Gasto en comunicación 2010 per capita</h2>";
                  html +=       "<div id='fondo_gasto'>";
                  html +=         "<label id='gasto'>" + data.gasto_percapita + "</label>";
                  html +=       "</div>";
                  html +=     "</div>";
                  html +=   "</div>";
                  html +=   "<div id ='reporte_datos'>";
                  html +=     "<h2>Información Recibida</h2>";
                  html +=     "<table id='tabla_gastos'>" + filas_gastos + "</table>";
                  html +=   "</div>";
                  html += "</div>";
                  html += "<div id='cronologia'>";
                  html +=   "<h2>Acceso al gasto en publicidad oficial vía solicitudes de información</h2>";
                  html +=    cronologia;
                  html += "</div>";

              return html;
            }

            //"http://publicidadoficial.com.mx/wp-content/themes/publicidadoficial/images/
            //http://publicidadoficial.com.mx/wp-content/themes/publicidadoficial/images/0estrellas.jpg

            var data_html = parse_html(data);
            res.end(data_html);
          }
        );
      }
    );
  });

  app.listen(3000, function(){
    console.log("Express server listening on port %d in %s", app.address().port, app.url);
  });



            