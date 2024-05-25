module.exports = {
    colorToHexString: function (dColor) {
        const HEX = 16;
        return "#" + Number(dColor).toString(HEX).toUpperCase()
    }
}