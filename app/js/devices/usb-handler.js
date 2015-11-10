define([
  "signals"
],function(Signal) {
  
  /*
  interface IConnectionData = {
    deviceId : string;
    connectionId: string;
    index:number;
  }
  */

  function USBHandler(name, deviceDef, pollCallback, pollMs) {
    this.name = name;
    this.deviceDef = deviceDef;
    this.pollCallback = pollCallback;
    this.pollMs = pollMs;
    this.connections = [];
    this.connectionRemoved = new Signal();
    this.connectionAdded = new Signal();
    this.autoPoll = true;
    
    this.addConnection = function(data) {
      var idx = this.connections.length;
      data.index = idx;
      this.connections.push(data);
      
      this.connectionAdded.dispatch(data);
    }

    this.removeConnection = function(deviceId) {
      var found;

      for (var i = 0; i < this.connections.length; i++) {

        var d = this.connections[i];
        if (d.deviceId == deviceId)
        {
          found = d;
          this.connections.splice(i, 1);
          this.connections.forEach(function(item, index){
            item.index = index;
          });
          this.connectionRemoved.dispatch();
          return found;
        }
      }
    }
  }

  return USBHandler;

});
