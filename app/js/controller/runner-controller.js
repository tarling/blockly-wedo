define([
  "../runner/runner"
  , "../runner/controls"
  , "../runner/tasks"
  , "../runner/api/message"
  , "../block-editor/project-utils"
  , "../events"
],function(
  runner
  , controls
  , tasks
  , message
  , projectUtils
  , events
){
  var highlitBlocks;

  function hardReset() {
    //project.lock(false);
    runner.reset();
    controls.reset();
  }

  runner.complete.add(hardReset);

  controls.runClicked.add(function(){
    runner.run();
    message.reset();
  });

  controls.resetClicked.add(function(){
    runner.reset();
  });

  controls.speedSet.add(function(n){
    runner.setSpeed(n);
  });

  runner.blockHighlit.add(function(id){
    var taskIndex = tasks.getIds().indexOf(tasks.active().id);
    highlitBlocks[taskIndex] = id;
    projectUtils.highlightBlocks(highlitBlocks);
  });

  runner.parsed.add(function(){
    Blockly.mainWorkspace.traceOn(true);
    highlitBlocks = tasks.getIds().map(function(){return 0});
  });

  runner.hitWarning.add(function(id){
    Blockly.mainWorkspace.getBlockById(id).warning.setVisible(true);
    hardReset()
  });

  runner.resetted.add(function(){
    projectUtils.clearHighlight();
    Blockly.mainWorkspace.traceOn(false);
  });

  events.inited.addOnce(function(){
    controls.reset();
    message.reset();
  });

});
