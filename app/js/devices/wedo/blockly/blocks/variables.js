define([
  "../wedo-constants"
  , "../../../../blockly/block-utils"
  , "../../../../blockly/appFieldVariable"
  , "../../../../lang"

],function(constants, blockUtils, AppFieldVariable, lang){

  var blockDefs = window.Blockly.Blocks;
  var TYPES = constants.types;

  blockDefs['var_set'] = {
    init: function() {
      this.appendDummyInput()
          .appendField(lang.blocks.get("SET"));
      this.appendDummyInput()
          .appendField(new AppFieldVariable("varA"), "var");
      this.appendDummyInput()
          .appendField(lang.blocks.get("TO"));
      this.appendValueInput("value")
          .setCheck([TYPES.NUMBER, TYPES.SENSOR, TYPES.VARIABLE]);
      this.setInputsInline(true);
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setColour(constants.colors.variables);
      blockUtils.setupBlock(this);
    },
    getVars: function() {
      return blockUtils.getAllVars(this, ["var"]);
    },
    renameVar: function(oldName, newName) {
      return blockUtils.renameVar(this, ["var"], oldName, newName);
    }
  };

  blockDefs['var_random'] = {
    init: function() {
      this.appendDummyInput()
          .appendField(lang.blocks.get("SET"));
      this.appendDummyInput()
          .appendField(new AppFieldVariable("varA"), "var");
      this.appendDummyInput()
          .appendField(lang.blocks.get("TO-RANDOM"));
      this.setInputsInline(true);
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setColour(constants.colors.variables);
      blockUtils.setupBlock(this);
    },
    getVars: function() {
      return blockUtils.getAllVars(this, ["var"]);
    },
    renameVar: function(oldName, newName) {
      return blockUtils.renameVar(this, ["var"], oldName, newName);
    }
  };

  blockDefs['var_inc'] = {
    init: function() {
      this.appendDummyInput()
          .appendField(lang.blocks.get("INC"));
      this.appendDummyInput()
          .appendField(new AppFieldVariable("varA"), "var");
      this.appendDummyInput()
          .appendField(lang.blocks.get("BY"));
      this.appendValueInput("value")
          .setCheck([TYPES.NUMBER, TYPES.SENSOR, TYPES.VARIABLE]);
      this.setInputsInline(true);
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setColour(constants.colors.variables);
      blockUtils.setupBlock(this);
    },
    getVars: function() {
      return blockUtils.getAllVars(this, ["var"]);
    },
    renameVar: function(oldName, newName) {
      return blockUtils.renameVar(this, ["var"], oldName, newName);
    }
  };

  blockDefs['var_dec'] = {
    init: function() {
      this.appendDummyInput()
          .appendField(lang.blocks.get("DEC"));
      this.appendDummyInput()
          .appendField(new AppFieldVariable("varA"), "var");
      this.appendDummyInput()
          .appendField(lang.blocks.get("BY"));
      this.appendValueInput("value")
          .setCheck([TYPES.NUMBER, TYPES.SENSOR, TYPES.VARIABLE]);
      this.setInputsInline(true);
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setColour(constants.colors.variables);
      blockUtils.setupBlock(this);
    },
    getVars: function() {
      return blockUtils.getAllVars(this, ["var"]);
    },
    renameVar: function(oldName, newName) {
      return blockUtils.renameVar(this, ["var"], oldName, newName);
    }
  };

  blockDefs['variable'] = {
    init: function() {
      this.appendDummyInput()
          .appendField(new AppFieldVariable("varA"), "var");
      this.setOutput(true, TYPES.VARIABLE);
      this.setColour(constants.colors.variables);
    },
    getVars: function() {
      return blockUtils.getAllVars(this, ["var"]);
    },
    renameVar: function(oldName, newName) {
      return blockUtils.renameVar(this, ["var"], oldName, newName);
    }
  };

  blockDefs['string'] = {
    init: function() {
      this.appendDummyInput()
          .appendField(lang.blocks.get("STR_LEFT_QUOTE"))
          .appendField(new Blockly.FieldTextInput("text"), "value")
          .appendField(lang.blocks.get("STR_RIGHT_QUOTE"));
      this.setInputsInline(true);
      this.setOutput(true, TYPES.STRING);
      this.setColour(constants.colors.variables);
    }
  };

  blockDefs['number'] = {
    init: function() {
      this.appendDummyInput()
          .appendField(new Blockly.FieldTextInput("0"), "value");
      this.setInputsInline(true);
      this.setOutput(true, TYPES.NUMBER);
      this.setColour(constants.colors.variables);
    }
  };

});
