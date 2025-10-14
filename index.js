import { predefinedSkinTones } from "./tones.js";

// HEX <-> RGB
export function hexToRgb(hex) {
  const bigint = parseInt(hex.slice(1), 16);
  return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
}
export function rgbToHex(r, g, b) {
  return "#" + [r, g, b].map(x => (x.toString(16).length === 1 ? "0" + x.toString(16) : x.toString(16))).join("");
}

// RGB → LAB
function rgbToXyz(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
  g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
  b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
  r *= 100; g *= 100; b *= 100;
  return {
    x: r * 0.4124 + g * 0.3576 + b * 0.1805,
    y: r * 0.2126 + g * 0.7152 + b * 0.0722,
    z: r * 0.0193 + g * 0.1192 + b * 0.9505,
  };
}
function xyzToLab(x, y, z) {
  const refX = 95.047, refY = 100.000, refZ = 108.883;
  x /= refX; y /= refY; z /= refZ;
  x = x > 0.008856 ? Math.cbrt(x) : (7.787 * x) + (16 / 116);
  y = y > 0.008856 ? Math.cbrt(y) : (7.787 * y) + (16 / 116);
  z = z > 0.008856 ? Math.cbrt(z) : (7.787 * z) + (16 / 116);
  return { l: (116 * y) - 16, a: 500 * (x - y), b: 200 * (y - z) };
}
function hexToLab(hex) {
  const rgb = hexToRgb(hex);
  return xyzToLab(...Object.values(rgbToXyz(rgb.r, rgb.g, rgb.b)));
}

// ΔE2000
function deltaE2000(lab1, lab2) {
  const { l: L1, a: a1, b: b1 } = lab1;
  const { l: L2, a: a2, b: b2 } = lab2;
  const avgLp = (L1 + L2) / 2.0;
  const C1 = Math.sqrt(a1*a1 + b1*b1);
  const C2 = Math.sqrt(a2*a2 + b2*b2);
  const avgC = (C1 + C2) / 2.0;
  const G = 0.5 * (1 - Math.sqrt(Math.pow(avgC,7)/(Math.pow(avgC,7)+Math.pow(25,7))));
  const a1p = (1+G)*a1, a2p = (1+G)*a2;
  const C1p = Math.sqrt(a1p*a1p + b1*b1);
  const C2p = Math.sqrt(a2p*a2p + b2*b2);
  const avgCp = (C1p+C2p)/2;
  const h1p = Math.atan2(b1,a1p)*180/Math.PI+(Math.atan2(b1,a1p)<0?360:0);
  const h2p = Math.atan2(b2,a2p)*180/Math.PI+(Math.atan2(b2,a2p)<0?360:0);
  let deltahp = (Math.abs(h1p-h2p)<=180)?h2p-h1p:h2p<=h1p?h2p-h1p+360:h2p-h1p-360;
  const deltaLp = L2-L1;
  const deltaCp = C2p-C1p;
  const deltaHp = 2*Math.sqrt(C1p*C2p)*Math.sin((deltahp*Math.PI/180)/2);
  const avgHp = (Math.abs(h1p-h2p)>180)?(h1p+h2p+360)/2:(h1p+h2p)/2;
  const T = 1-0.17*Math.cos((avgHp-30)*Math.PI/180)+0.24*Math.cos((2*avgHp)*Math.PI/180)+0.32*Math.cos((3*avgHp+6)*Math.PI/180)-0.20*Math.cos((4*avgHp-63)*Math.PI/180);
  const deltaTheta = 30*Math.exp(-Math.pow((avgHp-275)/25,2));
  const Rc = 2*Math.sqrt(Math.pow(avgCp,7)/(Math.pow(avgCp,7)+Math.pow(25,7)));
  const Sl = 1+(0.015*Math.pow(avgLp-50,2))/Math.sqrt(20+Math.pow(avgLp-50,2));
  const Sc = 1+0.045*avgCp;
  const Sh = 1+0.015*avgCp*T;
  const Rt = -Math.sin(2*deltaTheta*Math.PI/180)*Rc;
  return Math.sqrt(Math.pow(deltaLp/Sl,2)+Math.pow(deltaCp/Sc,2)+Math.pow(deltaHp/Sh,2)+Rt*(deltaCp/Sc)*(deltaHp/Sh));
}

// Find Closest Tone
export function getClosestTone(hex) {
  const lab = hexToLab(hex);
  let bestMatch = null;
  let lowestDelta = Infinity;
  for (let [toneName, toneHex] of Object.entries(predefinedSkinTones)) {
    const toneLab = hexToLab(toneHex);
    const deltaE = deltaE2000(lab, toneLab);
    if (deltaE < lowestDelta) {
      lowestDelta = deltaE;
      bestMatch = toneName;
    }
  }
  return { tone: bestMatch, hex: predefinedSkinTones[bestMatch], deltaE: lowestDelta };
}
