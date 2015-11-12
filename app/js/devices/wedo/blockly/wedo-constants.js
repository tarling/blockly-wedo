define(function(){

  function getChar(index) {
    return String.fromCharCode(65+index);
  }

  var letterList = [];
  for (var i = 0; i < 26; i++) {
    var ch = getChar(i);
    letterList.push([ch, ch]);
  }

  return {
    letterList: letterList,
    types: {
      SENSOR: "Sensor",
      NUMBER: "Number",
      STRING: "String",
      VARIABLE: "Variable",
      TILT: "Tilt"
    },
    comparisons: [["=", "=="], [">", ">"], ["<", "<"], [">=", ">="], ["<=", "<="], ["not =", "!="]],
    tilts: [["this way", "== 2"], ["that way", "== 4"], ["up", "== 3"], ["down", "== 1"], ["none", "== 0"], ["any way", "> 0"]],
    colors: {
      default: "#bbbbbb",
      start: "#007a29",
      output: "#5ba5a5",
      delays: "#49a6d4",
      variables: "#d05f2d",
      input: "#7c5385",
      flow: "#b32d5e",
      loops: "#77ab41",
      computer: "#cc0000"
    }
  }



});
