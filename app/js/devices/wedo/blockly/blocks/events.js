define([
  "../wedo-constants"
  , "../../../../blockly/block-utils"
  , "../../../../lang"
],function(constants, blockUtils, lang){

  var blockDefs = window.Blockly.Blocks;
  var TYPES = constants.types;
  var comps = constants.comparisons;
  
  blockDefs["when_start_clicked"] = {
    init: function() {
      this.appendDummyInput()
          .appendField(lang.blocks.get("START-CLICKED"));
      //this.appendStatementInput("block");
      this.setInputsInline(false);
      this.setNextStatement(true);
      this.setColour(constants.colors.start);
      this.setDeletable(false);
      this.startBlock = true;
      if (!this.isInFlyout)
      {
        blockUtils.addStart(this);
      }
    }
  };

  /*blockDefs["when"] = {
    init: function() {
      this.appendDummyInput()
          .appendField("when");
      this.appendValueInput("sensor")
          .setCheck([TYPES.SENSOR]);
      this.appendDummyInput()
          .appendField(new Blockly.FieldDropdown(comps), "comp");
      this.appendValueInput("value");
      this.appendStatementInput("block");
      this.setColour(constants.colors.default);
      this.setInputsInline(true);
      blockUtils.setupBlock(this);
    }
  };*/

});
