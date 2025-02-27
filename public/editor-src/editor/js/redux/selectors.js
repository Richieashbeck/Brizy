import { createSelector } from "reselect";
import produce from "immer";
import Editor from "visual/global/Editor";
import objectTraverse from "visual/utils/objectTraverse";
import { getGeneratedGlobalBlocksInPage } from "visual/utils/blocks";

export const pageDataSelector = state => state.page.data || {};

export const globalBlocksSelector = state => state.globalBlocks || {};

export const savedBlocksSelector = state => state.savedBlocks || {};

export const deviceModeSelector = state => state.ui.deviceMode;

export const globalsSelector = state => state.globals || {};

export const copiedElementSelector = state => state.copiedElement;

export const pageBlocksSelector = createSelector(
  pageDataSelector,
  pageData => pageData.items || []
);

export const currentStyleSelector = createSelector(
  globalsSelector,
  globals => {
    const { styles: globalStyles = {} } = globals;
    const currentStyleId =
      globalStyles._selected && Editor.getStyle(globalStyles._selected)
        ? globalStyles._selected
        : "default";
    const currentStyle = {
      ...Editor.getStyle(currentStyleId),
      ...globalStyles[currentStyleId]
    };

    const { colorPalette, fontStyles } = currentStyle;
    const { _extraFontStyles: extraFontStyles = [] } = globalStyles;
    const mergedFontStyles = fontStyles.concat(extraFontStyles);

    const generatedColorRules = colorPalette.reduce(
      (acc, color) => ({
        ...acc,
        [`${color.id}__color`]: {
          colorHex: color.hex
        },
        [`${color.id}__hoverColor`]: {
          hoverColorHex: color.hex
        },
        [`${color.id}__bg`]: {
          bgColorHex: color.hex
        },
        [`${color.id}__hoverBg`]: {
          hoverBgColorHex: color.hex
        },
        [`${color.id}__gradient`]: {
          gradientColorHex: color.hex
        },
        [`${color.id}__hoverGradient`]: {
          hoverGradientColorHex: color.hex
        },
        [`${color.id}__bg2`]: {
          bg2ColorHex: color.hex
        },
        [`${color.id}__border`]: {
          borderColorHex: color.hex
        },
        [`${color.id}__hoverBorder`]: {
          hoverBorderColorHex: color.hex
        },
        [`${color.id}__arrowsColor`]: {
          sliderArrowsColorHex: color.hex
        },
        [`${color.id}__dotsColor`]: {
          sliderDotsColorHex: color.hex
        },
        [`${color.id}__boxShadow`]: {
          boxShadowColorHex: color.hex
        },
        [`${color.id}__shapeTopColor`]: {
          shapeTopColorHex: color.hex
        },
        [`${color.id}__shapeBottomColor`]: {
          shapeBottomColorHex: color.hex
        },
        [`${color.id}__paginationColor`]: {
          paginationColorHex: color.hex
        },
        [`${color.id}__tabletBg`]: {
          tabletBgColorHex: color.hex
        },
        [`${color.id}__tabletBorder`]: {
          tabletBorderColorHex: color.hex
        },
        [`${color.id}__mobileBg`]: {
          mobileBgColorHex: color.hex
        },
        [`${color.id}__mobileBorder`]: {
          mobileBorderColorHex: color.hex
        },
        [`${color.id}__subMenuColor`]: {
          subMenuColorHex: color.hex
        },
        [`${color.id}__subMenuHoverColor`]: {
          subMenuHoverColorHex: color.hex
        },
        [`${color.id}__subMenuBgColor`]: {
          subMenuBgColorHex: color.hex
        },
        [`${color.id}__subMenuHoverBgColor`]: {
          subMenuHoverBgColorHex: color.hex
        },
        [`${color.id}__subMenuBorderColor`]: {
          subMenuBorderColorHex: color.hex
        },
        [`${color.id}__mMenuColor`]: {
          mMenuColorHex: color.hex
        },
        [`${color.id}__mMenuHoverColor`]: {
          mMenuHoverColorHex: color.hex
        },
        [`${color.id}__mMenuBgColor`]: {
          mMenuBgColorHex: color.hex
        },
        [`${color.id}__mMenuBorderColor`]: {
          mMenuBorderColorHex: color.hex
        },
        [`${color.id}__mMenuIconColor`]: {
          mMenuIconColorHex: color.hex
        },
        [`${color.id}__tabletMMenuIconColor`]: {
          tabletMMenuIconColorHex: color.hex
        },
        [`${color.id}__mobileMMenuIconColor`]: {
          mobileMMenuIconColorHex: color.hex
        }
      }),
      {}
    );
    const generatedFontRules = mergedFontStyles.reduce(
      (acc, font) => ({
        ...acc,
        [`${font.id}__fsDesktop`]: {
          fontFamily: font.fontFamily,
          fontSize: font.fontSize,
          fontWeight: font.fontWeight,
          lineHeight: font.lineHeight,
          letterSpacing: font.letterSpacing
        },
        [`${font.id}__fsTablet`]: {
          tabletFontSize: font.tabletFontSize,
          tabletFontWeight: font.tabletFontWeight,
          tabletLineHeight: font.tabletLineHeight,
          tabletLetterSpacing: font.tabletLetterSpacing
        },
        [`${font.id}__fsMobile`]: {
          mobileFontSize: font.mobileFontSize,
          mobileFontWeight: font.mobileFontWeight,
          mobileLineHeight: font.mobileLineHeight,
          mobileLetterSpacing: font.mobileLetterSpacing
        },
        [`${font.id}__subMenuFsDesktop`]: {
          subMenuFontFamily: font.fontFamily,
          subMenuFontSize: font.fontSize,
          subMenuFontWeight: font.fontWeight,
          subMenuLineHeight: font.lineHeight,
          subMenuLetterSpacing: font.letterSpacing
        },
        [`${font.id}__subMenuFsTablet`]: {
          tabletSubMenuFontSize: font.tabletFontSize,
          tabletSubMenuFontWeight: font.tabletFontWeight,
          tabletSubMenuLineHeight: font.tabletLineHeight,
          tabletSubMenuLetterSpacing: font.tabletLetterSpacing
        },
        [`${font.id}__subMenuFsMobile`]: {
          mobileSubMenuFontSize: font.mobileFontSize,
          mobileSubMenuFontWeight: font.mobileFontWeight,
          mobileSubMenuLineHeight: font.mobileLineHeight,
          mobileSubMenuLetterSpacing: font.mobileLetterSpacing
        },
        [`${font.id}__mMenuFsDesktop`]: {
          mMenuFontFamily: font.fontFamily,
          mMenuFontSize: font.fontSize,
          mMenuFontWeight: font.fontWeight,
          mMenuLineHeight: font.lineHeight,
          mMenuLetterSpacing: font.letterSpacing
        },
        [`${font.id}__mMenuFsTablet`]: {
          tabletMMenuFontSize: font.tabletFontSize,
          tabletMMenuFontWeight: font.tabletFontWeight,
          tabletMMenuLineHeight: font.tabletLineHeight,
          tabletMMenuLetterSpacing: font.tabletLetterSpacing
        },
        [`${font.id}__mMenuFsMobile`]: {
          mobileMMenuFontSize: font.mobileFontSize,
          mobileMMenuFontWeight: font.mobileFontWeight,
          mobileMMenuLineHeight: font.mobileLineHeight,
          mobileMMenuLetterSpacing: font.mobileLetterSpacing
        }
      }),
      {}
    );
    const rules = {
      ...Editor.getStyle("default").rules,
      ...currentStyle.rules,
      ...generatedColorRules,
      ...generatedFontRules
    };

    return {
      id: currentStyleId,
      colorPalette,
      fontStyles,
      extraFontStyles,
      mergedFontStyles,
      rules
    };
  }
);

