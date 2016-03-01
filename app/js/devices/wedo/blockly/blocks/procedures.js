
define([
  "../wedo-constants"
  , "../../../../blockly/block-utils"
  , "../../../../blockly/appFieldVariable"
  , "../../../../lang"
],function(constants, blockUtils, AppFieldVariable, lang){

  var BlocklyLib = window.Blockly;
  var blockDefs = window.Blockly.Blocks;
  var TYPES = constants.types;

blockDefs['procedures_defnoreturn'] = {
  /**
   * Block for defining a procedure with no return value.
   * @this BlocklyLib.Block
   */
  init: function() {
    this.arguments_ = [];
    this.setHelpUrl(lang.blocks.get("PROCEDURES_DEFNORETURN_HELPURL"));
    this.setColour(constants.colors.procedures);
    var name = BlocklyLib.Procedures.findLegalName(
        lang.blocks.get("PROCEDURES_DEFNORETURN_PROCEDURE"), this);
    var nameField = new BlocklyLib.FieldTextInput(name,
        function(text) {
          return BlocklyLib.Procedures.rename.apply(this, [text.substr(0,30)]);
        });
    nameField.validateOnInputChange = true;
    nameField.setSpellcheck(false);
    this.appendDummyInput()
        .appendField(lang.blocks.get("PROCEDURES_DEFNORETURN_TITLE"))
        .appendField(nameField, 'NAME')
        .appendField('', 'PARAMS');
    //this.setMutator(new BlocklyLib.Mutator(['procedures_mutatorarg']));
    this.setTooltip(lang.blocks.get("PROCEDURES_DEFNORETURN_TOOLTIP"));
    this.arguments_ = [];
    this.setStatements_(true);
    this.statementConnection_ = null;

  },
  onchange: blockUtils.checkInputs,
  /**
   * Initialization of the block has completed, clean up anything that may be
   * inconsistent as a result of the XML loading.
   * @this BlocklyLib.Block
   */
  validate: function () {
    var name = BlocklyLib.Procedures.findLegalName(
        this.getFieldValue('NAME'), this);
    this.setFieldValue(name, 'NAME');
  },
  /**
   * Add or remove the statement block from this function definition.
   * @param {boolean} hasStatements True if a statement block is needed.
   * @this BlocklyLib.Block
   */
  setStatements_: function(hasStatements) {
    if (this.hasStatements_ === hasStatements) {
      return;
    }
    if (hasStatements) {
      this.appendStatementInput('STACK')
          .appendField(lang.blocks.get("PROCEDURES_DEFNORETURN_DO"));
      if (this.getInput('RETURN')) {
        this.moveInputBefore('STACK', 'RETURN');
      }
    } else {
      this.removeInput('STACK', true);
    }
    this.hasStatements_ = hasStatements;
  },
  /**
   * Create XML to represent the argument inputs.
   * @return {Element} XML storage element.
   * @this BlocklyLib.Block
   */
  mutationToDom: function() {
    var container = document.createElement('mutation');
    for (var i = 0; i < this.arguments_.length; i++) {
      var parameter = document.createElement('arg');
      parameter.setAttribute('name', this.arguments_[i]);
      container.appendChild(parameter);
    }

    // Save whether the statement input is visible.
    if (!this.hasStatements_) {
      container.setAttribute('statements', 'false');
    }
    return container;
  },
  /**
   * Parse XML to restore the argument inputs.
   * @param {!Element} xmlElement XML storage element.
   * @this BlocklyLib.Block
   */
  domToMutation: function(xmlElement) {
    this.arguments_ = [];
    for (var i = 0, childNode; childNode = xmlElement.childNodes[i]; i++) {
      if (childNode.nodeName.toLowerCase() == 'arg') {
        this.arguments_.push(childNode.getAttribute('name'));
      }
    }
    //this.updateParams_();

    // Show or hide the statement input.
    this.setStatements_(xmlElement.getAttribute('statements') !== 'false');
  },
  /**
   * Populate the mutator's dialog with this block's components.
   * @param {!BlocklyLib.Workspace} workspace Mutator's workspace.
   * @return {!BlocklyLib.Block} Root block in mutator.
   * @this BlocklyLib.Block
   */
  decompose: function(workspace) {
    var containerBlock = BlocklyLib.Block.obtain(workspace,
                                              'procedures_mutatorcontainer');
    containerBlock.initSvg();

    // Check/uncheck the allow statement box.
    if (this.getInput('RETURN')) {
      containerBlock.setFieldValue(this.hasStatements_ ? 'TRUE' : 'FALSE',
                                   'STATEMENTS');
    } else {
      containerBlock.getInput('STATEMENT_INPUT').setVisible(false);
    }

    // Parameter list.
    var connection = containerBlock.getInput('STACK').connection;
    for (var i = 0; i < this.arguments_.length; i++) {
      var paramBlock = BlocklyLib.Block.obtain(workspace, 'procedures_mutatorarg');
      paramBlock.initSvg();
      paramBlock.setFieldValue(this.arguments_[i], 'NAME');
      // Store the old location.
      paramBlock.oldLocation = i;
      connection.connect(paramBlock.previousConnection);
      connection = paramBlock.nextConnection;
    }
    // Initialize procedure's callers with blank IDs.
    BlocklyLib.Procedures.mutateCallers(this.getFieldValue('NAME'),
                                     this.workspace, this.arguments_, null);
    return containerBlock;
  },
  /**
   * Reconfigure this block based on the mutator dialog's components.
   * @param {!BlocklyLib.Block} containerBlock Root block in mutator.
   * @this BlocklyLib.Block
   */
  compose: function(containerBlock) {
    // Parameter list.
    this.arguments_ = [];
    this.paramIds_ = [];
    var paramBlock = containerBlock.getInputTargetBlock('STACK');
    while (paramBlock) {
      this.arguments_.push(paramBlock.getFieldValue('NAME'));
      this.paramIds_.push(paramBlock.id);
      paramBlock = paramBlock.nextConnection &&
          paramBlock.nextConnection.targetBlock();
    }
    //this.updateParams_();
    BlocklyLib.Procedures.mutateCallers(this.getFieldValue('NAME'),
        this.workspace, this.arguments_, this.paramIds_);

    // Show/hide the statement input.
    var hasStatements = containerBlock.getFieldValue('STATEMENTS');
    var stackConnection;
    if (hasStatements !== null) {
      hasStatements = hasStatements == 'TRUE';
      if (this.hasStatements_ != hasStatements) {
        if (hasStatements) {
          this.setStatements_(true);
          // Restore the stack, if one was saved.
          stackConnection = this.getInput('STACK').connection;
          if (stackConnection.targetConnection ||
              !this.statementConnection_ ||
              this.statementConnection_.targetConnection ||
              this.statementConnection_.sourceBlock_.workspace !=
              this.workspace) {
            // Block no longer exists or has been attached elsewhere.
            this.statementConnection_ = null;
          } else {
            stackConnection.connect(this.statementConnection_);
          }
        } else {
          // Save the stack, then disconnect it.
          stackConnection = this.getInput('STACK').connection;
          this.statementConnection_ = stackConnection.targetConnection;
          if (this.statementConnection_) {
            var stackBlock = stackConnection.targetBlock();
            stackBlock.setParent(null);
            stackBlock.bumpNeighbours_();
          }
          this.setStatements_(false);
        }
      }
    }
  },
  /**
   * Dispose of any callers.
   * @this BlocklyLib.Block
   */
  dispose: function() {
    var name = this.getFieldValue('NAME');
    BlocklyLib.Procedures.disposeCallers(name, this.workspace);
    // Call parent's destructor.
    this.constructor.prototype.dispose.apply(this, arguments);
  },
  /**
   * Return the signature of this procedure definition.
   * @return {!Array} Tuple containing three elements:
   *     - the name of the defined procedure,
   *     - a list of all its arguments,
   *     - that it DOES NOT have a return value.
   * @this BlocklyLib.Block
   */
  getProcedureDef: function() {
    return [this.getFieldValue('NAME'), this.arguments_, false];
  },
  /**
   * Return all variables referenced by this block.
   * @return {!Array.<string>} List of variable names.
   * @this BlocklyLib.Block
   */
  getVars: function() {
    return this.arguments_;
  },
  /**
   * Add custom menu options to this block's context menu.
   * @param {!Array} options List of menu options to add to.
   * @this BlocklyLib.Block
   */
  customContextMenu: function(options) {
    // Add option to create caller.
    var option = {enabled: true};
    var name = this.getFieldValue('NAME');
    option.text = lang.blocks.get("PROCEDURES_CREATE_DO").replace('%1', name);
    var xmlMutation = goog.dom.createDom('mutation');
    xmlMutation.setAttribute('name', name);
    for (var i = 0; i < this.arguments_.length; i++) {
      var xmlArg = goog.dom.createDom('arg');
      xmlArg.setAttribute('name', this.arguments_[i]);
      xmlMutation.appendChild(xmlArg);
    }
    var xmlBlock = goog.dom.createDom('block', null, xmlMutation);
    xmlBlock.setAttribute('type', this.callType_);
    option.callback = BlocklyLib.ContextMenu.callbackFactory(this, xmlBlock);
    options.push(option);

  },
  callType_: 'procedures_callnoreturn'
};



blockDefs['procedures_mutatorcontainer'] = {
  /**
   * Mutator block for procedure container.
   * @this BlocklyLib.Block
   */
  init: function() {
    this.setColour(constants.colors.procedures);
    this.appendDummyInput()
        .appendField(lang.blocks.get("PROCEDURES_MUTATORCONTAINER_TITLE"));
    this.appendStatementInput('STACK');
    this.appendDummyInput('STATEMENT_INPUT')
        .appendField(lang.blocks.get("PROCEDURES_ALLOW_STATEMENTS"))
        .appendField(new BlocklyLib.FieldCheckbox('TRUE'), 'STATEMENTS');
    this.setTooltip(lang.blocks.get("PROCEDURES_MUTATORCONTAINER_TOOLTIP"));
    this.contextMenu = false;
  }
};


blockDefs['procedures_callnoreturn'] = {
  /**
   * Block for calling a procedure with no return value.
   * @this BlocklyLib.Block
   */
  init: function() {
    this.setHelpUrl(lang.blocks.get("PROCEDURES_CALLNORETURN_HELPURL"));
    this.setColour(constants.colors.procedures);
    this.appendDummyInput('TOPROW')
        .appendField(lang.blocks.get("PROCEDURES_CALLNORETURN_CALL"))
        .appendField('', 'NAME');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    // Tooltip is set in domToMutation.
    this.arguments_ = [];
    this.quarkConnections_ = {};
    this.quarkArguments_ = null;

  },
  /**
   * Returns the name of the procedure this block calls.
   * @return {string} Procedure name.
   * @this BlocklyLib.Block
   */
  getProcedureCall: function() {
    // The NAME field is guaranteed to exist, null will never be returned.
    return /** @type {string} */ (this.getFieldValue('NAME'));
  },
  /**
   * Notification that a procedure is renaming.
   * If the name matches this block's procedure, rename it.
   * @param {string} oldName Previous name of procedure.
   * @param {string} newName Renamed procedure.
   * @this BlocklyLib.Block
   */
  renameProcedure: function(oldName, newName) {
    if (BlocklyLib.Names.equals(oldName, this.getProcedureCall())) {
      this.setFieldValue(newName, 'NAME');
      this.setTooltip(
          (this.outputConnection ? lang.blocks.get("PROCEDURES_CALLRETURN_TOOLTIP") :
           lang.blocks.get("PROCEDURES_CALLNORETURN_TOOLTIP"))
          .replace('%1', newName));
    }
  },
  /**
   * Notification that the procedure's parameters have changed.
   * @param {!Array.<string>} paramNames New param names, e.g. ['x', 'y', 'z'].
   * @param {!Array.<string>} paramIds IDs of params (consistent for each
   *     parameter through the life of a mutator, regardless of param renaming),
   *     e.g. ['piua', 'f8b_', 'oi.o'].
   * @this BlocklyLib.Block
   */
  setProcedureParameters: function(paramNames, paramIds) {

  },
  /**
   * Create XML to represent the (non-editable) name and arguments.
   * @return {Element} XML storage element.
   * @this BlocklyLib.Block
   */
  mutationToDom: function() {
    var container = document.createElement('mutation');
    container.setAttribute('name', this.getProcedureCall());
    /*for (var i = 0; i < this.arguments_.length; i++) {
      var parameter = document.createElement('arg');
      parameter.setAttribute('name', this.arguments_[i]);
      container.appendChild(parameter);
    }*/
    return container;
  },
  /**
   * Parse XML to restore the (non-editable) name and parameters.
   * @param {!Element} xmlElement XML storage element.
   * @this BlocklyLib.Block
   */
  domToMutation: function(xmlElement) {
    var name = xmlElement.getAttribute('name');
    this.setFieldValue(name, 'NAME');
    this.setTooltip(
        (this.outputConnection ? lang.blocks.get("PROCEDURES_CALLRETURN_TOOLTIP") :
         lang.blocks.get("PROCEDURES_CALLNORETURN_TOOLTIP")).replace('%1', name));
  },
  /**
   * Add menu option to find the definition block for this call.
   * @param {!Array} options List of menu options to add to.
   * @this BlocklyLib.Block
   */
  customContextMenu: function(options) {
    var option = {enabled: true};
    option.text = lang.blocks.get("PROCEDURES_HIGHLIGHT_DEF");
    var name = this.getProcedureCall();
    var workspace = this.workspace;
    option.callback = function() {
      var def = BlocklyLib.Procedures.getDefinition(name, workspace);
      def && def.select();
    };
    options.push(option);


  },
};


});
