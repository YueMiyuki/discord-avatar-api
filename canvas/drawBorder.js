module.exports = {
  drawBorder: async function (client, ctx, user, canvas) {
    const acolor = client.b2h(user.accentColor);
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
