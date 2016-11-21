Blockly for WeDo
=
A [Blockly](https://developers.google.com/blockly/) editor Chrome App for controlling Lego WeDo devices. It should support up to 13 WeDo devices.

This is produced in conjunction with [Revolution Education](http://www.rev-ed.co.uk/) and uses code originally written for two of their products, the [S2Bot 4 Scratch Chrome App](https://chrome.google.com/webstore/detail/s2bot-4-scratch/pllkalmkifgmanfoghenhgafbcpbicdj), and the [PICAXE Blockly Chrome App](https://chrome.google.com/webstore/detail/picaxe-blockly/hhdlapnjifkkcpghcapopejopnbpapnb)

Install
-
After cloning this repo, go to your [Extensions settings page](chrome://extensions/), make sure the Developer Mode checkbox is selected, and then click the "Load unpacked extension..." button, selecting the app/ folder in the repo, containing the manifest.json file

Build
-
This project uses gulp for various build tasks. After the usual install of node, npm and gulp, run `npm install` to install dependencies.

The CSS is generated from SASS files in /src/sass. After making changes to the SASS files, run `gulp sass` to export the CSS into the /app/css folder. Or run `gulp sass:watch` to run a watch process that will monitor changes to the SASS and automatically export the CSS.

Run `gulp` to package up the app. This will export the CSS, bundle up the Javascript using [r.js](https://github.com/jrburke/r.js/) and create a ZIP file in /release ready for deployment to the Chrome App store.

Contributing
-
Bug reports, feature requests, and pull requests are all very welcome.

Credits
-
This app uses the following open source projects

- [Blockly](https://developers.google.com/blockly/)
- [Bootstrap](http://getbootstrap.com/)
- [FileSaver](https://github.com/eligrey/FileSaver.js)
- [Blob](https://github.com/eligrey/Blob.js/)
- [JS-Interpreter](https://github.com/NeilFraser/JS-Interpreter)
- [Acorn](https://github.com/marijnh/acorn)
- [jQuery](https://github.com/jquery/jquery)
- [Mustache.js](https://github.com/janl/mustache.js)
- [RequireJS](https://github.com/jrburke/requirejs)
- [Signals](https://github.com/millermedeiros/js-signals)
