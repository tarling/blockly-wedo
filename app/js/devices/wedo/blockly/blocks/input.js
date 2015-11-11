define([
  "../wedo-constants"
  , "../../wedo-names"
  , "../../../../blockly/block-utils"
  , "../../../../lang"

],function(constants, names, blockUtils, lang){

  var blockDefs = window.Blockly.Blocks;

  var TYPES = constants.types;
  var comps = constants.comparisons;

  var tiltDirections;

  var inited = false;
  function initMsg() {
    if (inited) return;
    tiltDirections = [
      //[label, ID]
      [lang.blocks.get("UP"), "3"],
      [lang.blocks.get("DOWN"), "1"],
      [lang.blocks.get("LEFT"), "4"],
      [lang.blocks.get("RIGHT"), "2"],
      [lang.blocks.get("LEVEL"), "0"]
    ]
    inited = true;
  }

  blockDefs["wedo_if"] = {
    init: function() {
      this.appendDummyInput()
          .appendField(lang.blocks.get("IF"));
      this.appendValueInput("input")
          .setCheck([TYPES.NUMBER, TYPES.SENSOR]);
      this.appendDummyInput()
          .appendField(new Blockly.FieldDropdown(comps), "comp");
      this.appendValueInput("value")
          .setCheck([TYPES.NUMBER, TYPES.VARIABLE]);
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
          .setCheck([TYPES.NUMBER, TYPES.SENSOR]);
      this.appendDummyInput()
          .appendField(new Blockly.FieldDropdown(comps), "comp");
      this.appendValueInput("value")
          .setCheck([TYPES.NUMBER, TYPES.VARIABLE]);
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
          .appendField(new Blockly.FieldDropdown([[lang.blocks.get("TILT"), names.TILT], [lang.blocks.get("MOTION"), names.MOTION]]), "sensor");
      this.setOutput(true, TYPES.SENSOR);
      this.setColour(constants.colors.input);
    }
  };

});
