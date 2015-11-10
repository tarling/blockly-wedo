define(function () {
	var self = {};

	self.getStringParamFromUrl = function(name, defaultValue) {
    var val = window.location.search.match(new RegExp('[?&]' + name + '=([^&]+)'));
    return val ? decodeURIComponent(val[1].replace(/\+/g, '%20')) : defaultValue;
  };

	self.mixin = function(obj, source) {
		for (var prop in source) {
			obj[prop] = source[prop]
		}
	}

	return self;
});
