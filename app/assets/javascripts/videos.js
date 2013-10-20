// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
// You can use CoffeeScript in this file: http://coffeescript.org/

// Youtube API 
$(document).ready(function(){
	$('#choose_video_modal').modal({show: false});
	$('#search_video_modal').modal({show: false});
	
	$('a.choose_video_modal').click(function(){
		$('#choose_video_modal').modal('show');
		return false;
	});	

	$('a.search_video_modal').click(function(){
		$('#search_video_modal').modal('show');
		return false;
	});	
	
	var typingTimer;
	var doneTypingInterval = 2000;

	$('.youtube_search').keyup(function(){
		$(".search_results").html("Searching");
	    clearTimeout(typingTimer);
	    if ($('.youtube_search').val) {
	        typingTimer = setTimeout(doneTyping($('.youtube_search').val()), doneTypingInterval);
	    }
	});

	//user is "finished typing," do something
	function doneTyping (keywords_for_searching) {
		$(".search_results").html("Searching");
		var yt_url='http://gdata.youtube.com/feeds/api/videos?q='+keywords_for_searching+'&format=5&max-results=20&v=2&alt=jsonc&key=AIzaSyARYPv5iRMVO1HXy9gKxXN3EX4QIYONkvw'; 
		$.ajax({
		type: "GET",
		url: yt_url,
		dataType:"jsonp",
		success: function(response)
			{
				$(".search_results").html("");
				if(response.data.items)
				{
				$.each(response.data.items, function(i,data)
				{
				console.log(data);
				var video_id=data.id;
				var thumb_url=data.thumbnail.hqDefault;
				var video_title=data.title;
				var video_viewCount=data.viewCount;
				var video_category=data.category;
				var video_description = data.description;
				var create_video_url = "/videos?youtube_id=" + video_id
				var image_container="<img src="+thumb_url+" width='200' heigh='200'>";

				var final="<div class='api_call_youtube'><div id='title'>"+video_title+"</div><br/>"+image_container+"<br/>"+video_viewCount+" Views<br/>" + "Description: <div class='description_container'>" + video_description+"</div> <br/> <a href='#choose_privacy' video_id="+video_id+" category="+video_category+" title="+video_title+" class='launch_privacy'> Choose this video </a></div><br/><br/>";

				$(".search_results").prepend(final); // Result
				});
				$('.launch_privacy').click(function(){
					$('input#youtube_id').val($(this).attr('video_id'));
					$('input#category').val($(this).attr('category'));
					$('input#title').val($(this).attr('title'));
					$('input#description').val($(this).parent('.api_call_youtube').find('.description_container').text());
					// the following sets the private boolean for a video record and submits the hidden form.
					$('.public_video_link').click(function(){
						$('input#private').val(false);
						$('form.video_form').submit();
					});

					$('.private_video_link').click(function(){
						$('input#private').val(true);
						$('form.video_form').submit();
					});
					$('#choose_privacy').modal();
				});
			}
			
			else {
				$(".search_results").html("<div class='there_is_nothing_to_display'>Sorry, No videos match your search query.</div>");
				}
			}

		});
	};

	// the following is realted to manually inputting a youtube url. 
	$('.input_youtube_url_submit').click(function(){
		doneTyping($('.youtube_url_input').val());
	});

});
