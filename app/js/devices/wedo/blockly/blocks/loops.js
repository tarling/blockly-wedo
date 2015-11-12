define([
  "../wedo-constants"
  , "../../../../blockly/block-utils"
  , "../../../../lang"
],function(constants, blockUtils, lang){

  var blockDefs = window.Blockly.Blocks;
  var TYPES = constants.types;
  var comps = constants.comparisons;
  var tilts = constants.tilts;
  
  blockDefs['repeat'] = {
    init: function() {
      this.appendDummyInput()
          .appendField(lang.blocks.get("REPEAT-FOREVER"));
      this.appendStatementInput("block");
      this.setInputsInline(false);
      this.setPreviousStatement(true);
      this.setColour(constants.colors.loops);
      blockUtils.setupBlock(this);
    }
  };

  blockDefs['repeat_count'] = {
    init: function() {
      this.appendDummyInput()
          .appendField(lang.blocks.get("REPEAT"));
      this.appendValueInput("count")
          .setCheck([TYPES.NUMBER, TYPES.VARIABLE]);
      this.appendDummyInput()
          .appendField(lang.blocks.get("TIMES"));
      this.appendStatementInput("block");
      this.setInputsInline(true);
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setColour(constants.colors.loops);
      blockUtils.setupBlock(this);
    }
  };

  blockDefs['repeat_until'] = {
    init: function() {
      this.appendDummyInput()
          .appendField(lang.blocks.get("REPEAT-UNTIL"));
      this.appendValueInput("input")
          .setCheck([TYPES.NUMBER, TYPES.SENSOR, TYPES.VARIABLE]);
      this.appendDummyInput()
          .appendField(new Blockly.FieldDropdown(comps), "comp");
      this.appendValueInput("value")
          .setCheck([TYPES.NUMBER, TYPES.SENSOR, TYPES.VARIABLE]);
      this.appendStatementInput("block");
      this.setInputsInline(true);
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setColour(constants.colors.loops);
      blockUtils.setupBlock(this);
    }
  };

  blockDefs['repeat_until_tilt'] = {
    init: function() {
      this.appendDummyInput()
          .appendField(lang.blocks.get("REPEAT-UNTIL"));
      this.appendValueInput("input")
          .setCheck([TYPES.SENSOR]);
      this.appendDummyInput()
          .appendField(lang.blocks.get("TILTS"))    
          .appendField(new Blockly.FieldDropdown(tilts), "value");
      this.appendStatementInput("block");
      this.setInputsInline(true);
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setColour(constants.colors.loops);
      blockUtils.setupBlock(this);
    }
  };

});
