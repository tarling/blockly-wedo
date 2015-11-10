define([
  "interpreter"
],function(Interpreter){

  function Task(id, code, initFunc) {
    this.id = id;
    this.code = code;
    this.initFunc = initFunc;
    this.restart();
  }

  Task.prototype.restart = function() {
    this.interpreter = new Interpreter(this.code, this.initFunc);
    this.openIds = [];
    this.lastClosed = null;
    this.suspended = false;
    this.complete = false;
    this.pauseCount = 0;
    this.completing = false;
  }

  Task.prototype.pauseActive = function() {
    return this.pauseCount > 0;
  }

  Task.prototype.reducePause = function(dec) {
    this.pauseCount = Math.max(0, this.pauseCount - dec);
  }

  Task.prototype.step = function(pauseDec) {
    this.complete = !this.interpreter.step();
    return this.complete;
  }

  Task.prototype.suspend = function() {
    this.suspended = true;
  }

  Task.prototype.resume = function() {
    this.suspended = false;
  }

  Task.prototype.pause = function(ms) {
    this.pauseCount = ms;
  }

  Task.prototype.stop = function() {
    this.completing = true;
  }

  Task.prototype.checkComplete = function() {
    if (this.completing == true)
    {
      this.completing = false;
      this.complete = true;
    }
  }

  return Task;

});
