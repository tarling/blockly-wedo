define([
  "jquery", "signals", "../lang", "./menubar-data", "./templates", "./template-utils"
], function ($, Signal, lang, menubarData, templates, templateUtils)
{

  function init()
  {
    var msg = lang.ui;
    function langSetter(data) {
      if (data.id) data.label = msg.get(data.id);
      if (data.selectable) data.selectLabel = msg.get(data.id + "-selectLabel");
    }

    var html = templateUtils.make(menubarData, templates.menu, langSetter);
    $("#main-nav").append(html);

    $(".dropdown-submenu")
      .mouseover(function (e)
      {
        $(e.currentTarget)
          .addClass("activated");
      });

    $("nav a[id]")
      .on("click", function (event)
      {
        var el = $(event.currentTarget);

        var parent = el.parent();
        if (parent.hasClass("disabled")) return;

        parent
          .parent()
          .parent()
          .removeClass('open');
        self.itemClicked.dispatch(el.attr("id"));
      })
  }

  $("#nav-menus > ul > li")
    .parent()
    .on('show.bs.dropdown', function ()
    {
      self.menuShown.dispatch();
    });

  function selectMenuItem(el, selectedIndex)
  {
    if (selectedIndex > -1)
    {
      var selected = el.find("li a")
        .eq(selectedIndex);
      el.trigger($.Event('click',
      {
        target: selected.get(0)
      }));
    }
  }

  function selectValue(el, value)
  {
    var idx = el.find("li")
      .index(el.find("li[data-value=" + value + "]"));
    selectMenuItem(el, idx);
  }

  var self = {};

  self.init = init;

  self.itemClicked = new Signal(); //element id

  self.menuShown = new Signal();

  self.enableItems = function (ids, enabled)
  {
    var prefix = "#px-";
    var sel = ids.map(function(id){ return prefix + id}).join(",");

    $(sel)
      .parent()
      .toggleClass("disabled", !enabled);
  }

  return self;

})
