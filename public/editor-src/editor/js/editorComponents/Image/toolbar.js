import { calcWrapperSizes } from "./calculations";
import {
  getOptionColorHexByPalette,
  getDynamicContentChoices
} from "visual/utils/options";
import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import {
  defaultValueValue,
  tabletSyncOnChange,
  mobileSyncOnChange
} from "visual/utils/onChange";

import {
  toolbarLinkAnchor,
  toolbarImageLinkExternal,
  toolbarLinkExternalBlank,
  toolbarLinkExternalRel,
  toolbarBoxShadowHexAndOpacity,
  toolbarBoxShadowPalette,
  toolbarBoxShadowFields,
  toolbarBoxShadow,
  toolbarHoverTransition
} from "visual/utils/toolbar";

export const getMinSize = () => 5;
export const getMaxSize = () => 100;
export const getMinHeight = () => 5;
export const getMaxHeight = (cW, v) => {
  const { imageWidth: iW, imageHeight: iH } = v;
  const originalContainerWidth = iH / (iW / cW);
  const maxHeight = ((cW * 2) / originalContainerWidth) * 100;

  return maxHeight >= 100 ? Math.round(maxHeight) : 100;
};

const imageDynamicContentChoices = getDynamicContentChoices("image");

export default ({
  desktopWrapperSizes,
  desktopContainerWidth,
  tabletWrapperSizes,
  tabletContainerWidth,
  mobileWrapperSizes,
  mobileContainerWidth,
  inGallery
}) => ({
  getItemsForDesktop: getItemsForDesktop(
    desktopWrapperSizes,
    desktopContainerWidth,
    inGallery
  ),
  getItemsForTablet: getItemsForTablet(
    tabletWrapperSizes,
    tabletContainerWidth,
    inGallery
  ),
  getItemsForMobile: getItemsForMobile(
    mobileWrapperSizes,
    mobileContainerWidth,
    inGallery
  )
});

