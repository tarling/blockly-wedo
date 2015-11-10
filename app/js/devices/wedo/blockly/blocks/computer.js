define([
  "../wedo-constants"
  , "../../../../blockly/block-utils"
  , "../../../../lang"
],function(constants, blockUtils, lang){

  var blockDefs = window.Blockly.Blocks;
  var TYPES = constants.types;
  var blockDefs = window.Blockly.Blocks;

  blockDefs['log'] = {
    init: function() {
      this.appendDummyInput()
          .appendField(lang.blocks.get("DISPLAY"));
      this.appendValueInput("value")
          .setCheck([TYPES.STRING, TYPES.NUMBER]);
      this.setInputsInline(true);
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setColour(constants.colors.computer);
      blockUtils.setupBlock(this);
    }
  };

  blockDefs['log_clear'] = {
    init: function() {
      this.appendDummyInput()
          .appendField(lang.blocks.get("CLEAR-DISPLAY"));
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setColour(constants.colors.computer);
    }
  };

});
