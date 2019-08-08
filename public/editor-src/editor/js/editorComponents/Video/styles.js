import { renderStyles } from "visual/utils/cssStyle";

export function styleContent(v, vs, vd, props) {
  const styles = {
    ".brz &&:hover": {
      standart: [
        "cssStyleBorderRadius",
        "cssStyleElementVideoBgColorRatio",
        "cssStyleSizeMaxWidthSize",
        "cssStyleElementVideoHeight"
      ]
    },
    ".brz &&:hover:before": {
      standart: ["cssStyleBoxShadow", "cssStyleBorder", "cssStyleBorderRadius"],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz &&:hover .brz-video-content, && .brz-shortcode__placeholder": {
      standart: ["cssStyleBorderRadius"],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz &&:hover .brz-iframe, && .brz-video__cover:before": {
      standart: ["cssStyleElementVideoFilter"]
    }
  };
  return renderStyles({ v, vs, vd, styles, props });
}

export function styleWrapper(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      standart: [
        "cssStyleElementVideoPaddingRatio",
        "cssStyleElementVideoPointerEvents"
      ]
    },
    ".brz &&:hover .brz-video__cover::before": {
      standart: [
        "cssStyleElementVideoCoverSrc",
        "cssStyleElementVideoCoverPosition",
        "cssStyleElementVideoBgSize"
      ]
    },
    ".brz &&:hover .brz-video__cover .brz-video__cover-icon": {
      standart: [
        "cssStyleElementVideoIconFontSize",
        "cssStyleElementVideoIconWidth",
        "cssStyleElementVideoIconHeight",
        "cssStyleBgColor"
      ]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
