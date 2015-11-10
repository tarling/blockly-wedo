define([
  "../events"
  ,"../ui/menubar"
  ,"../block-editor/block-history"
  ,"../block-editor/block-clipboard"


],function(events, menubar, blockHistory, blockClipboard){

  events.blockHistoryChange.add(function(){

    menubar.enableItems(["bem-undo"], blockHistory.isUndoAvailable());
    menubar.enableItems(["bem-redo"], blockHistory.isRedoAvailable());

  });

  events.selectionChange.add(function(){

    menubar.enableItems(["bem-cut", "bem-copy"], Blockly.selected !== null);

  });

  events.clipboardSet.add(function(){

    menubar.enableItems(["bem-paste"], true);

  });

  events.menuReady.add(reset);

  events.newProject.add(reset);

  function reset() {
    menubar.enableItems(["bem-undo", "bem-redo", "bem-cut", "bem-copy", "bem-paste"], false);
  }

  menubar.itemClicked.add(function (name)
  {
    name = name.replace("px-bem-", "");
    switch (name)
    {
      case "undo":
        blockHistory.undo();
        break;
      case "redo":
        blockHistory.redo();
        break;
      case "cut":
        blockClipboard.cut();
        break;
      case "copy":
        blockClipboard.copy();
        break;
      case "paste":
        blockClipboard.paste();
        break;
    }

  });

  events.inited.addOnce(function(){
    var workspace = Blockly.mainWorkspace;
    workspace.addChangeListener(function ()
    {
      if (Blockly.dragMode_ === 0)
      {
        events.workspaceChange.dispatch();
      }
    });
    Blockly.bindEvent_(workspace.getCanvas(), "blocklySelectChange", null, function() {
      events.selectionChange.dispatch();
    });

    $(".diagram svg, .blocklyWidgetDiv, .blocklyToolboxDiv").contextmenu(function(e){
      //stop right click triggering contextmenu
      e.preventDefault();
    });;

  });



});
