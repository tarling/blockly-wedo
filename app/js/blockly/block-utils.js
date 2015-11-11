define([
  "../lang"
],function(lang){

  function canSetWarning(block) {
    return block.workspace && Blockly.dragMode_ != 2;
  }

  function onchange() {
    var block = this;
    if (!canSetWarning(block)) return;
    var missing = block.inputList.some(function(input){
      if (input.type != Blockly.DUMMY_INPUT)
      {
        var target = block.getInputTargetBlock(input.name);
        if (!target)
        {
          block.setWarningText(lang.ui.get("MISSING_BLOCKS"));
          return true;
        }
      }
    });
    if (!missing) block.setWarningText(null);
  }

  var self = {};

  self.setupBlock = function(block) {
    block.onchange = onchange;
  }

  self.getAllVars = function(block, vars) {
    return vars.map(function(v){
      return block.getFieldValue(v);
    });
  };

  self.renameVar = function(block, vars, oldName, newName) {

    vars.forEach(function(v){
      var val = block.getFieldValue(v);
      if (val && Blockly.Names.equals(oldName, val)) {
        block.setTitleValue(newName, v);
      }
    });
  }

  return self;

});
