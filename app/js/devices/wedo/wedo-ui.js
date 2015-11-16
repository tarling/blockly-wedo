define([
  "jquery"
  ,"../../ui/ui"
  ,"../../lang"
  ,"./wedo-names"
], function($, ui, lang, wedoNames) {

  //would it be nicer to read this in from an external file
  var uiHTML = '<div class="connection device-connection">\
      <div class="connected">...</div>\
      <div class="not-connected">...</div>\
    </div>\
    <div class="table-wrapper">\
      <table class="table">\
        <colgroup>\
          <col />\
          <col />\
          <col />\
        </colgroup>\
        <tbody>\
        </tbody>\
      </table>\
    </div>';

  var slotGroups = [];

  function getChar(index) {
    return String.fromCharCode(65+index);
  }

  function getTBody() {
    return $("#pane-" + ID + " tbody");
  }

  function makeSlotGroup(index) {

      var slot0Id = 'slot-' + (index + '-0');
      var slot1Id = 'slot-' + (index + '-1');

      var a = index * 2;
      var b = (index * 2) + 1;

      var html = '<tr id="' + slot0Id + '">\
        <th>' + getChar(a) + '</th>\
        <td class="slot-type"></td>\
        <td class="slot-value"></td>\
      </tr>\
      <tr id="' + slot1Id + '">\
        <th>' + getChar(b) + '</th>\
        <td class="slot-type"></td>\
        <td class="slot-value"></td>\
      </tr>';

      getTBody().append(html);

      getTBody().find("tr").sort(function(a,b) {
           return a.id > b.id;
      }).appendTo(getTBody());

      //cache jQuery objects so we don't have to look them up on every poll
      var group = [
        [$("#" + slot0Id + " .slot-type"), $("#" + slot0Id + " .slot-value")],
        [$("#" + slot1Id + " .slot-type"), $("#" + slot1Id + " .slot-value")]
      ];
      slotGroups[index] = group;
      return group;
  }


  var ID = wedoNames.NAME;
  ui.add(ID, "WeDo", uiHTML, 0);

  function isOutput(type) {
    return type == wedoNames.MOTOR || type == wedoNames.LIGHTBRICK || type == wedoNames.SERVO;
  }
  function isSensor(type) {
    return type == wedoNames.MOTION || type == wedoNames.TILT;
  }
  function isTilt(type) {
    return type == wedoNames.TILT;
  }
  function isOpen(type) {
    return type == wedoNames.OPEN;
  }

  var self = {};
  var TILT_STATES = ["none","down","this way","up","that way"];
  
  self.updateConnection = function(count) {
    if (count > 0)
    {
      var msg = (count > 1) ? lang.ui.get("WEDO_CONNECTION_N", [count]) : lang.ui.get("WEDO_CONNECTION_1");

      $("#pane-wedo .device-connection .connected").text(msg).show();
      $("#pane-wedo .device-connection .not-connected").hide();
    } else {
      $("#pane-wedo .device-connection .connected").hide();
      $("#pane-wedo .device-connection .not-connected").text(lang.ui.get("WEDO_NO_CONNECTION")).show();
    }
    getTBody().empty();
    slotGroups = [];
    makeSlotGroup(0);
  }

  self.updateSlots = function(slots, outputStates, index){

    var slotGroup = slotGroups[index];
    if (!slotGroup) slotGroup = makeSlotGroup(index);

    function getDisplay(idx) {
      var type = slots[idx].type;
      var value = slots[idx].value;
      if (isOpen(type)) value = "---";
      if (isOutput(type))
      {
        if (outputStates[idx].isOn)
            value = outputStates[idx].power;
        else
            value = lang.ui.get("DEVICE_OFF");
      }

      //TODO - commented out as breaks tilt switch operation as value is now a string not number 
      //we actually want to make the html 'screenvalue' = string but leave 'value' still numeric 
      //so it can still work with comparisions etc.
      //if (isTilt(type)) {
      //  value = TILT_STATES[value];
      //}

      var s = isSensor(type);
      type = type.toLowerCase();
      if (s) type += " " + lang.ui.get("DEVICE_SENSOR");

      return {
        type: type, value: value
      }
    }

    var a = getDisplay(0);
    var b = getDisplay(1);

    slotGroup[0][0].text(a.type);
    slotGroup[0][1].text(a.value);
    slotGroup[1][0].text(b.type);
    slotGroup[1][1].text(b.value);
  }

  return self;

});
