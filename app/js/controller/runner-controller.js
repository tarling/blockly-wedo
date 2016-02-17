define([
  "../runner/runner"
  , "../runner/controls"
  , "../runner/tasks"
  , "../runner/api/message"
  , "../block-editor/project-utils"
  , "../block-editor/project"
  , "../events"
],function(
  runner
  , controls
  , tasks
  , message
  , projectUtils
  , project
  , events
){
  var highlitBlocks;

  function hardReset() {
    runner.reset();


  }

  runner.complete.add(hardReset);

  controls.runClicked.add(function(){
    Blockly.hideChaff();
    runner.setSpeed(0.1);
    runner.run();
    message.reset();
    project.lock(true);
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
    project.lock(false);
    controls.reset();
    projectUtils.clearHighlight();
    Blockly.mainWorkspace.traceOn(false);
  });

  events.inited.addOnce(function(){
    controls.reset();
  });

});
