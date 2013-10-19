$(document).ready(function() {



/*  // TOOLBAR TOGGLE //  */
		toggle('toolBar');


/*  // FADE TAGLINE //  */
		//hide all spans
		$('#text-fade-content span').hide();
		
		//start fade on the first span
		fadeText( $('#text-fade-content span:first') );

});



	/*   // FADES THE TAGLINE WORDS  //  */
	function fadeText(text) {
	
		//get next span
		var next = text.next();
		
		//if there is no next span, go back to the first span
		if ( next.length == 0 ) {
			next = text.parent().find(":first");
		}
		
		//begin the fade. Fade in is 1 second long, holds for 3 seconds long, and then fade out lasts for 1 second. After fade out, the next span will do the fade.
		$(text).fadeIn(1000).delay(2000).fadeOut(1000, function() { fadeText( next ) } );
	}
	
	

	

		function toggle(id) {
		    var el = document.getElementById(id);
		    var img = document.getElementById("arrow");
		    var toolBar = el.getAttribute("class");
		    if(toolBar == "hide"){
		        el.setAttribute("class", "show");
		        delay(img, "/assets/cat.jpg", 400);
		    }
		    else{
		        el.setAttribute("class", "hide");
		        delay(img, "/assets/cat.jpg", 400);
		    }
		}

		function delay(elem, src, delayTime){
		    window.setTimeout(function() {elem.setAttribute("src", src);}, delayTime);
	}
	
	
