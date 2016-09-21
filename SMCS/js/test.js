window.SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
var recognition = new webkitSpeechRecognition();
recognition.lang = 'ja';

var elapsedTime;
//連続してとる
recognition.continuous = true;

// var texts = [
// 	{"time": "0.00", "text":"start"}
// 	];
var texts = [];

recognition.onresult = function(event,$scope) {
		console.log('Result');
	var currentTime = new Date();
	//経過時間
	var time = (currentTime - startTime)/1000;
	var length = event.results.length;
	if (length > 0) {
		console.log(event.results[length-1][0].transcript);
	    var text = event.results[length-1][0].transcript;
    	$("#result_text").val(text);
    	
    	var object = {};
   		object["text"] = text;
   		object["time"] = elapsedTime;

   		texts.splice(0,0,object);
    	console.log(texts);
    	// $scope.texts = texts;
		recognition.stop();
		console.log('Speech recognition abort!');
	recognition.stop();
	
//	    	$("#result_time").val(time);
	}
}

function TextController($scope){
	$scope.texts = texts;

	$scope.refreshList = function(){
		$scope.texts = texts;
	};
}



recognition.onstart = function() {
		console.log('Speech recognition service has started');
}
recognition.onend = function(){
	console.log('On End');
        recognition.start();
}

recognition.onaudiostart = function() {
		console.log('Audio capturing started');
}

recognition.onsoundstart = function() {
		console.log('Some sound is being received');
}

recognition.onspeechstart = function() {
		console.log('Speech has been detected');
}

recognition.onspeechend = function() {
		console.log('Speech has stopped being detected');
}

recognition.onsoundend = function() {
		console.log('Sound has stopped being received');
}
recognition.onaudioend = function() {
		console.log('Audio capturing ended');
}

recognition.onspeechstart = function() {
	console.log('Speech has been detected');
	var currentTime = new Date();
	//経過時間
	var time = (currentTime - startTime)/1000;
    $("#result_time").val(time);
    elapsedTime = time;
    
}
// 録音開始
// recognition.start();
function record()
{
    recognition.start();
	startTime = new Date();
	console.log(startTime);
}
function stop()
{
	var currentTime = new Date();
}
function showHistory()
{
	document.getElementById('history').innerHTML = "";
	for (var i = 0, len = texts.length; i < len; i++) {
	document.getElementById('history').innerHTML += "<a href='#' class='list-group-item'><span class='badge'>"+texts[i].time+" seconds"+"</span><i class='fa fa-fw fa-comment'></i>"+texts[i].text+"</a>";
	}
}
