define([
	"../../lib/mustache"
],function(
	Mustache
){

  function applyLanguage(obj, setter) {

    for (var prop in obj)
    {
      if (typeof obj[prop] == "object") applyLanguage(obj[prop], setter);
    }
		setter(obj);
  }

  var self = {};

  self.make = function(data, template, langSetter){
    if (langSetter) applyLanguage(data, langSetter);

    Mustache.parse(template);   // optional, speeds up future uses

    return Mustache.render(template, data);
  }
  return self;

});
