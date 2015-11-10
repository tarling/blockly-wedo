require.config({
    shim : {
      "bootstrap" : {
        "deps" : ['jquery']
      }
      , "blob" : {
        "exports" :'Blob'
      }

      ,"interpreter": {
        "exports" :'Interpreter',
        "deps" :[
          'acorn'
        ]
      }
    }
    ,paths: {
        "bootstrap": '../lib/bootstrap/js/bootstrap.min'
        ,"jquery": '../lib/jquery-1.11.2.min'
        ,"signals": '../lib/signals.min'
        ,"FileSaver": '../lib/FileSaver'
        ,"blob": '../lib/Blob'
        ,'requireLib': '../lib/require'
        ,'interpreter': '../lib/JS-Interpreter/interpreter'
        ,'acorn': '../lib/JS-Interpreter/acorn_csp'
    }

});

//put all top level dependencies here
require ( [
    "bootstrap"
    ,"./events"
    ,"./ui/ui"
    ,"./devices/hid"
    ,"./runner/runner"
    ,"./block-editor/project"
    ,"./queue"
    ,"./lang"
    ,"./language-selection"
    ,"./devices/wedo/blockly/wedo"
    ,"./devices/wedo/wedo-ui"
    ,"./devices/wedo/wedo-api"
    ,"./devices/wedo/wedo-controller"

    ,"./controller/blocky-parse-controller"
    ,"./controller/menubar-controller"
    ,"./controller/runner-controller"
    ,"./controller/tabs-controller"
    ,"./controller/blocks-edit-controller"
    ,"./controller/ui-controller"
    ,"./controller/backup-controller"

    ,"./jquery-plugins/dropdown-select-plugin"
  ],
  function(
    bootstrap
    , events
    , ui
    , hid
    , runner
    , project
    , Queue
    , lang
    , languageSelection
    , wedo
    , wedoUI
    , wedoAPI) {


    var toolboxXml, exampleXml;
    var queue = new Queue(function() {
        project.init(toolboxXml, exampleXml);
        events.inited.dispatch();

        runner.addAPI(wedoAPI, wedoAPI.wedo.reset);
    });

    //load example project XML
    queue.add();
    $.get( "xml/example.xml", function( data ) {
        exampleXml = data.firstChild;
        queue.remove();
    }, "xml");

    //load Blockly toolbox XML
    queue.add();
    $.get( "xml/toolbox.xml", function( data ) {
        toolboxXml = data.firstChild;
        queue.remove();
    }, "xml");

    queue.add();
    lang.textLoaded.addOnce(queue.remove);

    languageSelection.inited.addOnce(function(){
      lang.load(languageSelection.getLangCode());
    });
    languageSelection.init("#languageMenu", "#languageMenuLabel");

    hid.init();
  }
);
