define([
	"jquery"
	], function ($) {

	var el = $("#content-xml");
	el.attr("disabled", "true");

	var self = {};
	self.getContent = function() {
		return el.text();
	}

	self.setContent = function(content) {
		el.text(content);
	}

	return self;

});
