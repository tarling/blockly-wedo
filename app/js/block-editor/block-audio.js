define([
  "../events"
],function(events){

  var sounds = [];

  var self = {};

  self.stop = function() {
    sounds.forEach(function(sound){sound.pause()});
    sounds = [];
  }

  self.setMasterVolume = function(value) {
    Blockly.mainWorkspace.setMasterVolume(value);
  }

  self.playFile = function(path, callback) {
    var id = "temp";
    var workspace = Blockly.mainWorkspace;
    workspace.loadAudio_([path], id);
    var sound = workspace.playAudio(id, 0.5);
    sound.addEventListener("ended", function(){
      delete workspace.SOUNDS_[id];
      while(true) {
        var idx = sounds.indexOf(sound);
        if (idx == -1) return;
        sounds.splice(idx, 1);
      }
      if (callback) callback();
    });

    sounds.push(sound);
  }
  return self;

});


