define([
  "jquery"
  ,"signals"
  ,"../events"
],function($, Signal, events){

  function disable() {
    Array.prototype.forEach.apply(arguments, [function(el){el.addClass("disabled")}]);
  }

  function enable() {
    Array.prototype.forEach.apply(arguments, [function(el){el.removeClass("disabled")}]);
  }

  function setRunState() {
    disable(runEl);
    enable(resetEl);
  }

  var runEl = $("#sim-run").click(function(e){
    setRunState();
    self.runClicked.dispatch();
  });

  var resetEl = $("#sim-reset").click(function(e){
    self.reset();
    self.resetClicked.dispatch();
  });

  var slider = $("#sim-speed");
  var sliderVal = $("#sim-speed-val");
  var min = 1;
  var max = 10;
  var val = 5;
  slider.attr({
    min: min
    , max: max
  }).on("input", function() {
    var v = parseInt(slider.val());
    sliderVal.text(v);
    sendSliderVal(v);
  }).val(val);
  sliderVal.text(val);

  function sendSliderVal(v){
    var n = v / (max - min);
    self.speedSet.dispatch(n);
  }

  events.inited.addOnce(function(){
    self.reset();
    sendSliderVal(val);
  });

  var self = {};

  self.runClicked = new Signal();
  self.resetClicked = new Signal();
  self.speedSet = new Signal();//0-1

  self.reset = function() {
    disable(resetEl);
    enable(runEl);
  }

  self.setRunState = function() {
    setRunState();
  }

  self.pause = function() {
    setPauseState();
  }

  return self;

});
