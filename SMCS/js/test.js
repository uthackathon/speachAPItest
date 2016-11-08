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
    createDirectory();
	writeToLocal("text", texts);
}

function showHistory()
{
	document.getElementById('history').innerHTML = "";
	for (var i = 0, len = texts.length; i < len; i++) {
	document.getElementById('history').innerHTML += "<a href='#' class='list-group-item'><span class='badge'>"+texts[i].time+" seconds"+"</span><i class='fa fa-fw fa-comment'></i>"+texts[i].text+"</a>";
	}
}



//directoryを作成
function createDirectory(){
    var path = 'test/';


    function errorCallback(e) {
        alert("Error: " + e.name);
    }
    function createDir(rootDirEntry, folders) {
      // Throw out './' or '/' and move on to prevent something like '/foo/.//bar'.
      if (folders[0] == '.' || folders[0] == '') {
        folders = folders.slice(1);
      }
      rootDirEntry.getDirectory(folders[0], {create: true}, function(dirEntry) {
        // Recursively add the new subfolder (if we still have another to create).
        if (folders.length) {
          createDir(dirEntry, folders.slice(1));
        }
      }, errorHandler);
    };

    function onInitFs(fs) {
      createDir(fs.root, path.split('/')); // fs.root is a DirectoryEntry.
    }

    webkitStorageInfo.requestQuota(PERSISTENT, 1024,
    webkitRequestFileSystem(PERSISTENT, 1024, onInitFs, errorCallback),
    errorCallback);
}


///作成されたファイルは、/Users/USERNAME/Library/Application Support/Google/Chrome/Default/File System/
function writeToLocal(filename, content) {
    // chrome以外は弾く
    var ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf('chrome') == -1) {
        alert("This Page is Google Chrome only!");
    }

    function errorCallback(e) {
        alert("Error: " + e.name);
    }

    function fsCallback(fs) {
        fs.root.getFile(filename, {create: true}, function(fileEntry) {
            fileEntry.createWriter(function(fileWriter) {

                fileWriter.onwriteend = function(e) {
                    alert("Success! : " + fileEntry.fullPath);
                };

                fileWriter.onerror = function(e) {
                    alert("Failed: " + e);
                };

                var output = new Blob([content], {type: "text/plain"});
                fileWriter.write(output);
            }, errorCallback);
        }, errorCallback);
    }
    // クオータを要求する。PERSISTENTでなくTEMPORARYの場合は
    // 直接 webkitRequestFileSystem を呼んでよい
    //'window.webkitStorageInfo' is deprecated. Please use 'navigator.webkitTemporaryStorage' or 'navigator.webkitPersistentStorage' instead.
    webkitStorageInfo.requestQuota(PERSISTENT, 1024,
    webkitRequestFileSystem(PERSISTENT, 1024, fsCallback, errorCallback),
    errorCallback);
}