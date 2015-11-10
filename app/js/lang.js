define([
    "jquery"
    ,"signals"
    ,"./text-group"
], function($, Signal, TextGroup) {


  var self = {};

  self.textLoaded = new Signal();

  self.load = function(langCode) {
    var groups = 3;

    var checkReady = function() {
      groups --;
      if (groups === 0) self.textLoaded.dispatch();
    }

    self.blocks = new TextGroup(langCode);
    self.blocks.load("json/blocks/").addOnce(function(en, locale){
      checkReady();
    });

    self.ui = new TextGroup(langCode);
    self.ui.load("json/ui/").addOnce(function(en, locale){
      checkReady();
    });

    $.getJSON( "lib/blockly/msg/json/" + langCode + ".json", function(data){
      Blockly.Msg = data;
      checkReady();
    });
	};



	return self;
});
