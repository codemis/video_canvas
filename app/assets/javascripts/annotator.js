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
var canvasSettings = {'stroke': 3, 'color': 'blue'};
/*
 * @param String The URL for saving a canvas image
 *
 */
var saveCanvasImageURL = "";
/*
 * @param String The URL for getting an images data URL
 *
 */
var getImageDataURL = "";
/*
 * Document is ready
 *
 */
$(document).ready(function() {
	$('a.trigger_scribble').click(function(event) {
		addNewScribbleAnnotation();
		return false;
	});
});
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
/*
 * Adds a Scribble Annotation to the screen
 *
 * @return void
 */
function addNewScribbleAnnotation() {
	var uuid = addNewObjectToCurrentAnnotations('canvas', {'isDrawing': false});
	var canvas = createScribbleCanvas(uuid);
	var canvasDialog = getDialogFrame(canvas);
	$('body').append(canvasDialog);
	canvasDialog.dialog({'height': dialogStartingDimensions['h'], width: dialogStartingDimensions['w'], 'resizeStop': function(event, ui){
		resizeCanvas($(this).find('.content'));
	}, dialogClass: 'transparent'});
	resizeCanvas(canvasDialog.find('.content'));
};
/*
 * Iterates over existing annotations and adds them to the page
 *
 * @param Array annotations the array of annotations
 * @return void
 */
function addExistingAnnotations(annotations) {
	$.each(annotations, function(index, val) {
		 if (val['annotation_type'] == 'canvas') {
		 	addExistingScribbleAnnotation(val);
		 };
	});
};
/*
 * Adds the existing Scribble Annotation to the page
 *
 * @param Hash Table annotation The annotation data to add
 * @return void
 */
function addExistingScribbleAnnotation(annotation) {
	$.get(getImageDataURL, {image_path: annotation['path']}, function(data) {
		var uuid = addNewObjectToCurrentAnnotations('canvas', {'isDrawing': false});
		var canvas = createScribbleCanvas(uuid);
		var context = canvas[0].getContext('2d');
		var canvasDialog = getDialogFrame(canvas);
		var imageObj = new Image();
        imageObj.onload = function() {
          context.drawImage(this, 0, 0);
        };
        imageObj.src = data['image_data'];
		$('body').append(canvasDialog);
		positionHash = {at: 'left+'+annotation['position']['x1']+' top+'+annotation['position']['y1'], my: 'left top', of: $(document)};
		canvasDialog.dialog({height: annotation['position']['height'], width: annotation['position']['width'], position: positionHash, 'resizeStop': function(event, ui){
			resizeCanvas($(this).find('.content'));
		}, dialogClass: 'transparent'});
	}, 'json');
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
		var ele = $(this);
		var eleUUID = ele.data('uuid');
		var dialogPosition = getDialogPosition(ele.parents('div.ui-dialog'));
		var canvasData = ele[0].toDataURL("image/png");
		currentAnnotations[eleUUID]['options']['isDrawing'] = false;
		$.post(saveCanvasImageURL, { annotation: { canvas_data: canvasData, annotation_type: 'canvas', position: dialogPosition, start_time: 0, stop_time: 300}}, function(data, textStatus, xhr) {
			if (data.hasOwnProperty('id') && $.isNumeric(data.id)) {
				ele.attr('data-id', data.id);
			};
		});
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
	contentEle.children('canvas').attr({'height': canvasParent.height(), 'width': canvasParent.width()});
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