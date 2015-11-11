define([
  "../../lang"
],function(lang){

  var self = {
    write: function(msg){
      $('.message').append('<p>' + msg + '</p>');
      var el = $('.message')[0];
      el.scrollTop = el.scrollHeight;
    },
    clear: function() {
      $('.message').empty();
    },
    reset: function() {
      self.clear();
    }
  }

  return self;

});
