import { renderStyles } from "visual/utils/cssStyle";

export function style(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      standart: ["cssStyleSizeWidthPercent", "cssStyleSizeMinHeightPx"]
    },
    ".brz &&:hover:before": {
      standart: [
        "cssStyleBorder",
        "cssStyleBorderRadius",
        ,
        "cssStyleBoxShadow"
      ],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz &&:hover .brz-soundCloud-content": {
      standart: ["cssStyleBorderRadius"],
      interval: ["cssStyleHoverTransition"]
    },
    ".brz &&:hover iframe": { standart: ["cssStyleSizeHeightPx"] }
  };

  return renderStyles({ v, vs, vd, styles });
}
