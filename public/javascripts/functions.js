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

	function base_url(){
    	// capturamos la url
    	url_site      = document.location.href

    	// La separamos por la doble barra
    	url_pos      = url_site.indexOf('//');

    	// por un lado tenemos la url sin protocolos
   		url_limpia   = url_site.substr(url_pos+2);

    	// y por otro lado el protocolo usado
    	url_prot    = url_site.substr(0,url_pos+2);

    	// separamos todas las posibles carpetas
    	url_split 	  = url_limpia.split('/');

    	// y obtenemos el dominio actual
    	url_base 	= url_prot + url_split[0];

		return url_base;
	}
