/*
 * The Youtube video instance
 *
 * Object
 */
var player;
var videoDuration;
var ytLoopStartTime = 0;
var ytLoopEndTime = 0;
var ytLoopingVideo = false;
var ytLoopHasBeenStarted = false;
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
	player = new YT.Player('player', {
		height: '360',
		width: '480',
		videoId: 'jofNR_WkoCE',
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
	ytLoopingVideo = true;
	if (ytLoopStartTime != start) {
		console.log('Start Slider Moved');
		var playerStatus = player.getPlayerState();
		/* start slider moved */
		if (playerStatus == 2) {
			/* player paused */
			player.playVideo();
		} else if (playerStatus == 1) {
			/* player playing */
			player.seekTo(ytLoopStartTime, false);
			ytLoopHasBeenStarted = true;
			console.log('1) Starting Loop');
		} else {
			player.playVideo();
		}
	} else {
		console.log('End Slider Moved');
	}
	ytLoopStartTime = start;
	ytLoopEndTime = end;
	if (ytLoopTimer == null) {
		console.log('Setting Timer');
		ytLoopTimer = window.setInterval(function(){timerCheckVideoState();}, 500);
	};
};
/*
 * A timer triggered to loop video
 *
 * @return void
 */
function timerCheckVideoState() {
	console.log(ytLoopHasBeenStarted);
	if ((player.getPlayerState() == 1) && (ytLoopHasBeenStarted === false)) {
		/* player playing */
		ytLoopHasBeenStarted = true;
		player.seekTo(ytLoopStartTime, false);
		console.log('2) Starting Loop');
	} else {
		var currentVideoTime = player.getCurrentTime();
		if ((currentVideoTime >= ytLoopEndTime) && (ytLoopHasBeenStarted === true)) {
			console.log('Restarting Loop');
			ytLoopHasBeenStarted = false;
		};
	}
};