export const pageDataNoRefsSelector = createSelector(
  pageDataSelector,
  globalBlocksSelector,
  (pageData, globalBlocks) => {
    return produce(pageData, draft => {
      objectTraverse(draft, (key, value, obj) => {
        if (obj.type && obj.type === "GlobalBlock" && obj.value) {
          const { globalBlockId } = obj.value;

          if (globalBlocks[globalBlockId]) {
            Object.assign(obj, globalBlocks[globalBlockId]);
          }
        }
      });
    });
  }
);

export const globalBlocksInPageSelector = createSelector(
  globalBlocksSelector,
  pageBlocksSelector,
  (globalBlocks, pageBlocks) => {
    const acc = {};

    // global blocks can be deep in the tree (like popups)
    // that's why it's not sufficient to search only with a simple reduce
    objectTraverse(pageBlocks, (key, value, obj) => {
      if (obj.type && obj.type === "GlobalBlock" && obj.value) {
        const { globalBlockId } = obj.value;

        if (!acc[globalBlockId]) {
          acc[globalBlockId] = globalBlocks[globalBlockId];
        }
      }
    });

    return acc;
  }
);

export const copiedElementNoRefsSelector = createSelector(
  copiedElementSelector,
  globalBlocksSelector,
  (copiedElement, globalBlocks) => {
    return produce(copiedElement, draft => {
      objectTraverse(draft, (key, value, obj) => {
        if (obj.type && obj.type === "GlobalBlock" && obj.value) {
          const { globalBlockId } = obj.value;

          if (globalBlocks[globalBlockId]) {
            Object.assign(obj, globalBlocks[globalBlockId]);
          }
        }
      });
    });
  }
);
