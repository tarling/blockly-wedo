define([
  "../wedo-constants"
  , "../../wedo-names"
  , "../../../../blockly/block-utils"
  , "../../../../lang"
],function(constants, names, blockUtils, lang){

  var TYPES = constants.types;

  var blockDefs = window.Blockly.Blocks;

  /*
  turn motor/all motors/lights/everything on for N secs

  turn motor/all motors/lights/everything on

  turn motor/all motors/lights/everything off

  set motor/all motors/lights/everything power to N

  turn motor/all motors/lights/everything direction to this way/that way/reverse

  - distance
  - tilt
  */

  var outputs, directions;

  var inited = false;
  function initMsg() {
    if (inited) return;
    //motor/all motors/lights/everything
    outputs = [
      //[label, ID]
      [lang.blocks.get("MOTOR"), "motor"],
      [lang.blocks.get("LIGHTS"), "lights"]
    ];

    directions = [
      [lang.blocks.get("THIS-WAY"), names.THIS_WAY],
      [lang.blocks.get("THAT-WAY"), names.THAT_WAY],
      [lang.blocks.get("REVERSE"), names.REVERSE],
    ];

    inited = true;
  }

  blockDefs['wedo_turn_on'] = {
    init: function() {
      initMsg();
      this.appendDummyInput()
          .appendField(lang.blocks.get("TURN"))
          .appendField(new Blockly.FieldDropdown(constants.letterList), "slot")
          .appendField(lang.blocks.get("ON"));
      this.setColour(constants.colors.output);
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      blockUtils.setupBlock(this);
    }
  };

  blockDefs['wedo_turn_off'] = {
    init: function() {
      initMsg();
      this.appendDummyInput()
          .appendField(lang.blocks.get("TURN"))
          .appendField(new Blockly.FieldDropdown(constants.letterList), "slot")
          .appendField(lang.blocks.get("OFF"));
      this.setColour(constants.colors.output);
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      blockUtils.setupBlock(this);
    }
  };

  blockDefs['wedo_turn_on_for'] = {
    init: function() {
      initMsg();
      this.appendDummyInput()
          .appendField(lang.blocks.get("TURN"))
          .appendField(new Blockly.FieldDropdown(constants.letterList), "slot")
          .appendField(lang.blocks.get("ON-FOR"));
      this.appendValueInput("time")
          .setCheck([TYPES.NUMBER, TYPES.VARIABLE]);
      this.appendDummyInput()
          .appendField(lang.blocks.get("SECS"));
      this.setColour(constants.colors.output);
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setInputsInline(true);
      blockUtils.setupBlock(this);
    }
  };

  blockDefs['wedo_power'] = {
    init: function() {
      initMsg();
      this.appendDummyInput()
          .appendField(lang.blocks.get("SET-POWER"))
          .appendField(new Blockly.FieldDropdown(constants.letterList), "slot")
          .appendField(lang.blocks.get("TO"))
      this.appendValueInput("power")
          .setCheck([TYPES.NUMBER, TYPES.VARIABLE]);
      this.setColour(constants.colors.output);
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setInputsInline(true);
      blockUtils.setupBlock(this);
    }
  };

  blockDefs['wedo_motor_direction'] = {
    init: function() {
      this.appendDummyInput()
          .appendField(lang.blocks.get("SET-DIRECTION"))
          .appendField(new Blockly.FieldDropdown(constants.letterList), "slot")
          .appendField(lang.blocks.get("TO"))
          .appendField(new Blockly.FieldDropdown(directions), "direction");
      this.setColour(constants.colors.output);
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setInputsInline(true);
      blockUtils.setupBlock(this);
    }
  };

});
