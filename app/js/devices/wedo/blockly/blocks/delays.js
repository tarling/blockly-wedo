define([
  "../wedo-constants"
  , "../wedo-block-utils"
  , "../../../../blockly/block-utils"
  , "../../../../lang"
],function(constants, wedoBlockUtils, blockUtils, lang){

  var blockDefs = window.Blockly.Blocks;
  var TYPES = constants.types;
  var comps = constants.comparisons;

  blockDefs["wait"] = {
    init: function() {
      this.appendDummyInput()
          .appendField(lang.blocks.get("WAIT"));
      this.appendValueInput("time")
          .setCheck([TYPES.NUMBER, TYPES.VARIABLE]);
      this.appendDummyInput()
          .appendField(lang.blocks.get("SECS"));
      this.setInputsInline(true);
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setColour(constants.colors.delays);
      blockUtils.setupBlock(this);
    }
  };

  blockDefs["wait_until"] = {
    init: function() {
      this.appendDummyInput()
          .appendField(lang.blocks.get("WAIT-UNTIL"));
      this.appendValueInput("input")
          .setCheck([TYPES.VARIABLE, TYPES.SENSOR]);
      this.appendDummyInput()
          .appendField(new Blockly.FieldDropdown(comps), "comp");
      this.appendValueInput("value")
          .setCheck([TYPES.NUMBER, TYPES.TILT, TYPES.VARIABLE]);
      this.setInputsInline(true);
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setColour(constants.colors.delays);

      this.onchange = wedoBlockUtils.setSensorValueType;
    }
  };

});
