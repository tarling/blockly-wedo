define([
  "jquery"
  ,"bootstrap"
],function($){

  //based on code here:
  //https://github.com/ptgamr/bootstrap-dropdown-select-extension


  var Dropdown = $.fn.dropdown.Constructor;

  var getParent = function ($this) {
      return $this.parent();
  };

  /**
   * Select Handler
   * Will be trigger when user choose a menu item by 'Enter' key or 'click' to that item
   *
   * The code is taken from the Dropdown.prototype.keydown(), attach some hacks to it
   *
   * @param  Event e
   * @return
   */
  var select = function(e) {

      //only accept enter when event is keydown
      if (e.type === 'keydown' && !/13/.test(e.which)) return;

      var $this = $(this);

      if ($this.is('.disabled, :disabled')) return;

      var $parent  = getParent($this);
      var isActive = $parent.hasClass('open');

      var $items = $this.find('ul a');

      if (!$items.length) return;

      var index = $items.index(e.target);
      if (index == -1) return;

      var $selected = $items.eq(index);
      if ($selected.parent().is(".disabled, .no-select")) return;

      e.preventDefault();
      e.stopPropagation();

      //previous selected
      var $previousSelect = $this.find('.selected');
      if (!$selected.hasClass('selected') && !$previousSelect.is($selected)) {
          $selected.parent('li').addClass('selected');
          $previousSelect.removeClass('selected');
      }

      //set label of submeny
      var format = $this.attr("data-select-label");
      var selectedText = $items.eq(index).text();
      $this.find("a").first().text(format ? format.replace("%1", selectedText) : selectedText);

      //set submenu data value to selected child data value
      var val = $selected.parent('li').attr("data-value");
      $this.attr("data-value", val);

      //trigger the event
      $this.trigger(e = $.Event('selected.bs.dropdown', {relatedTarget : this}));

      //remove activated class from submenu so that the submenu children are hidden
      $this.removeClass("activated");
  };


  $.extend(true, Dropdown.prototype, {select: select});

  $(document)
      .on('keydown.bs.dropdown.data-api', '[data-select="true"]', Dropdown.prototype.select)
      .on('click.bs.dropdown.data-api', '[data-select="true"]', Dropdown.prototype.select);
})
