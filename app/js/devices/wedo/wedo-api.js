define([
  "./wedo-usb"
  , "./wedo-names"
],function(
  usb
  , names
){

  function outputName(type, slot) {
    return type + " " + slot;
  }

  var api = {
    wedo: {
      reset: function() {
        usb.resetAll();
      },
      get: function(slot) {
        return usb.getSensorAt(slot);
      },
      set: function(output, state) {
        if (state)
        {
          usb.motorOn(output);
        } else {
          var offMode = "off" ;//parts[2]; TODO only when motor off block includes menu for off/brake
          usb.motorOff(output, offMode);
        }
      },
      setAt: function(slot, state) {
        usb.setAt(slot, state);
      },
      power: function(slot, value) {
        usb.powerAt(slot, parseFloat(value));
      },
      direction: function(slot, value) {
        usb.directionAt(slot, value);
      }
    }
  }

  return api;


});
