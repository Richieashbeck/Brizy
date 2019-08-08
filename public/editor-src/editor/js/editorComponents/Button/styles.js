import { renderStyles } from "visual/utils/cssStyle";

export function style(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      standart: [
        "cssStyleTypographyFontFamily",
        "cssStyleTypographyFontWeight",
        "cssStyleTypographyFontSize",
        "cssStyleTypographyLineHeight",
        "cssStyleTypographyLetterSpacing",
        "cssStyleColor",
        "cssStyleBorder",
        "cssStyleBgColor",
        "cssStyleBgGradient",
        "cssStyleBoxShadow",
        "cssStyleElementButtonBorderRadius",
        "cssStylePadding",
        "cssStyleElementButtonIconPosition"
      ],
      interval: ["cssStyleHoverTransition"]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}

export function styleIcon(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      standart: [
        "cssStyleElementButtonIconFontSize",
        "cssStyleElementButtonIconMargin",
        "cssStyleElementIconStrokeWidth"
      ]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
