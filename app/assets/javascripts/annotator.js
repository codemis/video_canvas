if (typeof console == "undefined" || typeof console.log == "undefined") var console = { log: function() {} }; 
/* This file holds all the code for the annotation tools */
/*
 * @param Hash Table Stores the current annotations on the page.  Key is a uuid.
 *
 */
var currentAnnotations = {};
/*
 * @param Hash Table Stores the dimensions for the starting dialog
 *
 */
var dialogStartingDimensions = {'h': 300, 'w': 300};
/*
 * @param Hash Table Stores the settings for the Canvas writing tools
 *
 */
var canvasSettings = {'stroke': 3, 'color': '#25c176'};
/*
 * @param String The URL for saving a canvas image
 *
 */
var annotationsURL = "";
/*
 * @param String The URL for getting an images data URL
 *
 */
var getImageDataURL = "";
/*
 * @param String The HTML Markup for the dialog pin
 *
 */
var pinHTML = "<button class='pin' title='Pin to Timeline'></button>";
var deleteHTML = "<button class='delete search_link_to_canvas' title='Delete Annotation'>&#9986;</button>";
/*
 * @param String The HTML Markup for the dialog to hide users
 *
 */
var hideHTML = "";
/*
 * @param Integer The additional hheight for the slider
 */
var sliderHeight = 10;
var annotationQeue = {};
/*
 * Document is ready
 *
 */
$(document).ready(function() {
	$('a.trigger_scribble').click(function(event) {
		newScribbleAnnotation();
		return false;
	});
});
function checkQeueForNewAnnotation(youtubePlayer) {
	if(youtubePlayer.getPlayerState() == 1) {
		/* Video is playing */
		var currentTime = youtubePlayer.getCurrentTime();
		var minTime = parseInt(currentTime) - 10;
		var maxTime = parseInt(currentTime) + 10;
		$.each(annotationQeue, function(index, val) {
			var dialogID = 'dialog-for-annotations-'+val.id;
			currDialog = $('#'+dialogID);
			 if((maxTime >= val.start_time) && (val.start_time >= minTime)) {
			 	if(currDialog.dialog("isOpen") === false) {
			 		openDialogModal(currDialog, val);
			 	};
			 }else{
			 	if((maxTime >= val.stop_time) && (val.stop_time >= minTime)) {
				 	if(currDialog.dialog( "isOpen" ) === true) {
				 		currDialog.dialog('close');
				 	};
				 };
			 }
		});
	}
};
/*
 * Returns an JQuery instance of the dialog window
 *
 * @param Object content A JQuery object to append to the content
 * @return Object
 */
function getDialogFrame(content) {
	var widgetFrame = $("#dialog_template").clone(true, true);
	widgetFrame.find('.content').append(content).removeClass('hidden');
	return widgetFrame;
};
function createScribbleDialogModal(annotation, dialogType) {
	if(dialogType == 'manageable') {
		var uuid = addNewObjectToCurrentAnnotations('canvas', {'isDrawing': false});
		var canvas = createScribbleCanvas(uuid);
	} else if(dialogType == 'viewable') {
		var canvas = $('<canvas/>').addClass('scribbleAnnotation').css({'cursor': 'pointer'});
	}
	var canvasDialog = getDialogFrame(canvas);
	/*
	 * Add to the dialog que to handle the displaying timing
	 */
	var dialogID = 'dialog-for-annotations-'+annotation.id;
	canvasDialog.attr('id', dialogID);
	$('body').append(canvasDialog);
	positionHash = {at: 'left+'+annotation.position.x1+' top+'+annotation.position.y1, my: 'left top', of: $(document)};

	if(dialogType == 'manageable') {
		canvasDialog.dialog({'height': annotation.position.height, width: annotation.position.width, position: positionHash, 'resizeStop': function(event, ui){
			scribbleDialogResizeStopCallback($(this));
		}, dialogClass: 'transparent', 'dragStop': function(){
			var contentCanvas = $(this).find('canvas');
			var currID = contentCanvas.attr('data-id');
			if (hasDataID(currID)) {
				saveAnnotation(contentCanvas, 'scribble');
			}
		}});
	} else if(dialogType == 'viewable') {
		canvasDialog.dialog({'height': annotation.position.height, width: annotation.position.width, position: positionHash, dialogClass: 'transparent viewable', draggable: false, resizable: false, title: annotation.contributor, closeOnEscape: false});
	}

	canvasDialog.dialog('close');
	var titleBar = canvasDialog.parents('.ui-dialog').find('.ui-dialog-titlebar');

	if(dialogType == 'manageable') {
		$(pinHTML).appendTo(titleBar).click(function(event) {
			togglePinSlider($(this), 'scribble');
		});
		$(deleteHTML).appendTo(titleBar).click(function(event) {
			scribbleDialogDeleteButtonPressed($(this));
		});
	} else if(dialogType == 'viewable') {
		// $(hideHTML).appendTo(titleBar).click(function(event) {
		// 	hideUser($(this));
		// });
	}
};
function openDialogModal(currDialog, annotation) {
	currDialog.dialog('open');
	if(annotation.annotation_type == 'scribble') {
		var uuid = addNewObjectToCurrentAnnotations('canvas', {'isDrawing': false, startTime: annotation.start_time, stopTime: annotation.stop_time});
		canvas = currDialog.find('canvas.scribbleAnnotation');
		canvas.attr('data-id', annotation.id);
		canvas.attr('data-user-id', annotation.user_id);
		var context = canvas[0].getContext('2d');
		var imageObj = new Image();
		imageObj.onload = function() {
	  		context.drawImage(this, 0, 0);
		};
		imageObj.src = annotation.scribble_data;
		currDialog.find('.content').append(canvas);
		resizeCanvas(currDialog.find('.content'));
	}
};
/*
 * Create a canvas for scribbling
 *
 * @param String uuid the unique id for the canvas
 *
 * @return Object
 */
