define([
  "./task"
  ,"./task-utils"
  ,"./js-transforms"
],function(Task, taskUtils, jsTransforms){

  function getTaskId() {
    return ids[currentIndex];
  }

  function reducePause(dec){
    ids.forEach(function(id){
      tasks[id].reducePause(dec);
    });
  }

  var self = {};

  var tasks = {};
  var ids = [];
  var currentIndex;

  self.ready = false;
  self.parallel = false;

  self.getIds = function() {
    return ids.concat();
  }

  self.clear = function() {
    self.ready = false;
  }

  self.active = function() {
    if (currentIndex == -1) return null;
    return tasks[getTaskId()];
  }

  self.setup = function(js, initFunc) {
    var taskBlocks = taskUtils.getTaskBlocks(js);
    ids = Object.keys(taskBlocks);
    tasks = {};
    currentIndex = 0;
    self.parallel = (ids.length > 1);

    ids.forEach(function(id){
      var taskCode = taskBlocks[id];
      tasks[id] = new Task(id, taskCode, initFunc);
    });

    self.ready = true;
  }

  self.switch = function(pauseDec) {
    reducePause(pauseDec);

    var active = self.active();
    if (active) active.checkComplete();

    var tries = ids.length;
    var nextTaskIndex = currentIndex;
    currentIndex = -1;

    for (var t = 0; t < tries; t++) {
      nextTaskIndex++;
      nextTaskIndex %= ids.length;

      var id = ids[nextTaskIndex];
      var task = tasks[id];

      if (task.pauseActive())
      {
        //console.log(id, "pause active. skipping")
      } else if (task.complete)
      {
        //console.log(id, "complete. skipping");
      } else if (task.suspended)
      {
        //console.log(id, "suspended. skipping");
      } else {
        //console.log(id, "ready");
        currentIndex = nextTaskIndex;

        break;
      }
    }
  }

  self.allComplete = function(){
    return ids.every(function(id){
      return tasks[id].complete;
    });
  }

  self.allPaused = function(){
    return ids.every(function(id){
      return tasks[id].paused;
    });
  }

  self.resume = function(id){
    var task = tasks[id];
    if (!task) return;
    task.resume();
  }

  self.suspend = function(id){
    var task = tasks[id];
    if (!task) return;
    task.suspend();
  }

  self.restart = function(id){
    var task = tasks[id];
    if (!task) return;
    task.restart();
  }



  return self;

});
