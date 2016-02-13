define(["../javascript"],function(generators){

  generators['var_set'] = function(block) {
    var dropdown_var = block.getFieldValue('var');
    var value_value = generators.valueToCode(block, 'value', generators.ORDER_ATOMIC);
    var code = dropdown_var + ' = ' + value_value;
    return generators.wrap(block, code);
  };

  generators['var_random'] = function(block) {
    var dropdown_var = block.getFieldValue('var');
    var code = dropdown_var + ' = Math.round(Math.random() * 100)';
    return generators.wrap(block, code);
  };
  
  generators['var_op'] = function(block) {
  var value_var1 = generators.valueToCode(block, 'VAR1', generators.ORDER_ATOMIC);
  var dropdown_op = block.getFieldValue('OP');
  var value_var2 = generators.valueToCode(block, 'VAR2', generators.ORDER_ATOMIC);
  if (!value_var1) value_var1 = 0;
  if (!value_var2) value_var2 = 0;

  var code;
  switch(dropdown_op)
  {
    case "and":
      dropdown_op = "&";
      break;
    case "or":
      dropdown_op = "|";
      break;
    case "xor":
      dropdown_op = "^";
      break;
    case "min":
      code = "Math.min(" + value_var1 + "," + value_var2 + ")";
      break;
    case "max":
      code = "Math.max(" + value_var1 + "," + value_var2 + ")";
      break;
  }

  if (!code) code = "(" + value_var1 + " " + dropdown_op + " " + value_var2 + ")";

  return [code, generators.ORDER_ATOMIC];
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
    text_value = text_value.replace(/'/g, "\'")
    var code = "'" + text_value + "'";
    return [code, generators.ORDER_ATOMIC];
  };

  generators['number'] = function(block) {
    var text_value = block.getFieldValue('value');
    var code = text_value;
    return [code, generators.ORDER_ATOMIC];
  };

});
