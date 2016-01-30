define( [
  "jquery"
  ,"../events"
  ,"../ui/modals"
  ,"../ui/tabs"
  ,"../ui/menubar"
  ,"../lang"
  ,"../block-editor/project"
],
function(
  $
  , events
  , modals
  , tabs
  , menubar
  , lang
  , project
  ) {

    menubar.itemClicked.add(function (name)
    {
      switch (name)
      {
        case "px-pm-new":
          function proceed()
          {
            project.discard();
          }
          if (project.dirty)
          {
            modals.showMessageModal(
              lang.ui.get("WARNING"), lang.ui.get("LOSE_CHANGES_WARNING"), lang.ui.get("NEW_PROJECT_ACTION"), lang.ui.get("CANCEL_ACTION"), proceed,
              function () {}
            );
          }
          else
          {
            proceed();
          }
          break;
        case "px-pm-save":
          project.save();
          break;
        case "px-pm-open":
          project.load(function (merge, dontMerge)
          {
            modals.showMessageModal(
              lang.ui.get("MERGE_PROJECT"), lang.ui.get("MERGE_PROMPT"), lang.ui.get("MERGE_ACTION"), lang.ui.get("DONT_MERGE_ACTION"), merge, dontMerge
            );
          });
          tabs.setActive(tabs.BLOCKS_TAB);
          break;
        case "px-bm-port":  

          break;

        case "px-bm-scan":  

          break;
          
        }
    });

    $(document).on('click',function(){
    	if($('.collapse').collapse) $('.collapse').collapse('hide');
    });

    events.inited.addOnce(function(){
      menubar.init();
      events.menuReady.dispatch();
    });

});
