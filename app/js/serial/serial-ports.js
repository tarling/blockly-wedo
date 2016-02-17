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
          if (name.indexOf("cu.") == 0) return;
          name = name.replace("tty.","");
          list.push({name:name, id:path, displayName:item.displayName, vendorId:item.vendorId, productId:item.productId});
        });

        sortPortsByDigits(list);

        var selectedIndex = -1;
        for (var index = 0; index < list.length; index++) {
          var item = list[index];
          if (self.value == item.id)
          {
            selectedIndex = index;
            break;
          } else if (selectedIndex == -1)
          {
            if (item.name.indexOf("COM") === 0 || item.name.indexOf("usbmodem") === 0 || item.name.indexOf("ttyACM") === 0) selectedIndex = index;
          }
        }
        callback(list, selectedIndex);
      });
    }

    return self;
});
