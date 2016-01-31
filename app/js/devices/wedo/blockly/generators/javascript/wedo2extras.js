define(["../javascript"],function(generators){

  generators['led_colour'] = function(block) {
    var colour = block.getFieldValue('colour');
    var value = block.getFieldValue('value');
    var code = 'wedo.setLED(' + value + ', ' + colour + ')'
    return generators.wrap(block, code);
  };

  generators['piezo'] = function(block) {
    var note = block.getFieldValue('note');
    var octave = block.getFieldValue('octave');
    var value = block.getFieldValue('value');
    var value_time = generators.valueToCode(block, 'time', generators.ORDER_ATOMIC);
    var code = 'wedo.playNote(' + value + ', ' + note + ', ' + octave + ', ' + value_time + ')'
    return generators.wrap(block, code);
  };
  
  generators['wait_until_button'] = function(block) {
    var value = block.getFieldValue('value');   
    var code = 'while(!((wedo.getButton(\'' + value + '\')) == 1)){\n'
    code += generators.getInnerStepCode(block);
    code += "}"    
    return generators.wrap(block, code);
  };
});
