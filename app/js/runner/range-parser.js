define([
], function(){

  return function(code, addVos) {

    //console.log("range-parser input", code);

    var idR = new RegExp("<n id='([0-9]+)'>", "g");
    var ids = []
    var result;
    //find all ids
    while(result = idR.exec(code))
    {
      ids.push(result[1]);
    }

    var startTag = "<n id='%1'>";
    var endTag = "<!--%1--></n>";

    //parse tagged code into pseudo HTML so we can traverse and log children and parents
    var tree = $($.parseHTML("<d>" + code + "</d>")[0]);

    function getStartTag(id) {
      return startTag.replace("%1", id);
    }

    function getEndTag(id){
      return endTag.replace("%1", id);
    }


    var lookup = {};
    ids.forEach(function(id){

      var node = tree.find("#" + id);
      lookup[id] = {
        parent: node.parent().attr("id")
        , children: node.children().toArray().map(function(child){return child.id})
        , next: node.next().attr("id")
        , prev: node.prev().attr("id")
        , start: code.indexOf(getStartTag(id))
        , end: code.indexOf(getEndTag(id))
      }

    });

    function recurseDown(vo, startOffset) {
      //recursing through children of vo
      var children = vo.children;
      children.forEach(function(id){
        if (id != undefined) {
          var vc = lookup[id];
          vc.start -= startOffset;
          vc.end -= startOffset;
          recurseDown(vc, startOffset)
        }
      });
    }

    function adjustSiblings(vo, totalOffset) {
      var vs = vo;
      while(true) {
        var nextId = vs.next;
        if (nextId == undefined) break;

        vs = lookup[nextId];
        //removing total tag len for vo.id sibling
        vs.start -= totalOffset;
        vs.end -= totalOffset;

        //recursing through children of sibling to remove total tag length
        recurseDown(vs, totalOffset);
      }
    }

    //iterate through "tags" again and update start and end positions now we know the dependencies
    ids.forEach(function(id){
      var vo = lookup[id];

      var startLen = getStartTag(id).length;
      var endLen = getEndTag(id).length;
      var tagLen = startLen + endLen;

      //substract own start length from end pos
      vo.end -= startLen;

      //go up through parents
      var vp = vo;
      while(true) {
        var parentId = vp.parent;
        if (parentId == undefined) break;

        vp = lookup[parentId];
        //subtract tag length from parent end pos
        vp.end -= tagLen;

        //subtract tag length from sibling of parents and their children
        adjustSiblings(vp, tagLen);
      }

      //go down through children, subtract start
      recurseDown(vo, startLen);

      //subtract tag length from own siblings, and their children
      adjustSiblings(vo, tagLen);
    });

    //remove start and end tags from code
    code = code.replace(/<n id='[0-9]*'>/g, "");
    code = code.replace(/<!--[0-9]*--><\/n>/g, "");

    function getLineCharVO(pos) {
      var sub = code.substring(0, pos);
      sub = sub.replace(/ *$/, "");
      var lineMatches = sub.match(/\n/g);
      var lines = lineMatches ? lineMatches.length : 0;
      var char = sub.length - sub.lastIndexOf("\n");
      return {
        line: lines
        , ch: char - 1
      }
    }

    //console.log("used for range parsing:");
    //console.log(code);

    //add text to vos for debugging
    ids.forEach(function(id){
      var vo = lookup[id];
      vo.text = code.substring(vo.start, vo.end);
      if (addVos)
      {
        vo.startVo = getLineCharVO(vo.start);
        vo.endVo = getLineCharVO(vo.end - 1);
      }
    });
    //console.dir(lookup);

    return lookup;
  }

});
