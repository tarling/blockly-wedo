define(["signals"], function(Signal) {

  function deviceMatch(a,b) {
    return a.vendorId == b.vendorId && a.productId == b.productId;
  }

  var handlers = {};

  var hid = {};

  hid.connected = new Signal();//name
  hid.disconnected = new Signal();//name

  hid.addHandler = function(handler) {
    console.log("adding " + handler.name + " hid handler")
    handlers[handler.name] = handler;
  }

  hid.init = function() {
    chrome.hid.onDeviceAdded.addListener(checkNewDevice);

    var defs = [];
    for (var name in handlers) {
      defs.push(handlers[name].deviceDef);
    }

    chrome.hid.getDevices({filters:defs}, function(devices) {
      devices.forEach(checkNewDevice);
    });

    chrome.hid.onDeviceRemoved.addListener(function(deviceId){

      var handler, connectionData;
      for (var name in handlers) {
        connectionData = handlers[name].removeConnection(deviceId);
        if (connectionData)
        {
          handler = handlers[name];
          break;
        }
      }
      if (!handler)
      {
        console.log("device removed was not recognised");
        return;
      }

      chrome.hid.disconnect(connectionData.connectionId);
      hid.disconnected.dispatch(handler.name);
      clearTimeout(connectionData.pollTimeoutId);
    });

  }

  function connect(deviceInfo, handler) {

    var deviceId = deviceInfo.deviceId;
    //handler.deviceId = deviceId;

    chrome.hid.connect(deviceId, function(connection) {
      var connectionId = connection.connectionId;

      var connectionData = {
        deviceId : deviceId,
        connectionId: connectionId
      }

      handler.addConnection(connectionData);
      hid.connected.dispatch(handler.name);

      if (!handler.autoPoll) return;

      var poll = function() {
        chrome.hid.receive(connectionId, function(id, data) {
          if (chrome.runtime.lastError) {
            console.log("poll lastError:" + chrome.runtime.lastError.message);
            return;
          }

          handler.pollCallback(data, connectionData);//index is updated when devices are connected and disconnected

          connectionData.pollTimeoutId = setTimeout(poll, handler.pollMs);
        });
      }
      poll();
    });
  }

  function checkNewDevice(deviceInfo) {

    console.log("checking new device...");
    for (var name in handlers) {
      var handler = handlers[name];
      console.log("checking for match with " + handler.name);
      if (deviceMatch(deviceInfo, handler.deviceDef))
      {
        connect(deviceInfo, handler);
        return;
      }
    }
    console.log("Device not recognised");
  }

  return hid;

});
