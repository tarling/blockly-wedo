define(function(){

	var menu = '{{#menus}}\
	<li id="px-{{id}}" class="dropdown{{#class}} {{class}}{{/class}}">\
    <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">{{label}} <span class="caret"></span></a>\
    <ul class="dropdown-menu" role="menu">\
	{{#options}}\
      <li{{#class}} class="{{class}}"{{/class}}{{#selectLabel}} data-select="true" data-select-label="{{selectLabel}}"{{/selectLabel}}>{{#checkbox}}<input type="checkbox" id="px-{{id}}-checkbox"/>{{/checkbox}}<a id="px-{{id}}" href="#">{{label}}</a>{{#submenu}}\
<ul id="px-{{id}}" class="dropdown-menu"></ul>\
{{/submenu}}</li>\
	{{/options}}\
     </ul>\
  </li>\
  {{/menus}}';

	return {
		menu: menu
	}

});
