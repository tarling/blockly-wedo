define(["../javascript"],function(generators){

  generators['var_set'] = function(block) {
    var dropdown_var = block.getFieldValue('var');
    var value_value = generators.valueToCode(block, 'value', generators.ORDER_ATOMIC);
    var code = dropdown_var + '=' + value_value;
    return generators.wrap(block, code);
  };

  generators['var_inc'] = function(block) {
    var dropdown_var = block.getFieldValue('var');
    var value_value = generators.valueToCode(block, 'value', generators.ORDER_ATOMIC);
    var code = dropdown_var + '=' + dropdown_var + ' + ' + value_value;
    return generators.wrap(block, code);
  };

  generators['var_dec'] = function(block) {
    var dropdown_var = block.getFieldValue('var');
    var value_value = generators.valueToCode(block, 'value', generators.ORDER_ATOMIC);
    var code = dropdown_var + '=' + dropdown_var + ' - ' + value_value;
    return generators.wrap(block, code);
  };

  generators['variable'] = function(block) {
    var dropdown_var = block.getFieldValue('var');
    var code = dropdown_var;
    return [code, generators.ORDER_ATOMIC];
  };

  generators['string'] = function(block) {
    var text_value = block.getFieldValue('value');
    var code = text_value;
    return [code, generators.ORDER_ATOMIC];
  };

  generators['number'] = function(block) {
    var text_value = block.getFieldValue('value');
    var code = text_value;
    return [code, generators.ORDER_ATOMIC];
  };

});
