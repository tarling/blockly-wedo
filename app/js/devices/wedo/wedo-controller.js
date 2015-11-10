define([
  "../../events"
  ,"./wedo-ui"
  ,"./wedo-usb"
  ,"../hid"
],function(events, ui, wedoUsb, hid){

  function updateConnection() {
    ui.updateConnection(wedoUsb.getConnectionCount());
  }

  events.inited.addOnce(updateConnection);
  hid.connected.add(updateConnection);
  hid.disconnected.add(updateConnection);

  wedoUsb.polled.add(ui.updateSlots);


});
