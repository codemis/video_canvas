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
		$.post(saveCanvasImageURL, {image_data: canvasData, annotation_type: 'canvas', uuid: eleUUID, position: dialogPosition}, function(data, textStatus, xhr) {
			// We need to do something with result
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
	var canvasDialog = getDialogFrame(canvas);
	$('body').append(canvasDialog);
	canvasDialog.dialog({'height': dialogStartingDimensions['h'], width: dialogStartingDimensions['w'], 'resizeStop': function(event, ui){
		resizeCanvas($(this).find('.content'));
	}, dialogClass: 'transparent'});
	// Positions using the params we send for the dialog
	// positionHash = {at: 'left+'+dialogPosition['x1']+' top+'+dialogPosition['y1'], my: 'left top', of: $(document)};
	// canvasDialog.dialog({height: dialogPosition['height'], width: dialogPosition['width'], position: positionHash, 'resizeStop': function(event, ui){
	// 	resizeCanvas($(this).find('.content'));
	// }, dialogClass: 'transparent'});
	resizeCanvas(canvasDialog.find('.content'));
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