define([
  "jquery"
  , "../config"
  , "../utils"
  , "../lang"
  , "../filesystem"
  , "../ui/messages"
  , "./project-utils"
  , "../events"
], function ($, config, utils, lang, filesystem, messages, projectUtils, events)
{

  function validateProject(xml) {
    var blockEls = xml.getElementsByTagName("block");
    for (var i = 0; i < blockEls.length; i++)
    {
      var blockEl = blockEls[i];
      var type = blockEl.getAttribute("type");
      if (!Blockly.Blocks[type])
      {
        console.warn("validateProject. " + type + " not recognised");
        return false;
      }
    }
    return true;
  }



  function parseProject(content, getMergeDecision)
  {
    var xml;
    try
    {
      xml = Blockly.Xml.textToDom(content);
    }
    catch (e)
    {
      console.error('Error parsing XML:\n' + e);
      return;
    }

    if (!validateProject(xml))
    {
      console.error("parseProject. cannot render project");
      return;
    }


    var blockly = xml.getElementsByTagName("blockly")[0];
    if (blockly)
    {
      //parse saved settings
      savedSettings = {};
      var atts = blockly.attributes;
      for (var i = 0; i < atts.length; i++)
      {
        var att = atts[i];
        savedSettings[att.name] = att.value;
      }
    }
    else
    {
      console.warn("Not Blockly XML");
      return;
    }

    function onDecision(merge)
    {
      if (!merge) Blockly.mainWorkspace.clear();
      Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, xml);
      if (merge) projectUtils.arrangeBlocks();
      events.newProject.dispatch();
    }

    if (getMergeDecision)
    {
      getMergeDecision(function ()
      {
        onDecision(true)
      }, function ()
      {
        onDecision(false)
      });
    }
    else
    {
      onDecision(false);
    }
  }

  function addSettingsXml(xml)
  {
		var settings = {
			version: config.version
		}
    var b = $.parseXML("<blockly/>")
      .firstChild;
    for (var prop in settings)
    {
      b.setAttribute(prop, settings[prop]);
    }
    xml.insertBefore(b, xml.firstChild);
  }

  //var ids = [];
  var savedSettings = {};
  var exampleXml;

  var project = {};
  project.dirty = false;

  project.lock = function(bln) {
    $("body").toggleClass("locked", bln);
  }

  project.getSettings = function ()
  {
    return savedSettings;
  }

  project.getExampleXMLText = function ()
  {
    var exampleText = Blockly.Xml.domToText(exampleXml);
    var copy = Blockly.Xml.textToDom(exampleText);
    addSettingsXml(copy)
    return Blockly.Xml.domToText(copy);
  }

  project.init = function (toolboxXml, exampleXml_)
  {
    exampleXml = exampleXml_;

    Blockly.inject(
      $('#content-blocks')
      .get(0),
      {
        grid:
        {
          spacing: 25,
          length: 3,
          colour: '#ccc',
          snap: true
        },
        //readOnly: true,
        media: 'lib/blockly/media/',
        rtl: false,
        toolbox: toolboxXml
      });
    var workspace = Blockly.mainWorkspace;
    workspace.addChangeListener(function ()
    {
      project.dirty = true;
    });

    project.reset();
  }

  project.load = function (getMergeDecision)
  {
    filesystem.loadText("xml", function (filename, content)
    {
      parseProject(content, getMergeDecision);
    });
  }

  project.setFromXml = function (content, getMergeDecision)
  {
    parseProject(content, getMergeDecision);
  }

  project.getXml = function (pretty)
  {
    var xmlDom = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
    addSettingsXml(xmlDom);
    return pretty ? Blockly.Xml.domToPrettyText(xmlDom) : Blockly.Xml.domToText(xmlDom);
  }

  project.save = function ()
  {
    filesystem.save(project.getXml(), 'text/xml', 'wedo.xml', function(){
      project.dirty = false;
    },function(){});
  }

  project.reset = function ()
  {
    messages.clear();

    //Use example workspace XML
    Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, exampleXml);
    //Blockly.mainWorkspace.getAllBlocks()[0].setDeletable(false);
    events.newProject.dispatch();

    window.setTimeout(function ()
    {
      project.dirty = false;
    }, 0);
  }

  project.discard = function ()
  {
    Blockly.mainWorkspace.clear();
    project.reset();
  };

  return project;

});
