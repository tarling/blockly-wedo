define([
  "../events"
], function (events)
{
  function deselectBlock(id) {
      var b = Blockly.mainWorkspace.getBlockById(id);
      if (b) b.removeSelect();
  }

  var disabled = [];

  var self = {};
  self.isBlockVisible = function (blockId)
  {
    var workspace = Blockly.mainWorkspace;

    var b = workspace.getBlockById(blockId);
    if (!b) return;

    var m = workspace.getMetrics();

    var bpos = b.getRelativeToSurfaceXY();
    var bx2 = bpos.x + b.width;
    var by2 = bpos.y + b.height;

    //p and q are the top left and bottom right corner of the canvas area that is visible
    var px = -workspace.scrollX;
    var py = -workspace.scrollY;
    var qx = px + m.viewWidth;
    var qy = py + m.viewHeight;

    return bpos.x > px && bx2 < qx && bpos.y > py && by2 < qy;
  }

  var scrollXIntervalId;
  var scrollYIntervalId;

  self.scrollTo = function (blockId)
  {
    var workspace = Blockly.mainWorkspace;

    var b = workspace.getBlockById(blockId);
    if (!b) return;

    var bpos = b.getRelativeToSurfaceXY();

    var margin = 40;
    var steps = 20;

    window.clearInterval(scrollXIntervalId);
    window.clearInterval(scrollYIntervalId);

    //TODO
    //instead of the hitLimit test, we could limit the targetX/targetY to the max possible scrollX/scrollY values
    //minx = viewWidth - contentWidth
    //miny = viewHeight - contentHeight
    //maxx = contentWidth - viewWidth
    //maxy = contentHeight - viewHeight

    scrollXIntervalId = scroll(function ()
    {
      return workspace.scrollX
    }, function (v)
    {
      workspace.scrollX = v
    }, -bpos.x + margin);
    scrollYIntervalId = scroll(function ()
    {
      return workspace.scrollY
    }, function (v)
    {
      workspace.scrollY = v
    }, -bpos.y + margin);

    function scroll(get, set, target)
    {

      var dist = get() - target;
      var step = dist / steps;
      var last;

      var intervalId = window.setInterval(function ()
      {

        var current = get();
        var hitLimit = last == current; //if the value hasn't updated, then we've reached a min/max limit
        last = current;

        var next = current - step;
        set(next);

        if (hitLimit || Math.abs(target - next) < Math.abs(step))
        {
          set(target);
          window.clearInterval(intervalId);
          console.log("scroll complete");
        }
        workspace.render();

      }, 10);

      return intervalId;
    }
  }

  self.arrangeBlocks = function ()
  {
    //code taken from here: https://github.com/mit-cml/appinventor-sources/blob/master/appinventor/lib/blockly/src/core/blockly.js#L613
    var SPACER = 25;
    var topblocks = Blockly.mainWorkspace.getTopBlocks(false);
    var metrics = Blockly.mainWorkspace.getMetrics();
    var viewLeft = metrics.viewLeft + 5, viewTop = metrics.viewTop + 5;
    var x = viewLeft, y = viewTop;
    var wsRight = viewLeft + metrics.viewWidth, wsBottom = viewTop + metrics.viewHeight;
    var maxHgt = 0, maxWidth = 0;
    for (var i = 0, len = topblocks.length; i < len; i++)
    {
      var blk = topblocks[i];
      var blkXY = blk.getRelativeToSurfaceXY();
      var blockHW = blk.getHeightWidth();
      var blkHgt = blockHW.height;
      var blkWidth = blockHW.width;

      if (x < wsRight)
      {
        blk.moveBy(x - blkXY.x, y - blkXY.y);
        blk.select();
        x += blkWidth + SPACER;
        if (blkHgt > maxHgt) // Remember highest block
          maxHgt = blkHgt;
      }
      else
      {
        y += maxHgt + SPACER;
        maxHgt = blkHgt;
        x = viewLeft;
        blk.moveBy(x - blkXY.x, y - blkXY.y);
        blk.select();
        x += blkWidth + SPACER;
      }
    }
  }

  self.highlightBlocks = function(list) {
      var highlit = self.getHighlitIds();
      //deselect any blocks not in new list
      highlit.forEach(function(id){
          if (list.indexOf(id) == -1) deselectBlock(id);
      });

      var hidden = [];

      list.forEach(function(id){
          //ignore blocks already in list of selected ids
          if (highlit.indexOf(id) != -1) return;

          //otherwise, new id, select
          var b = Blockly.mainWorkspace.getBlockById(id);
          if (b) b.addSelect();

          if (!self.isBlockVisible(id)) hidden.push(id);
      });
      //if all blocks are hidden, scroll to the first found
      if (list.length > 0 && hidden.length == list.length) self.scrollTo(hidden[0]);
  }

  self.clearHighlight = function() {
      var highlit = self.getHighlitIds();
      highlit.forEach(deselectBlock);
  }

  self.getHighlitIds = function() {
      return Blockly.mainWorkspace.getAllBlocks().filter(function(b){
          return Blockly.hasClass_(b.svgGroup_,"blocklySelected");
      }).map(function(b){
          return b.id
      });
  }

  self.disableAllExcept = function(id) {
    disabled = Blockly.mainWorkspace.getAllBlocks().filter(function(block){
      var found = block.id != id && !block.disabled;
      if (found)
      {
        block.disabled = true;
        block.updateDisabled(true);
      }
      return found;
    });
    events.requestBlocklyRedraw.dispatch();
  }

  self.clearDisabled = function() {
    disabled.forEach(function(block){
      block.setDisabled(false);
    });
    disabled = [];
    events.requestBlocklyRedraw.dispatch();
  }

  return self;

});
