define(["../javascript"],function(generators){

  generators['repeat'] = function(block) {
    var statements_block = generators.statementToCode(block, 'block');
    var code = 'while(true){\n';
    code += generators.getInnerStepCode(block);
    code += ' ' + statements_block + '}';
    code += generators.getInnerStepCode(block);
    code += '}'
    return generators.wrap(block, code);
  };

  generators['repeat_count'] = function(block) {
    var value_count = generators.valueToCode(block, 'count', generators.ORDER_ATOMIC);
    var statements_block = generators.statementToCode(block, 'block');
    var var_name = Blockly.Variables.generateUniqueName(Blockly.mainWorkspace);
    var code = 'for (var ' + var_name + ' = 0; ' + var_name + ' < ' + value_count + '; ' + var_name + '++) {\n';
    code += generators.getInnerStepCode(block);
    code += ' ' + statements_block + ';\n';
    code += generators.getInnerStepCode(block);
    code += '}'
    return generators.wrap(block, code);
  };

  generators['repeat_until'] = function(block) {
    var value_value1 = generators.valueToCode(block, 'value1', generators.ORDER_ATOMIC);
    var dropdown_comp = block.getFieldValue('comp');
    var value_value2 = generators.valueToCode(block, 'value2', generators.ORDER_ATOMIC);
    var statements_block = generators.statementToCode(block, 'block');
    var code = 'do{\n';
    code += generators.getInnerStepCode(block);
    code += ' ' + statements_block + ';\n';
    code += generators.getInnerStepCode(block);
    code += '} while (' + value_value1 + ' ' + dropdown_comp + ' ' + value_value2 + ')';
    return generators.wrap(block, code);
  };

});
