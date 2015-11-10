define([

  "jquery"
  ,"signals"
  ,"./queue"

],function($, Signal, Queue){

  function TextGroup(langCode) {
    var en, locale;

    function applyRepl(out, repl) {
      if (repl)
      {
        repl.forEach(function(s, index){
          index ++;
          out = out.replace("$" + index, s);
          out = out.replace("%" + index, s);
        });
      }
      return out;
    }


    this.load = function(path) {
      var signal = new Signal();

      var queue = new Queue(function(){
        signal.dispatch(en, locale);
      });

      queue.add();
      $.getJSON( path + "en.json", function(data){
        en = data;
        queue.remove();
      });
      if (langCode != "en")
      {
        queue.add();
        $.getJSON(path + langCode + ".json", function(data){
          locale = data;
          queue.remove();
        })
      }
      return signal;
    }

    this.get = function(id, repl) {
      var out;
      if (locale)
      {
        out = locale[id];
        if (out !== undefined) return applyRepl(out, repl);
      }
      out = en[id];
      if (out !== undefined) return applyRepl(out, repl);
      return "[" + id + "]"
    }
  }




  return TextGroup;

});
