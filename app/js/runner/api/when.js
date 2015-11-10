define(function(){

  var list, activeIndex;

  var self = {};

  //TODO - if there's more than one when block, start searching from the last activeIndex + 1, so everyone gets a go...
  self.test = function() {
    if (activeIndex == -1) return;
    activeIndex = list.findIndex(function(item, index){
      return item.test();
    });
    if (activeIndex >= 0) {
      list[list].callback();
      activeIndex = -1;
    }
  }

  self.enabled = function() {
    return list.length > 0;
  }

  self.add = function(test, callback) {
    list.push({test: test, callback: callback});
  }

  self.reset = function() {
    list = [];
    activeIndex = -1;
  }

  self.reset();

  return self;


});
