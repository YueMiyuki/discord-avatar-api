// Draws avatar

module.exports = {
  drawAvatar: async function (client, ctx, user) {
    const Canvas = require("canvas");
    const jimp = require("jimp");
    const path = require("path");
    const avatar = user.avatar;

    const avatarJPG = await client.w2j(user.id, avatar);

    const image = await jimp.read(avatarJPG);
    const resizeAvatar = image.resize(512, 512);

    const mask = path.resolve(__dirname, "../assets/images/mask.png");
    const maskImage = await jimp.read(mask);
    const newAvatar = resizeAvatar.mask(maskImage, 0, 0);

    const raw = await newAvatar.getBufferAsync("image/png");

    const profile = await Canvas.loadImage(raw);

    ctx.drawImage(profile, 44, 48, 155, 155);
  },
};