function createScribbleCanvas(uuid) {
	var canvas = $('<canvas/>').attr({'data-uuid': uuid}).addClass('scribbleAnnotation').css({'cursor': 'pointer'});
	var canvasContext = canvas[0].getContext('2d');
	/*
	 * Handle the canvas' mouse events
	 *
	 */
	canvas.mouseup(function(event) {
		ele  = $(this);
		saveAnnotation(ele, 'scribble');
		var eleUUID = ele.data('uuid');
		currentAnnotations[eleUUID]['options']['isDrawing'] = false;
		return false;
	});
	canvas.mouseout(function(event) {
		var eleUUID = $(this).data('uuid');
		currentAnnotations[eleUUID]['options']['isDrawing'] = false;
		return false;
	});
	canvas.mousedown(function(event) {
		var ele = $(this);
		var eleUUID = ele.data('uuid');
		currentAnnotations[eleUUID]['options']['isDrawing'] = true;
		var canvasOffset = ele.offset();
		canvasContext.beginPath();
		canvasContext.moveTo(event.pageX - canvasOffset.left, event.pageY - canvasOffset.top);
		return false;
	});
	canvas.mousemove(function(event) {
		var ele = $(this);
		var eleUUID = ele.data('uuid');
		if(currentAnnotations[eleUUID]['options']['isDrawing'] === true){
			var canvasOffset = ele.offset();
			canvasContext.lineTo(event.pageX - canvasOffset.left, event.pageY - canvasOffset.top);
			canvasContext.lineWidth = canvasSettings['stroke'];
			canvasContext.strokeStyle = canvasSettings['color'];
			canvasContext.stroke();
		}
		return false;
	});
	return canvas;
};
/*
 * Iterates over existing annotations and adds them to the page
 *
 * @param Array annotations the array of annotations
 * @return void
 */
function addExistingAnnotations(annotations) {
	var videoID = $('#annotated_video').attr('data-our-id');
	$.ajax({
		url: '/protected_contributions',
		type: 'GET',
		dataType: 'json',
		data: {video_id: videoID},
	}).done(function(data) {
		var uintArray = data.contributions;
		$.each(annotations, function(index, val) {
			 if (val['annotation_type'] == 'scribble') {
			 	if (($.isArray(uintArray)) && ($.inArray(val['id'], uintArray) === -1)) {
			 		createScribbleDialogModal(val, 'viewable');
			 	} else {
			 		createScribbleDialogModal(val, 'manageable');
			 	};
			 };
			 annotationQeue[val.id] = val;
		});
	}).fail(function() {
		console.log("Unable to get protected ids.");
	});
};
/*
 * Adds a Scribble Annotation to the screen
 *
 * @return void
 */
function newScribbleAnnotation() {
	var uuid = addNewObjectToCurrentAnnotations('canvas', {'isDrawing': false});
	var canvas = createScribbleCanvas(uuid);
	var canvasDialog = getDialogFrame(canvas);
	$('body').append(canvasDialog);
	canvasDialog.dialog({'height': dialogStartingDimensions['h'], width: dialogStartingDimensions['w'], 'resizeStop': function(event, ui){
		scribbleDialogResizeStopCallback($(this));
	}, dialogClass: 'transparent', 'dragStop': function(event, ui) {
		var contentCanvas = $(this).find('canvas');
		var currID = contentCanvas.attr('data-id');
		if (hasDataID(currID)) {
			saveAnnotation(contentCanvas, 'scribble');
		}
	}});
	var titleBar = canvasDialog.parents('.ui-dialog').find('.ui-dialog-titlebar');
	$(pinHTML).appendTo(titleBar).click(function(event) {
		togglePinSlider($(this), 'scribble');
	});
	$(deleteHTML).appendTo(titleBar).click(function(event) {
		scribbleDialogDeleteButtonPressed($(this));
	});
	
	resizeCanvas(canvasDialog.find('.content'));
};
/*
 * The dialog callback for resizeStop
 *
 * @param Object ele the dialog JQuery element
 *
 * @return void
 */
