define([
  "./wedo-constants"
  , "../wedo-names"
  , "../../../blockly/block-utils"


], function(constants, names, blockUtils){

  var TYPES = constants.types;

  var self = {};

  self.setSensorValueType = function() {
    var sensorInputBlock = this.getInputTargetBlock("input");
    if (sensorInputBlock && sensorInputBlock.type == "sensor")//type is block ID
    {
      var valueInput = this.getInput("value");
      var sensorValue = sensorInputBlock.getFieldValue("sensor");
      if (sensorValue == names.TILT)
      {
        valueInput.setCheck([TYPES.TILT]);
      } else if (sensorValue == names.MOTION)
      {
        valueInput.setCheck([TYPES.NUMBER]);
      }
    }
    blockUtils.setupBlock(this);
  }

  return self;

});
