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
    say: function(msg) {
      chrome.tts.speak(msg, {'enqueue': true});
    },
    sayStop: function() {
      chrome.tts.stop();
    },    
    reset: function() {
      self.clear();
      chrome.tts.stop();
    }
  }

  return self;

});