export const getItemsForDesktop = (wrapperSizes, cW, inGallery) => v => {
  const device = "desktop";
  const maxBorderRadius = Math.round(
    Math.min(wrapperSizes.width, wrapperSizes.height) / 2
  );

  const { hex: boxShadowColorHex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: "boxShadowColorHex", device }),
    defaultValueValue({ v, key: "boxShadowColorPalette", device })
  );

  return [
    {
      id: "toolbarImage",
      type: "popover",
      icon: "nc-img",
      title: t("Image"),
      position: 80,
      options: [
        {
          id: "media",
          type: "tabs",
          tabs: [
            {
              id: "image",
              label: t("Image"),
              options: [
                {
                  id: "image",
                  label: t("Image"),
                  type: "imageSetter",
                  population: {
                    show: imageDynamicContentChoices.length > 0 && !inGallery,
                    choices: imageDynamicContentChoices
                  },
                  value: {
                    width: v.imageWidth,
                    height: v.imageHeight,
                    src: v.imageSrc,
                    x: v.positionX,
                    y: v.positionY,
                    population: v.imagePopulation
                  },
                  onChange: ({ width, height, src, x, y, population }) => {
                    if (population) {
                      return {
                        imagePopulation: population
                      };
                    }

                    width = width || DEFAULT_IMAGE_SIZES.width;
                    height = height || DEFAULT_IMAGE_SIZES.height;
                    const newWrapperSize = calcWrapperSizes(cW, {
                      imageWidth: width,
                      imageHeight: height,
                      resize: v.resize,
                      width: v.width,
                      height: 100
                    });
                    const newHeight =
                      src === v.imageSrc
                        ? v.height
                        : Math.round(
                            (wrapperSizes.height / newWrapperSize.height) * 100
                          );

                    return {
                      imageWidth: width,
                      imageHeight: height,
                      imageSrc: src,
                      height: newHeight,
                      positionX: x,
                      positionY: y,
                      imagePopulation: ""
                    };
                  }
                },
                {
                  id: "zoom",
                  label: t("Zoom"),
                  type: "slider",
                  disabled: Boolean(v.imagePopulation),
                  slider: {
                    min: 100,
                    max: 200
                  },
                  input: {
                    show: true,
                    min: 100,
                    max: 200
                  },
                  suffix: {
                    show: true,
                    choices: [
                      {
                        title: "%",
                        value: "%"
                      }
                    ]
                  },
                  value: {
                    value: v.zoom
                  },
                  onChange: ({ value: zoom }) => ({
                    zoom
                  })
                },
                {
                  id: "linkLightBox",
                  disabled: inGallery,
                  label: t("Open in Lightbox"),
                  type: "switch",
                  value: v.linkLightBox
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "toolbarColor",
      type: "popover",
      size: "auto",
      title: t("Colors"),
      roles: ["admin"],
      position: 80,
      icon: {
        style: {
          backgroundColor: hexToRgba(boxShadowColorHex, v.boxShadowColorOpacity)
        }
      },
      options: [
        {
          id: "tabsState",
          tabsPosition: "left",
          type: "tabs",
          value: v.tabsState,
          tabs: [
            {
              id: "tabNormal",
              tabIcon: "nc-circle",
              title: t("Normal"),
              options: [
                {
                  id: "tabsColor",
                  type: "tabs",
                  value: v.tabsColor,
                  hideHandlesWhenOne: false,
                  tabs: [
                    {
                      id: "tabBoxShadow",
                      label: t("Shadow"),
                      options: [
                        toolbarBoxShadowHexAndOpacity({
                          v,
                          device,
                          state: "normal",
                          onChange: [
                            "onChangeBoxShadowHexAndOpacity",
                            "onChangeBoxShadowHexAndOpacityPalette",
                            "onChangeBoxShadowHexAndOpacityDependencies"
                          ]
                        }),
                        toolbarBoxShadowPalette({
                          v,
                          device,
                          state: "normal",
                          onChange: [
                            "onChangeBoxShadowPalette",
                            "onChangeBoxShadowPaletteOpacity",
                            "onChangeBoxShadowHexAndOpacityDependencies"
                          ]
                        }),
                        {
                          type: "grid",
                          className: "brz-ed-grid__color-fileds",
                          columns: [
                            {
                              width: 41,
                              options: [
                                toolbarBoxShadowFields({
                                  v,
                                  device,
                                  state: "normal",
                                  onChange: [
                                    "onChangeBoxShadowHexAndOpacity",
                                    "onChangeBoxShadowHexAndOpacityPalette",
                                    "onChangeBoxShadowHexAndOpacityDependencies"
                                  ]
                                })
                              ]
                            },
                            {
                              width: 59,
                              options: [
                                toolbarBoxShadow({
                                  v,
                                  device,
                                  state: "normal"
                                })
                              ]
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              id: "tabHover",
              tabIcon: "nc-hover",
              title: t("Hover"),
              options: [
                {
                  id: "tabsColor",
                  type: "tabs",
                  value: v.tabsColor,
                  hideHandlesWhenOne: false,
                  tabs: [
                    {
                      id: "tabBoxShadow",
                      label: t("Shadow"),
                      options: [
                        toolbarBoxShadowHexAndOpacity({
                          v,
                          device,
                          state: "hover",
                          onChange: [
                            "onChangeBoxShadowHexAndOpacity",
                            "onChangeBoxShadowHexAndOpacityPalette",
                            "onChangeBoxShadowHexAndOpacityDependencies"
                          ]
                        }),
                        toolbarBoxShadowPalette({
                          v,
                          device,
                          state: "hover",
                          onChange: [
                            "onChangeBoxShadowPalette",
                            "onChangeBoxShadowPaletteOpacity",
                            "onChangeBoxShadowHexAndOpacityDependencies"
                          ]
                        }),
                        {
                          type: "grid",
                          className: "brz-ed-grid__color-fileds",
                          columns: [
                            {
                              width: 41,
                              options: [
                                toolbarBoxShadowFields({
                                  v,
                                  device,
                                  state: "hover",
                                  onChange: [
                                    "onChangeBoxShadowHexAndOpacity",
                                    "onChangeBoxShadowHexAndOpacityPalette",
                                    "onChangeBoxShadowHexAndOpacityDependencies"
                                  ]
                                })
                              ]
                            },
                            {
                              width: 59,
                              options: [
                                toolbarBoxShadow({
                                  v,
                                  device,
                                  state: "hover"
                                })
                              ]
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      onChange: (_, { isOpen }) => ({
        tabsState: !isOpen ? "tabNormal" : v.tabsState
      })
    },
    {
      id: "toolbarLink",
      type: "popover",
      icon: "nc-link",
      title: t("Link"),
      size: "medium",
      position: 90,
      disabled: inGallery && v.linkLightBox === "on",
      options: [
        {
          id: "linkType",
          type: "tabs",
          value: v.linkType,
          tabs: [
            {
              id: "external",
              label: t("URL"),
              options: [
                toolbarImageLinkExternal({ v, inGallery }),
                toolbarLinkExternalBlank({ v }),
                toolbarLinkExternalRel({ v })
              ]
            },
            {
              id: "anchor",
              label: t("Anchor"),
              options: [toolbarLinkAnchor({ v })]
            }
          ]
        }
      ]
    },
    {
      id: "toolbarSettings",
      type: "popover",
      icon: "nc-cog",
      title: t("Settings"),
      roles: ["admin"],
      position: 110,
      disabled: inGallery,
      options: [
        {
          id: "resize",
          label: t("Size"),
          type: "slider",
          slider: {
            min: getMinSize(),
            max: getMaxSize()
          },
          input: {
            show: true
          },
          suffix: {
            show: true,
            choices: [
              {
                title: "%",
                value: "%"
              }
            ]
          },
          value: {
            value: v.resize
          },
          onChange: ({ value: resize }) => ({
            resize
          })
        },
        {
          id: "height",
          label: t("Height"),
          type: "slider",
          slider: {
            min: getMinHeight(),
            max: getMaxHeight(cW, v)
          },
          input: {
            show: true
          },
          suffix: {
            show: true,
            choices: [
              {
                title: "%",
                value: "%"
              }
            ]
          },
          value: {
            value: v.height
          },
          onChange: ({ value: height }) => ({
            height
          })
        },
        {
          type: "multiPicker",
          picker: {
            id: "borderRadiusType",
            label: t("Corner"),
            type: "radioGroup",
            choices: [
              {
                value: "square",
                icon: "nc-corners-square"
              },
              {
                value: "rounded",
                icon: "nc-corners-round"
              },
              {
                value: "custom",
                icon: "nc-more"
              }
            ],
            value: v.borderRadiusType,
            onChange: borderRadiusType => ({
              borderRadiusType,

              borderRadius:
                borderRadiusType === "square"
                  ? v.tempBorderRadius
                  : borderRadiusType === "rounded"
                  ? maxBorderRadius
                  : v.borderRadius
            })
          },
          choices: {
            custom: [
              {
                id: "borderRadius",
                type: "slider",
                slider: {
                  min: 0,
                  max: maxBorderRadius
                },
                input: {
                  show: true,
                  max: maxBorderRadius
                },
                suffix: {
                  show: true,
                  choices: [
                    {
                      title: "px",
                      value: "px"
                    }
                  ]
                },
                value: {
                  value: Math.min(v.borderRadius, maxBorderRadius)
                },
                onChange: ({ value: borderRadius }) => ({
                  borderRadius,
                  tempBorderRadius: borderRadius
                })
              }
            ]
          }
        },
        {
          id: "advancedSettings",
          type: "advancedSettings",
          label: t("More Settings"),
          icon: "nc-cog",
          options: [
            {
              id: "settingsTabs",
              type: "tabs",
              align: "start",
              tabs: [
                {
                  id: "settingsStyling",
                  label: t("Styling"),
                  tabIcon: "nc-styling",
                  options: []
                },
                {
                  id: "moreSettingsAdvanced",
                  label: t("Advanced"),
                  tabIcon: "nc-cog",
                  options: [toolbarHoverTransition({ v, position: 100 })]
                }
              ]
            }
          ]
        }
      ]
    }
  ];
};

export const getItemsForTablet = (wrapperSizes, cW, inGallery) => v => {
  const device = "tablet";

  const { hex: tabletBoxShadowColorHex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: "boxShadowColorHex", device }),
    defaultValueValue({ v, key: "boxShadowColorPalette", device })
  );

  return [
    {
      id: "toolbarImage",
      type: "popover",
      icon: "nc-img",
      title: t("Image"),
      position: 80,
      options: [
        {
          id: "tabletImage",
          label: t("Image"),
          type: "imageSetter",
          onlyPointer: true,
          population: {
            show: imageDynamicContentChoices.length > 0 && !inGallery,
            choices: imageDynamicContentChoices
          },
          value: {
            width: v.imageWidth,
            height: v.imageHeight,
            src: v.imageSrc,
            x: tabletSyncOnChange(v, "positionX"),
            y: tabletSyncOnChange(v, "positionY"),
            population: v.imagePopulation
          },
          onChange: ({ width, height, x, y, population }) => {
            if (population) {
              return {
                imagePopulation: population
              };
            }

            width = width || DEFAULT_IMAGE_SIZES.width;
            height = height || DEFAULT_IMAGE_SIZES.height;
            const newWrapperSize = calcWrapperSizes(cW, {
              imageWidth: width,
              imageHeight: height,
              resize: tabletSyncOnChange(v, "resize"),
              width: tabletSyncOnChange(v, "width"),
              height: 100
            });
            const newHeight = Math.round(
              (wrapperSizes.height / newWrapperSize.height) * 100
            );

            return {
              imageWidth: width,
              imageHeight: height,
              tabletPositionX: x,
              tabletPositionY: y,
              tabletHeight: newHeight,
              imagePopulation: ""
            };
          }
        },
        {
          id: "tabletZoom",
          label: t("Zoom"),
          type: "slider",
          disabled: Boolean(v.imagePopulation),
          slider: {
            min: 100,
            max: 200
          },
          value: {
            value: tabletSyncOnChange(v, "zoom")
          },
          onChange: ({ value: tabletZoom }) => ({ tabletZoom })
        }
      ]
    },
    {
      id: "tabletToolbarColor",
      type: "popover",
      size: "auto",
      title: t("Colors"),
      roles: ["admin"],
      position: 80,
      icon: {
        style: {
          backgroundColor: hexToRgba(
            tabletBoxShadowColorHex,
            v.tabletBoxShadowColorOpacity
          )
        }
      },
      options: [
        {
          id: "tabletTabsColor",
          type: "tabs",
          hideHandlesWhenOne: false,
          tabs: [
            {
              id: "tabletBoxShadow",
              label: t("Shadow"),
              options: [
                toolbarBoxShadowHexAndOpacity({
                  v,
                  device,
                  state: "normal",
                  onChange: [
                    "onChangeBoxShadowHexAndOpacity",
                    "onChangeBoxShadowHexAndOpacityPalette",
                    "onChangeBoxShadowHexAndOpacityDependencies"
                  ]
                }),
                toolbarBoxShadowPalette({
                  v,
                  device,
                  state: "normal",
                  onChange: [
                    "onChangeBoxShadowPalette",
                    "onChangeBoxShadowPaletteOpacity",
                    "onChangeBoxShadowHexAndOpacityDependencies"
                  ]
                }),
                {
                  type: "grid",
                  className: "brz-ed-grid__color-fileds",
                  columns: [
                    {
                      width: 41,
                      options: [
                        toolbarBoxShadowFields({
                          v,
                          device,
                          state: "normal",
                          onChange: [
                            "onChangeBoxShadowHexAndOpacity",
                            "onChangeBoxShadowHexAndOpacityPalette",
                            "onChangeBoxShadowHexAndOpacityDependencies"
                          ]
                        })
                      ]
                    },
                    {
                      width: 59,
                      options: [
                        toolbarBoxShadow({
                          v,
                          device,
                          state: "normal"
                        })
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "tabletToolbarLink",
      type: "popover",
      icon: "nc-link",
      position: 90,
      options: []
    },
    {
      id: "tabletToolbarSettings",
      type: "popover",
      icon: "nc-cog",
      title: t("Settings"),
      roles: ["admin"],
      position: 110,
      disabled: inGallery,
      options: [
        {
          id: "tabletResize",
          label: t("Size"),
          type: "slider",
          input: {
            show: true
          },
          suffix: {
            show: true,
            choices: [
              {
                title: "%",
                value: "%"
              }
            ]
          },
          value: {
            value: tabletSyncOnChange(v, "resize")
          },
          onChange: ({ value: tabletResize }) => ({ tabletResize })
        },
        {
          id: "tabletHeight",
          label: t("Height"),
          type: "slider",
          slider: {
            max: getMaxHeight(cW, v)
          },
          input: {
            show: true
          },
          suffix: {
            show: true,
            choices: [
              {
                title: "%",
                value: "%"
              }
            ]
          },
          value: {
            value: tabletSyncOnChange(v, "height")
          },
          onChange: ({ value: tabletHeight }) => ({ tabletHeight })
        }
      ]
    }
  ];
};

export const getItemsForMobile = (wrapperSizes, cW, inGallery) => v => {
  const device = "mobile";

  const { hex: mobileBoxShadowColorHex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: "boxShadowColorHex", device }),
    defaultValueValue({ v, key: "boxShadowColorPallete", device })
  );
  return [
    {
      id: "toolbarImage",
      type: "popover",
      icon: "nc-img",
      title: t("Image"),
      position: 80,
      options: [
        {
          id: "media",
          type: "tabs",
          tabs: [
            {
              id: "image",
              label: t("Image"),
              options: [
                {
                  id: "mobileImage",
                  label: t("Image"),
                  type: "imageSetter",
                  onlyPointer: true,
                  population: {
                    show: imageDynamicContentChoices.length > 0 && !inGallery,
                    choices: imageDynamicContentChoices
                  },
                  value: {
                    width: v.imageWidth,
                    height: v.imageHeight,
                    src: v.imageSrc,
                    x: mobileSyncOnChange(v, "positionX"),
                    y: mobileSyncOnChange(v, "positionY"),
                    population: v.imagePopulation
                  },
                  onChange: ({ width, height, x, y, population }) => {
                    if (population) {
                      return {
                        imagePopulation: population
                      };
                    }

                    width = width || DEFAULT_IMAGE_SIZES.width;
                    height = height || DEFAULT_IMAGE_SIZES.height;
                    const newWrapperSize = calcWrapperSizes(cW, {
                      imageWidth: width,
                      imageHeight: height,
                      resize: mobileSyncOnChange(v, "resize"),
                      width: mobileSyncOnChange(v, "width"),
                      height: 100
                    });
                    const newHeight = Math.round(
                      (wrapperSizes.height / newWrapperSize.height) * 100
                    );

                    return {
                      imageWidth: width,
                      imageHeight: height,
                      mobilePositionX: x,
                      mobilePositionY: y,
                      mobileHeight: newHeight,
                      imagePopulation: ""
                    };
                  }
                },
                {
                  id: "mobileZoom",
                  label: t("Zoom"),
                  type: "slider",
                  disabled: Boolean(v.imagePopulation),
                  slider: {
                    min: 100,
                    max: 200
                  },
                  value: {
                    value: mobileSyncOnChange(v, "zoom")
                  },
                  onChange: ({ value: mobileZoom }) => ({ mobileZoom })
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "mobileToolbarColor",
      type: "popover",
      size: "auto",
      title: t("Colors"),
      roles: ["admin"],
      position: 80,
      icon: {
        style: {
          backgroundColor: hexToRgba(
            mobileBoxShadowColorHex,
            v.mobileBoxShadowColorOpacity
          )
        }
      },
      options: [
        {
          id: "mobileTabsColor",
          className: "",
          type: "tabs",
          hideHandlesWhenOne: false,
          tabs: [
            {
              id: "mobileBoxShadow",
              label: t("Shadow"),
              options: [
                toolbarBoxShadowHexAndOpacity({
                  v,
                  device,
                  state: "normal",
                  onChange: [
                    "onChangeBoxShadowHexAndOpacity",
                    "onChangeBoxShadowHexAndOpacityPalette",
                    "onChangeBoxShadowHexAndOpacityDependencies"
                  ]
                }),
                toolbarBoxShadowPalette({
                  v,
                  device,
                  state: "normal",
                  onChange: [
                    "onChangeBoxShadowPalette",
                    "onChangeBoxShadowPaletteOpacity",
                    "onChangeBoxShadowHexAndOpacityDependencies"
                  ]
                }),
                {
                  type: "grid",
                  className: "brz-ed-grid__color-fileds",
                  columns: [
                    {
                      width: 41,
                      options: [
                        toolbarBoxShadowFields({
                          v,
                          device,
                          state: "normal",
                          onChange: [
                            "onChangeBoxShadowHexAndOpacity",
                            "onChangeBoxShadowHexAndOpacityPalette",
                            "onChangeBoxShadowHexAndOpacityDependencies"
                          ]
                        })
                      ]
                    },
                    {
                      width: 59,
                      options: [
                        toolbarBoxShadow({
                          v,
                          device,
                          state: "normal"
                        })
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "mobileToolbarLink",
      type: "popover",
      icon: "nc-link",
      position: 90,
      options: []
    },
    {
      id: "mobileToolbarSettings",
      type: "popover",
      icon: "nc-cog",
      title: t("Settings"),
      roles: ["admin"],
      position: 110,
      disabled: inGallery,
      options: [
        {
          id: "mobileResize",
          label: t("Size"),
          type: "slider",
          input: {
            show: true
          },
          suffix: {
            show: true,
            choices: [
              {
                title: "%",
                value: "%"
              }
            ]
          },
          value: {
            value: mobileSyncOnChange(v, "resize")
          },
          onChange: ({ value: mobileResize }) => ({ mobileResize })
        },
        {
          id: "mobileHeight",
          label: t("Height"),
          type: "slider",
          slider: {
            max: getMaxHeight(cW, v)
          },
          input: {
            show: true
          },
          suffix: {
            show: true,
            choices: [
              {
                title: "%",
                value: "%"
              }
            ]
          },
          value: {
            value: mobileSyncOnChange(v, "height")
          },
          onChange: ({ value: mobileHeight }) => ({ mobileHeight })
        }
      ]
    }
  ];
};

const DEFAULT_IMAGE_SIZES = {
  width: 1440,
  height: 960
};
