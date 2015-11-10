define([
  "jquery"
  , "../events"
  , "../ui/textsetter"

], function(
  $
  , events
  , textsetter){

    events.inited.addOnce(function(){
      textsetter.init();
    });

    $("#version").text("v" + chrome.runtime.getManifest().version);

});
