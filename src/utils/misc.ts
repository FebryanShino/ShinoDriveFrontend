export function hashToRGB(str: string) {
  const rgb = [];
  for (let i = 0; i < (str.length < 4 ? str.length : 3); i++) {
    const color = Math.round(((str.charCodeAt(i) - 97) / 25) * 135 + 120);
    rgb.push(color);
  }
  return rgb;
}
