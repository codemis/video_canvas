// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
// You can use CoffeeScript in this file: http://coffeescript.org/
$('button.choose_video_modal').click(function(){
	$('#choose_video_modal').modal();
});	




// Youtube API 
var yt_url='http://gdata.youtube.com/feeds/api/videos?q='+"apple"+'&format=5&max-results=1&v=2&alt=jsonc'; 

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

		var final="<div id='title'>"+video_title+"</div><br/>"+image_container+"<br/>"+video_viewCount+" Views<br/>" + "Description: " + video_description+" <br/> <a href='#choose_privacy' video_id="+video_id+" class='launch_privacy'> Choose this video </a>";

		$("#choose_video_modal > .modal-body").html(final); // Result
		});
		$('.launch_privacy').click(function(){
			$('.public_video_link').attr('href', "/videos?youtube_id="+ $(this).attr('video_id') + "&private=false");
			$('.private_video_link').attr('href', "/videos?youtube_id="+ $(this).attr('video_id') + "&private=true");
			$('#choose_privacy').modal();
		});
	}
		else {
			$(".modal-body").html("<div id='no'>No Video</div>");
			}
	}
});
