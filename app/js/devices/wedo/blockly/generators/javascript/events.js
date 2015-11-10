define(["../javascript"],function(generators){

  generators['when_start_clicked'] = function(block) {
    var statements_block = generators.statementToCode(block, 'block');
    var code = 'function onStart(){\n' + statements_block + '}';
    return generators.wrap(block, code);
  };

  generators['when'] = function(block) {
    var text_sensor = generators.valueToCode(block, 'sensor', generators.ORDER_ATOMIC);
    var dropdown_comp = block.getFieldValue('comp');
    var text_value = generators.valueToCode(block, 'value', generators.ORDER_ATOMIC);
    var statements = generators.statementToCode(block, 'block');
    var code = 'wedo.when(function(){\n';
    code += '  return ' + text_sensor + ' ' + dropdown_comp + ' ' + text_value + ';\n';
    code += '}, function(){\n';
    code += '  ' + statements;
    code += '})'
    return generators.wrap(block, code);
  };



});