function scribbleDialogResizeStopCallback(ele) {
	var contentDiv = ele.find('.content');
	resizeCanvas(contentDiv);
	var contentCanvas = contentDiv.children('canvas');
	if (contentCanvas.length > 0) {
		var currID = contentCanvas.attr('data-id');
		if (hasDataID(currID)) {
			/*
			 * When the canvas is resized, we need to add the image back
			 *
			 */
			$.ajax({
				url: annotationsURL+'/'+currID,
				type: 'get',
				dataType: 'json',
				data: {},
			})
			.done(function(data) {
				saveAnnotation(contentCanvas, 'scribble');
				var context = contentCanvas[0].getContext('2d');
				var imageObj = new Image();
				imageObj.onload = function() {
					context.drawImage(this, 0, 0);
				};
				imageObj.src = data.scribble_data;
			})
			.fail(function() {
				console.log("Unable to find the Annotation #"+currID);
			});
		};
	};
};
/*
 * The dialog delete button is pressed
 *
 * @param Object ele the dialog JQuery element
 *
 * @return void
 */
function scribbleDialogDeleteButtonPressed(ele) {
	var dialog = $(ele).parents('.ui-dialog').eq(0);
	var currCanvas = dialog.find('.content').children('canvas');
	var currID = currCanvas.attr('data-id');
	if(currID) {
		var dialogID = '#dialog-for-annotations-'+currID;
		$(dialogID).dialog('close');
		var currUUID = currCanvas.attr('data-uuid');
		currentAnnotations[currUUID] = {};
		if (hasDataID(currID)) {
			$.ajax({
				url: annotationsURL+"/"+currID,
				type: 'delete',
				dataType: 'json',
				data: {},
			})
			.fail(function() {
				console.log("Unable to delete the annotation id: "+currID);
			});
		};
	}
};
function hideUser(ele) {

};
/*
 * Save the annotation into the database
 *
 * @param Object ele the annotations JQuery Object
 * @param String annotationType the type of annotation
 *
 * @return void
 */
function saveAnnotation(ele, annotationType) {
		var eleUUID = ele.attr('data-uuid');
		var eleID = ele.attr('data-id');
		var ajaxType = 'post';
		var pathForID = '';
		/*
		 * Determine if we are creating or updating
		 *
		 */
		if (hasDataID(eleID)) {
			ajaxType = 'patch';
			var pathForID = '/'+eleID;
		};
		var dialogPosition = getDialogPosition(ele.parents('div.ui-dialog'));
		/*
		 * Setup the Annotation data object for the Controller
		 */
		var startTime = (currentAnnotations[eleUUID]['options'].hasOwnProperty('startTime')) ? currentAnnotations[eleUUID]['options']['startTime'] : 0;
		var stopTime = (currentAnnotations[eleUUID]['options'].hasOwnProperty('stopTime')) ? currentAnnotations[eleUUID]['options']['stopTime'] : videoDuration;
		var videoID = $('#annotated_video').attr('data-our-id');
		var annotationDataObject = { annotation: { 	annotation_type: annotationType, 
													position: dialogPosition, 
													start_time: startTime, 
													stop_time: stopTime,
													video_id: videoID
												}
									};
		if(annotationType == 'scribble') {
			annotationDataObject.annotation.scribble_data = ele[0].toDataURL("image/png");
		}
		$.ajax({
			url: annotationsURL+pathForID,
			type: ajaxType,
			data: annotationDataObject,
			dataType: 'json',
			success: function(data) {
				if (data.hasOwnProperty('id') && $.isNumeric(data.id)) {
					ele.attr('data-id', data.id);
					annotationQeue[data.id] = annotationDataObject;
					console.log(annotationQeue);
				} else {
					console.log('Unable to save annotation.');
					console.log(data);
				};
			},
			error:function() {
				console.log('Unable to save annotation.');
			}
		});
};
/*
 * Adds the newObject details to the currentAnnotations var
 *
 * @param String typeOfAnnotation the type of annotation (canvas)
 * @param Hash Table options other options to pass
 *
 * @return String
 */
function addNewObjectToCurrentAnnotations(typeOfAnnotation, options) {
	var uuid = createUUID();
	currentAnnotations[uuid] = {'type': typeOfAnnotation, 'options': options};
	return uuid;
};
/*
 * Resizes the canvas element
 *
 * @param Object contentEle the div.content in the dialog
 * @return void
 */
