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
 * Document is ready
 *
 */
$(document).ready(function() {
	addScribbleAnnotation();
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
function addScribbleAnnotation() {
	var uuid = addNewObjectToCurrentAnnotations('canvas', {'isDrawing': false});
	var canvas = $('<canvas/>').attr({'data-uuid': uuid}).addClass('scribbleAnnotation');
	// var canvasContext = canvas.getContext('2d');
	var canvasDialog = getDialogFrame(canvas);
	$('body').append(canvasDialog);
	canvasDialog.dialog({'height': dialogStartingDimensions['h'], width: dialogStartingDimensions['w'], 'resizeStop': function(event, ui){
		resizeCanvas($(this).find('.content'));
	}});
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