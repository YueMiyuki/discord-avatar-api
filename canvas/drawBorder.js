// Draws a border around the canvas.

module.exports = {
  drawBorder: async function (client, ctx, user, canvas) {
    const db = client.db;
    const isEnabled = await db.get("banner_enable_" + user.id);
    if (!isEnabled) return;

    const color = await db.get("banner_" + user.id);

    let acolor;
    if (!color) {
      acolor = client.b2h(user.accentColor);
    } else if (color) {
      acolor = color;
    }
    const borderWidth = 8;
    const borderRadius = 14;
    ctx.lineWidth = borderWidth;
    ctx.strokeStyle = acolor;

    // Draw the border around the entire canvas
    ctx.roundRect(
      borderWidth / 2,
      borderWidth / 2,
      canvas.width - borderWidth,
      canvas.height - borderWidth,
      borderRadius,
    );
    ctx.stroke();
  },
};
