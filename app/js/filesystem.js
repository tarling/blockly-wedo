define([
	"jquery"
	,"signals"
	,"FileSaver"
	,"blob"
],function($, Signal, saveAs, Blob){

	var fileEl = $('<input type="file" id="load" style="display:none" />');
	$("body").append(fileEl);
	fileEl.change(function(event) {
		var files = event.target.files;
		// Only allow uploading one file.
		if (files.length != 1) return;
    fileSelected.dispatch(files[0]);
	});

  var fileSelected = new Signal();
	var fileLoaded = new Signal();//content

  function makeFileReader(file) {
    var reader = new window.FileReader();
		reader.onloadend = function(event) {
      var target = event.target;
      // 2 == FileReader.DONE
      if (target.readyState == 2) {
        fileLoaded.dispatch(file.name, target.result);
        fileEl.val("");//clear it
      }
		};
    return reader;
  }

  function load(ext, readerCallback, contentCallback) {
    fileSelected.addOnce(function(file){
      readerCallback(file, makeFileReader(file));
    });
    fileLoaded.addOnce(contentCallback);
    selectFile(ext);
  }

  function selectFile(ext) {
    fileEl.attr("accept", "." + ext);
    fileEl.click();
  }

	var self = {};

  self.loadText = function(ext, callback) {
    load(ext, function(file, reader){
      reader.readAsText(file)
    }, callback)
  }

  self.loadArrayBuffer = function(ext, callback) {
    load(ext, function(file, reader){
      reader.readAsArrayBuffer(file)
    }, callback)
  }

	self.save = function (content, mimeType, fileName, successCallback, failCallback)
  {
    var success = function ()
    {
      successCallback && successCallback()
    }
    var fail = function ()
    {
      failCallback && failCallback()
    }
    var blob = new Blob([content],
    {
      type: mimeType
    });

    if (!(typeof chrome != "undefined" && chrome.fileSystem))
    {
      saveAs(blob, fileName);
      //doesn't give us feedback
    }
    else
    {
      chrome.fileSystem.chooseEntry(
      {
        type: "saveFile",
        suggestedName: fileName
      }, function (fileEntry)
      {
        if (chrome.runtime.lastError != null)
        {
          console.warn("filesystem save:" + chrome.runtime.lastError.message);
          fail();
          return;
        }
        else if (!fileEntry)
        {
          console.warn("filesystem save. user didn't select a file");
          fail();
          return;
        }
        fileEntry.createWriter(function (writer)
        {

          writer.onwriteend = function (e)
          {
            console.info('filesystem save. Write completed.');
            success();
          };
          writer.onerror = function (e)
          {
            console.error('filesystem save. Write failed: ' + e.toString());
            fail();
          };
          writer.write(blob);
        }, function ()
        {
          console.error("filesystem save. Couldn't create writer");
          fail();
        });
      });
    }
  }

	return self;

});
