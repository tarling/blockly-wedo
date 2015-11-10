define([
  "../events"
  , "../language-selection"
  , "../storage"
  , "../block-editor/project"
],function(events, languageSelection, storage, project){

  var XML_KEY = "xml";

  events.inited.addOnce(function(){
    storage.get([XML_KEY], function(data){
      var str = data[XML_KEY];
      if (str) project.setFromXml(str);
    });
  });

  languageSelection.beforeChange.add(function() {
    var data = {};
    data[XML_KEY] = project.getXml();
    storage.set(data);
  });

});
