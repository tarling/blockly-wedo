define([
  "../block-editor/project"
  ,"../events"
],function(project, events){

  var idCounter = 0;

  function HistoryItem(state) {
    this.id = ++idCounter;
    this.state = state;
  }

  events.newProject.add(function(){
    reset();
  });

  events.workspaceChange.add(function(){
    if (lock) return;
    window.setTimeout(function(){
      addToUndoStack();
    }, Blockly.BUMP_DELAY * 1.5);
  });

  function addToUndoStack() {
    if (lock) return;
    var state = project.getXml();
    var item = new HistoryItem(state)
    undoStack.push(item);
    redoStack = [];
    if (undoStack.length > 30) undoStack.shift();

    sendUpdateEvent();
  }

  function sendUpdateEvent(){
    events.blockHistoryChange.dispatch();
  }

  function reset() {
    if (lock) return;
    undoStack = [];
    redoStack = [];
  }

  function setState(historyItem) {
    lock = true;
    project.setFromXml(historyItem.state);
    sendUpdateEvent();

    window.setTimeout(function(){
      lock = false
    },100);
  }

  var lock = false;

  var self = {};

  var undoStack = [];
  var redoStack = [];
  reset();

  self.isUndoAvailable = function() {
    return undoStack.length > 1;
  }
  self.isRedoAvailable = function() {
    return redoStack.length > 0;
  }

  self.undo = function() {
    if (lock) return;

    if (!self.isUndoAvailable())
    {
      console.warn("block-history undo - no state available");
      return;
    }
    var current = undoStack.pop();
    redoStack.push(current)
    var previous = undoStack[undoStack.length - 1]
    setState(previous);
  }

  self.redo = function() {
    if (lock) return;

    if (!self.isRedoAvailable())
    {
      console.warn("block-history redo - no state available");
      return;
    }
    var previous = redoStack.pop();
    undoStack.push(previous)
    setState(previous);
  }

  return self;


});
