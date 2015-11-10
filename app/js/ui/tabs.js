define([
	"jquery"
	,"signals"
], function ($, Signal) {

	function select(name) {
		$("body").removeClass(current + "-active");

		if (name != current) self.tabSelected.dispatch(name, current);
		current = name;

		$("body").addClass(current + "-active");
	}


	var self = {};

	self.BLOCKS_TAB = "blocks";
	self.JS_TAB = "js";
	self.XML_TAB = "xml";

	self.tabSelected = new Signal();//new,old

	self.init = function() {

		$('#tabs').tab();
		var tabs = [self.BLOCKS_TAB, self.JS_TAB, self.XML_TAB];

		for (var i = 0; i < tabs.length; i++) {
			var name = tabs[i];
			$("#tab-" + name).click(function(name_) {
				return function() {
					select(name_);
				}
			}(name));
		}
	};

	self.addLocks = function() {
		$(".lock").addClass("glyphicon glyphicon-lock");
	}

	self.removeLocks = function() {
		$(".lock").removeClass("glyphicon glyphicon-lock");
	}

	self.setActive = function(name) {
		$(".tab-pane,.nav-tabs li").removeClass("active");
		$("#pane-" + name + ",#tab-" + name + "").addClass("active");

		select(name);
	}

	self.getActive = function() {
		return current;
	}

	var current = self.BLOCKS_TAB;
	$("body").addClass(current + "-active");

	self.addLocks();

	return self;
});
