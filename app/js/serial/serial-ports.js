define(["signals"], function(Signal){

    function sortPortsByDigits(array) {
        //from http://stackoverflow.com/questions/8107226/
        var re = /\D/g;
        array.sort(function(a, b) {
          return(parseInt(a.name.replace(re, ""), 10) - parseInt(b.name.replace(re, ""), 10));
        });
    }

    var self = {};

    self.requestList = function(callback) {
      var list = [];
      chrome.serial.getDevices(function(ports){
        var selectedIndex = -1;
        ports.forEach(function(item, index){
          var path = item.path;
          var name = path.replace("/dev/","");
          //Windows    COMX
          //Linux CrOS /dev/ttyACMX
          //Mac        /dev/cu.usbmodemX
          if (name.indexOf("cu.") == 0) return;
          name = name.replace("tty.","");
          
          //For bluetooth work we only want the BLED112 dongle to be found, ignore all other ports
          //BLED112 has a VID of 9304 and PID of 1
          //TODO check VID/PID are actually available on Mac and Linux?
          if (item.vendorId && item.productId && item.vendorId==9304 && item.productId==1) {
            name = "BLED112 " + name;
            list.push({name:name, id:path});
          }
        });

        sortPortsByDigits(list);

        //If low energy API supported we can also add the internal bluetooth adapter
        if (typeof chrome.bluetoothLowEnergy.connect == "function") {
          chrome.bluetooth.getAdapterState(function(adapter) {
            name = "Internal " + adapter.name;
            if (adapter.available) list.push({name:name, id:adapter.address});
          });
        }
    
        var selectedIndex = -1;
        for (var index = 0; index < list.length; index++) {
          var item = list[index];
          if (self.value == item.id)
          {
            selectedIndex = index;
            break;
          } else if (selectedIndex == -1)
          {
            //if (item.name.indexOf("COM") === 0 || item.name.indexOf("usbmodem") === 0 || item.name.indexOf("ttyACM") === 0) selectedIndex = index;
            if (item.name.indexOf("BLED112") === 0 || item.name.indexOf("Internal") === 0) selectedIndex = index;
          }
        }
        callback(list, selectedIndex);
      });
    }

    return self;
});
