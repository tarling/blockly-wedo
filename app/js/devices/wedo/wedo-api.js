define([
  "./wedo-usb"
  , "./wedo-names"
    ,"../../block-editor/block-audio"
],function(
  usb
  , names
  , blocklyAudio
){

  function outputName(type, slot) {
    return type + " " + slot;
  }

  var api = {
    wedo: {
      reset: function() {
        usb.resetAll();
        blocklyAudio.stop();
        chrome.tts.stop();
      },
      getInput: function(slot) {
        return usb.getSensorAt(slot);
      },
      get: function(slot) {
        return usb.getSensorAt(slot);
      },
      set: function(slot, state) {
        usb.setAt(slot, state);
      },
      setMotor: function(slot, state) {
        usb.setAt(slot, state);
      },
      setPower: function(slot, value) {
        usb.powerAt(slot, parseFloat(value));
      },
      setDirection: function(slot, value) {
        usb.directionAt(slot, value);
      },
      setLED: function(wedoSlot, color) {
        //TODO
      },
      playNote: function(wedoSlot, note, octave, time) {
        //TODO
      },
      getButton: function(wedoSlot) {
        //TODO return usb.getSensorAt(slot);
      },
      playFile: function(file) {
        var path = "../../res/MP3/" + file; // + ".mp3";
        blocklyAudio.stop();
        blocklyAudio.playFile(path);
      },
      playStop: function() {
        blocklyAudio.stop();
      }
    }
  }

  return api;


});
