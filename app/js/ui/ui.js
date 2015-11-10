define([
	"jquery"
	,"signals"
],function($, Signal){

	function addPanel(id, html) {
    var wrapped = '<div id="pane-' + id + '">' + html + '</div>';
    $("#device-info").append(wrapped);
  }

  function addStyle(id) {
    var link = document.createElement("link");
    link.href = "css/" + id + ".css";
    link.type = "text/css";
    link.rel = "stylesheet";
    $("head").eq(0).append(link);
  }

  var self = {};

  self.selectedId = null;

  self.add = function(id, tabTitle, panelHTML, index) {
    addPanel(id, panelHTML);
    addStyle(id);
  };

  return self;

});
