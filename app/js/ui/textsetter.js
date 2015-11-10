define([
  "../lang"
],function(lang){


  function set(sel, id) {
    $(sel).text(lang.ui.get(id));
  }

  var self = {};

  self.init = function() {

    document.title = lang.ui.get("TITLE");

    set("h1", "TITLE");

    set("#tab-blocks .tab-label", "TAB_BLOCKS");
    set("#tab-js .tab-label", "TAB_JS");
    set("#tab-xml .tab-label", "TAB_XML");
  }

  return self;

});
