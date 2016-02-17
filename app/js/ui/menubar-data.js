define(function ()
{

  return {
    menus: [
    {
      id: "m-project",
      options: [
      {
        id: "pm-new"
      },
      {
        id: "pm-open"
      },
      {
        id: "pm-save"
      }]
    },
    {
      id: "m-blocks-edit",
      options: [
        {
          id: "bem-undo"
        },
        {
          id: "bem-redo"
        },
        {
          id: "bem-cut"
        },
        {
          id: "bem-copy"
        },
        {
          id: "bem-paste"
        }]
    },
    {
      id: "m-bluetooth",
      options: [
      {
        id: "sm-ports",
        selectable: true,
        submenu:
        {
          id: "sm-ports-menu"
        },
        class: "dropdown-submenu"
      },
      {
        id: "sm-scan"
      }]   
    }]
  };

});
