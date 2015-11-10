define( [
  "jquery"
  ,"../events"
  ,"../ui/tabs"
  ,"../ui/messages"
  ,"../block-editor/project"
  ,"../js-editor"
  ,"../xml-editor"
  ,"../devices/wedo/blockly/generators/javascript"
],
function(
  $
  , events
  , tabs
  , messages
  , project
  , jsEditor
  , xmlEditor
  , jsGenerator
  ) {

  tabs.tabSelected.add(function (newTab, oldTab)
  {
    switch (oldTab)
    {
      case tabs.BLOCKS_TAB:
        Blockly.hideChaff();
        messages.clearBlockly();
        break;
    }
    switch (newTab)
    {
      case tabs.BLOCKS_TAB:
        messages.clear();
        Blockly.mainWorkspace.render();
        break;
      case tabs.XML_TAB:
        xmlEditor.setContent(project.getXml(true));
        break;
      case tabs.JS_TAB:
        jsEditor.setContent(jsGenerator.workspaceToCode());
        break;
    }
  });

  events.inited.addOnce(tabs.init);
});
