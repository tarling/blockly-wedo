chrome.app.runtime.onLaunched.addListener(function() {

  var id = "blockly-wedo";
  var appWin;

  chrome.app.window.create('main.html', {
    'innerBounds': {
      'width': 640,
      'height': 640
    }
    //frame: "chrome",
    ,id: id // Even an empty string is sufficient.
    ,resizable : true
    //,alwaysOnTop: true
  });
});
