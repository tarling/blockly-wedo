define([
  "signals"
],function(Signal){

  var self = {};

  self.blockParseMsg = new Signal();//type,msg

  self.clipboardSet = new Signal();
  self.blockAdded = new Signal();//block
  self.newProject = new Signal();
  self.blockHistoryChange = new Signal();
  self.workspaceChange = new Signal();
  self.selectionChange = new Signal();
  self.inited = new Signal();
  self.menuReady = new Signal();
  self.requestBlocklyRedraw = new Signal();

  return self;

});
