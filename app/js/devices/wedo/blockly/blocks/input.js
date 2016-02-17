define([
  "../wedo-constants"
  , "../../wedo-names"
  , "../../../../blockly/block-utils"
  , "../../../../lang"

],function(constants, names, blockUtils, lang){

  var blockDefs = window.Blockly.Blocks;

  var TYPES = constants.types;
  var comps = constants.comparisons;
  var tilts = constants.tilts;

  blockDefs["wedo_if"] = {
    init: function() {
      this.appendDummyInput()
          .appendField(lang.blocks.get("IF"));
      this.appendValueInput("input")
          .setCheck([TYPES.VARIABLE, TYPES.SENSOR]);
      this.appendDummyInput()
          .appendField(new Blockly.FieldDropdown(comps), "comp");
      this.appendValueInput("value")
          .setCheck([TYPES.NUMBER, TYPES.VARIABLE, TYPES.SENSOR]);
      this.appendStatementInput("block");
      this.setColour(constants.colors.flow);
      this.setInputsInline(true);
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      blockUtils.setupBlock(this);
    }
  };

  blockDefs["wedo_if_tilt"] = {
    init: function() {
      this.appendDummyInput()
          .appendField(lang.blocks.get("IF"));
      this.appendValueInput("input")
          .setCheck([TYPES.SENSOR]);
      this.appendDummyInput()
          .appendField(lang.blocks.get("TILTS"));
      this.appendDummyInput()
          .appendField(new Blockly.FieldDropdown(tilts), "value");
      this.appendStatementInput("block");
      this.setColour(constants.colors.flow);
      this.setInputsInline(true);
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      blockUtils.setupBlock(this);
    }
  };

  blockDefs["wedo_if_else"] = {
    init: function() {
      this.appendDummyInput()
          .appendField(lang.blocks.get("IF"));
      this.appendValueInput("input")
          .setCheck([TYPES.VARIABLE, TYPES.SENSOR]);
      this.appendDummyInput()
          .appendField(new Blockly.FieldDropdown(comps), "comp");
      this.appendValueInput("value")
          .setCheck([TYPES.NUMBER, TYPES.VARIABLE, TYPES.SENSOR]);
      this.appendStatementInput("trueblock");
      this.appendDummyInput()
          .appendField(lang.blocks.get("ELSE"));
      this.appendStatementInput("falseblock");
      this.setColour(constants.colors.flow);
      this.setInputsInline(true);
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      blockUtils.setupBlock(this);
    }
  };

  blockDefs["wedo_if_tilt_else"] = {
    init: function() {
      this.appendDummyInput()
          .appendField(lang.blocks.get("IF"));
      this.appendValueInput("input")
          .setCheck([TYPES.SENSOR]);
      this.appendDummyInput()
          .appendField(lang.blocks.get("TILTS"));
      this.appendDummyInput()
          .appendField(new Blockly.FieldDropdown(tilts), "value");
      this.appendStatementInput("trueblock");
      this.appendDummyInput()
          .appendField(lang.blocks.get("ELSE"));
      this.appendStatementInput("falseblock");
      this.setColour(constants.colors.flow);
      this.setInputsInline(true);
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      blockUtils.setupBlock(this);
    }
  };

  var sensors = constants.sensors;

  blockDefs['sensor'] = {
    init: function() {
      this.appendDummyInput()
          .appendField(lang.blocks.get("SENSOR"))
          .appendField(new Blockly.FieldDropdown(constants.sensorList), "sensor");
      this.setOutput(true, TYPES.SENSOR);
      this.setColour(constants.colors.input);
    }
  };

});
