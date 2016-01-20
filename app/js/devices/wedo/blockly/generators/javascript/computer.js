define(["../javascript"],function(generators){

  generators['comment'] = function(block) {
    var value_value = generators.valueToCode(block, 'value', generators.ORDER_ATOMIC);
    var code = '/*\n' + value_value + '\n*/';
    return generators.wrap(block, code);
  };

  generators['log'] = function(block) {
    var value_value = generators.valueToCode(block, 'value', generators.ORDER_ATOMIC);
    var code = 'message.write(' + value_value + ')';
    return generators.wrap(block, code);
  };

  generators['log_clear'] = function(block) {
    var code = 'message.clear()';
    return generators.wrap(block, code);
  };

});
