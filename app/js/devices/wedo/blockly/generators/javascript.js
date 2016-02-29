/**
 * @license
 * Visual Blocks Language
 *
 * Copyright 2012 Google Inc.
 * https://developers.google.com/blockly/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


define([
  "../../../../events"
  , "../../../../blockly/constants"
],function(
  events
  , blocklyConstants
){

  var Blockly = window.Blockly;
  var generator = new Blockly.Generator('JavaScript');
  var stepMode = false;
  var innerStepsLookup;

  generator.addReservedWords(
      'w,' +  //name of word array
      'Blockly,' +  // In case JS is evaled in the current window.
      // https://developer.mozilla.org/en/JavaScript/Reference/Reserved_Words
      'break,case,catch,continue,debugger,default,delete,do,else,finally,for,function,if,in,instanceof,new,return,switch,this,throw,try,typeof,var,void,while,with,' +
      'class,enum,export,extends,import,super,implements,interface,let,package,private,protected,public,static,yield,' +
      'const,null,true,false,' +
      // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects
      'Array,ArrayBuffer,Boolean,Date,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,Error,eval,EvalError,Float32Array,Float64Array,Function,Infinity,Int16Array,Int32Array,Int8Array,isFinite,isNaN,Iterator,JSON,Math,NaN,Number,Object,parseFloat,parseInt,RangeError,ReferenceError,RegExp,StopIteration,String,SyntaxError,TypeError,Uint16Array,Uint32Array,Uint8Array,Uint8ClampedArray,undefined,uneval,URIError,' +
      // https://developer.mozilla.org/en/DOM/window
      'applicationCache,closed,Components,content,_content,controllers,crypto,defaultStatus,dialogArguments,directories,document,frameElement,frames,fullScreen,globalStorage,history,innerHeight,innerWidth,length,location,locationbar,localStorage,menubar,messageManager,mozAnimationStartTime,mozInnerScreenX,mozInnerScreenY,mozPaintCount,name,navigator,opener,outerHeight,outerWidth,pageXOffset,pageYOffset,parent,performance,personalbar,pkcs11,returnValue,screen,screenX,screenY,scrollbars,scrollMaxX,scrollMaxY,scrollX,scrollY,self,sessionStorage,sidebar,status,statusbar,toolbar,top,URL,window,' +
      'addEventListener,alert,atob,back,blur,btoa,captureEvents,clearImmediate,clearInterval,clearTimeout,close,confirm,disableExternalCapture,dispatchEvent,dump,enableExternalCapture,escape,find,focus,forward,GeckoActiveXObject,getAttention,getAttentionWithCycleCount,getComputedStyle,getSelection,home,matchMedia,maximize,minimize,moveBy,moveTo,mozRequestAnimationFrame,open,openDialog,postMessage,print,prompt,QueryInterface,releaseEvents,removeEventListener,resizeBy,resizeTo,restore,routeEvent,scroll,scrollBy,scrollByLines,scrollByPages,scrollTo,setCursor,setImmediate,setInterval,setResizable,setTimeout,showModalDialog,sizeToContent,stop,unescape,updateCommands,XPCNativeWrapper,XPCSafeJSObjectWrapper,' +
      'onabort,onbeforeunload,onblur,onchange,onclick,onclose,oncontextmenu,ondevicemotion,ondeviceorientation,ondragdrop,onerror,onfocus,onhashchange,onkeydown,onkeypress,onkeyup,onload,onmousedown,onmousemove,onmouseout,onmouseover,onmouseup,onmozbeforepaint,onpaint,onpopstate,onreset,onresize,onscroll,onselect,onsubmit,onunload,onpageshow,onpagehide,' +
      'Image,Option,Worker,' +
      // https://developer.mozilla.org/en/Gecko_DOM_Reference
      'Event,Range,File,FileReader,Blob,BlobBuilder,' +
      'Attr,CDATASection,CharacterData,Comment,console,DocumentFragment,DocumentType,DomConfiguration,DOMError,DOMErrorHandler,DOMException,DOMImplementation,DOMImplementationList,DOMImplementationRegistry,DOMImplementationSource,DOMLocator,DOMObject,DOMString,DOMStringList,DOMTimeStamp,DOMUserData,Entity,EntityReference,MediaQueryList,MediaQueryListListener,NameList,NamedNodeMap,Node,NodeFilter,NodeIterator,NodeList,Notation,Plugin,PluginArray,ProcessingInstruction,SharedWorker,Text,TimeRanges,Treewalker,TypeInfo,UserDataHandler,Worker,WorkerGlobalScope,' +
      'HTMLDocument,HTMLElement,HTMLAnchorElement,HTMLAppletElement,HTMLAudioElement,HTMLAreaElement,HTMLBaseElement,HTMLBaseFontElement,HTMLBodyElement,HTMLBRElement,HTMLButtonElement,HTMLCanvasElement,HTMLDirectoryElement,HTMLDivElement,HTMLDListElement,HTMLEmbedElement,HTMLFieldSetElement,HTMLFontElement,HTMLFormElement,HTMLFrameElement,HTMLFrameSetElement,HTMLHeadElement,HTMLHeadingElement,HTMLHtmlElement,HTMLHRElement,HTMLIFrameElement,HTMLImageElement,HTMLInputElement,HTMLKeygenElement,HTMLLabelElement,HTMLLIElement,HTMLLinkElement,HTMLMapElement,HTMLMenuElement,HTMLMetaElement,HTMLModElement,HTMLObjectElement,HTMLOListElement,HTMLOptGroupElement,HTMLOptionElement,HTMLOutputElement,HTMLParagraphElement,HTMLParamElement,HTMLPreElement,HTMLQuoteElement,HTMLScriptElement,HTMLSelectElement,HTMLSourceElement,HTMLSpanElement,HTMLStyleElement,HTMLTableElement,HTMLTableCaptionElement,HTMLTableCellElement,HTMLTableDataCellElement,HTMLTableHeaderCellElement,HTMLTableColElement,HTMLTableRowElement,HTMLTableSectionElement,HTMLTextAreaElement,HTMLTimeElement,HTMLTitleElement,HTMLTrackElement,HTMLUListElement,HTMLUnknownElement,HTMLVideoElement,' +
      'HTMLCanvasElement,CanvasRenderingContext2D,CanvasGradient,CanvasPattern,TextMetrics,ImageData,CanvasPixelArray,HTMLAudioElement,HTMLVideoElement,NotifyAudioAvailableEvent,HTMLCollection,HTMLAllCollection,HTMLFormControlsCollection,HTMLOptionsCollection,HTMLPropertiesCollection,DOMTokenList,DOMSettableTokenList,DOMStringMap,RadioNodeList,' +
      'SVGDocument,SVGElement,SVGAElement,SVGAltGlyphElement,SVGAltGlyphDefElement,SVGAltGlyphItemElement,SVGAnimationElement,SVGAnimateElement,SVGAnimateColorElement,SVGAnimateMotionElement,SVGAnimateTransformElement,SVGSetElement,SVGCircleElement,SVGClipPathElement,SVGColorProfileElement,SVGCursorElement,SVGDefsElement,SVGDescElement,SVGEllipseElement,SVGFilterElement,SVGFilterPrimitiveStandardAttributes,SVGFEBlendElement,SVGFEColorMatrixElement,SVGFEComponentTransferElement,SVGFECompositeElement,SVGFEConvolveMatrixElement,SVGFEDiffuseLightingElement,SVGFEDisplacementMapElement,SVGFEDistantLightElement,SVGFEFloodElement,SVGFEGaussianBlurElement,SVGFEImageElement,SVGFEMergeElement,SVGFEMergeNodeElement,SVGFEMorphologyElement,SVGFEOffsetElement,SVGFEPointLightElement,SVGFESpecularLightingElement,SVGFESpotLightElement,SVGFETileElement,SVGFETurbulenceElement,SVGComponentTransferFunctionElement,SVGFEFuncRElement,SVGFEFuncGElement,SVGFEFuncBElement,SVGFEFuncAElement,SVGFontElement,SVGFontFaceElement,SVGFontFaceFormatElement,SVGFontFaceNameElement,SVGFontFaceSrcElement,SVGFontFaceUriElement,SVGForeignObjectElement,SVGGElement,SVGGlyphElement,SVGGlyphRefElement,SVGGradientElement,SVGLinearGradientElement,SVGRadialGradientElement,SVGHKernElement,SVGImageElement,SVGLineElement,SVGMarkerElement,SVGMaskElement,SVGMetadataElement,SVGMissingGlyphElement,SVGMPathElement,SVGPathElement,SVGPatternElement,SVGPolylineElement,SVGPolygonElement,SVGRectElement,SVGScriptElement,SVGStopElement,SVGStyleElement,SVGSVGElement,SVGSwitchElement,SVGSymbolElement,SVGTextElement,SVGTextPathElement,SVGTitleElement,SVGTRefElement,SVGTSpanElement,SVGUseElement,SVGViewElement,SVGVKernElement,' +
      'SVGAngle,SVGColor,SVGICCColor,SVGElementInstance,SVGElementInstanceList,SVGLength,SVGLengthList,SVGMatrix,SVGNumber,SVGNumberList,SVGPaint,SVGPoint,SVGPointList,SVGPreserveAspectRatio,SVGRect,SVGStringList,SVGTransform,SVGTransformList,' +
      'SVGAnimatedAngle,SVGAnimatedBoolean,SVGAnimatedEnumeration,SVGAnimatedInteger,SVGAnimatedLength,SVGAnimatedLengthList,SVGAnimatedNumber,SVGAnimatedNumberList,SVGAnimatedPreserveAspectRatio,SVGAnimatedRect,SVGAnimatedString,SVGAnimatedTransformList,' +
      'SVGPathSegList,SVGPathSeg,SVGPathSegArcAbs,SVGPathSegArcRel,SVGPathSegClosePath,SVGPathSegCurvetoCubicAbs,SVGPathSegCurvetoCubicRel,SVGPathSegCurvetoCubicSmoothAbs,SVGPathSegCurvetoCubicSmoothRel,SVGPathSegCurvetoQuadraticAbs,SVGPathSegCurvetoQuadraticRel,SVGPathSegCurvetoQuadraticSmoothAbs,SVGPathSegCurvetoQuadraticSmoothRel,SVGPathSegLinetoAbs,SVGPathSegLinetoHorizontalAbs,SVGPathSegLinetoHorizontalRel,SVGPathSegLinetoRel,SVGPathSegLinetoVerticalAbs,SVGPathSegLinetoVerticalRel,SVGPathSegMovetoAbs,SVGPathSegMovetoRel,ElementTimeControl,TimeEvent,SVGAnimatedPathData,' +
      'SVGAnimatedPoints,SVGColorProfileRule,SVGCSSRule,SVGExternalResourcesRequired,SVGFitToViewBox,SVGLangSpace,SVGLocatable,SVGRenderingIntent,SVGStylable,SVGTests,SVGTextContentElement,SVGTextPositioningElement,SVGTransformable,SVGUnitTypes,SVGURIReference,SVGViewSpec,SVGZoomAndPan');

  /**
   * Order of operation ENUMs.
   * https://developer.mozilla.org/en/JavaScript/Reference/Operators/Operator_Precedence
   */
  generator.ORDER_ATOMIC = 0;         // 0 "" ...
  generator.ORDER_MEMBER = 1;         // . []
  generator.ORDER_NEW = 1;            // new
  generator.ORDER_FUNCTION_CALL = 2;  // ()
  generator.ORDER_INCREMENT = 3;      // ++
  generator.ORDER_DECREMENT = 3;      // --
  generator.ORDER_LOGICAL_NOT = 4;    // !
  generator.ORDER_BITWISE_NOT = 4;    // ~
  generator.ORDER_UNARY_PLUS = 4;     // +
  generator.ORDER_UNARY_NEGATION = 4; // -
  generator.ORDER_TYPEOF = 4;         // typeof
  generator.ORDER_VOID = 4;           // void
  generator.ORDER_DELETE = 4;         // delete
  generator.ORDER_MULTIPLICATION = 5; // *
  generator.ORDER_DIVISION = 5;       // /
  generator.ORDER_MODULUS = 5;        // %
  generator.ORDER_ADDITION = 6;       // +
  generator.ORDER_SUBTRACTION = 6;    // -
  generator.ORDER_BITWISE_SHIFT = 7;  // << >> >>>
  generator.ORDER_RELATIONAL = 8;     // < <= > >=
  generator.ORDER_IN = 8;             // in
  generator.ORDER_INSTANCEOF = 8;     // instanceof
  generator.ORDER_EQUALITY = 9;       // == != === !==
  generator.ORDER_BITWISE_AND = 10;   // &
  generator.ORDER_BITWISE_XOR = 11;   // ^
  generator.ORDER_BITWISE_OR = 12;    // |
  generator.ORDER_LOGICAL_AND = 13;   // &&
  generator.ORDER_LOGICAL_OR = 14;    // ||
  generator.ORDER_CONDITIONAL = 15;   // ?:
  generator.ORDER_ASSIGNMENT = 16;    // = += -= *= /= %= <<= >>= ...
  generator.ORDER_COMMA = 17;         // ,
  generator.ORDER_NONE = 99;          // (...)


  generator.addReservedWords([
    blocklyConstants.INNERSTEP_PREFIX
    ,blocklyConstants.PRESTEP_PREFIX
    ,blocklyConstants.POSTSTEP_PREFIX
    ,blocklyConstants.WARNING_COMMAND
    ,blocklyConstants.STOP_PREFIX
    ].join(","))

  /**
   * Initialise the database of variable names.
   * @param {!Blockly.Workspace} workspace Workspace to generate code from.
   */
  generator.init = function(workspace) {
    // Create a dictionary of definitions to be printed before the code.
    generator.definitions_ = Object.create(null);
    // Create a dictionary mapping desired function names in definitions_
    // to actual function names (to avoid collisions with user functions).
    generator.functionNames_ = Object.create(null);

    if (!generator.variableDB_) {
      generator.variableDB_ =
          new Blockly.Names(generator.RESERVED_WORDS_);
    } else {
      generator.variableDB_.reset();
    }

    var defvars = [];
    var variables = Blockly.Variables.allVariables(workspace);
    for (var x = 0; x < variables.length; x++) {
      defvars[x] = 'var ' +
          generator.variableDB_.getName(variables[x],
          Blockly.Variables.NAME_TYPE) + ' = 0;';
    }
    generator.definitions_['variables'] = defvars.join('\n');
  };

  generator.getInnerStepCode = function(block) {
    if (stepMode)
    {
      var id = block.id;
      var count = innerStepsLookup[id];
      if (typeof count == "undefined") count = 0;
      count ++;
      innerStepsLookup[id] = count;

      return blocklyConstants.INNERSTEP_PREFIX + "('" + id + '.' + count + "');\n"
    } else {
      return "";
    }
  }

  generator.workspaceToCode = function(step) {

    stepMode = step;

    innerStepsLookup = {};
    var workspace = Blockly.mainWorkspace;

    var startBlock;
    var ignored = [];
    var comments = [];
    
    var blocks = workspace.getTopBlocks(true);
    blocks.forEach(function(block){
      if (block.type.indexOf("procedures_def") === 0)
      {
        //keep this block
        return;
      } else if (block.startBlock == undefined)
      {
        //disable block and all attached
        var b = block;
        do {
          b.setDisabled(true);
          if (b.type == 'comment') {
            comments.push(b);
          } else {
            ignored.push(b);
          }
          b = b.getNextBlock();
        } while (b);
      } else {
        startBlock = block;
      }
    });

    generator.BLOCKS_IGNORED = "BLOCKS_IGNORED";
    generator.NO_START_BLOCK = "NO_START_BLOCK";

    if (ignored.length > 0)
    {
      events.blockParseMsg.dispatch(
        blocklyConstants.parseMsg.types.WARNING,
        blocklyConstants.parseMsg.msgs.BLOCKS_IGNORED);
    } else if (startBlock == null)
    {
      events.blockParseMsg.dispatch(
        blocklyConstants.parseMsg.types.ERROR,
        blocklyConstants.parseMsg.msgs.NO_START_BLOCK);
    }

    //TODO:does closure already have better ways to call method on superclass?
    var out = Blockly.Generator.prototype.workspaceToCode.call(this, workspace);

    //re-enable ignored blocks
    ignored.forEach(function(block){
      block.setDisabled(false);
    });
    //re-enable comments blocks
    comments.forEach(function(block){
      block.setDisabled(false);
    });

    return out;
  }

  /**
   * Prepend the generated code with the variable definitions.
   * @param {string} code Generated code.
   * @return {string} Completed code.
   */
  generator.finish = function(code) {

    var definitions = [];
    for (var name in generator.definitions_) {
      definitions.push(generator.definitions_[name]);
    }
    return definitions.join('\n') + '\n\n' + code;
  };

  /**
   * Naked values are top-level blocks with outputs that aren't plugged into
   * anything.  A trailing semicolon is needed to make this legal.
   * @param {string} line Line of generated code.
   * @return {string} Legal line of code.
   */
  generator.scrubNakedValue = function(line) {
    return line + ';\n';
  };

  /**
   * Encode a string as a properly escaped JavaScript string, complete with
   * quotes.
   * @param {string} string Text to encode.
   * @return {string} JavaScript string.
   * @private
   */
  generator.quote_ = function(string) {
    // TODO: This is a quick hack.  Replace with goog.string.quote
    string = string.replace(/\\/g, '\\\\')
                   .replace(/\n/g, '\\\n')
                   .replace(/'/g, '\\\'');
    return '\'' + string + '\'';
  };

  /**
   * Common tasks for generating JavaScript from blocks.
   * Handles comments for the specified block and any connected value blocks.
   * Calls any statements following this block.
   * @param {!Blockly.Block} block The current block.
   * @param {string} code The JavaScript code created for this block.
   * @return {string} JavaScript code with comments and subsequent blocks added.
   * @private
   */
  generator.scrub_ = function(block, code) {
    var commentCode = '';
    // Only collect comments for blocks that aren't inline.
    if (!block.outputConnection || !block.outputConnection.targetConnection) {
      // Collect comment for this block.
      var comment = block.getCommentText();
      if (comment) {
        commentCode += generator.prefixLines(comment, '// ') + '\n';
      }
      // Collect comments for all value arguments.
      // Don't collect comments for nested statements.
      for (var x = 0; x < block.inputList.length; x++) {
        if (block.inputList[x].type == Blockly.INPUT_VALUE) {
          var childBlock = block.inputList[x].connection.targetBlock();
          if (childBlock) {
            var comment = generator.allNestedComments(childBlock);
            if (comment) {
              commentCode += generator.prefixLines(comment, '// ');
            }
          }
        }
      }
    }
    var nextBlock = block.nextConnection && block.nextConnection.targetBlock();
    var nextCode = generator.blockToCode(nextBlock);
    return commentCode + code + nextCode;
  };

  generator.wrap = function(block, code) {

    if (stepMode)
    {
      code = blocklyConstants.PRESTEP_PREFIX + "(" + block.id + ");\n" + code;
      if (block.type.indexOf("procedures_def") === 0) {
        code = blocklyConstants.STOP_PREFIX + "();\n" + code;        
      }
      if (block.warning){
        code = blocklyConstants.WARNING_COMMAND + "(" + block.id + ");\n" + code;
      }
      code = code + ";\n" + blocklyConstants.POSTSTEP_PREFIX + "(" + block.id + ")";
    }
    return code + ";\n";
  }

  return generator;

});
