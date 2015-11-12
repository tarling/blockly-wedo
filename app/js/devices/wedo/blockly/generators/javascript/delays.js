define(["../javascript"],function(generators){

  generators['wait'] = function(block) {
    var value_time = generators.valueToCode(block, 'time', generators.ORDER_ATOMIC);
    var code = 'wait.for(' + value_time + ')';
    return generators.wrap(block, code);
  };

  generators['wait_until'] = function(block) {
    var value_input = generators.valueToCode(block, 'input', generators.ORDER_ATOMIC);
    var dropdown_comp = block.getFieldValue('comp');
    var value_value = generators.valueToCode(block, 'value', generators.ORDER_ATOMIC);
    var code = 'while(!(' + value_input + ' ' + dropdown_comp + ' ' + value_value + ')){\n';
    code += generators.getInnerStepCode(block);
    code += "}"
    return generators.wrap(block, code);
  };

  generators['wait_until_tilt'] = function(block) {
    var value_input = generators.valueToCode(block, 'input', generators.ORDER_ATOMIC);
    var tilt_value = block.getFieldValue('value');
    var code = 'while(!(' + value_input + ' ' + tilt_value + ')){\n';
    code += generators.getInnerStepCode(block);
    code += "}"
    return generators.wrap(block, code);
  };
});
