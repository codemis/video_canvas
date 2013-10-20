/*
 * The Youtube video instance
 *
 * Object
 */
var player;
var videoDuration;
$(document).ready(function() {
	/*
	 * Append the Youtube iFrame API to javascript tags
	 *
	 */
	var tag = $('<script/>').attr('src','https://www.youtube.com/iframe_api');
    $('body').append(tag);
});
/*
 * Callback Function for YouTube iFrame API. Called when YouTube API is ready
 *
 * @return void
 */
function onYouTubeIframeAPIReady() {
	player = new YT.Player('player', {
		height: '360',
		width: '480',
		videoId: 'jofNR_WkoCE',
		events: {
			'onReady': onYouTubePlayerReady
		}
	});
};
/*
 * Callback Function for YouTube iFrame API. Called when the player is loaded
 *
 * @return void
 */
function onYouTubePlayerReady(event) {
	videoDuration = player.getDuration();
};