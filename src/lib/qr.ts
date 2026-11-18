import QRCode from "qrcode";

export interface QRCodeOptions {
  width?: number;
  margin?: number;
  darkColor?: string;
  lightColor?: string;
}

export async function generateQRCodeDataUrl(
  text: string,
  options: QRCodeOptions = {}
): Promise<string> {
  const {
    width = 600,
    margin = 2,
    darkColor = "#00F0FF",
    lightColor = "#04070D",
  } = options;

  return QRCode.toDataURL(text, {
    width,
    margin,
    color: {
      dark: darkColor,
      light: lightColor,
    },
    errorCorrectionLevel: "H",
  });
}

export async function generateQRCodeSVG(
  text: string,
  options: QRCodeOptions = {}
): Promise<string> {
  const {
    width = 400,
    margin = 2,
    darkColor = "#00F0FF",
    lightColor = "#04070D",
  } = options;

  return QRCode.toString(text, {
    type: "svg",
    width,
    margin,
    color: {
      dark: darkColor,
      light: lightColor,
    },
    errorCorrectionLevel: "H",
  });
}
