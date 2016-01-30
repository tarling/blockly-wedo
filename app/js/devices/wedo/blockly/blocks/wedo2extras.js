define([
  "../wedo-constants"
  , "../../wedo-names"
  , "../../../../blockly/block-utils"
  , "../../../../lang"
],function(constants, names, blockUtils, lang){

  var TYPES = constants.types;
  var blockDefs = window.Blockly.Blocks;
  var wedoList = constants.wedoList;
  var ledColour = constants.ledColors;
  var octaves = constants.octaves;
  var notes = constants.notes;
  //TODO colorPicker not working in Chrome app?
  //var colour = new Blockly.FieldColour('#ff0000');
  //colour.setColours(['#f00','#0f0','#00f','#000','#888','#fff']).setColumns(3);
		  
  blockDefs['led_colour'] = {
    init: function() {
      this.appendDummyInput()
          .appendField(lang.blocks.get("SET-LED"))
		  //.appendField(colour, 'colour')
		  .appendField(new Blockly.FieldDropdown(ledColour), "colour")
          .appendField(lang.blocks.get("ON-WEDO"))
		  .appendField(new Blockly.FieldDropdown(wedoList), "value");
      this.data = 'WeDo2.0';
      this.setColour(constants.colors.output);
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      blockUtils.setupBlock(this);
    }
  };

  blockDefs['piezo'] = {
    init: function() {
      this.appendDummyInput()
          .appendField(lang.blocks.get("PLAY-NOTE"))
		  .appendField(new Blockly.FieldDropdown(notes), "note")
          .appendField(lang.blocks.get("OCTAVE"))
		  .appendField(new Blockly.FieldDropdown(octaves), "octave");
      this.appendValueInput("time")
          .setCheck([TYPES.NUMBER, TYPES.VARIABLE, TYPES.SENSOR])	  
          .appendField(lang.blocks.get("ON-WEDO"))
		  .appendField(new Blockly.FieldDropdown(wedoList), "value")
          .appendField(lang.blocks.get("FOR"));
      this.setInputsInline(false);
      this.data = 'WeDo2.0';
	  this.setColour(constants.colors.output);
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      blockUtils.setupBlock(this);
    }
  };
  
  blockDefs["wait_until_button"] = {
    init: function() {
      this.appendDummyInput()
          .appendField(lang.blocks.get("WAIT-UNTIL-BUTTON"));
      this.appendDummyInput()
	      .appendField(lang.blocks.get("ON-WEDO"))   
	      .appendField(new Blockly.FieldDropdown(wedoList), "value");
      this.setInputsInline(false);
      this.data = 'WeDo2.0';
      this.setColour(constants.colors.delays);
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      blockUtils.setupBlock(this);
    }
  };
  
});
