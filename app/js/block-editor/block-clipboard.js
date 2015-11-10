define([
  "../events"
  ,"../ui/tabs"
],function(events, tabs){

  function cutCopyCmd(remove) {
    if (Blockly.selected &&
        Blockly.selected.isDeletable() && Blockly.selected.isMovable() &&
        Blockly.selected.workspace == Blockly.mainWorkspace) {
      Blockly.hideChaff();
      Blockly.copy_(Blockly.selected);
      if (remove) Blockly.selected.dispose(true, true);

      events.clipboardSet.dispatch();
    }
  }

  $(document).keydown(function(e){
    if (e.altKey || e.ctrlKey || e.metaKey) {
      if (e.keyCode == 67) {
        // 'c' for copy.
        self.copy();
      } else if (e.keyCode == 88) {
        // 'x' for cut.
        self.cut();
      } else if (e.keyCode == 86) {
        // 'v' for paste.
        self.paste();
      }
    }
  });

  var self = {};

  self.cut = function(){
    cutCopyCmd(true);
  }

  self.copy = function(){
    cutCopyCmd(false);
  }

  self.paste = function(){
    if (Blockly.clipboardXml_) {
      Blockly.hideChaff();
      Blockly.mainWorkspace.paste(Blockly.clipboardXml_);
    }
  }

  return self;
});
