define(["../javascript"],function(generators){

  generators['wedo_turn_on'] = function(block) {
    var dropdown_type = block.getFieldValue('type');
    var code = 'wedo.set(\'' + dropdown_type + '\', true)'
    return generators.wrap(block, code);
  };
  generators['wedo_turn_off'] = function(block) {
    var dropdown_type = block.getFieldValue('type');
    var code = 'wedo.set(\'' + dropdown_type + '\', false)'
    return generators.wrap(block, code);
  };
  generators['wedo_turn_on_for'] = function(block) {
    var dropdown_type = block.getFieldValue('type');
    var text_time = generators.valueToCode(block, 'time', generators.ORDER_ATOMIC);
    var code = 'wedo.set(\'' + dropdown_type + '\', true);\n';
    code += 'wait.for(' + text_time + ');\n';
    code += 'wedo.set(\'' + dropdown_type + '\', false)'
    return generators.wrap(block, code);
  };
  generators['wedo_power'] = function(block) {
    var dropdown_type = block.getFieldValue('type');
    var text_power = generators.valueToCode(block, 'power', generators.ORDER_ATOMIC);
    var code = 'wedo.power(\'' + dropdown_type + '\', ' + text_power + ')'
    return generators.wrap(block, code);
  };
  generators['wedo_motor_direction'] = function(block) {
    var dropdown_type = block.getFieldValue('type');
    var dropdown_direction = block.getFieldValue('direction');
    var code = 'wedo.direction(\'' + dropdown_type + '\', \'' + dropdown_direction + '\')'
    return generators.wrap(block, code);
  };

});
