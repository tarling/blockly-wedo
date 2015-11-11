define(["../javascript"],function(generators){

  generators['wedo_if'] = function(block) {
    var text_sensor = generators.valueToCode(block, 'input', generators.ORDER_ATOMIC);
    var dropdown_comp = block.getFieldValue('comp');
    var text_value = generators.valueToCode(block, 'value', generators.ORDER_ATOMIC);
    var statements_block = generators.statementToCode(block, 'block');
    var code = 'if (' + text_sensor + ' ' + dropdown_comp + ' ' + text_value + ') {\n';
    code += statements_block;
    code += '}'
    return generators.wrap(block, code);
  };

  generators['wedo_if_else'] = function(block) {
    var text_sensor = generators.valueToCode(block, 'input', generators.ORDER_ATOMIC);
    var dropdown_comp = block.getFieldValue('comp');
    var text_value = generators.valueToCode(block, 'value', generators.ORDER_ATOMIC);
    var statements_trueblock = generators.statementToCode(block, 'trueblock');
    var statements_falseblock = generators.statementToCode(block, 'falseblock');
    var code = 'if (' + text_sensor + ' ' + dropdown_comp + ' ' + text_value + ') {\n';
    code += statements_trueblock;
    code += '} else {\n';
    code += statements_falseblock;
    code += '}'
    return generators.wrap(block, code);
  };

  generators['sensor'] = function(block) {
    var dropdown_sensor = block.getFieldValue('sensor');
    var code = 'wedo.get(\'' + dropdown_sensor + '\')';
    return [code, generators.ORDER_NONE];
  };

});
