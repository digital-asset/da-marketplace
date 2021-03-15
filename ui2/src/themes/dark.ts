import tinycolor from "tinycolor2";
import {PaletteType} from "@material-ui/core";

const primary = "#454444"; //"#01a6c0"; //"#E5E6E7"
const secondary = "#1a1a1a"; //"#203260"; //"#01a6c0"; //"#639";
const warning = "#ffc260";
const success = "#3cd4a0";
const info = "#9013fe";

const lightenRate = 7.5;
const darkenRate = 15;

const paletteType : PaletteType = "dark";

export default {
  palette: {
    type : paletteType,
    primary: {
      main: primary,
      light: tinycolor(primary)
        .lighten(lightenRate)
        .toHexString(),
      dark: tinycolor(primary)
        .darken(darkenRate)
        .toHexString(),
    },
    secondary: {
      main: secondary,
      light: tinycolor(secondary)
        .lighten(lightenRate)
        .toHexString(),
      dark: tinycolor(secondary)
        .darken(darkenRate)
        .toHexString(),
      contrastText: "#FFFFFF",
    },
    warning: {
      main: warning,
      light: tinycolor(warning)
        .lighten(lightenRate)
        .toHexString(),
      dark: tinycolor(warning)
        .darken(darkenRate)
        .toHexString(),
    },
    success: {
      main: success,
      light: tinycolor(success)
        .lighten(lightenRate)
        .toHexString(),
      dark: tinycolor(success)
        .darken(darkenRate)
        .toHexString(),
    },
    info: {
      main: info,
      light: tinycolor(info)
        .lighten(lightenRate)
        .toHexString(),
      dark: tinycolor(info)
        .darken(darkenRate)
        .toHexString(),
    },
    text: {
      primary: "#ffffff", //"#393939", //"#4A4A4A",
      secondary: "#dbdada", //"#00565f", // "#393939", "#6E6E6E",
      hint: "#e3d7d7",
    },
    background: {
      default: "#000000", //"#F6F7FF",
      light: "#0c0c0c",
      paper: "#303030"
    },
  },
  customShadows: {
    widget:
      "0px 3px 11px 0px #E8EAFC, 0 3px 3px -2px #B2B2B21A, 0 1px 8px 0 #9A9A9A1A",
    widgetDark:
      "0px 3px 18px 0px #4558A3B3, 0 3px 3px -2px #B2B2B21A, 0 1px 8px 0 #9A9A9A1A",
    widgetWide:
      "0px 12px 33px 0px #E8EAFC, 0 3px 3px -2px #B2B2B21A, 0 1px 8px 0 #9A9A9A1A",
  },
  typography: {
    fontFamily: [
      '"Noto Sans Condensed"',
      'Helvetica',
      'Arial',
      'sans-serif',
    ].join(','),
  },
};
