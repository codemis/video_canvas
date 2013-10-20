/*
 * The Youtube video instance
 *
 * Object
 */
var player;
var videoDuration;
var prevYtLoopStartTime = 0;
var ytLoopStartTime = 0;
var ytLoopEndTime = 0;
var ytLoopTimer;
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
	var ytVideoID = $('#annotated_video').data('youtube-id');
	player = new YT.Player('player', {
		height: '360',
		width: '480',
		videoId: ytVideoID,
		playerVars: {'rel': 0},
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
/*
 * When the slider is moved, this method will be triggered
 *
 * @param Integer start The amount of seconds to start at
 * @param Integer sec The amount of seconds to stop at
 * @return void
 */
function youtubeClipVideoTimeLine(start, end) {
	prevYtLoopStartTime = ytLoopStartTime;
	ytLoopStartTime = start;
	ytLoopEndTime = end;
	if (prevYtLoopStartTime != ytLoopStartTime) {
		/* start slider moved */
		startLoopClip();
	}
	if (ytLoopTimer == null) {
		ytLoopTimer = window.setInterval(function(){timerCheckVideoState();}, 500);
	};
};
/*
 * Starts the loop clip
 *
 * @return void
 */
function startLoopClip() {
	player.pauseVideo();
	player.seekTo(ytLoopStartTime, true);
	player.playVideo();
};
/*
 * Pauses video if it meets the criteria
 *
 * @param Integer start The amount of seconds to start at
 * @param Integer sec The amount of seconds to stop at
 * @return void
 */
function pausePlayer(start, end) {
	if (ytLoopStartTime != start) {
		/*We have not altered the ending range*/
		player.pauseVideo();
	}
};
/*
 * A timer triggered to loop video
 *
 * @return void
 */
function timerCheckVideoState() {
	var currentVideoTime = player.getCurrentTime();
	if (currentVideoTime >= ytLoopEndTime) {
		pausePlayer();
		startLoopClip();
	};
};