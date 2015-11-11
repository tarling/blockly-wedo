define([
  "./wedo-usb"
  , "./wedo-names"
],function(
  usb
  , names
){

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
      power: function(output, value) {
        usb.motorPower(output, parseFloat(value));
      },
      direction: function(output, value) {
        usb.motorDirection(output, value);
      }
    }
  }

  return api;


});
