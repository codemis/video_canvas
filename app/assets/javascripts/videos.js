// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
// You can use CoffeeScript in this file: http://coffeescript.org/

// Youtube API 
$(document).ready(function(){
	$('#choose_video_modal').modal({show: false});
	$('button.choose_video_modal').click(function(){
		$('#choose_video_modal').modal('show');
		return false;
	});	

	$(".youtube_search").keyup(function(){
	var keyword = $(this).val();
	var yt_url='http://gdata.youtube.com/feeds/api/videos?q='+keyword+'&format=5&max-results=1&v=2&alt=jsonc'; 

		$.ajax({
		type: "GET",
		url: yt_url,
		dataType:"jsonp",
		success: function(response)
			{

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

				var final="<div class='api_call_youtube'><div id='title'>"+video_title+"</div><br/>"+image_container+"<br/>"+video_viewCount+" Views<br/>" + "Description: <div class='description_container'>" + video_description+"</div> <br/> <a href='#choose_privacy' video_id="+video_id+" category="+video_category+" class='launch_privacy'> Choose this video </a></div>";

				$(".search_results").prepend(final); // Result
				});
				$('.launch_privacy').click(function(){
					$('input#youtube_id').val($(this).attr('video_id'));
					$('input#category').val($(this).attr('category'));
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
				$(".search_results").prepend("<div id='no'>No Video</div>");
				}
			}

		});

	});

});
