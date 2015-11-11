define([
  "../usb-handler"
  , "../hid"
  , "./wedo-names"
  , "./wedo-outputs"
  , "signals"], function(USBHandler, hid, names, outputs, Signal) {

  var scope = this;

  var DEVICE_DEF = {
   vendorId: 0x0694,
   productId: 0x0003
  };
  var BUSY = "";

  var lastReportStr;

  /*
  interface IWeDoInstance extends IConnectionData {
    slots;
    states;
    motorOffTime;
    aTypeBytes;
    bTypeBytes;
  }
  */

  var INDEX_LOOK_UP = {};

  (function(){

    function getIndicesFor(letter) {
      var n = letter.charCodeAt(0) - 65;
      var index = Math.floor(n/2);
      var sub = n % 2;
      return [index,sub]
    }

    for (var i = 0; i < 26; i++) {
      var l = String.fromCharCode(i + 65);
      INDEX_LOOK_UP[l] = getIndicesFor(l);
    }

  })()

  var sensorsByType;


  //USBHandler(name, deviceDef, pollCallback, pollMs)
  var handler = new USBHandler(names.NAME, DEVICE_DEF, pollCallback, 3);
  hid.addHandler(handler);
  handler.connectionRemoved.add(function(){
    self.reset();
  });

  function pollCallback(data, conn) {
    if (data != null) {

      var bytes = new Uint8Array(data);
      data = null;

      var reportStr = Array.prototype.join.call(bytes);
      if (reportStr == lastReportStr) return;
      lastReportStr = reportStr;

      if (!conn.slots) setupNewInstance(conn);

      var slots = conn.slots;

      var aTypeBytes = bytes[3];
      var bTypeBytes = bytes[5];

      var aType, bType;
      if (slots.length == 0 || (outputs.okayToReadIDs(conn) && (aTypeBytes != conn.aTypeBytes || bTypeBytes != conn.bTypeBytes)))
      {
        aType = getType(aTypeBytes);
        bType = getType(bTypeBytes);
        conn.aTypeBytes = aTypeBytes;
        conn.bTypeBytes = bTypeBytes;
      } else {
        aType = slots[0].type;
        bType = slots[1].type;
      }

      var aValue = getValue(aType, bytes[2]);
      var bValue = getValue(bType, bytes[4]);

      slots[0] = {type: aType, value: aValue};
      slots[1] = {type: bType, value: bValue};

      sensorsByType[aType] = aValue;
      sensorsByType[bType] = bValue;

      self.polled.dispatch(conn.slots, conn.states, conn.index);
    };
  }



  function setupNewInstance(connectionData) {
    connectionData.slots = [];
    connectionData.motorOffTime = 0;
    connectionData.states = [
        {power: 100, dir: 1, isOn: false},
        {power: 100, dir: 1, isOn: false}
    ];
  }

  function isMotor(type) {
    return type == names.MOTOR || type == names.SERVO || type == names.SHORTHI || type == names.SHORTLO;
  }

  function isLight(type) {
    return type == names.LIGHTBRICK;
  }

  function isSensor(type) {
    return type == names.MOTION || type == names.TILT;
  }

  function getSlotFor(letter) {
    var i = INDEX_LOOK_UP[letter];
    var conn = handler.connections[i[0]];
    return conn && conn.slots ? conn.slots[i[1]] : null;
  }

  function getDataFor(letter) {
    var i = INDEX_LOOK_UP[letter];
    return handler.connections[i[0]];
  }

  function getDeviceAt(slotName) {
    var conn = getDataFor(slotName);
    var index = INDEX_LOOK_UP[slotName][1];
    return {conn:conn, index:index}
  }


  // WeDo (power functions) ID values
  // Source: https://github.com/ev3dev/lego-linux-drivers/tree/master/wedo

  var ID_LIST = [
    9, //var WEDO_TYPE_SHORTLO	=   9 ; // (short to 0V, 0) motor active braking also gives value <5
  	27,//var WEDO_TYPE_BEND	    =  27 ; // (1k5, 16-17)
  	47,//var WEDO_TYPE_TILT	    =  47 ; // (3k9, 38-39)
  	67,//var WEDO_TYPE_FUTURE	=  67 ; // (6k8, 58-59)
  	82,//var WEDO_TYPE_RAW		=  82 ; // (10k, 77-78) CPS changed 87 to 82
  	92,//var WEDO_TYPE_TOUCH	    =  92 ; // (12k, 86-87) CPS changed 100 to 92
  	109,//var WEDO_TYPE_SERVO	    = 109 ; // (15k, 99-102)
  	131,//var WEDO_TYPE_SOUND	    = 131 ; // (22k, 120-121)
  	152,//var WEDO_TYPE_TEMP	    = 152 ; // (33k, 143-144)
  	169,//var WEDO_TYPE_LIGHT	    = 169 ; // (47k, 161-162)
  	190,//var WEDO_TYPE_MOTION	= 190 ; // (68k, 176-179) aka distance
  	207,//var WEDO_TYPE_LIGHTBRICK =207 ; // (150k, 203-204)aka LEDs CPS changed from 211 to 207
  	224,//var WEDO_TYPE_22		= 224 ; // (220k, 210-211)
  	233,//var WEDO_TYPE_OPEN	    = 233 ; // (228-231) no i/o device is connected
  	246,//var WEDO_TYPE_MOTOR	    = 246 ; // (short via motor coil to sensor pd, 238-240)
  	255//var WEDO_TYPE_SHORTHI	= 255 ; // (short to V+, 255)
  ].reverse();

  var NAME_ID_ORDER = [names.SHORTLO, names.BEND, names.TILT, names.FUTURE, names.RAW, names.TOUCH, names.SERVO, names.SOUND, names.TEMP, names.LIGHT, names.MOTION, names.LIGHTBRICK, names.N_22, names.OPEN, names.MOTOR, names.SHORTHI   ].reverse();

  function getType(id) {
    var found = -1;
    ID_LIST.forEach(function(val, index){
      if (id <= val)
      {
        found = index;
        return;
      }
    });
    if (found != -1)
    {
      return NAME_ID_ORDER[found];
    } else {
      return id;
    }
  }

  function getValue(type, val) {
    var out = val;
    if (type == names.TILT)
    {
      out = getTilt(val);
    } else if (type == names.MOTION)
    {
      out = getMotion(val)
    }
    return out;
  }

  function getTilt(rawValue) {
    //http://scratched.gse.harvard.edu/sites/default/files/activities_for_lego_wedo_with_scratch_scripts.pdf
    var tilt;

    if (rawValue < 49) tilt = 3;//up
          else if (rawValue < 100) tilt = 2;//right
          else if (rawValue < 154) tilt = 0;//level
          else if (rawValue < 205) tilt = 1;//down
          else tilt = 4;//left
    return tilt;
  }

  function getMotion(rawValue) {

    var out = Math.round((100 * (rawValue - 70)) / 140);
    out = Math.max(0, Math.min(out, 100));
    return out;
  }

  function turnDevicesOnOff(name, onOff, alreadyBraked) {
    var list = getDevicesFor(name);
    list.forEach(function(device) {
      outputs.deviceOnOff(device.conn, device.index, onOff, alreadyBraked);
    }, scope);
  };

  function getDevicesFor(name) {
    var list = [];
    if (name.indexOf(" ") != -1)
    {
      //specifc

      var l = name.split(" ")[1];
      var slot = getSlotFor(l);

      if (slot)
      {
        var doLight = name.indexOf("light") == 0;
        var doMotor = name.indexOf("motor") == 0;

        var conn = getDataFor(l);
        var index = INDEX_LOOK_UP[l][1];

        if ((doMotor && isMotor(slot.type)) || (doLight && isLight(slot.type)))
        {
          list.push({conn:conn, index:index});
        }
      }

    } else {

      //all

      var doLight = name.indexOf("light") != -1 || name == "everything";
      var doMotor = name.indexOf("motor") != -1  || name == "everything";

      handler.connections.forEach(function(conn){
        conn.slots.forEach(function(slot, index){
          if ((doMotor && isMotor(slot.type)) || (doLight && isLight(slot.type)))
          {
            list.push({conn:conn, index:index});
          }
        });
      });
    }
    return list;
  };

  var self = {};

  self.getSensor = function(type) {
    var val = sensorsByType[type];
    return val == undefined ? 0 : val;
  }

  self.getSensorAt = function(letter) {
    var slot = getSlotFor(letter);
    return (slot && isSensor(slot.type)) ? slot.value : 0;
  }

  self.getBusy = function() {
    return BUSY;
  }

  self.reset = function() {
    sensorsByType = {};
  };

  self.getConnectionCount = function() {
    return handler.connections.length;
  }

  self.sendData = function(connectionData, outputA, outputB) {

    var data = new Uint8Array([
      0x40,
      outputA,
      outputB,
      0,
      0,
      0,
      0,
      0
    ]);
    chrome.hid.send(connectionData.connectionId, 0, data.buffer, function(){});
  }

  self.motorOn = function(name) {
    turnDevicesOnOff(name, true);
  };

  self.motorOff = function(name, brake) {
    if (brake == 'brake') {      //brake and then callback to coast
      getDevicesFor(name).forEach(function(device) {
        outputs.brake(device.conn, device.index);
      });
      setTimeout(function() {
        turnDevicesOnOff(name, false, true);
      }, outputs.motorBrakingTime);
    }
    else  //normal coast to brake
      turnDevicesOnOff(name, false);
  };

  self.motorOnFor = function(name, time, uniqueID) {
    turnDevicesOnOff(name, true);
    BUSY += " " + uniqueID;
    setTimeout(function() {
      turnDevicesOnOff(name, false);
      BUSY = BUSY.replace(" " + uniqueID, "");
    }, 1000 * time);
  };

  self.resetAll = function() { turnDevicesOnOff('everything', false); }

  self.motorPower = function(name, power) {
    getDevicesFor(name).forEach(function(device) {
      outputs.power(device.conn, device.index, power);
    });

    if (power == 0) turnDevicesOnOff(name, false);
    else  turnDevicesOnOff(name, true);
  };

  self.motorDirection = function(name, dir) {
    getDevicesFor(name).forEach(function(device) {
      outputs.direction(device.conn, device.index, dir);
    });
  }

  self.setAt = function(slotName, state) {
    var device = getDeviceAt(slotName);
    outputs.deviceOnOff(device.conn, device.index, state, false);
  }

  self.powerAt = function(slotName, power) {
    var device = getDeviceAt(slotName);
    outputs.power(device.conn, device.index, power);

    self.setAt(slotName, power != 0);
  }

  self.directionAt = function(slotName, dir) {
    var device = getDeviceAt(slotName);
    outputs.direction(device.conn, device.index, dir);
  }



  self.polled = new Signal();

  outputs.setDeviceHandler(self);

  self.reset();

	return self;
});
