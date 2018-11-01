export function getItemsForDesktop(v) {
  return [
    {
      id: "toolbarSettings",
      type: "popover",
      disabled: true
    },
    {
      id: "advancedSettings",
      type: "advancedSettings",
      disabled: true
    }
  ];
}

export function getItemsForTablet(v) {
  return [
    {
      id: "showOnTablet",
      type: "toggle",
      disabled: true
    },
    {
      id: "tabletToolbarSettings",
      type: "popover",
      disabled: true
    },
    {
      id: "tabletToolbarSettings",
      type: "advancedSettings",
      disabled: true
    }
  ];
}

export function getItemsForMobile(v) {
  return [
    {
      id: "showOnMobile",
      type: "toggle",
      disabled: true
    },
    {
      id: "mobileToolbarSettings",
      type: "popover",
      disabled: true
    },
    {
      id: "mobileToolbarSettings",
      type: "advancedSettings",
      disabled: true
    }
  ];
}
