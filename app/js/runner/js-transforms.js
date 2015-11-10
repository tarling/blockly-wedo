define([
  "../blockly/constants"
],function(
  blocklyConstants
){

  var self = {}

  self.forRangeParser = function(code) {
    var whiteR = "[\\s]*";

    //console.log("pre range processed");
    //console.log(code);

    //remove these lines from code completely
    var ignore = [
      blocklyConstants.WARNING_COMMAND
    ]
    ignore.forEach(function(str){
      code = code.replace(new RegExp(whiteR + str + "\\([0-9\.]*\\);\\n", "g"), "\n");
    });
    code = code.replace(new RegExp(blocklyConstants.INNERSTEP_PREFIX + "\\([0-9\.']*\\);\\n", "g"), "");

    //replace pre step with a start tag
    var preR = new RegExp("(\\n{1}|(\\n* +))?" + blocklyConstants.PRESTEP_PREFIX + "\\(([0-9\.]*)\\);\\n", "g");
    code = code.replace(preR, "\n<n id='$3'>");

    //if there were no new lines at the start of code we've inserted one
    if (code.charAt(0) == "\n") code = code.substr(1);

    var endTag = "</n>";

    //replace post step with an end tag
    code = code.replace(new RegExp(whiteR + blocklyConstants.POSTSTEP_PREFIX + "\\(([0-9]*)\\);", "g"), "<!--$1-->" + endTag);

    return code;
  }

  return self


});
