define(function(){

  return {
    types: {
      SENSOR: "Sensor",
      NUMBER: "Number",
      STRING: "String",
      VARIABLE: "Variable",
      TILT: "Tilt"
    },
    comparisons: [["=", "=="], ["!=", "!="], [">", ">"], [">=", ">="], ["<", "<"], ["<=", "<="]],
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
