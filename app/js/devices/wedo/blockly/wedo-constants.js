define(function(){

  function getChar(index) {
    return String.fromCharCode(65+index);
  }

  var letterList = [];
  for (var i = 0; i < 26; i++) {
    var ch = getChar(i);
    letterList.push([ch, ch]);
  }

  var wedoList = [];
  for (var i = 1; i < 14; i++) {
    wedoList.push([i.toString(), i.toString()]);
  }

  var octaves = [];
  for (var i = 0; i < 6; i++) {
    octaves.push([i.toString(), i.toString()]);
  }
  
  return {
    letterList: letterList,
    wedoList: wedoList,
    types: {
      SENSOR: "Sensor",
      NUMBER: "Number",
      STRING: "String",
      VARIABLE: "Variable",
      TILT: "Tilt"
    },
    comparisons: [["=", "=="], [">", ">"], ["<", "<"], [">=", ">="], ["<=", "<="], ["not =", "!="]],
    tilts: [["this way", "== 2"], ["that way", "== 4"], ["up", "== 3"], ["down", "== 1"], ["none", "== 0"], ["any way", "> 0"]],
    ledColors: [["off", "0"], ["red", "1"], ["purple", "2"], ["cyan", "3"], ["blue", "4"], ["lime", "5"], ["green", "6"], ["yellow", "7"], ["orange", "8"], ["white","9"]],
	notes: [["C", "0"], ["D", "1"], ["E", "F"], ["G", "3"], ["A", "4"], ["B", "5"], ["C", "6"]],
    octaves: octaves,
	colors: {
      default: "#bbbbbb",
      start: "#007a29",
      output: "#5ba5a5",
      delays: "#49a6d4",
      variables: "#d05f2d",
      input: "#7c5385",
      flow: "#b32d5e",
      loops: "#77ab41",
      computer: "#cc0000",
      comment: "#fffacd"
    }
  }



});
