define([
  "../ui/modals"
],function(
  modals
){

  function dropdownChange(text, changeCallback)
  {

    var thisObj = this;

    function promptName(promptText, defaultText, callback)
    {
      Blockly.hideChaff();

      modals.showRenamePrompt(promptText, defaultText, function (newVar)
      {
        // Merge runs of whitespace.  Strip leading and trailing whitespace.
        // Beyond this, all names are legal.
        if (newVar)
        {
          newVar = newVar.replace(/[\s\xa0]+/g, ' ')
            .replace(/^ | $/g, '');
          if (newVar == Blockly.Msg.RENAME_VARIABLE ||
            newVar == Blockly.Msg.NEW_VARIABLE)
          {
            // Ok, not ALL names are legal...
            newVar = null;
          }
        }
        callback(newVar);
      });
    }
    var workspace = this.sourceBlock_.workspace;
    if (text == Blockly.Msg.RENAME_VARIABLE)
    {
      var oldVar = this.getText();

      promptName(Blockly.Msg.RENAME_VARIABLE_TITLE.replace('%1', oldVar), oldVar, function (text)
      {

        if (text)
        {
          Blockly.Variables.renameVariable(oldVar, text, workspace);
        }

        if (changeCallback)
        {
          changeCallback(text);
        }
        else
        {
          thisObj.setValue(text);
        }
      });
      return "...";
    }
    else if (text == Blockly.Msg.NEW_VARIABLE)
    {
      // Since variables are case-insensitive, ensure that if the new variable
      // matches with an existing variable, the new case prevails throughout.

      var newName = '', existing = Blockly.Variables.allVariables(Blockly.mainWorkspace);
      for (var i = 65; i <= 90; i++) {
        var varName = "var" + String.fromCharCode(i);
        if (existing.indexOf(varName) == -1)
        {
          newName = varName;
          break;
        }
      }

      promptName(Blockly.Msg.NEW_VARIABLE_TITLE, newName, function (text)
      {
        if (text)
        {
          Blockly.Variables.renameVariable(text, text, workspace);
        }
        if (changeCallback)
        {
          changeCallback(text);
        }
        else
        {
          thisObj.setValue(text);
        }
      })
      return "...";
    }
    else
    {
      if (changeCallback)
      {
        changeCallback(text);
      }
      return text;
    }

  };

  function AppFieldVariable(varname, opt_changeHandler)
  {

    var changeHandler;

    if (opt_changeHandler)
    {
      // Wrap the user's change handler together with the variable rename handler.
      changeHandler = function (value)
      {
        var thisObj = this;
        dropdownChange.call(thisObj, value, function (retVal)
        {

          var newVal;
          if (retVal === undefined)
          {
            newVal = value; // Existing variable selected.
          }
          else if (retVal === null)
          {
            newVal = thisObj.getValue(); // Abort, no change.
          }
          else
          {
            newVal = retVal; // Variable name entered.
          }

          var checked = opt_changeHandler.call(thisObj, newVal);
          if (checked === null)
          {
            newVal = "varA";
          }
          else
          {
            newVal = checked;
          }
          thisObj.setValue(newVal);
        });

        return null;
      };
    }
    else
    {
      changeHandler = dropdownChange;
    }

    //bypass this class's direct superclass

    Blockly.FieldVariable.superClass_.constructor.call(this,
      Blockly.FieldVariable.dropdownCreate, changeHandler);

      this.setValue(varname || '');

  }

  goog.inherits(AppFieldVariable, Blockly.FieldVariable);

  return AppFieldVariable;

});
