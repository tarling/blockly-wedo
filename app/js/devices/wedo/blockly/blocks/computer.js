define([
  "../wedo-constants"
  , "../../../../blockly/block-utils"
  , "../../../../lang"
],function(constants, blockUtils, lang){

  var blockDefs = window.Blockly.Blocks;
  var TYPES = constants.types;
  var blockDefs = window.Blockly.Blocks;

// ADVANCED : COMMENT [TEXT]

  blockDefs['comment'] = {
    init: function() {
      this.appendDummyInput()
          .appendField(new Blockly.FieldTextInput("comment"), "value")
      this.setPreviousStatement(true);
      this.setNextStatement(false);
      this.setTooltip('');
      this.setColour(constants.colors.comment);
      blockUtils.setupBlock(this);
    }
  };

  blockDefs['log'] = {
    init: function() {
      this.appendDummyInput()
          .appendField(lang.blocks.get("DISPLAY"));
      this.appendValueInput("value")
          .setCheck([TYPES.STRING, TYPES.NUMBER, TYPES.SENSOR, TYPES.VARIABLE]);
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
