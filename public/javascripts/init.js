$(function(){
	
	var r = Raphael('map', 900, 615),
		attributes = {
            fill: '#fff',
            stroke: '#3899E6',
            'stroke-width': 1,
            'stroke-linejoin': 'round'
        },
		arr = new Array();

	//setTimeout(function(){$("#info").fadeIn(2000)}, 500);

	for (var state in paths) {
		var obj = r.path(paths[state].path);
		obj.attr(attributes);
		arr[obj.id] = state;

		var fijar_estado = false;		
		obj
			.hover(
				function(){ 
					state_name = paths[arr[this.id]].name
					image_url  = "http://publicidadoficial.com.mx/wp-content/themes/publicidadoficial/images/";
					image_url += normalize(state_name) + ".png";

					this.animate({ fill: '#1669AD' }, 300); 					
					this.animate({ fill: '#1669AD' }, 300); 
					
					$("#title_bar label#name_estado")
						.css("display","none")
						.html(state_name + "<img id='img_estado' src='" + image_url + "'/>");

					$("#title_bar label#name_estado").fadeIn("slow");
				}, 
				function(){ 
					this.animate({ fill: attributes.fill }, 300); 
					if(fijar_estado === false){
						$("#info label#name_estado").html("<small>Da click y accede a la información</small>");
					}
				}
			)
			
			.click(function(){
				fijar_estado = false;
				state_name = paths[arr[this.id]].name

				$("div#load").css("display", "inline");

				$("#protector_map").css("display", "inline");
				$('html, body').animate({scrollTop:570}, 'slow', function(){

				url = /*"http://mapa-pof.jit.su/reporte/" + state_name; /*/"http://localhost:3000/reporte/" + state_name/**/
				$("div#status").slideUp("slow")//, function(){
				$.get(url, {}, function(data){
					//$("div#status").slideUp("fast", function(){
						$("div#status").html(data);
						$("div#status").slideDown(500, function(){
							$("div#load").css("display", "none");
						});
					//});
				})
				//});
				});
				fijar_estado = true;
				return false;
			});

		var normalize = (function() {
		  var from = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç",
		      to   = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc",
		      mapping = {};
		 
		  for(var i = 0, j = from.length; i < j; i++ )
		      mapping[ from.charAt( i ) ] = to.charAt( i );
		 
		  return function( str ) {
		      var ret = [];
		      for( var i = 0, j = str.length; i < j; i++ ) {
		          var c = str.charAt( i );
		          if( mapping.hasOwnProperty( str.charAt( i ) ) )
		              ret.push( mapping[ c ] );
		          else
		              ret.push( c );
		      }
		      return ret.join( '' ).replace( /[^-A-Za-z0-9]+/g, '-' ).toLowerCase();
		  }		 
		})();
	}

	$("div#go_home").live("click", function(e){
		$('html, body').animate({scrollTop:0}, 'slow');
	});

	$(window).scroll(function(){
		scroll_top = $(this).scrollTop();
		if(scroll_top == 0){
			$("#protector_map").css("display","none");
			$(this).css("display","none");
		}
	})
});

