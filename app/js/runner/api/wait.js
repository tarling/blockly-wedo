define(function(){

  var duration, waitStart;

  function getSeconds() {
    return (new Date()).getTime()/1000;
  }

  var self = {
    for: function(secs) {
      duration = secs;
      waitStart = getSeconds();
    },
    reset: function() {
      duration = -1;
      waiting = false;
      waitTest = null;
      waitStart = null;
    },
    test: function() {
      var ok = true;
      if (duration > -1)
      {
        var now = getSeconds();
        if ((now - waitStart) > duration)
        {
          duration = -1;
        } else {
          ok = false;
        }
      }
      return ok;
    }
  }

  self.reset();

  return self;
});
