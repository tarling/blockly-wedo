define([
  "jquery"
  , "../utils"
  , "../lang"
  , "../blockly/constants"
], function (
  $
  , utils
  , lang
  , blocklyConstants)
{
  var timeoutId_ = 0;

  function showNow(msg, className)
  {
    var html = '<div class="alert ' + className + ' alert-dismissible fade in" role="alert">';
    html += '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">x</span></button>';
    html += msg;
    html += '</div>';

    $("#messages")
      .html(html);
  }

  var messages = {};

  messages.showBlockly = function (type, msgId)
  {
    var msg = lang.ui.get(msgId);

    for (var a = 2, i = 1; a < arguments.length; a++, i++)
    {
      msg = msg.replace("%" + i, arguments[a]);
    }

    var className = "alert-info";
    if (type == blocklyConstants.parseMsg.types.WARNING)
    {
      className = "alert-warning";
    }
    else if (type == blocklyConstants.parseMsg.types.ERROR)
    {
      className = "alert-danger";
    }

    showNow(msg, className + " alert-blockly");
  }

  messages.clear = function ()
  {
    if ($("#messages .alert")
      .length > 0)
    {
      $("#messages .alert")
        .alert('close');
    }

    $("#messages")
      .html("");
  }

  messages.clearBlockly = function ()
  {
    $("#messages .alert-blockly")
      .alert('close');
  }

  return messages;
});
