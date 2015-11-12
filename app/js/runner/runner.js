define([
  "signals"
  ,"acorn"
  ,"../devices/wedo/blockly/generators/javascript"
  ,"../blockly/constants"
  ,"../utils"
  ,"../block-editor/project"
  ,"./api/api"
  ,"./api/when"
  ,"./api/wait"
  ,"./js-transforms"
  ,"./tasks"
],function(
  Signal
  , acorn
  , jsGenerator
  , blocklyConstants
  , utils
  , project
  , api
  , when
  , wait
  , jsTransforms
  , tasks){

  var stepTimeoutID;
  var intervalMs;
  var simPaused = false;
  var waiting = false;
  var autoplay = false;


  var INTERVAL_RANGE_MS = 1000;
  var MIN_INTERVAL_MS = 5;

  window.acorn = acorn;

  function clearTimeoutId() {
    window.clearTimeout(stepTimeoutID);
    stepTimeoutID = null;
  }

  function voToArray(obj) {
    var out = [];
    for (var prop in obj.properties)
    {
      out[prop] = obj.properties[prop].valueOf();
    }
    return out;
  }

  function mapAPI() {
    return function(intrprtr, scope) {
      function recurse(real,fake) {
        for (var prop in real) {
          var realChild = real[prop];
          var type = typeof realChild;
          if (type == "function") {
            var wrapper = (function(thisObj, func) {
              return function() {
                var args = Array.prototype.map.apply(arguments, [function(val){
                  if (val.hasOwnProperty("length"))
                  {
                    return voToArray(val);
                  } else {
                    return val.valueOf()
                  }
                }]);
                return intrprtr.createPrimitive(func.apply(thisObj, args));
              }
            })(real, realChild);
            intrprtr.setProperty(fake, prop, intrprtr.createNativeFunction(wrapper));

          } else if (type == "object")
          {
            var fakeChildObj  = intrprtr.createObject(intrprtr.OBJECT);
            intrprtr.setProperty(fake, prop, fakeChildObj);
            recurse(realChild, fakeChildObj);
          }
        }
      }
      recurse(api, scope);

      intrprtr.setProperty(scope, blocklyConstants.PRESTEP_PREFIX,
          intrprtr.createNativeFunction(function(id) {
            return intrprtr.createPrimitive(blocklyPreStep(id.valueOf()));
          }));

      intrprtr.setProperty(scope, blocklyConstants.POSTSTEP_PREFIX,
          intrprtr.createNativeFunction(function(id, isProcCall) {
            return intrprtr.createPrimitive(blocklyPostStep(id.valueOf()));
          }));

      intrprtr.setProperty(scope, blocklyConstants.INNERSTEP_PREFIX,
          intrprtr.createNativeFunction(function(id) {
            return intrprtr.createPrimitive(blocklyInnerStep(id.valueOf()));
          }));

      intrprtr.setProperty(scope, blocklyConstants.WARNING_COMMAND,
          intrprtr.createNativeFunction(function(id) {
            return intrprtr.createPrimitive(blocklyWarning(id.valueOf()));
          }));
    }
  }

  function highlightBlock(id) {
    self.blockHighlit.dispatch(id);
    pause();
  }

  function pause() {
    self.stepped.dispatch();
    simPaused = true;
  }

  function blocklyPreStep(id) {
    highlightBlock(id);
  }

  function blocklyInnerStep(id) {
    var id = id.split(".")[0];
    highlightBlock(id);
  }

  function blocklyPostStep(id) {

  }

  function blocklyWarning(id){
    highlightBlock(id);
    stopped();
    self.hitWarning.dispatch(id);
  }

  function stopped() {
    waiting = false;
    simPaused = true;
    autoplay = false;
  }

  function parse() {
    //parse JS
    var js = jsGenerator.workspaceToCode(true);
    console.log("js", js)
    
    tasks.setup(js, mapAPI());

    self.parsed.dispatch();
  }

  function reset() {
    tasks.clear();
    api.reset();

    clearTimeoutId();

    waiting = false;
    simPaused = false;
    autoplay = false;

    self.resetted.dispatch();
  }

  function takeStep() {
    //console.log("takeStep");
    var task = tasks.active();
    if (!task)
    {
      console.log("no task");
      return;
    }

    when.test();
    if (!wait.test()) return;

    var taskComplete = task.step();
    if (taskComplete) {
      // Task complete
      if (tasks.allComplete())
      {
        self.complete.dispatch();
        reset();
      } else {
        tasks.switch(pauseDec);
      }
    } else if (simPaused) {
      // A block has been highlighted.  Pause execution here.
      simPaused = false;
      tasks.switch(pauseDec);
    } else {
      // Keep executing until a highlight statement is reached.
      takeStep();
    }
  }

  function autoStep() {
    if (!tasks.active())
    {
      tasks.switch(pauseDec);
    }
    takeStep();

    if (!autoplay || waiting || simPaused) return;
    clearTimeoutId();
    stepTimeoutID = window.setTimeout(function(){
      autoStep();
    }, intervalMs);
  }

  var pauseDec = 25;

  var self = {};

  self.parsed = new Signal();
  self.stepped = new Signal();
  self.complete = new Signal();
  self.resetted = new Signal();
  self.hitWarning = new Signal();
  self.blockHighlit = new Signal();//id, jsRange, basicRange

  self.addAPI = function(otherApi, reset) {
    utils.mixin(api, otherApi);

    if (reset)
    {
      var pr = api.reset;
      api.reset = function() {
        pr();
        reset();
      }
    }
  }

  self.reset = function() {
    reset();
  }

  self.setSpeed = function(n) {//n: 0-1, 0 slowest, 1 fastest
    n = Math.max(Math.min(n,1),0);//clamp number
    intervalMs = MIN_INTERVAL_MS + (INTERVAL_RANGE_MS * n);
  }

  self.run = function() {
    if (!tasks.ready) parse();
    autoplay = true;
    clearTimeoutId();
    autoStep();
  }

  self.pause = function() {
    clearTimeoutId();
  }

  self.step = function() {
    if (!tasks.ready) parse();
    autoplay = false;
    clearTimeoutId();

    if (!tasks.active())
    {
      tasks.switch(pauseDec);
    }
    takeStep();
  }

  return self;

});
