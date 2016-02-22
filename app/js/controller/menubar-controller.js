define( [
  "jquery"
  ,"../events"
  ,"../ui/modals"
  ,"../ui/tabs"
  ,"../ui/menubar"
  ,"../lang"
  ,"../block-editor/project"
  ,"../serial/serial-ports"
  ],
function(
  $
  , events
  , modals
  , tabs
  , menubar
  , lang
  , project
  , ports
  ) {

    menubar.itemClicked.add(function (name)
    {
      switch (name)
      {
        case "px-pm-new":
          function proceedNew()
          {
            project.discard();
          }
          if (project.dirty)
          {
            modals.showMessageModal(
              lang.ui.get("WARNING"), lang.ui.get("LOSE_CHANGES_WARNING"), lang.ui.get("NEW_PROJECT_ACTION"), lang.ui.get("CANCEL_ACTION"), proceedNew,
              function () {}
            );
          }
          else
          {
            proceedNew();
          }
          break;
        case "px-pm-save":
          project.save();
          break;
        case "px-pm-open":
          function proceed()
          {
            project.load(false);
            tabs.setActive(tabs.BLOCKS_TAB);
          }
          if (project.dirty)
          {
            modals.showMessageModal(
              lang.ui.get("WARNING"), lang.ui.get("LOSE_CHANGES_WARNING"), lang.ui.get("OK_ACTION"), lang.ui.get("CANCEL_ACTION"), proceed,
              function () {}
            );
          }
          else
          {
            proceed();
          }
          break;
        case "px-pm-merge":
          project.load(function (merge, dontMerge)
          {
            modals.showMessageModal(
              lang.ui.get("MERGE_PROJECT"), lang.ui.get("MERGE_PROMPT"), lang.ui.get("MERGE_ACTION"), lang.ui.get("DONT_MERGE_ACTION"), merge, dontMerge
            );
          });
          tabs.setActive(tabs.BLOCKS_TAB);
          break;
        case "px-sm-scan":  

          break;
          
        }
    });

    $(document).on('click',function(){
    	if($('.collapse').collapse) $('.collapse').collapse('hide');
    });

    var firstRun = true;
    menubar.settingsMenuShown.add(function (id)
    {
      ports.requestList(function (list, selectedIndex)
      {
        menubar.makePortsMenu(list, firstRun ? selectedIndex : -1);
        firstRun = false;
      });
    });
  
    menubar.portSelected.add(function (id)
    {
      //TODO ports.set(id);
    });
  
    events.inited.addOnce(function(){
      menubar.init();
      events.menuReady.dispatch();
    });

});
