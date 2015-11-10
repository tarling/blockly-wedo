define(["../javascript"],function(generators){

  generators['log'] = function(block) {
    var value_value = generators.valueToCode(block, 'value', generators.ORDER_ATOMIC);
    var code = 'message.write(\'' + value_value.replace(/'/g, "\'") + '\')';
    return generators.wrap(block, code);
  };

  generators['log_clear'] = function(block) {
    var code = 'message.clear()';
    return generators.wrap(block, code);
  };

});