function resizeCanvas(contentEle) {
	var canvasParent = contentEle.parent();
	contentEle.children('canvas').attr({'height': canvasParent.height() - 20, 'width': canvasParent.width()});
};
/*
 * Get the positioning of the dialog for saving
 *
 * @param Object dialog the JQuery dialog object
 * @return Hash Table
 */
function getDialogPosition(dialog) {
	var dialogOffset = dialog.offset();
	return {	x1: dialogOffset.left,
				y1: dialogOffset.top, 
				width: dialog.width(), 
				height: dialog.height()
			};
};
/*
 * Toggle the pin slider
 *
 * @param Object pin the JQuery pin object
 * @param String annotationType they type of annotation
 * @return void
 */
function togglePinSlider(pin, annotationType) {
	var dialog = $(pin).parents('.ui-dialog').eq(0);
	if (annotationType == 'scribble') {
		var annotationElement = dialog.find('canvas');
		var annotationUUID = annotationElement.data('uuid');
	};
	var dialogContent = dialog.find('div.ui-dialog-content').eq(0);
	var sliderDiv = dialog.find('div.pin_slider').eq(0);
	dialogHeight = dialog.height();
	dialogContentHeight = dialogContent.height();
	if (pin.attr('data-showing') == 'YES') {
		window.clearInterval(ytLoopTimer);
		$(pin).attr('data-showing', 'NO');
		$(pin).addClass('unpinned').removeClass('pinned');
		sliderDiv.addClass('hidden');
		dialog.height(dialogHeight - sliderHeight);
		dialogContent.height(dialogContentHeight - sliderHeight);
		/*
		 * Reset the start and stop times
		 */
		if (currentAnnotations[annotationUUID]['options'].hasOwnProperty('startTime')) {
			currentAnnotations[annotationUUID]['options']['startTime'] = 0;
		}
		if (currentAnnotations[annotationUUID]['options'].hasOwnProperty('stopTime')) {
			currentAnnotations[annotationUUID]['options']['stopTime'] = videoDuration;
		}
		sliderDiv.find('span.start_time').text(toHHMMSS(0));
		sliderDiv.find('span.stop_time').text(toHHMMSS(videoDuration));
		saveAnnotation(annotationElement, annotationType);
	} else {
		/*
		 * Set the defaultstart and stop times
		 */
		if (currentAnnotations[annotationUUID]['options'].hasOwnProperty('startTime')) {
			sliderDiv.find('span.start_time').text(toHHMMSS(currentAnnotations[annotationUUID]['options']['startTime']));
		} else {
			sliderDiv.find('span.start_time').text(toHHMMSS(0));
		}
		if (currentAnnotations[annotationUUID]['options'].hasOwnProperty('stopTime')) {
			sliderDiv.find('span.stop_time').text(toHHMMSS(currentAnnotations[annotationUUID]['options']['stopTime']));
		} else {
			sliderDiv.find('span.stop_time').text(toHHMMSS(videoDuration));
		}
		$(pin).attr('data-showing', 'YES');
		$(pin).addClass('pinned').removeClass('unpinned');
		sliderDiv.removeClass('hidden');
		dialog.height(dialogHeight + sliderHeight);
		dialogContent.height(dialogContentHeight + sliderHeight);
		var rangeSliderHolder = sliderDiv.children(".pin_slider_range");
		rangeSliderHolder.slider({
			range: true,
			min: 0,
			max: videoDuration,
			values: [0, videoDuration],
			stop: function(event, ui) {
				currentAnnotations[annotationUUID]['options']['startTime'] = ui.values[0];
				currentAnnotations[annotationUUID]['options']['stopTime'] = ui.values[1];
				saveAnnotation(annotationElement, annotationType);
				youtubeClipVideoTimeLine(ui.values[0], ui.values[1]);
			},
			start: function(event, ui) {
				pausePlayer(ui.values[0], ui.values[1]);
			},
			slide: function(event, ui) {
				sliderDiv.find('span.start_time').text(toHHMMSS(ui.values[0]));
				sliderDiv.find('span.stop_time').text(toHHMMSS(ui.values[1]));
			}
	    });
	};
};
/*
 * Creates a unique id
 *
 * @return String
 */
function createUUID() {
    // http://www.ietf.org/rfc/rfc4122.txt
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
};
/*
 * Checks and see that it has a data-id attribute
 *
 * @param Strong dataID The data-id attribute
 * @return Boolean
 */
function hasDataID(dataID) {
	return (typeof dataID !== 'undefined' && dataID !== false && $.isNumeric(dataID));
};
function setBrushStroke(stroke, color) {
	canvasSettings['stroke'] = stroke;
	canvasSettings['color'] = color;
};
