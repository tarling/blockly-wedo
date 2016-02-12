define([
"../javascript"

],function(generators){

  var BlocklyLib = window.Blockly;

generators['procedures_callnoreturn'] = function(block) {
    // Call a procedure with no return value.
    var funcName = generators.variableDB_.getName(
      block.getFieldValue('NAME'), BlocklyLib.Procedures.NAME_TYPE);
    var code = funcName + "()";
    return generators.wrap(block, code, true);
};

generators['procedures_defnoreturn'] = function(block) {
  // Define a procedure with a return value.
    var funcName = generators.variableDB_.getName(
      block.getFieldValue('NAME'), BlocklyLib.Procedures.NAME_TYPE);
    var branch = generators.statementToCode(block, 'STACK');
    var code = "function " + funcName + "(){\n";

    //put warning inside function or it will never get hit by interpreter
    if (block.warning){
      code = code + generators.WARNING_COMMAND + "(" + block.id + ");\n";
    }

    code += branch;
    code += "}";

    return generators.wrap(block, code);
};

});
