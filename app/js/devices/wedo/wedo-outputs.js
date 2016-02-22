define(["./wedo-names"], function(names) {

  //based on code from here
  //https://scratch.mit.edu/scratchr2/static/js/scratch_extensions/wedoExtension.js

  function isMotor(wedo, slot) {
    return wedo.slots[slot].type == names.MOTOR || wedo.slots[slot].type == names.SERVO;
  }

  function isLight(wedo, slot) {
    return wedo.slots[slot].type == names.LIGHTBRICK;
  }

  function isMoving(wedo, slot) {
    return wedo.states[slot].isOn && (wedo.states[slot].power > 0)
  }

  function getByteValue(wedo, slot) {
      // Return a byte value to control the given motor.
      var motor = wedo.states[slot];
      var byteValue = 0;
      if (motor.isOn && (motor.power > 0)) byteValue = (17 + Math.floor(1.1 * motor.power));
      if (motor.dir < 0) byteValue = (256 - byteValue) & 0xFF;
      return byteValue;
  }

  function sendOutputReport(wedo, brake0, brake1) {

    var outputA = brake0 ? 128 : getByteValue(wedo, 0);
    var outputB = brake1 ? 128 : getByteValue(wedo, 1);

    usb.sendData(wedo, outputA, outputB);
  }

  function checkForMotorsOff(wedo, alreadyBraked) {
      // Called on motor transition from on to off or motor power goes from non-zero to zero.
      // If both motors are just become off (or zero power), set wedo.motorOffTime to the current time.
      if (isMoving(wedo, 0) || isMoving(wedo, 1)) return; // a motor is still on

      wedo.motorOffTime = new Date().getTime();
      if (alreadyBraked) wedo.motorOffTime +=  self.MOTOR_BRAKING_TIME;
  };



  var MOTOR_COASTING_TIME = 700; // was 500
  var usb;

  var self = {};
  self.MOTOR_BRAKING_TIME = 300;
  self.setDeviceHandler = function(u) {
    usb = u;
  }

  self.okayToReadIDs = function(wedo) {
      // The WeDo sensor ID data is garbled and meaningless while any motor is running.
      // In fact, the ID continues to be garbled for a short while after all motors have
      // been turned off because the motor "coasts" and generates a current which throws
      // off the analog-to-digital converter in the WeDo hub. Thus, we keep track when the last
      // motor was turned off and wait half a second before trying to read the sensor ID's
      // Cached values of the sensor ID's are used while motors are running. Thus, if a user
      // plugs a different sensor into the WeDo hub while the motors are running, the plugin
      // won't notice until all motors are stopped.
      if (wedo.states[0].isOn || wedo.states[1].isOn) return false;
      return (new Date().getTime() - wedo.motorOffTime) > MOTOR_COASTING_TIME;
  };

  self.deviceOnOff = function(wedo, slotIndex, onOff, alreadyBraked) {

    var wasOn;
    var motor = isMotor(wedo, slotIndex);

    if (motor) wasOn = isMoving(wedo, slotIndex);
    wedo.states[slotIndex].isOn = (onOff == true);
    if (motor && wasOn) checkForMotorsOff(wedo, alreadyBraked);

    sendOutputReport(wedo);
  };

  self.power = function(wedo, slotIndex, value) {
    var power = Math.max(0, Math.min(value, 100));
    wedo.states[slotIndex].power = power;
  }

  self.direction = function(wedo, slotIndex, dirName) {

    var newDir;
    switch(dirName) {
      case names.THIS_WAY:
          newDir = 1;
          break;
      case names.THAT_WAY:
          newDir = -1;
          break;
      case names.OTHER_WAY:
          newDir = 0;
          break;
      default:
          return;
          break;
    }

    if (newDir == -1 || newDir == 1) wedo.states[slotIndex].dir = newDir;
    if (newDir == 0) wedo.states[slotIndex].dir = -wedo.states[slotIndex].dir;

    sendOutputReport(wedo);
  }



  self.brake = function(wedo, slotIndex) {
    var brake0 = slotIndex == 0;
    var brake1 = slotIndex == 1;

    sendOutputReport(wedo, brake0, brake1);
  };




  return self;

});
