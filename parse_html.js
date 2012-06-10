// Function parse_html
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

              var html  = "<div id='balance'>";
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

exports.parse_html = parse_html;
