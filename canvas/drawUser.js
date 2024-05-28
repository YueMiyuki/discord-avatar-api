// Draw user's name and username on the canvas.

module.exports = {
  drawUser: async function (client, ctx, user) {
    const db = client.db;
    const Canvas = require("canvas");
    const jimp = require("jimp");
    const path = require("path");
    const font = "Seto";

    let name = user.globalName;
    let username = user.username;

    ctx.font = `bold 50px ${font}`;
    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "start";
    ctx.strokeStyle = "#f5f5f5";
    ctx.fillText(`${name}`, 240, 90, 100);

    ctx.font = `bold 20px ${font}`;
    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "start";
    ctx.strokeStyle = "#f5f5f5";
    ctx.fillText(`${username}`, 245, 118);

    // Start Hypesquad section
    const hypesquad = await db.get("hypesquad_" + user.id);

    if (hypesquad) {
      let hypesquadA = null;
      let hypesquad;
      if (user.flags.toArray()) {
        hypesquadA = user.flags.toArray()[0];
        if (hypesquadA === "HypeSquadOnlineHouse2") {
          hypesquad = "brilliance.png";
        } else if (hypesquadA === "HypeSquadOnlineHouse3") {
          hypesquad = "balance.png";
        } else if (hypesquadA === "HypeSquadOnlineHouse1") {
          hypesquad === "bravery.png";
        }
      }

      if (hypesquad !== null) {
        const hypesquadImgDir = path.resolve(
          __dirname,
          "../assets/images/",
          `${hypesquad}`,
        );
        const hypesquadImg = await jimp.read(hypesquadImgDir);
        const resizeHypesquad = hypesquadImg.resize(48, 48);

        const hypesquadImgRaw =
          await resizeHypesquad.getBufferAsync("image/png");

        const hypesquadBadge = await Canvas.loadImage(hypesquadImgRaw);
        ctx.drawImage(hypesquadBadge, 16, 16, 32, 32);
      }
    }
  },
};
