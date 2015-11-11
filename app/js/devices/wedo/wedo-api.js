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
      get: function(letter) {
        var value = usb.getSensorAt(letter);
        console.log("get", letter, value);
        return value;
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
      setAt: function(output, slot, state) {
        var name = outputName(output, slot);
        if (state)
        {
          usb.motorOn(name);
        } else {
          var offMode = "off" ;//parts[2]; TODO only when motor off block includes menu for off/brake
          usb.motorOff(name, offMode);
        }
      },
      power: function(output, slot, value) {
        var name = outputName(output, slot);
        usb.motorPower(name, parseFloat(value));
      },
      direction: function(output, slot, value) {
        var name = outputName(output, slot);
        usb.motorDirection(name, value);
      }
    }
  }

  return api;


});
