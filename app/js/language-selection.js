define([
  "jquery", "signals", "./storage", "./lang-codes"
], function ($, Signal, storage, lookup)
{
  var LANG_KEY = "lang";
  var RTL = ['ar', 'fa', 'he'];

  function getStringParamFromUrl(name) {
    var val = window.location.search.match(new RegExp('[?&]' + name + '=([^&]+)'));
    return val ? decodeURIComponent(val[1].replace(/\+/g, '%20')) : "";
  };

  function retrieveLangCode()
  {
    langCode = getStringParamFromUrl('lang');

    if (langCode == "")
    {
      storage.get([LANG_KEY], function (data)
      {
        langCode = data[LANG_KEY];
        langCodeRetrieved();
      });
    }
    else
    {
      langCodeRetrieved();
    }
  }

  function langCodeRetrieved()
  {
    if (lookup[langCode] === undefined)
    {
      // Default to English.
      langCode = 'en';
    }
    var rtl = self.isRtl();
    document.head.parentElement.setAttribute('dir', rtl ? 'rtl' : 'ltr');
    document.head.parentElement.setAttribute('lang', langCode);

    makeMenu();
  }

  function makeMenu()
  {
    // Sort languages alphabetically.
    var languages = [];
    for (var code in lookup)
    {
      languages.push([lookup[code], code]);
    }
    var comp = function (a, b)
    {
      // Sort based on first argument ('English', 'Русский', '简体字', etc).
      if (a[0] > b[0]) return 1;
      if (a[0] < b[0]) return -1;
      return 0;
    };
    languages.sort(comp);
    // Populate the language selection menu.
    var name;
    var languageMenu = $(menuListSel);
    languageMenu.empty();
    for (var i = 0; i < languages.length; i++)
    {
      var tuple = languages[i];
      var option = $('<li data-value="' + tuple[1] + '"><a href="#">' + tuple[0] + '</a></li>');
      if (tuple[1] == langCode)
      {
        option.addClass("selected");
        name = tuple[0];
      }
      languageMenu.append(option);

    }
    $(menuLabelSel).text(name);

    languageMenu.parent()
      .on("selected.bs.dropdown", function (e)
      {
        var id = $(e.relatedTarget)
          .attr("data-value");
        languageMenu.parent()
          .removeClass("open");
        change(id);
      });

    self.inited.dispatch(langCode);
  }

  function change(newLang)
  {
    if (newLang == langCode) return;

    self.beforeChange.dispatch(newLang);

    var saveData = {};
    saveData[LANG_KEY] = newLang;
    storage.set(saveData, function ()
    {
      if ((typeof chrome != "undefined") && chrome.runtime != null && chrome.runtime.id)
      {
        chrome.runtime.reload();
      }
      else
      {
        window.location.reload();
      }
    });
  };

  var langCode;
  var menuListSel, menuLabelSel;

  var self = {};

  self.beforeChange = new Signal();
  self.inited = new Signal();//langCode

  self.getLangCode = function ()
  {
    return langCode;
  }

  self.init = function (menuListSel_, menuLabelSel_)
  {
    menuListSel = menuListSel_;
    menuLabelSel = menuLabelSel_;
    retrieveLangCode();
  };

  self.isRtl = function ()
  {
    return RTL.indexOf(langCode) != -1;
  };

  return self;
});
