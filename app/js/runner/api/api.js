define([
  "./when"
  , "./wait"
  , "./message"
],function(when, wait, message){

  var api = {
    reset: function() {
      when.reset();
      wait.reset();
    },

    when: when.add,
    wait: wait,
    message: message
  };

  api.reset();

  return api;
});
