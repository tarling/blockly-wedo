define(function(){

  function Queue(completeCallback) {
    this.actions = 0;
    this.completeCallback = completeCallback;
    var t = this;
    this.add = function(value){
      if (typeof value == "undefined") value = 1;
      t.actions += value;
    }
    this.remove = function(){
      t.actions --;
	    if (t.actions === 0)
	    {
        if (t.completeCallback) t.completeCallback();
        t.completeCallback = null;
	    }
    }
  }
  return Queue;

});
