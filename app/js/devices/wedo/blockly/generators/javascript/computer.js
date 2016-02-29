define(["../javascript"],function(generators){

  generators['comment'] = function(block) {
    var value_value = generators.valueToCode(block, 'value', generators.ORDER_ATOMIC);
    var code = '/* ' + value_value.trim() + ' */';
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

  generators['say'] = function(block) {
    var value_value = generators.valueToCode(block, 'value', generators.ORDER_ATOMIC);
    var code = 'message.say(' + value_value + ')';
    return generators.wrap(block, code);
  };

  generators['say_stop'] = function(block) {
    var code = 'message.sayStop()'
    return generators.wrap(block, code);
  }; 
  
  generators['play_file'] = function(block) {
    var text_value = block.getFieldValue('value');
    text_value = text_value.replace(/'/g, "\'")
    var code = 'wedo.playFile(' + "'" + text_value + "'" + ')';
    return generators.wrap(block, code);
  };  
  
  generators['play_stop'] = function(block) {
    var code = 'wedo.playStop()'
    return generators.wrap(block, code);
  };  
  
});
