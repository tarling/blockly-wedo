define(function(){

  var self = {}

  self.INNERSTEP_PREFIX = "blocklyInnerStep";
  self.PRESTEP_PREFIX = "blocklyPreStep";
  self.POSTSTEP_PREFIX = "blocklyPostStep";
  self.WARNING_COMMAND = "blocklyWarning";

  self.parseMsg = {};

  self.parseMsg.types = {
    ERROR: "error",
    WARNING: "warning",
    INFO: "info"
  }
  self.parseMsg.msgs = {
    VALUE_CHANGED: "VALUE_CHANGED",
    BAD_VAR_NAME: "BAD_VAR_NAME",
    RESERVED_VAR_NAME: "RESERVED_VAR_NAME",
    BLOCKS_IGNORED: "BLOCKS_IGNORED",
    NO_START_BLOCK: "NO_START_BLOCK"
  }

  return self;

});
