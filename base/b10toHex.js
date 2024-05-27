/**
 * Change the base 10 color to hex string.
 * @param {Base10Color} Base10Color The base 10 color to convert.
 * @return {HexColor} The hex color.
 */

module.exports = {
  colorToHexString: function (dColor) {
    const HEX = 16;
    return "#" + Number(dColor).toString(HEX).toUpperCase();
  },
};
