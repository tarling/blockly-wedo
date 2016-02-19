define(["../javascript" , "../../../../../lang"],function(generators, lang){

  generators['when_start_clicked'] = function(block) {
    var code = "// " + lang.blocks.get("START-CLICKED");
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
