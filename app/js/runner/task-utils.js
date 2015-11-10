define([
  "../blockly/constants"
],function(
  blocklyConstants
){

  var self = {};

  self.getTaskBlocks = function(code, functions) {

    code += "\n\n";

    var taskR = new RegExp(blocklyConstants.PRESTEP_PREFIX + "\\((\\d*)\\)");

    var taskIds = [];
    var taskBlocks = {};

    var result = taskR.exec(code);
    var id = result[1];

    taskBlocks[id] = code;

    return taskBlocks;
  }


  return self;

});
